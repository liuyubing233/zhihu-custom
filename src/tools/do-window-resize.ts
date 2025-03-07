/** 手动触发页面尺寸变更方法 */
export const windowResize = () => {
  window.dispatchEvent(new Event('resize'));
};
