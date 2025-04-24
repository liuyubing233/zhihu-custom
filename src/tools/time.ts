/**
 * 时间格式化
 * @param t 传入的时间
 * @param f 时间格式
 * @param showTimeFromNow 是否显示距离当前时间
 */
export const formatTime = (t: string | number, f = 'YYYY-MM-DD HH:mm:ss', showTimeFromNow = false): string => {
  if (!t) return '';
  const d = new Date(t);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hour = d.getHours();
  const min = d.getMinutes();
  const sec = d.getSeconds();
  const preArr = (num: number) => (String(num).length !== 2 ? '0' + String(num) : String(num));

  const strDate = f
    .replace(/YYYY/g, String(year))
    .replace(/MM/g, preArr(month))
    .replace(/DD/g, preArr(day))
    .replace(/HH/g, preArr(hour))
    .replace(/mm/g, preArr(min))
    .replace(/ss/g, preArr(sec));

  if (showTimeFromNow) {
    return strDate + `（${timeFromNow(t)}）`;
  }

  return strDate;
};

export const timeFromNow = (t: string | number) => {
  if (!t) return '';
  const d = new Date(t);
  const year = d.getFullYear();
  const day = d.getDate();
  const hour = d.getHours();
  const min = d.getMinutes();

  const prevTimestamp = +new Date(t);
  const now = new Date();
  const nowTimestamp = +now;
  const nowYear = now.getFullYear();
  const nowDay = now.getDate();
  const nowHour = now.getHours();
  const nowMin = now.getMinutes();

  const fromNow = nowTimestamp - prevTimestamp;

  // 一分钟内
  if (fromNow <= 1000 * 60) {
    return '刚刚';
  }

  // 一小时内
  if (fromNow <= 1000 * 60 * 60) {
    return `${nowMin - min}分钟前`;
  }

  // 一天内
  if (fromNow <= 1000 * 60 * 60 * 24) {
    return `${nowHour - hour}小时前`;
  }

  // 一个月内
  if (fromNow <= 1000 * 60 * 60 * 24 * 31) {
    return `${nowDay - day}天前`;
  }

  // 一年内
  if (fromNow <= 1000 * 60 * 60 * 24 * 365) {
    return `${Math.floor(fromNow / 1000 / 60 / 60 / 24 / 30)}个月前`;
  }

  return `${nowYear - year}年前`;
};
