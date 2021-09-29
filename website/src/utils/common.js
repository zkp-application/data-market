import bn from './bn';
import utils from './utils';
import date from './dateFormat';
import toast from './toast';

export default {
  normalizeNeu(neuAmount) {
    return neuAmount / Math.pow(10, 8);
  },
  digits(num) {
    if (!num) return num;
    const [int, decimal] = String(num).split('.');
    return int.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,') + (decimal ? `.${decimal}` : '');
  },
  normalizeSize(size) {
    return size ? (size / 1024).toFixed(2) : size;
  },
  ell_text(text, width) {
    if (!text.length) return '';
    if (text.length <= width) return text;
    return `${text.substr(0, width / 2)}...${text.substr(-width / 2)}`;
  },
  toFixed(num, minDecimals = 2, maxDecimals = 4) {
    if (num === undefined || num === null) return '';
    const isInteger = Number.isInteger(+num);
    return bn.toFixed(String(num), isInteger ? minDecimals : maxDecimals);
  },
  copy(text) {
    const $input = document.createElement('textarea');
    $input.value = text;
    $input.style = { position: 'absolute', left: '-9999px' };
    document.body.appendChild($input);
    $input.select();
    document.execCommand('copy');
    document.body.removeChild($input);
  },
  toShortNumber(val, decimals) {
    if (+val === 0) return decimals ? `${(0).toFixed(decimals)}` : '0';
    if (+val >= 10 ** 6) return `${decimals ? +(+val / 10 ** 6).toFixed(decimals) : +val / 10 ** 6}M`;
    if (+val >= 1000) return `${decimals ? +(+val / 1000).toFixed(decimals) : +val / 1000}K`;
    return val;
  },
  bn,
  date,
  ...utils,
  ...toast,
};
