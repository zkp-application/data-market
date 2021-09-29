import React from 'react';

const Wrap = css.div`
  &>ul{
    ${_gb.flex()};
    justify-content: space-around;
    li{
      text-align: center;
      &:not(:first-child) {
        margin-left: 96px;
      }
      p:first-child{
        color: #fff;
        font-size: 40px;
        font-weight: bold;
        line-height: 1em;
      }
      p:last-child{
        color: rgba(255, 255, 255, .65);
        font-size: 17px;
      }
    }
  }
`;

function Stats() {
  const _env = useSelector((state) => state.env);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { getContract } = _hook.useContract();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const contract = await getContract();
      const info = await contract.methods.getMarketInfo().call({ from: _env.address });
      console.log(info);
      setList(info);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <Wrap>
      <ul>
        <li>
          <p>{list?.all || 0}</p>
          <p>All</p>
        </li>
        <li>
          <p>{list?.sold || 0}</p>
          <p>Sold</p>
        </li>
        <li>
          <p>{list?.selling || 0}</p>
          <p>Selling</p>
        </li>
        <li>
          <p>{list?.participate || 0}</p>
          <p>Users</p>
        </li>
      </ul>
    </Wrap>
  );
}

export default Stats;
