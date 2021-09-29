const defaultColor = {
  // default color
  primary: '#1891ff',

  b88: 'rgba(0 , 0, 0, .88)',
  b24: 'rgba(0 , 0, 0, .24)',
  b36: 'rgba(0 , 0, 0, .36)',
  b50: 'rgba(0 , 0, 0, .5)',
};

const font = (size, color, lineHeight, fontWeight) => {
  return `
    font-size: ${size}px;
    line-height: ${lineHeight ? lineHeight + 'px' : '1em'};
    color: ${defaultColor[color] || color || '#000'};
    font-weight: ${fontWeight ? fontWeight : 'normal'};
  `;
};

const size = {
  pageContentWidth: '1280px',
};

const fontSize = {
  f14: '14px',
  f16: '16px',
};

const noWrap = () => {
  return `
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  `;
};

const flex = () => {
  return `
    display: flex;
    justify-content: space-between;
    align-items: center;
  `;
};

export default {
  ...defaultColor,
  ...fontSize,
  ...size,
  noWrap,
  font,
  flex,
};
