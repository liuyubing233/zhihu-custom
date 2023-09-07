/** 是否需要进入重定向 */
export const needRedirect = () => {
  const { pathname, origin } = location;
  const PATHNAME_FOR_PHONE_QUESTION = '/tardis/sogou/qus/';
  const PATHNAME_FOR_PHONE_ART = '/tardis/zm/art/';
  // 重定向页面
  if (pathname.includes(PATHNAME_FOR_PHONE_QUESTION)) {
    const questionId = pathname.replace(PATHNAME_FOR_PHONE_QUESTION, '');
    location.href = origin + '/question/' + questionId;
    return true;
  }

  if (pathname.includes(PATHNAME_FOR_PHONE_ART)) {
    const questionId = pathname.replace(PATHNAME_FOR_PHONE_ART, '');
    location.href = 'https://zhuanlan.zhihu.com/p/' + questionId;
    return true;
  }
  return false;
};
