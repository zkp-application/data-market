import { formatDistanceToNow, format, formatDistanceToNowStrict } from 'date-fns';
import zh from 'date-fns/locale/zh-CN';
import en from 'date-fns/locale/en-US';

const locales = { zh, en };

export default {
  distanceInWordsToNow(date, opts) {
    return formatDistanceToNow(
      date,
      Object.assign({}, opts, {
        locale: locales[window.env.lang || 'en'],
      }),
    );
  },
  distanceInWordsToNowStrict(date, opts) {
    let words = formatDistanceToNowStrict(
      new Date(),
      date,
      Object.assign({}, opts, {
        locale: locales[window.env.lang || 'en'],
        addSuffix: false,
      }),
    );
    // words = words.replace(/(minutes|hours|hour|months|years|days|seconds)/, (match) => match[0]);
    return words;
  },
  format(date, formatStr = 'yyyy-MM-dd HH:mm:ss', opts) {
    return format(
      date,
      formatStr,
      Object.assign({}, opts, {
        locale: locales[window.env.lang || 'en'],
      }),
    );
  },
};
