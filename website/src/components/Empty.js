const Wrap = css.div`
  text-align: center;
  color: #fff;
  img{
    width: 33px;
  }
  p{
    margin-top: 12px;
    font-size: 13px;
  }
`;

function Empty({ text, style, imgStyle, textStyle }) {
  return (
    <Wrap style={style}>
      <p style={textStyle}>{text}</p>
    </Wrap>
  );
}

export default Empty;
