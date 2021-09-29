import React, { useRef } from 'react';
import Layout from '@/components/layout/Layout';
import jsZIP from 'jszip';
import { utils } from 'web3';
import { useParams } from 'react-router-dom';
import { Button, Modal, Input, message, Row, Col } from 'antd';
import keyJson from '@/lib/verification_key';
import CryptoJS from 'crypto-js';
import Loading from '@/components/Loading';
import { saveAs } from 'file-saver';
import { Typing, TypingStep } from 'typing-effect-reactjs';

import { LoadWasm } from '@/pages/create/components/exec.go';

const wasm = 'https://zkp-datamarket.com/js/lib9.wasm';

const Wrap = css.div`
  padding: 32px 64px;
  height: calc(100vh - 150px);
  overflow-y: scroll;
  color: #fff;
  .title, h1{
    color: #fff;
    font-size: 16px;
    line-height: 1em;
  }
  .detail-cont{
    background: #111;
    padding: 32px;
    margin-top: 32px;
    min-height: calc(100vh - 250px);
    .item{
      ${_gb.flex()};
      margin: 24px 0;
      justify-content: flex-start;
      align-items: flex-start;
      img{
        height: auto;
        width: 320px;
        max-height: 300px;
      }
      &>span{
        width: 200px;
        display: inline-block;
        font-size: 16px;
        font-weight: bold;
        color: rgba(255, 255, 255, .65);
      }
      &>p{
        flex: 1;
        font-size: 15px;
      }
    }
    .btn-group{
      button{
        width: 180px;
        margin: 0 16px 8px 0;
      }
      &.first{
        button{
          background: rgba(4, 255, 165, 1);
        }
      }
    }
  }
  .ant-modal-content{
    input{
      height: 50px;
    }
    h2{
      margin: 16px 0;
    }
    .ant-modal-footer{
      padding: 18px;
      button{
        width: 120px;
        height: 40px;
        margin: 0 0 0 32px;
      }
    }
  }
  .ant-input-affix-wrapper{
    border: 1px solid #111 !important;
    input{
      font-size: 20px;
      font-weight: bold;
    }
  }
  .status{
    color: #fff;
    padding: 16px 16px;
    background: #e6e6e6;
    margin: 32px 0 0 0;
  }
`;

function DetailPage() {
  const params = useParams();
  const _env = useSelector((state) => state.env);
  const { getContract } = _hook.useContract();
  const [detail, setDetail] = useState();
  const [visible, setVisible] = useState(false);
  const [withdrawVisible, setWithdrawVisible] = useState(false);
  const [price, setPrice] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [loadingBuy, setLoadingBuy] = useState(false);
  const [loadingWithdraw, setLoadingWithdraw] = useState(false);
  const [loading, setLoading] = useState(true);
  const [curStatus, setCurStatus] = useState(['waiting']);
  const [wasmLoading, setWasmLoading] = useState(false);

  const leafHash = useRef();

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    _env?.address && getDetail();
  }, [_env?.address]);

  const load = () => {
    if (!window.wasmIsLoad) {
      LoadWasm();
      if (!WebAssembly.instantiateStreaming) {
        // polyfill
        WebAssembly.instantiateStreaming = async (resp, importObject) => {
          const source = await (await resp).arrayBuffer();
          return await WebAssembly.instantiate(source, importObject);
        };
      }
      const init = async () => {
        setWasmLoading(true);
        const file = await fetch(wasm, { mode: 'no-cors' });
        const buffer = await file.arrayBuffer();
        const go = new window.Go();
        const { instance } = await WebAssembly.instantiate(buffer, go.importObject);
        go.run(instance);
        window.wasmIsLoad = true;
        setWasmLoading(false);
      };
      init();
    }
  };

  const getDetail = async () => {
    try {
      const id = params?.id;
      const hash = params?.hash;
      const contract = await getContract();
      const zip = new jsZIP();
      const res = await contract.methods.getCommodityInfo(id).call({ from: _env.address });
      const files = await fetch(`${_conf.config.api.download}?file_type=part_file&file_hash=${hash}`, {
        mode: 'no-cors',
      });
      const zipFile = await zip.loadAsync(files.blob());
      const thumb = await zipFile.file('thumb.png').async('base64');
      leafHash.current = await window.hash(thumb);
      const extra = filter(res.extra);
      setDetail({ ...res, extra, thumb: `data:image/png;base64,${thumb}` });
      console.log(res, extra);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const filter = (value) => {
    let extra = {};
    try {
      const str = utils.hexToUtf8(value);
      extra = { ...JSON.parse(str) };
    } catch (error) {
      console.log(error);
    }
    console.log(extra);
    return extra;
  };

  const handleRefund = async () => {
    try {
      const id = params?.id;
      const contract = await getContract();
      const res = await contract.methods.refund(id).send({ from: _env.address });
      message.success('Refund success');
      console.log(res);
    } catch (error) {
      console.log(error);
      message.error('Refund fail');
    }
  };

  const handlePurchase = async () => {
    if (!price) {
      message.error('Please enter the price');
      return;
    }
    try {
      setLoadingBuy(true);
      updateStatus('purchase');
      const contract = await getContract();
      const zip = new jsZIP();
      const hash = params?.hash;
      const id = params?.id;
      const files = await fetch(`${_conf.config.api.download}?file_type=proof_file_zip&file_hash=${hash}`, {
        mode: 'no-cors',
      });
      const zipFile = await zip.loadAsync(files.blob());
      const proofData = await zipFile.file('data/proof-data').async('string');
      const encryptData = await zipFile.file('data/encrypt-data').async('string');
      const value = utils.toWei(price);
      const { proof, publicSignals: downloadpublicSignals } = JSON.parse(proofData);
      const publicSignals = [leafHash.current, detail?.encrypted_data_hash?.replace('0x', '')];
      const proofRes = await window.snarkjs.groth16.verify(keyJson, publicSignals, proof);
      console.log('downloadpublicSignals', downloadpublicSignals, '\n', publicSignals, '\n');
      if (proofRes) {
        const res = await contract.methods.participate(id).send({ from: _env.address, value });
        console.log(res);
      } else {
        message.info('Verified fail');
      }
      setVisible(false);
      setLoadingBuy(false);
      console.log(proofData);
    } catch (error) {
      console.log(error);
      setLoadingBuy(false);
    }
  };

  const handleWithdrawalVisible = () => {
    setWithdrawVisible(true);
  };

  const updateStatus = (status) => {
    setCurStatus([...curStatus, status]);
  };

  const handleWithdrawal = async () => {
    const id = params?.id;
    if (!privateKey || privateKey?.length !== 32) {
      message.info('Please enter right private key');
      return;
    }
    try {
      setLoadingWithdraw(true);
      updateStatus('verify-private-key');
      const contract = await getContract();
      const res = await contract.methods.withdraw(id, privateKey).send({ from: _env.address });
      console.log(res);
      message.success('Successed');
      setLoadingWithdraw(false);
    } catch (error) {
      console.log(error);
      setLoadingWithdraw(false);
      message.error('Contract exec failed, Please check your private key');
    }
  };

  const handleInput = (e) => {
    const value = e.target.value.trim();
    setPrice(value);
  };

  const handlePrivateInput = (e) => {
    const value = e.target.value.trim();
    setPrivateKey(value);
  };

  const handleBuy = (id) => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
    setPrice('');
  };

  const handleDownload = async () => {
    const zip = new jsZIP();
    const hash = params?.hash;
    const files = await fetch(`${_conf.config.api.download}?file_type=proof_file_zip&file_hash=${hash}`, {
      mode: 'no-cors',
    });
    const zipFile = await zip.loadAsync(files.blob());
    const encryptData = await zipFile.file('data/encrypt-data').async('string');
    const privateKey = detail?.priv_key;
    const imgSrc = aesDecode(encryptData, privateKey);
    const img = new jsZIP();
    img.file('data.png', imgSrc, { base64: true });
    const imgFile = await img.generateAsync({ type: 'blob' });
    saveAs(imgFile, 'data.zip');
  };

  const aesDecode = (data, privateKey) => {
    const aesConfig = {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    };
    var bytes = CryptoJS.AES.decrypt(data, privateKey, aesConfig);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  if (loading) {
    return (
      <Layout>
        <Wrap>
          <h1>Detail</h1>
          <div className="detail-cont">
            <Loading style={{ height: 300 }} />
          </div>
        </Wrap>
      </Layout>
    );
  }

  return (
    <Layout>
      <Wrap>
        <h1>Detail</h1>
        <div className="detail-cont">
          <div className="item">
            <span>Preview</span>
            <img src={detail?.thumb} alt="" />
          </div>
          <div className="item">
            <span>Title</span>
            <h1 className="title">{detail?.extra?.title}</h1>
          </div>
          <div className="item">
            <span>Description</span>
            <p className="des">{detail?.extra?.description}</p>
          </div>
          <div className="item">
            <span>Publisher</span>
            <p className="des">{detail?.publisher}</p>
          </div>
          <div className="item">
            <span>Raised</span>
            <p className="price">{utils.fromWei(detail?.received_value || '0')} ETH</p>
          </div>
          <div className="item">
            <span>My Contribution</span>
            <p className="price">{utils.fromWei(detail?.my_support || '0')} ETH</p>
          </div>
          <div className="item">
            <span>Goal</span>
            <p className="price">{utils.fromWei(detail?.value || '0')} ETH</p>
          </div>
          <div className="item" style={{ marginTop: '66px' }}>
            <span></span>
            <div className="btn-group first">
              {detail?.status !== '1' && (
                <Button onClick={handleBuy} type="primary" size="large">
                  BACK IT
                </Button>
              )}
              {detail?.status === '0' && !!+detail?.my_support && (
                <Button onClick={handleRefund} type="primary" size="large">
                  Refund
                </Button>
              )}
            </div>
          </div>
          <div className="item">
            <span></span>
            <div className="btn-group">
              {detail?.status === '0' && !!+detail?.received_value && (
                <Button onClick={handleWithdrawalVisible} type="default" size="large">
                  Withdrawal
                </Button>
              )}
              {detail?.status === '1' && (
                <Button onClick={handleDownload} type="default" size="large">
                  Download
                </Button>
              )}
            </div>
          </div>
        </div>
        <Modal
          getContainer={false}
          visible={visible}
          onOk={handlePurchase}
          okButtonProps={{ loading: loadingBuy }}
          onCancel={handleCancel}
        >
          <h2 style={{ color: '#111' }}>BACK IT</h2>
          <Input
            placeholder="Please enter ETH amount..."
            type="number"
            value={price}
            suffix={<h1 style={{ color: '#000', padding: '0 20px' }}>ETH</h1>}
            onChange={handleInput}
          />
          <div className="status">
            {curStatus.includes('waiting') && <TypingStep sequence={[{ content: 'everything is ready.' }]} />}
            {curStatus.includes('purchase') && (
              <TypingStep
                smartBackspace
                sequence={[
                  { content: 'connecting to Etheruem node...\n' },
                  { content: 300 },
                  { content: 'initializing the smart contract...\n' },
                  { content: 500 },
                  { content: 'download image file\n' },
                  { content: 300 },
                  { content: 'get Zero-Knowledge Proof\n' },
                  { content: 500 },
                  { content: 'Zero-Knowledge Proof verifying...\n' },
                  { content: 600 },
                  { content: '✅ verify completed.\n' },
                ]}
              />
            )}
          </div>
        </Modal>
        <Modal
          visible={withdrawVisible}
          onOk={handleWithdrawal}
          getContainer={false}
          okButtonProps={{ loading: loadingWithdraw }}
          onCancel={() => {
            setWithdrawVisible(false);
            setCurStatus(['waiting']);
          }}
        >
          <h2>Private KEY</h2>
          <Input
            placeholder="Please enter private key..."
            type="text"
            value={privateKey}
            onChange={handlePrivateInput}
            style={{ marginTop: 16 }}
          />
          <div className="status">
            {curStatus.includes('waiting') && <TypingStep sequence={[{ content: 'everything is ready.' }]} />}
            {curStatus.includes('verify-private-key') && (
              <TypingStep
                smartBackspace
                sequence={[
                  { content: 'connecting to Etheruem node...\n' },
                  { content: 300 },
                  { content: 'initializing the smart contract...\n' },
                  { content: 500 },
                  { content: 'verifying private key...\n' },
                  { content: 300 },
                  { content: 'completed.\n' },
                  { content: 300 },
                  { content: 'waiting network response...\n' },
                ]}
              />
            )}
          </div>
        </Modal>
      </Wrap>
    </Layout>
  );
}

export default DetailPage;
