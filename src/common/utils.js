import _ from 'lodash';
import classnames from 'classnames';

export default {
  classnames: (prefix, styles) => {
    const cx = classnames.bind(styles);
    return (...names) =>
      cx(_.map(names, name => {
        if (typeof name === 'string') {
          return `${prefix}-${name}`;
        } else if (typeof name === 'object') {
          const returnObj = {};
          for (const key in name) {
            if (Object.prototype.hasOwnProperty.call(name, key)) {
              const element = name[key];
              returnObj[`${prefix}-${key}`] = element;
            }
          }
          return returnObj;
        }
        return '';
      }));
  },
  number: {
    localize(num, precision = 2) {
      if (!_.isFinite(num)) {
        return '--';
      }
      const flag = num < 0 ? '-' : '';
      const number = Math.abs(num);
      if (number > 100000000) {
        return `${flag}${(number / 100000000).toFixed(precision)}亿`;
      } else if (number > 10000) {
        return `${flag}${(number / 10000).toFixed(precision)}万`;
      }
      return num;
    },
    comma(num) {
      if (_.isNil(num)) {
        return '--';
      }
      const nStr = `${num}`;
      const x = nStr.split('.');
      let x1 = x[0];
      const x2 = x.length > 1 ? `.${x[1]}` : '';
      const rgx = /(\d+)(\d{3})/;
      while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1,$2');
      }
      return x1 + x2;
    },
    toPercent(value, precision = 2) {
      if (_.isNumber(value) && _.isFinite(value)) {
        const percentValue = (Math.abs(value) * 100).toFixed(precision);
        return `${percentValue}%`;
      }
      return '--';
    },
    numberFormatter(value) {
      const reg = /^(-)*(\d+)\.(\d*).*$/;
      return !isNaN(parseFloat(value))
        ? value.toString().replace(reg, '$1$2.$3')
        : ''; /* eslint no-restricted-globals:0 */
    },
  },
  url: {
    parse(realurl) {
      const url = realurl.replace('#', '');
      const arr = url.split('?');
      if (arr.length === 1) {
        return {};
      }
      const kvStr = arr[1];
      const kv = kvStr.split('&');
      return kv.reduce((params, item) => {
        const kvArr = item.split('=');
        const newParams = params;
        if (kvArr.length === 2) {
          newParams[kvArr[0]] = kvArr[1];
        }
        return newParams;
      }, {});
    },
  },
  highlight: {
    escape(escapeText) {
      return escapeText
        .replace(/&lt;em&gt;/g, '<em>')
        .replace(/&lt;\/em&gt;/g, '</em>')
        .replace(/<em>/g, '<em>')
        .replace(/<\/em>/g, '</em>');
    },
    removeHighlight(escapeText) {
      return escapeText
        .replace(/&lt;em&gt;/g, '')
        .replace(/&lt;\/em&gt;/g, '')
        .replace(/<em>/g, '')
        .replace(/<\/em>/g, '');
    },
  },
  cutstr: (str, num, suffix = '...') => {
    const len = str.length;
    const result = str.slice(0, num) + (num < len ? suffix : '');
    return result;
  },
  navTo: (pathName, history) => {
    history.push(pathName);
  },
  formatNum: n => {
    const unit = [{ text: '万', limit: 6, hide: 4 }, { text: '亿', limit: 5, hide: 4 }];
    let num = `${n}`;

    let unitStr = '';
    for (let i = 0; i < unit.length; i += 1) {
      const item = unit[i];
      if (num.length > item.limit) {
        num = num.substr(0, num.length - item.hide);
        unitStr = item.text;
      } else break;
    }

    const re = /(-?\d+)(\d{3})/;
    while (re.test(num)) {
      num = num.replace(re, '$1,$2');
    }
    return `${num}${unitStr}`;
  },
  smartDayDiff: (moment1, moment2) => {
    const year1 = moment1.year();
    let year2 = moment2.year();
    const month1 = moment1.month();
    let month2 = moment2.month();
    const date1 = moment1.date();
    const date2 = moment2.date();
    if (month2 < month1) {
      year2 -= 1;
      month2 += 12;
    }

    let year = year2 - year1;
    let month = month2 - month1 + (date2 - date1 > 15 ? 1 : date2 - date1 < -15 ? -1 : 0);

    if (month < 0) {
      year -= 1;
      month += 12;
    } else if (month >= 12) {
      year += 1;
      month -= 12;
    }

    return {
      text:
        year > 0 || month > 0
          ? `约${year > 0 ? `${year}年` : ''}${month > 0 ? `${month}个月` : ''}`
          : '',
      value: parseInt((moment2.unix() - moment1.unix()) / 24 / 3600),
    };
  },
  isObjectEmpty: (obj, except) => {
    for (const key in obj) {
      if (!except || !_.includes(except, key)) {
        if (obj[key] != null && obj[key] !== '') {
          return false;
        }
      }
    }
    return true;
  },
  calcPriv:(component,privs)=>{
    console.log('计算组件权限',component,privs);
    return component;
  }
};
