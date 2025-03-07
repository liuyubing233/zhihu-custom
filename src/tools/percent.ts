/**
 * Promise.all 百分比进度
 * @param requests 异步方法数据
 * @param callback 回调函数
 */
export const promisePercent = (requests: any[] = [], callback: (index: number) => void): Promise<any[]> => {
  let index = 0;
  requests.forEach((item) => {
    item.then(() => {
      index++;
      callback(index);
    });
  });
  return Promise.all(requests);
};
