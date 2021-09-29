import React from 'react';

const Wrap = css.div`
  width: 100%;
  ${_gb.flex()};
  h1{
    color: ${_gb.b88};
    font-size: 30px;
    line-height: 30px;
  }
  a{
    color: ${_gb.b50};
    font-size: 18px;
  }
`;

function SectionTitle({ title, extra, style }) {
  return (
    <Wrap style={style}>
      <h1>{title}</h1>
      {extra}
    </Wrap>
  );
}

export default SectionTitle;
