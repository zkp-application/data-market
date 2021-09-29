import { withRouter } from 'react-router-dom';

import Stats from '@/pages/home/components/Stats';

import { actions } from '@/redux/env';

const Wrap = css.div`
  height: 112px;
  border: 2px solid #fff;
  border-left: 0;
  ${_gb.flex()};
  justify-content: flex-end;
  padding: 0 48px;
  position: fixed;
  top: 0;
  left: 305px;
  right: 0;
`;

function Header({ hideLogo }) {
  return (
    <Wrap>
      <Stats />
    </Wrap>
  );
}

export default withRouter(Header);
