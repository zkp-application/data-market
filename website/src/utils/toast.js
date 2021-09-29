import { message } from 'antd';

const colors = {
  warning: '#004EE4',
  info: '#004EE4',
  success: '#06BE85',
  error: '#FE1919',
};
const Icon = css.span`
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 6px;
  vertical-align: 3px;
  margin-right: 8px;
  background-color: ${(props) => colors[props.type] || '#004ee4'};
`;

message.config({
  top: 77,
  maxCount: 1,
  duration: 2.5,
});
const defaultConfig = {
  className: 'bycoin-toast',
};
const toast = (msg, type = 'info', style) => {
  message[type]({
    ...defaultConfig,
    content: msg,
    icon: <Icon type={type} />,
    style,
  });
};

export default {
  toast,
};
