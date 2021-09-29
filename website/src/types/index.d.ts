import api from '../conf/api';
import utils from '../utils/common';
import ajax from '../utils/ajax';
import hook from '../hooks/index';
import gb from '../conf/global.style';
import _Icon from '../components/Icon';

export declare global {
  const _api: typeof api;
  const _util: typeof utils;
  const _ajax: typeof ajax;
  const _hook: typeof hook;
  const _gb: typeof gb;
  const Icon: typeof _Icon;
}
