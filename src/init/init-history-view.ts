import { myStorage } from '../commons/storage';
import { dom } from '../commons/tools';

/** 添加浏览历史 */
export const initHistoryView = async () => {
  const { href, origin, pathname } = location;
  setTimeout(async () => {
    let name = '';
    const isQuestion = href.includes('www.zhihu.com/question/');
    isQuestion && dom('.QuestionPage [itemprop="name"]') && (name = (dom('.QuestionPage [itemprop="name"]') as HTMLMetaElement)!.content);
    href.includes('zhuanlan.zhihu.com/p/') && dom('.Post-Title') && (name = dom('.Post-Title')!.innerText);
    href.includes('www.zhihu.com/zvideo/') && dom('.ZVideo .ZVideo-title') && (name = dom('.ZVideo .ZVideo-title')!.innerText);

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
      myStorage.setHistoryItem('view', view);
    }
  }, 500);
};
