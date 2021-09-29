import Layout from '@/components/layout/Layout';

import Market from '@/pages/home/components/Market';
import Bar from '@/pages/home/components/Bar';

const Wrap = css.div`
  width: ${_gb.pageContentWidth};
  margin: 64px auto;
`;

function HomePage() {
  return (
    <Layout>
      <Market />
      {/* <Wrap>
        <Stats />
      </Wrap>
      <div style={{ background: '#fff' }}>
        <Market />
      </div>
      <Bar /> */}
    </Layout>
  );
}

export default HomePage;
