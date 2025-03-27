import { dom, myStorage } from '../tools';

const CONTENT_HREF = ['www.zhihu.com/question/', 'zhuanlan.zhihu.com/p/', 'www.zhihu.com/zvideo/'];

/** 添加浏览历史 */
export const initHistoryView = async () => {
  const { href, origin, pathname } = location;
  // 判断是否在内容页面中（回答、文章、视频）
  let isContentHref = false;
  CONTENT_HREF.forEach((item) => href.includes(item) && (isContentHref = true));
  if (!isContentHref) return;

  setTimeout(async () => {
    let name = '';
    const isQuestion = href.includes('www.zhihu.com/question/');
    isQuestion &&
      dom('.QuestionPage [itemprop="name"]') &&
      (name = `<b style="color: #ec7259">「问题」</b>${(dom('.QuestionPage [itemprop="name"]') as HTMLMetaElement)!.content}`);
    href.includes('zhuanlan.zhihu.com/p/') && dom('.Post-Title') && (name = `<b style="color: #00965e">「文章」</b>${dom('.Post-Title')!.innerText}`);
    href.includes('www.zhihu.com/zvideo/') && dom('.ZVideo .ZVideo-title') && (name = `<b style="color: #12c2e9">「视频」</b>${dom('.ZVideo .ZVideo-title')!.innerText}`);

    if (!name) {
      initHistoryView();
      return;
    }

    let extra = '';
    const questionAnswerId = pathname.replace(/\/question\/\d+\/answer\//, '');
    if (isQuestion && questionAnswerId) {
      extra = ` ---- 回答: ${questionAnswerId}`;
    }

    const nA = `<a href="${origin + pathname}" target="_blank">${name + extra}</a>`;
    const { view } = await myStorage.getHistory();
    if (!view.includes(nA)) {
      view.unshift(nA);
      myStorage.updateHistoryItem('view', view);
    }
  }, 500);
};
