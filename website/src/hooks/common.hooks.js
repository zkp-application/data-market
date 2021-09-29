import Web3 from 'web3';
import _abi from '@/conf/abi';

export const useContract = () => {
  const _env = useSelector((state) => state.env);
  const { address } = _env;
  const options = {
    address,
  };
  const contractAddress = _conf.config.address.contract;
  const web3 = new Web3(window.ethereum);
  const getContract = () => new web3.eth.Contract(_abi, contractAddress, options);
  return { getContract };
};
