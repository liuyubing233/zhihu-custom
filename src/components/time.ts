import { CLASS_TIME_ITEM } from '../misc';
import { dom, domC, formatTime, myStorage } from '../tools';

/** 问题添加时间 */
export const updateItemTime = (contentItem: HTMLElement) => {
  const nodeBox = contentItem.querySelector('.ContentItem-meta');
  if (!nodeBox || contentItem.querySelector(`.${CLASS_TIME_ITEM}`)) return;
  const dateCreated = contentItem.querySelector('[itemprop="dateCreated"]') as HTMLMetaElement;
  const datePublished = contentItem.querySelector('[itemprop="datePublished"]') as HTMLMetaElement;
  const dateModified = contentItem.querySelector('[itemprop="dateModified"]') as HTMLMetaElement;
  let innerHTML = '';
  const create = dateCreated ? dateCreated.content || '' : '';
  const published = datePublished ? datePublished.content || '' : '';
  const modified = dateModified ? dateModified.content || '' : '';
  create && (innerHTML += `<div>创建时间：${formatTime(create, 'YYYY-MM-DD HH:mm:ss', true)}</div>`);
  published && (innerHTML += `<div>发布时间：${formatTime(published, 'YYYY-MM-DD HH:mm:ss', true)}</div>`);
  modified && modified !== published && modified !== create && (innerHTML += `<div>最后修改时间：${formatTime(modified, 'YYYY-MM-DD HH:mm:ss', true)}</div>`);
  nodeBox.appendChild(
    domC('div', {
      className: CLASS_TIME_ITEM,
      innerHTML,
      style: 'line-height: 24px;padding-top: 2px;font-size: 13px;color: rgb(132, 145, 165);',
    })
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
  const create = nodeCreated.content || '';
  const modified = nodeModified.content || '';

  nodeBox &&
    nodeBox.appendChild(
      domC('div', {
        className: 'ctz-question-time',
        innerHTML:
          `<div>创建时间：${formatTime(create, 'YYYY-MM-DD HH:mm:ss', true)}</div>` +
          (modified && modified !== create ? `<div>最后修改时间：${formatTime(modified, 'YYYY-MM-DD HH:mm:ss', true)}</div>` : ''),
        style: 'color: rgb(132, 145, 165);',
      })
    );
  resetQuestionTime();
};

/** 文章发布时间置顶 */
export const addArticleTime = async () => {
  const { articleCreateTimeToTop } = await myStorage.getConfig();
  const nodeT = dom('.ctz-article-time');
  if (nodeT) return;
  const nodeContentTime = dom('.ContentItem-time');
  const nodeBox = dom('.Post-Header');
  if (!articleCreateTimeToTop || !nodeContentTime || !nodeBox) return;
  nodeBox.appendChild(
    domC('span', {
      className: 'ctz-article-time',
      style: 'line-height: 30px;color: rgb(132, 145, 165);',
      innerHTML: nodeContentTime.innerText || '',
    })
  );
  setTimeout(() => {
    // 解决页面重载问题
    addArticleTime();
  }, 500);
};
