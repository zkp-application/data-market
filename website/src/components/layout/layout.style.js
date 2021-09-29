export const Wrap = css.div`
  width: 1280px;
  height: 800px;
  min-width: ${_gb.pageContentWidth};
  min-width: 100vw;
  min-height: 100vh;
  position: relative;
  background: #000;
  @media(max-width: 860px) {
    .container{
      padding-left: 0;
    }
  }
  .container{
    padding-left: 305px;
    height: 100%;
    position: relative;
    .page-content{
      height: 100%;
      border: 2px solid #fff;
      border-width: 0 2px 2px 0;
      padding-top: 112px;
      overflow: hidden;
    }
  }
`;
