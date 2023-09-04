/** 加载数据 */
export const initData = () => {
  storageConfig.cacheTitle = document.title;
  echoData();
  cacheHeader();
  changeICO();
  changeTitle();
  changeSuspensionTab();
};
