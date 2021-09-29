import React from 'react';
import Layout from '@/components/layout/Layout';

const Wrap = css.div`
  overflow: scroll;
  height: calc(100vh - 150px);
  color: #fff;
  padding: 32px 64px;
  line-height: 1.8em;
  h1, h2, h3{
    color: #fff;
  }
  h1{
    font-size: 28px;
    margin: 0px 0 16px;
  }
  h2, h3{
    font-size: 16px;
    margin: 12px 0 12px;
    color: rgba(255, 255, 255, .9);
  }
  h2{
    font-size: 20px;
    margin: 32px 0 16px;
  }
  p{
    color: rgba(255, 255, 255, .65);
    font-size: 15px;
  }
  ul{
    margin: 16px;
    li{
      color: rgba(255, 255, 255, .65);
    }
  }
`;

function GuidePage() {
  return (
    <Layout>
      <Wrap>
        <h1>What is DataMarket</h1>
        <p>
          DataMarket is a data publish protocol using Zero-knowledge proof (ZKP). DataMarket supports data publish,
          Fundraising, and back the data you want to support.
        </p>
        <h2>1, Connect Wallet</h2>
        <h3>1.1 Install metamask </h3>
        <p>You can use Chrome to visit DataMarket, make sure you have MetaMask installed.</p>
        <h3>1.2 Connect Wallet</h3>
        <p>
          Visit <a href="https://zkp-datamarket.com/">https://zkp-datamarket.com/</a>, MetaMask will pop up, and remind
          you to connect. Or you can also click Connect Wallet button on the Bottom Left.
        </p>
        <h3>1.3 Wallet Connected</h3>
        <p>After you successfully connect wallet, then you can start to use DataMarket.</p>
        <h2>2, How to publish your item to get funds</h2>
        <h3>2.1 Check the items </h3>
        <p>
          You can browse all the crowdfunding items under the Market module if the item has green color, then this item
          is in process. If the item has grey color, then this item has been published.
        </p>
        <h3>2.2 Check ‘Published’ items</h3>
        <p>
          Click the Published items, and you will see the details of the raised fund and download the data into your
          local computer.
        </p>
        <h3>2.3 Participate in the ‘on process’ items</h3>
        <p>For ‘on process’ items, you can pay a certain amount of ETH to support the items on the details page:</p>
        <ul>
          <li>· Click ‘Back it’</li>
          <li>· Enter the amount of ETH you want to support</li>
          <li>· Click "Confirm" on the wallet payment page</li>
          <li>
            · Waiting for the transaction confirmation, refresh the page to check the participation status after the
            transaction is successful
          </li>
          <li>
            · Before the initiator withdraws the funds, you can click ‘Refund’ to get back the ETH you have paid at any
            time
          </li>
        </ul>
        <h2>3. How to initiate a crowdfunding for your items</h2>
        <h3>3.1 Initiate a new crowdfunding</h3>
        <p>
          You can initiate your crowdfunding under the Publish module. To initiate a crowdfunding, you need to fill in 5
          required items on the page:
        </p>
        <p>· Upload: Upload your items locally from your device (current version only supports image files).</p>
        <p>
          When the item is uploaded successfully, the browser will automatically download the key file to your device.
          The key file is a necessary element for the withdrawal of crowdfunding funds, please keep it properly!
        </p>
        <ul>
          <li>· title: The name of the project, which will be displayed in the Market list</li>
          <li>· Description: the description of the item</li>
          <li>· Extra: record some extra information (contact information, copyright notice, etc.)</li>
          <li>· Goal amount: the amount of ETH you want to raise</li>
        </ul>
        <h3>3.2 Withdraw Funds</h3>
        <p>
          You can withdraw the funds of the item at any time through the key downloaded to the local when you created
          the project:
        </p>
        <ul>
          <li>· Click on the item you published</li>
          <li>· Click "Withdrawal"</li>
          <li>· Paste the character string in the key file into the input box and click ‘OK’</li>
          <li>· Click "Confirm" on the wallet confirmation page and wait for the transaction to complete</li>
        </ul>
      </Wrap>
    </Layout>
  );
}

export default GuidePage;
