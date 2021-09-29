import { useRef } from 'react';
import { Avatar, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { actions } from '@/redux/env';

import img_logo from '@/assets/images/logo.png';
import img_title from '@/assets/images/title.png';
import icon_arrow_right from '@/assets/images/icon/arrow-right.png';
import icon_metamask from '@/assets/images/icon/wallet-metamask.png';

const Wrap = css.div`
  width: 305px;
  height: 100%;
  border: 2px solid #fff;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 10;
  ${_gb.flex()};
  flex-direction: column;
  .side-header{
    width: 100%;
    height: 112px;
    padding: 0 24px;
    ${_gb.flex()};
    img{
      width: 64px;
      height: 64px;
    }
  }
  @media(max-height: 640px) {
    .side-content{
      display: none;
    }
  }
  @media(max-width: 860px) {
    display: none;
  }
  .side-content{
    flex: 1;
    padding: 24px;
    color: rgba(255, 255, 255, .65);
    font-size: 17px;
    line-height: 24px;
    &>img{
      width: 220px;
    }
    p{
      margin: 24px 0;
    }
  }
  .side-footer{
    width: 100%;
    .side-nav{
      li{
        border-top: 2px solid #fff;
        height: 72px;
        line-height: 72px;
        padding: 0 24px;
        ${_gb.flex()};
        img{
          width: 32px;
        }
        span{
          cursor: pointer;
        }
        a, &{
          font-size: 24px;
          color: #fff;
          font-weight: 800;
          &:hover{
            color: rgba(4, 255, 165, 1);
          }
        }
      }
    }
    .side-copy{
      font-size: 13px;
      color: #fff;
      padding: 24px;
      border-top: 2px solid #fff;
    }
  }
`;

function Side() {
  const _env = useSelector((state) => state.env);
  const timer = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    initAddress();
  }, []);

  const initAddress = async () => {
    timer.current = setInterval(() => {
      if (typeof window.ethereum !== 'undefined') {
        updateAddress();
        timer.current && clearInterval(timer.current);
      }
    }, 1000);
    return () => {
      timer.current && clearInterval(timer.current);
    };
  };

  const updateAddress = async () => {
    const _eth = window.ethereum;
    _eth.on('accountsChanged', function (accounts) {
      updateAddress();
    });
    const res = await _eth.request({ method: 'eth_requestAccounts' });
    const address = res[0];
    dispatch(actions.update({ address }));
  };

  const handleConnect = async () => {
    if (typeof window.ethereum === 'undefined') {
      _util.toast('Please install Metamask first.');
      return;
    }
    updateAddress();
  };
  return (
    <Wrap>
      <div className="side-header">
        <img src={img_logo} alt="" />
      </div>
      <div className="side-content">
        <img src={img_title} alt="" />
        <p>
          Darkforest data publishing market place based on zero-knowledge proof. create, buy, sell, and discover digital
          items.
        </p>
      </div>
      <div className="side-footer">
        <ul className="side-nav">
          <li>
            <Link to={'/'}>Market</Link>
            <img src={icon_arrow_right} alt="" />
          </li>
          <li>
            <Link to={'/create'}>Publish</Link>
            <img src={icon_arrow_right} alt="" />
          </li>
          <li>
            <Link to={'/guide'}>Guide</Link>
            <img src={icon_arrow_right} alt="" />
          </li>
          <li>
            <Link to={'/about'}>About</Link>
            <img src={icon_arrow_right} alt="" />
          </li>
          <li>
            {_env.address ? (
              <Link to={'/'}>
                <span>{_util.ell_text(_env.address, 10)}</span>
              </Link>
            ) : (
              <Button onClick={handleConnect} size="large" type="primary">
                Connect Wallet
              </Button>
            )}
            <img src={icon_metamask} alt="" />
          </li>
        </ul>
        <div className="side-copy">
          <p>All rights reserved. ©DataMarket · 2021</p>
        </div>
      </div>
    </Wrap>
  );
}

export default Side;
