import moment from 'moment-timezone';

export const isJsonString = str => {
  if (str) {
    try {
      return JSON.parse(str);
    } catch (e) {
      return null;
    }
  } else {
    return null;
  }
};

export function rangeDesc(start, end) {
  return Array(start - end + 1)
    .fill()
    .map((_, idx) => start - idx);
}

export const today = moment().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD');

export const formatDate = (date, format = 'MM/DD/YYYY') => moment(date).format(format);

export const getInitFilerChart = () => ({
  startDate: new Date(formatDate(moment(new Date()).subtract(6, 'days').add(1, 'day'))),
  endDate: new Date(formatDate(moment(new Date()).add(1, 'day'))),
});

export const downloadFile = (file, name) => {
  const url = window.URL.createObjectURL(new Blob([file]));
  const link = document.createElement('a');

  link.href = url;
  link.setAttribute('download', `${name}.xlsx`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const getDomainUrl = (url) => {
  const matchResult = url?.match(/^https?:\/\/([a-zA-Z0-9.-]+)\.com$/);
  if (matchResult && matchResult.length === 2) {
    return matchResult[1];
  }
}

export const getUrlWebsite = (domain) => {
  return 'https://' + domain + '.com'
}

export const isObjectNameInArray = (targetName, array, key) => array?.some(element => element[key] === targetName);
