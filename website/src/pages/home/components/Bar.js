import React from 'react';
import img_bg from '@/assets/images/bg.svg';

const Wrap = css.div`
  width: 100%;
  height: 300px;
  overflow: hidden;
  background: #fff;
  span.anticon{
    width: 100%;
    height: 100%;
  }
`;

function Bar() {
  return (
    <Wrap>
      <Icon component={img_bg} />
    </Wrap>
  );
}

export default Bar;
