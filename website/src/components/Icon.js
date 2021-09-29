import React from 'react';

const Wrap = css.span`
  transition: all 0.15s ease-out;
`;

function Icon({ component, icon, style, className = 'anticon', onClick }) {
  return (
    <Wrap style={style} className={className} onClick={onClick}>
      {React.createElement(component || icon)}
    </Wrap>
  );
}

export default Icon;
