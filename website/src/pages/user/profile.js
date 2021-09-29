import { Statistic, Row, Col, Tabs, Card } from 'antd';
import { KeyOutlined, HddOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import Layout from '@/components/layout/Layout';

const { TabPane } = Tabs;

const Wrap = css.div`
  width: ${_gb.pageContentWidth};
  margin: 64px auto;
  .hd{
    text-align: center;
  }
  .bd{
    margin: 72px 0 0 0;
    min-height: calc(100vh - 200px);
    .ant-tabs{
      height: 100%;
    }
    .ant-card{
      background: #fff;
      width: 320px;
    }
  }
`;

function ProfilePage() {
  return (
    <Layout>
      <Wrap>
        <div className="hd">
          <Row gutter={24}>
            <Col span={8}>
              <Statistic title="On sale" value={0} prefix={<ShoppingCartOutlined />} />
            </Col>
            <Col span={8}>
              <Statistic title="Purchased" value={0} prefix={<KeyOutlined />} />
            </Col>
            <Col span={8}>
              <Statistic title="Owned" value={0} prefix={<HddOutlined />} />
            </Col>
          </Row>
        </div>
        <div className="bd">
          <Tabs defaultActiveKey="1" size="large" type="card" tabPosition="left">
            <TabPane tab="On sale" key="1">
              <Card title="title"></Card>
            </TabPane>
            <TabPane tab="Purchased" key="2">
              Content of Tab Pane 2
            </TabPane>
            <TabPane tab="Owned" key="3">
              Content of Tab Pane 3
            </TabPane>
          </Tabs>
        </div>
      </Wrap>
    </Layout>
  );
}

export default ProfilePage;
