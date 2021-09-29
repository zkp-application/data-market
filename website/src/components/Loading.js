import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const LoadingIcon = ({ size, color }) => <LoadingOutlined style={{ fontSize: size, color }} spin />;

const Wrap = css.div`
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
function Loading({ style, size = 18, color = '#fff', inline }) {
  if (inline) {
    return <Spin delay={0} style={style} indicator={<LoadingIcon size={12} color={'rgba(0, 0, 0, 0.36)'} />} />;
  }
  return (
    <Wrap style={style}>
      <Spin indicator={<LoadingIcon size={size} color={color} />} />
    </Wrap>
  );
}

export default Loading;
