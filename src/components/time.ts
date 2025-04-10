import { CLASS_TIME_ITEM } from '../misc';
import { dom, domC, formatTime, insertAfter, myStorage } from '../tools';

/** 问题添加时间 */
export const updateItemTime = (contentItem: HTMLElement) => {
  const nodeBox = contentItem.querySelector('.ContentItem-meta');
  if (!nodeBox || contentItem.querySelector(`.${CLASS_TIME_ITEM}`)) return;
  const dateCreated = contentItem.querySelector('[itemprop="dateCreated"]');
  const datePublished = contentItem.querySelector('[itemprop="datePublished"]');
  const dateModified = contentItem.querySelector('[itemprop="dateModified"]');
  let innerHTML = '';
  dateCreated && (innerHTML += `<div>创建时间：${formatTime(dateCreated.getAttribute('content') || '')}</div>`);
  datePublished && (innerHTML += `<div>发布时间：${formatTime(datePublished.getAttribute('content') || '')}</div>`);
  dateModified && (innerHTML += `<div>最后修改时间：${formatTime(dateModified.getAttribute('content') || '')}</div>`);
  insertAfter(
    domC('div', {
      className: CLASS_TIME_ITEM,
      innerHTML,
      style: 'line-height: 24px;padding-top: 2px;font-size: 14px;color: rgb(132, 145, 165);',
    }),
    nodeBox
  );
};

export const removeItemTime = (contentItem?: Element) => {
  if (!contentItem) return;
  const prevTime = contentItem.querySelector(`.${CLASS_TIME_ITEM}`);
  prevTime && prevTime.remove();
};

let questionTimeout: NodeJS.Timeout;
let questionFindIndex = 0;
const resetQuestionTime = () => {
  if (questionFindIndex > 5 || !dom('.ctz-question-time')) {
    return;
  }
  questionFindIndex++;
  clearTimeout(questionTimeout);
  questionTimeout = setTimeout(addQuestionTime, 500);
};

/** 问题详情添加时间 */
export const addQuestionTime = async () => {
  const nodeTime = dom('.ctz-question-time');
  nodeTime && nodeTime.remove();
  const { questionCreatedAndModifiedTime } = await myStorage.getConfig();
  const nodeCreated = dom('[itemprop="dateCreated"]') as HTMLMetaElement;
  const nodeModified = dom('[itemprop="dateModified"]') as HTMLMetaElement;
  const nodeBox = dom('.QuestionPage .QuestionHeader-title');
  if (!questionCreatedAndModifiedTime || !nodeCreated || !nodeModified || !nodeBox) {
    resetQuestionTime();
    return;
  }
  nodeBox &&
    nodeBox.appendChild(
      domC('div', {
        className: 'ctz-question-time',
        innerHTML: `<div>创建时间：${formatTime(nodeCreated.content)}</div><div>最后修改时间：${formatTime(nodeModified.content)}</div>`,
        style: 'color: rgb(132, 145, 165);',
      })
    );
  resetQuestionTime();
};

const C_ARTICLE_TIME = 'ctz-article-time';
/** 文章发布时间置顶 */
export const addArticleTime = async () => {
  const { articleCreateTimeToTop } = await myStorage.getConfig();
  const nodeT = dom(`.${C_ARTICLE_TIME}`);
  if (nodeT) return;
  const nodeContentTime = dom('.ContentItem-time');
  const nodeBox = dom('.Post-Header');
  if (!articleCreateTimeToTop || !nodeContentTime || !nodeBox) return;
  nodeBox.appendChild(
    domC('span', {
      className: C_ARTICLE_TIME,
      style: 'line-height: 30px;color: rgb(132, 145, 165);',
      innerHTML: nodeContentTime.innerText || '',
    })
  );
  setTimeout(() => {
    // 解决页面重载问题
    addArticleTime();
  }, 500);
};
