import { utils } from 'web3';
import { Card, Col, Row, Button, Modal, Input, message } from 'antd';
import rs from 'jsrsasign';

import Loading from '@/components/Loading';
import Empty from '@/components/Empty';

const Wrap = css.div`
  .ant-card{
    background: #000;
    color: #fff;
    .ant-card-head, .ant-card-head-title{
      color: #fff;
      text-align: left;
      border: none;
    }
  }
  .ant-card-body{
    height: calc(100vh - 250px);
    overflow: scroll;
  }
  &>div.ant-card {
    &>.ant-card-head .ant-card-head-title{
      font-size: 28px;
      padding: 28px 0;
      border: 0;
    }
  }
  .item{
    ${_gb.flex()};
    align-items: center;
    margin: 12px 64px;
    background-color: #111;
    border-left: 4px solid #666;
    padding: 12px 16px;
    transition: all 0.25s ease-in-out;
    &.active{
      border-color: rgba(4, 255, 165, 1);
    }
    &:hover{
      transform: translate3d(-1px, -2px, 0px);
    }
    .cont{
      flex: 1;
      h1{
        color: #fff;
        font-size: 20px;
        line-height: 24px;
      }
      &>p{
        margin-top: 8px;
        color: rgba(255, 255, 255, .65);
        font-size: 13px;
      }
    }
    .btn{

    }
    .price{

    }
  }
`;

function GoodList({ title, data, loading }) {
  return (
    <Wrap>
      <Card title={title} bordered={false}>
        {loading && <Loading />}
        {data?.length === 0 && !loading && <Empty text="No data." />}
        {data?.map((item, index) => (
          <Link key={index} to={`/detail/${item?.id}/${item?.extra?.download}`}>
            <div className={`item ${item?.status === '0' ? 'active' : 'disabled'}`} bordered={false}>
              <div className="cont">
                <h1>{item.extra?.title || `Data ${item[0]}`}</h1>
                <p className="des">
                  <span style={{ color: 'rgba(0, 0, 0, .33)' }}></span>
                  {item?.extra?.description}
                </p>
              </div>
              <div className="btn">
                <Link to={`/detail/${item[0]}/${item?.extra?.download}`}>
                  <Button block type="primary" size="large">
                    BACK IT
                  </Button>
                </Link>
              </div>
              <div className="price">{item.price}</div>
            </div>
          </Link>
        ))}
      </Card>
    </Wrap>
  );
}

export default GoodList;
