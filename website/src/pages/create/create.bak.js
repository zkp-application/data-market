import { useRef } from 'react';
import { Form, Input, Upload, Select, Row, Col, Modal, Button, Slider, message } from 'antd';
import Layout from '@/components/layout/Layout';
import { useHistory } from 'react-router-dom';
import { utils } from 'web3';
import rsu from 'jsrsasign-util';
import rs from 'jsrsasign';
import ImgCrop from 'antd-img-crop';
import { LoadWasm } from './components/exec.go';

import CryptoJS from 'crypto-js';

// const wasm = 'https://olso.space/go-wasm-cat-game-on-canvas/game.wasm';
const wasm = 'https://zkp-datamarket.com/js/lib6.wasm';

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
  textarea {
    font-size: 14px;
  }
`;

export default function CreatePage() {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [key, setKey] = useState('');
  const [keyLoading, setKeyLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const { getContract } = _hook.useContract();
  const _env = useSelector((state) => state.env);
  const dataUrl = useRef();
  const history = useHistory();

  useEffect(() => {
    // LoadWasm();
    // load();
    // const go = new window.Go();
    // WebAssembly.instantiateStreaming(fetch(wasm), go.importObject).then(async (result) => {
    //   console.log('do something', result);
    //   const res = await go.run(result.instance);
    //   console.log('object', res);
    // });
  }, []);

  const aes256 = async (msg) => {
    const key = 'DataMarket';
    const config = {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    };
    var ciphertext = CryptoJS.AES.encrypt(msg, key, config).toString();
    // Decrypt
    var bytes = CryptoJS.AES.decrypt(ciphertext, key, config);
    var originalText = bytes.toString(CryptoJS.enc.Utf8);

    console.log('originalText', originalText); // 'my message'
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
        const file = await fetch(wasm);
        const buffer = await file.arrayBuffer();
        const go = new window.Go();
        const { instance } = await WebAssembly.instantiate(buffer, go.importObject);
        go.run(instance);
        window.wasmIsLoad = true;
      };
      init();
    }
  };

  const onChange = async ({ fileList: newFileList }) => {
    setFileList(newFileList);
    // if (newFileList?.[0]) {
    //   const url = await new Promise((resolve) => {
    //     const reader = new FileReader();
    //     reader.readAsDataURL(newFileList[0].originFileObj);
    //     reader.readAsArrayBuffer(newFileList[0].originFileObj);
    //     reader.onload = () => resolve(reader.result);
    //   });
    //   console.log('data url', url);
    //   dataUrl.current = url;
    // }
    if (newFileList?.[0]) {
      const buffer = await new Promise((resolve) => {
        const reader = new FileReader();
        // readAsBinaryString
        // readAsDataURL
        // readAsArrayBuffer
        reader.readAsDataURL(newFileList[0].originFileObj);
        reader.onload = () => resolve(reader.result);
      });
      // let baseSplit = url.split(',');
      // let strArray = window.atob(baseSplit[1]);
      // let buffer = new ArrayBuffer(strArray.length);
      // let bytes = new Uint8Array(buffer);
      // for (let i = 0; i < strArray.length; i++) {
      //   bytes[i] = strArray.charCodeAt(i);
      // }
      // const res = await window.splitImage([Array.from(new Uint8Array(buffer))]);
      // const data = buffer.replace('data:image/png;base64,', '');
      // const res2 = await window.splitImage(data);
      const res = aes256(buffer);
      console.log('data', buffer, res);
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
    console.log(src);
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  const onFinish = (values) => {
    if (!dataUrl.current) {
      message.info('Please select a picture');
      return;
    }
    create(values);
    console.log('Received values of form: ', values);
  };

  const normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const generateRSAkey = async () => {
    setKeyLoading(true);
    const keys = await rs.KEYUTIL.generateKeypair('RSA', 1024);
    const public_key = await rs.KEYUTIL.getPEM(keys.prvKeyObj);
    const private_key = await rs.KEYUTIL.getPEM(keys.prvKeyObj, 'PKCS8PRV');
    form.setFieldsValue({ public: public_key, private: private_key });
    setKey({ public_key, private_key, keys });
    setKeyLoading(false);
  };

  const encrypt = async () => {
    const { keys } = key;
    const data = (dataUrl.current || '').substring(0, 108);
    console.log(data);
    const res = await rs.KJUR.crypto.Cipher.encrypt(data, keys.pubKeyObj);
    console.log('encrypted data: ', res);
    return res;
  };

  const signData = async () => {
    const { keys } = key;
    const data = dataUrl.current;
    let signature = new rs.KJUR.crypto.Signature({ alg: 'SHA1withRSA' });
    signature.init(keys.prvKeyObj);
    signature.updateString(data);
    let res = signature.sign();
    console.log('sign res: ', res);
    return res;
  };

  const create = async (values) => {
    console.log('create.');
    // setLoading(true);
    const { public: public_key, private: private_key, price, extra, title, description, download } = values;
    const keys = await rs.KEYUTIL.getKey(private_key);
    const dataEncrypted = await encrypt();

    const encrypted_data_hash = `${utils.toHex(dataEncrypted || 'data market')}`;
    const prime1 = `0x${keys.p.toString(16)}`;
    const prime2 = `0x${keys.q.toString(16)}`;
    const d = `0x${keys.d.toString(16)}`;
    const e = `0x${keys.e.toString(16)}`;
    const sign = signData();
    // private key modulus
    const n = `0x${keys.n.toString(16)}`;
    const value = +utils.toWei(price);
    const data_extra = `${utils.toHex(JSON.stringify({ title, description, download, extra }) || 'data market')}`;

    console.log(encrypted_data_hash, prime1, prime2, n, e, data_extra, value);
    const contract = await getContract();
    const res = await contract.methods
      .create(encrypted_data_hash, prime1, prime2, n, e, data_extra, value)
      .send({ from: _env.address });
    console.log(res);
    setLoading(false);
    message.success('Create Successed');
    history.replace('/');
  };

  return (
    <Layout>
      <Wrap>
        <Form {...formItemLayout} form={form} name="register" size="large" onFinish={onFinish} scrollToFirstError>
          <Form.Item label="Upload">
            <Form.Item name="dragger" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
              <ImgCrop initialCroppedAreaPixels={{ width: 100, height: 100 }} modalTitle="Chose">
                <Upload
                  action="#"
                  listType="picture-card"
                  maxCount={1}
                  fileList={fileList}
                  onChange={onChange}
                  onPreview={onPreview}
                  beforeUpload={beforeUpload}
                >
                  {fileList.length < 5 && '+ Upload'}
                </Upload>
              </ImgCrop>
            </Form.Item>
          </Form.Item>
          <Form.Item
            name="title"
            label="Title"
            tooltip="title..."
            rules={[{ required: false, message: 'Please input your title' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            tooltip="description..."
            rules={[{ required: false, message: 'Please input description' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="extra"
            label="Extra"
            tooltip="extra..."
            rules={[{ required: false, message: 'Please input your extra msg!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Price">
            <Row gutter={8}>
              <Col span={12}>
                <Form.Item
                  name="price"
                  noStyle
                  rules={[{ required: true, message: 'Please input the captcha you got!' }]}
                >
                  <Input type="number" />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
          <Form.Item
            name="download"
            label="Download Link"
            tooltip="download..."
            rules={[{ required: false, message: 'Please input download link' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button loading={loading} type="primary" size="large" block htmlType="submit">
              Submit
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
