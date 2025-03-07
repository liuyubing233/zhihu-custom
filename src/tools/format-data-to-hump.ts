/**
 * 下划线转驼峰
 * if_answer_is_had ---> isAnswerIsHad
 */
export function formatDataToHump(data: any): any {
  if (!data) return data;
  if (Array.isArray(data)) {
    return data.map((item) => {
      return typeof item === 'object' ? formatDataToHump(item) : item;
    });
  } else if (typeof data === 'object') {
    const nData: any = {};
    Object.keys(data).forEach((prevKey) => {
      const nKey = prevKey.replace(/\_(\w)/g, (_, $1) => $1.toUpperCase());
      nData[nKey] = formatDataToHump(data[prevKey]);
    });
    return nData;
  }
  return data;
}
