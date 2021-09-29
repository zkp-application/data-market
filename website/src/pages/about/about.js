import React from 'react';
import Layout from '@/components/layout/Layout';

const Wrap = css.div`
  color: #fff;
  padding: 32px 64px;
  h1{
    color: #fff;
    font-size: 20px;
    margin-bottom: 32px;
  }
  p{
    color: rgba(255, 255, 255, .65);
    font-size: 18px;
    line-height: 1.8em;
    margin-bottom: 12px;
  }
`;

function AboutPage() {
  return (
    <Layout>
      <Wrap>
        <h1>About</h1>
        <p>
          We find that if we want to incentivize people to publish data has to solve two problems.
          <br />
          <br />
          1, A seller should be rewarded by publishing data and the data become public goods. <br />
          <br />
          2, others can not re-sell the published data to a third party, because it's already a public goods. <br />
          <br />
          Darkforest Data market is proud to provide a Zero knowledge proof technology to create a data market to solve
          these two problems, and empower a seamless crowdfunding data market for Users <br />
          <br />
          This product is brought to you by Ethereum Foundation, without the support of Ethereum Foundation we cannot
          provide you this fantastic product. <br />
          <br />
          If you have any suggestions regarding our product, feel free to drop us a message! We would love to see your
          opinion.
        </p>
        <br />
        <p>Made with 🧡 by ETH holders</p>
        <p>
          Contact us: <a href="mailto:lifengliu1994@gmail.com">lifengliu1994@gmail.com</a>
        </p>
      </Wrap>
    </Layout>
  );
}

export default AboutPage;
