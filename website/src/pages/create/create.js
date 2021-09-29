import { useRef } from 'react';
import { Form, Input, Upload, Select, Row, Col, Modal, Button, Slider, message } from 'antd';
import Layout from '@/components/layout/Layout';
import { useHistory } from 'react-router-dom';
import { utils } from 'web3';
import CryptoJS from 'crypto-js';
import sha256 from 'crypto-js/sha256';
import jsZIP from 'jszip';
import { saveAs } from 'file-saver';
import { IncrementalQuinTree, hashOne } from 'maci-crypto';

import { LoadWasm } from './components/exec.go';

// const wasm = 'https://olso.space/go-wasm-cat-game-on-canvas/game.wasm';
const wasm = 'https://zkp-datamarket.com/js/lib9.wasm';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 4,
    },
  },
};

const Wrap = css.div`
  margin: 64px auto;
  color: #fff;
  overflow: scroll;
  .ant-form-item-label > label{
    color: #fff;
  }
  .ant-upload-list-item{
    background-color: #fff;
  }
  .ant-btn.ant-btn-primary{
    background-color: rgba(4, 255, 165, 1);
    font-weight: bold;
    height: 42px;
  }
  textarea {
    font-size: 14px;
  }
  .anticon.anticon-question-circle.ant-form-item-tooltip{
    display: none;
  }
`;

const aesKey = sha256(Math.random().toString()).toString().slice(0, 32);

export default function CreatePage() {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [wasmLoading, setWasmLoading] = useState(false);
  const [encryptLoading, setEncryptLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const { getContract } = _hook.useContract();
  const _env = useSelector((state) => state.env);
  const encryptData = useRef();
  const imgSplitRes = useRef();
  const curProof = useRef();
  const fileHash = useRef();
  const rootHash = useRef();
  const history = useHistory();
  const aesConfig = {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  };

  useEffect(() => {
    load();
  }, []);

  const aesEncode = async (msg) => {
    return CryptoJS.AES.encrypt(msg, aesKey, aesConfig).toString();
  };

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

  const onChange = async ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (newFileList?.[0]) {
      setEncryptLoading(true);
      const url = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(newFileList[0].originFileObj);
        reader.onload = () => resolve(reader.result);
      });
      const data = url?.split(',')[1];
      const res = await window.split(data);
      console.log('split img rsp', JSON.parse(res));
      imgSplitRes.current = JSON.parse(res); //wasm 图片分割结果
      encryptData.current = await aesEncode(data); // 原图加密数据
      const proofRes = await createProof();
      const zipRes = await zipFile(proofRes);
      setEncryptLoading(false);
    }
  };

  const beforeUpload = (file) => {
    return false;
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  const onFinish = (values) => {
    const { price, title } = values;
    if (!encryptData.current) {
      message.info('Please select a picture');
      return;
    }
    if (!title) {
      message.info('Please enter the title');
      return;
    }
    if (!price) {
      message.info('Please enter the price');
      return;
    }
    create(values);
  };

  const createProof = async () => {
    const LEVELS = 5;
    const ZERO_VALUE = 0;
    const tree = new IncrementalQuinTree(LEVELS, ZERO_VALUE, 2);
    const leaves = [...imgSplitRes.current.shards, ...new Array(64).fill('0')].splice(0, 32);
    leaves.forEach((item) => tree.insert(item));
    const root = tree.root.toString();
    rootHash.current = root;
    const org_proof = tree.genMerklePath(0);
    const json = {
      leaf: leaves[0].toString(),
      path_elements: org_proof.pathElements.map((item) => item.toString()),
      path_index: [0, 0, 0, 0, 0],
      root: root,
    };
    const { proof, publicSignals } = await window.snarkjs.groth16.fullProve(
      json,
      'https://zkp-datamarket.com/js/circuit.wasm',
      'https://zkp-datamarket.com/js/circuit_final.zkey',
    );
    curProof.current = JSON.stringify({ proof, publicSignals });
    console.log(json, publicSignals, proof);
    return Promise.resolve({ proof, publicSignals });
  };

  const zipFile = async () => {
    const zip = new jsZIP();
    const thumb = new jsZIP();
    const key = new jsZIP();
    const folder = zip.folder('data');
    key.file('private-key.txt', aesKey);
    folder.file('encrypt-data', encryptData.current);
    folder.file('proof-data', curProof.current);
    folder.file('thumb.png', `${imgSplitRes.current.first}`, { base64: true });
    thumb.file('thumb.png', `${imgSplitRes.current.first}`, { base64: true });
    const zipFile = await zip.generateAsync({ type: 'blob' });
    const thumbFile = await thumb.generateAsync({ type: 'blob' });
    const keyFile = await key.generateAsync({ type: 'blob' });
    const keySaveFile = await saveAs(keyFile, 'key.zip');
    uploadData({ proof_file_zip: zipFile, part_file: thumbFile });
  };

  const uploadData = async (data) => {
    const formData = new FormData();
    formData.append('proof_file_zip', data['proof_file_zip']);
    formData.append('part_file', data['part_file']);
    const res = await _ajax.post(_conf.config.api.upload, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (res.code === 200) {
      fileHash.current = res.data.hash;
    }
    console.log(res);
  };

  const normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const create = async (values) => {
    try {
      console.log('create.');
      setLoading(true);
      const address = _env.address;
      const { price, extra, title, description } = values;
      const private_key_hash = sha256(aesKey).toString();
      const encrypted_data_hash = `0x${rootHash.current}`;
      const value = utils.toWei(price);
      const download = fileHash.current;
      const data_extra = `${utils.toHex(
        JSON.stringify({ title, description, download, extra, address, price }) || 'data market',
      )}`;
      const contract = await getContract();
      const res = await contract.methods
        .create(encrypted_data_hash, `0x${private_key_hash}`, data_extra, value)
        .send({ from: _env.address });
      console.log(res);
      setLoading(false);
      message.success('Publish Successed');
      history.replace('/');
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Wrap>
        <Form {...formItemLayout} form={form} name="register" size="large" onFinish={onFinish} scrollToFirstError>
          <Form.Item label="Upload">
            <Form.Item name="dragger" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
              <Upload
                action="#"
                maxCount={1}
                fileList={fileList}
                onChange={onChange}
                onPreview={onPreview}
                beforeUpload={beforeUpload}
              >
                <Button loading={wasmLoading} disabled={wasmLoading} type="primary">
                  Select Image
                </Button>
              </Upload>
            </Form.Item>
          </Form.Item>
          <Form.Item
            name="title"
            label="Title"
            tooltip="title..."
            rules={[{ required: false, message: 'Please input your title' }]}
          >
            <Input placeholder="Please input your title..." />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            tooltip="description..."
            rules={[{ required: false, message: 'Please input description' }]}
          >
            <Input placeholder="Please input description..." />
          </Form.Item>
          <Form.Item
            name="extra"
            label="Extra"
            tooltip="extra..."
            rules={[{ required: false, message: 'Please input your extra message!' }]}
          >
            <Input placeholder="Please input extra message" />
          </Form.Item>
          <Form.Item label="Goal amount">
            <Row gutter={24}>
              <Col span={16}>
                <Form.Item name="price" noStyle rules={[{ message: 'Please input the goal amount!' }]}>
                  <Input
                    type="number"
                    suffix={<h1 style={{ fontSize: '14px' }}>ETH</h1>}
                    placeholder="Please input the goal amount (ETH)..."
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button style={{ marginTop: 32 }} loading={loading} type="primary" size="large" block htmlType="submit">
              Publish
            </Button>
          </Form.Item>
        </Form>
        <div style={{ display: 'none' }}>
          <Slider />
          <Modal tile="Edit"></Modal>
        </div>
      </Wrap>
    </Layout>
  );
}

// "{"name":"Sky","download":"https://website.com","description":"the sky"}"
