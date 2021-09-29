import Header from './Header';
import Side from './Side';
import { StyleWrapper, GlobalStyles } from './overwrite.style';
import { Wrap } from './layout.style';

const Layout = ({ children, style, hideLogo }) => {
  return (
    <StyleWrapper>
      <GlobalStyles />
      <Wrap style={style}>
        <Side />
        <div className="container">
          <Header hideLogo={hideLogo} />
          <div className="page-content">{children}</div>
        </div>
      </Wrap>
    </StyleWrapper>
  );
};

export default Layout;
