import GoodList from '@/pages/home/components/GoodList';
import { utils } from 'web3';

const Wrap = css.div`
`;

function Market() {
  const _env = useSelector((state) => state.env);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { getContract } = _hook.useContract();

  useEffect(() => {
    fetchData();
  }, []);

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

  const fetchData = async () => {
    try {
      setLoading(true);
      const contract = await getContract();
      const res = await contract.methods.getCommodityList(0, 100).call({ from: _env.address });
      console.log(res);
      const list = res.map((item) => {
        return {
          ...item,
          extra: filter(item.extra),
        };
      });
      setList(list.reverse());
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  return (
    <Wrap>
      <GoodList loading={loading} data={list} title="Market" />
    </Wrap>
  );
}

export default Market;
