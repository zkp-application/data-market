const Wrap = css.div`
  padding: 32px 0;
  position: relative;
  left: 0;
  right: 0;
  bottom: 0;
  .cont{
    width: ${_gb.pageContentWidth};
    margin: 0 auto;
    text-align: center;
    color: rgba(0,0,0,0.64);
    line-height: 1.8em;
    p{
      margin: 0;
      font-size: 16px;
    }
    p:last-child{
      color: rgba(0,0,0,0.32);
      font-size: 14px;
      a{
        opacity: .6;
      }
    }
  }
`;

function Footer(props) {
  return (
    <Wrap>
      <div className="cont">
        <p>All rights reserved. ©DataMarket · 2021</p>
        <p>
          Contact Us <a href="mailto:lifengliu1994@gmail.com">lifengliu1994@gmail.com</a>
        </p>
      </div>
    </Wrap>
  );
}

export default Footer;
