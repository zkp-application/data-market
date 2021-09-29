import { combineReducers } from 'redux';

import env from './env';
import config from './config';

export default combineReducers({
  ...env,
  ...config,
});
