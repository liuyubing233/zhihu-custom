/** 是否需要进入重定向 */
export const needRedirect = () => {
  const { pathname, origin } = location;
  const phoneQuestion = '/tardis/sogou/qus/';
  const phoneArt = '/tardis/zm/art/';

  if (pathname.includes(phoneQuestion)) {
    const questionId = pathname.replace(phoneQuestion, '');
    location.href = origin + '/question/' + questionId;
    return true;
  }

  if (pathname.includes(phoneArt)) {
    const questionId = pathname.replace(phoneArt, '');
    location.href = 'https://zhuanlan.zhihu.com/p/' + questionId;
    return true;
  }
  return false;
};
