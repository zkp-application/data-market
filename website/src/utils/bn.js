import BN from 'bignumber.js';
BN.config({ EXPONENTIAL_AT: 1e9 });

const operator = (num, num2, type, decimal) => {
  if (!num && num !== 0) return '';
  if (!Array.isArray(num)) {
    return BN(num)[type](BN(num2)).toFixed(decimal, 1).toString();
  }
};
/**
 * bn plus
 *
 * @param   {[string/array]}  num   [num description]
 * @param   {[string/number]}  num2  [num2 description]
 *
 * @return  {[string]}        [return description]
 */
const plus = (num, num2, decimal) => {
  return operator(num, num2, 'plus', decimal);
};
// ➗
const div = (num, num2, decimal) => {
  return operator(num, num2, 'div', decimal);
};
// -
const minus = (num, num2, decimal) => {
  return operator(num, num2, 'minus', decimal);
};
// x
const times = (num, num2, decimal) => {
  return operator(num, num2, 'times', decimal);
};
// toFixed
const toFixed = (num, decimal) => {
  if (!num) return '';
  return BN(num).toFixed(decimal, 1);
};

// toFormat
const toFormat = (num, decimal) => {
  if (!num) return '';
  return BN(num).toFormat(decimal);
};

// absolute value
const abs = (num, decimal) => {
  if (!num) return '';
  return BN(num).abs().toFormat(decimal);
};

// Sum up
const sum = (numArray) => {
  return BN.sum.apply(null, numArray);
};

export default {
  abs,
  plus,
  div,
  minus,
  times,
  toFixed,
  toFormat,
  sum,
};
