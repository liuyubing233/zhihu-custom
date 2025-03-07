/** 缓存网页标题 */
export const myCachePageTitle = {
  value: '',
  set: function (v = '') {
    this.value = v;
  },
  get: function (): string {
    return this.value;
  },
};
