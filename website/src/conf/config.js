const config = {
  path: {},
  address: {
    contract: '0x393b6586b4ebca8133e8815cd0953e4d6780f001',
  },
  api: {
    upload: 'https://zkp-datamarket.com/api/v1/proof-upload', // body: proof_file_zip
    download: 'https://zkp-datamarket.com/api/v1/proof-download', // prams: proof_file_hash
  },
  default_lang: 'zh-cn',
};

const get_path = (key) => {
  if (!key) throw new Error('key is required.');
  if (!config.path.api_url[key]) throw new Error('not found.');
  return config.path.api_base_url + config.path.api_url[key];
};

export default config;
export { config, get_path };
