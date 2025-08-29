
// /**
//  * 初始化缓存顶部元素
//  * 顶部发现模块、个人中心模块、搜索模块
//  */
// export const initCacheHeader = () => {
//   cacheSuspension('suspensionFind', '.AppHeader-inner .AppHeader-Tabs');
//   cacheSuspension('suspensionSearch', '.AppHeader-inner .SearchBar');
//   cacheSuspension('suspensionUser', '.AppHeader-inner .AppHeader-userInfo');
// };

// /** 查找缓存顶部元素 */
// const cacheSuspension = (name: IHeaderName, classname: string, index = 0) => {
//   const { setHeaderCache, getHeaderCache, setHeaderFound } = storeSuspension;
//   const prevDom = getHeaderCache(name);

//   // 当前元素仍然存在于页面上，那么知乎自身已经重载完毕
//   if (prevDom && document.body.contains(prevDom)) {
//     setHeaderFound(name);
//     suspensionHeader(name);
//     return;
//   }

//   const nextDom = dom(classname);
//   if (nextDom) {
//     setHeaderCache(name, nextDom);
//     setTimeout(() => cacheSuspension(name, classname, index), 500);
//     return;
//   }

//   // 如果已经查找超过十次仍未查找到元素则不进行再次查找（页面上不存在此元素）
//   if (index >= 10) {
//     setHeaderFound(name);
//     return;
//   }
//   setTimeout(() => cacheSuspension(name, classname, ++index), 500);
// };
