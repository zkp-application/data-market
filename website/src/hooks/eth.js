const getWalletAddress = async () => {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const eth = window.ethereum;
      const accounts = await eth.enable();
      const address = accounts[0] || eth.selectedAddress;
      return Promise.resolve(address);
    } catch (error) {
      console.log(error);
    }
  }
  return Promise.reject('eth undefined');
};

const getContract = (address) => {
  const options = {
    from: address,
  };
  // const contract = new window.web3js.eth.Contract(_abi, _address.contract, options);
  // return contract;
};

const getBalance = async (address, format = false, chain) => {
  if (!window.web3js) {
    return;
  }
  try {
    const WEB3 = chain || window.web3js;
    const balance = await WEB3.eth.getBalance(address);
    console.log('get balance of eth: ', balance);
    return format ? WEB3.utils.fromWei(balance, 'ether') : balance;
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
};
