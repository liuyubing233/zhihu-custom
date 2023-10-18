import { dom, domC } from '../commons/tools';
import { store } from '../store';
import { IMyElement } from '../types';

/** 时间格式化 */
const timeFormatter = (time: string, formatter = 'YYYY-MM-DD HH:mm:ss') => {
  if (!time) return '';
  const date = new Date(time);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const min = date.getMinutes();
  const sec = date.getSeconds();
  const preArr = (num: number) => (String(num).length !== 2 ? '0' + String(num) : String(num));
  return formatter
    .replace(/YYYY/g, String(year))
    .replace(/MM/g, preArr(month))
    .replace(/DD/g, preArr(day))
    .replace(/HH/g, preArr(hour))
    .replace(/mm/g, preArr(min))
    .replace(/ss/g, preArr(sec));
};

/** 问题添加时间 */
export const addTimes = (event: IMyElement) => {
  const className = 'ctz-list-item-time';
  const node = event.querySelector(`.${className}`);
  node && node.remove();
  const nodeCreated = event.querySelector('[itemprop="dateCreated"]') as IMyElement;
  const nodePublished = event.querySelector('[itemprop="datePublished"]') as IMyElement;
  const nodeModified = event.querySelector('[itemprop="dateModified"]') as IMyElement;
  const crTime = nodeCreated ? nodeCreated.content : '';
  const puTime = nodePublished ? nodePublished.content : '';
  const muTime = nodeModified ? nodeModified.content : '';
  const created = timeFormatter(crTime || puTime);
  const modified = timeFormatter(muTime);
  const nodeMeta = event.querySelector('.ContentItem-meta');
  if (!created || !nodeMeta) return;
  nodeMeta.appendChild(
    domC('div', {
      className,
      style: 'line-height: 24px;padding-top: 2px;',
      innerHTML: `<div>创建时间：${created}</div><div>最后修改时间：${modified}</div>`,
    })
  );
};

/** 问题详情添加时间 */
export const addQuestionCreatedAndModifiedTime = () => {
  const { getConfig } = store;
  const className = 'ctz-question-time';
  const nodeTime = dom(`.${className}`);
  nodeTime && nodeTime.remove();
  const conf = getConfig();
  const nodeCreated = dom('[itemprop="dateCreated"]');
  const nodeModified = dom('[itemprop="dateModified"]');
  if (!(conf.questionCreatedAndModifiedTime && nodeCreated && nodeModified)) return;
  const created = timeFormatter(nodeCreated.content);
  const modified = timeFormatter(nodeModified.content);
  const nodeTitle = dom('.QuestionPage .QuestionHeader-title');
  nodeTitle &&
    nodeTitle.appendChild(
      domC('div', {
        className,
        innerHTML: `<div>创建时间：${created}</div><div>最后修改时间：${modified}</div>`,
      })
    );
};

/** 文章发布时间置顶 */
export const addArticleCreateTimeToTop = () => {
  const { getConfig } = store;
  const className = 'ctz-article-create-time';
  const nodeT = dom(`.${className}`);
  nodeT && nodeT.remove();
  const conf = getConfig();
  const nodeContentTime = dom('.ContentItem-time');
  const nodeHeader = dom('.Post-Header');
  if (!(conf.articleCreateTimeToTop && nodeContentTime && nodeHeader)) return;
  nodeHeader.appendChild(
    domC('span', {
      className,
      style: 'color: #8590a6;line-height: 30px;',
      innerHTML: nodeContentTime.innerText || '',
    })
  );
};
