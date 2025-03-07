/** 判断浏览器环境 */
const judgeBrowserType = () => {
  const userAgent = navigator.userAgent;
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Edg')) return 'Edge';
  if (userAgent.includes('Chrome')) return 'Chrome';
  return 'Safari';
};

/** 当前浏览器是否为 Safari */
export const isSafari = judgeBrowserType() === 'Safari';
