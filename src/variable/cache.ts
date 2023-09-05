/** 用户信息 */
export let userInfo = {};

export const findEvent = {
  header: { fun: null, num: 0, isFind: false },
};

/** 脚本内配置缓存 */
export const storageConfig = {
  cachePfConfig: {}, // 缓存初始配置
  cacheTitle: '', // 缓存页面原标题
  fetchHeaders: {}, // fetch 的 headers 内容, 获取下来以供使用
  heightForList: 0, // 列表缓存高度
  headerDoms: {}, // header内元素
};
