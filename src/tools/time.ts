/** 时间格式化 */
export const formatTime = (t: string | number, f = 'YYYY-MM-DD HH:mm:ss') => {
  if (!t) return '';
  const d = new Date(t);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const hour = d.getHours();
  const min = d.getMinutes();
  const sec = d.getSeconds();
  const preArr = (num: number) => (String(num).length !== 2 ? '0' + String(num) : String(num));
  return f
    .replace(/YYYY/g, String(year))
    .replace(/MM/g, preArr(month))
    .replace(/DD/g, preArr(day))
    .replace(/HH/g, preArr(hour))
    .replace(/mm/g, preArr(min))
    .replace(/ss/g, preArr(sec));
};
