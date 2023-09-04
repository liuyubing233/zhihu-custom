/** 时间格式化 */
const timeFormatter = (time, formatter = 'YYYY-MM-DD HH:mm:ss') => {
  if (!time) return '';
  const date = new Date(time);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const min = date.getMinutes();
  const sec = date.getSeconds();
  const preArr = (num) => (String(num).length !== 2 ? '0' + String(num) : String(num));
  return formatter
    .replace(/YYYY/g, year)
    .replace(/MM/g, preArr(month))
    .replace(/DD/g, preArr(day))
    .replace(/HH/g, preArr(hour))
    .replace(/mm/g, preArr(min))
    .replace(/ss/g, preArr(sec));
};

/** 问题添加时间 */
export const addTimes = (event) => {
  const className = 'ctz-list-item-time';
  event.querySelector(`.${className}`) && event.querySelector(`.${className}`).remove();
  const crTime = event.querySelector('[itemprop="dateCreated"]') ? event.querySelector('[itemprop="dateCreated"]').content : '';
  const puTime = event.querySelector('[itemprop="datePublished"]') ? event.querySelector('[itemprop="datePublished"]').content : '';
  const muTime = event.querySelector('[itemprop="dateModified"]') ? event.querySelector('[itemprop="dateModified"]').content : '';
  const created = timeFormatter(crTime || puTime);
  const modified = timeFormatter(muTime);
  if (!created || !event.querySelector('.ContentItem-meta')) return;
  event.querySelector('.ContentItem-meta').appendChild(
    domC('div', {
      className,
      style: 'line-height: 24px;padding-top: 6px;',
      innerHTML: `<div>创建时间：${created}</div><div>最后修改时间：${modified}</div>`,
    })
  );
};

/** 问题详情添加时间 */
export const addQuestionCreatedAndModifiedTime = () => {
  const className = 'ctz-question-time';
  dom(`.${className}`) && dom(`.${className}`).remove();
  if (!(pfConfig.questionCreatedAndModifiedTime && dom('[itemprop="dateCreated"]'))) return;
  const created = timeFormatter(dom('[itemprop="dateCreated"]').content);
  const modified = timeFormatter(dom('[itemprop="dateModified"]').content);
  dom('.QuestionPage .QuestionHeader-title').appendChild(
    domC('div', {
      className,
      innerHTML: `<div>创建时间：${created}</div><div>最后修改时间：${modified}</div>`,
    })
  );
};

/** 文章发布时间置顶 */
export const addArticleCreateTimeToTop = () => {
  const className = 'ctz-article-create-time';
  dom(`.${className}`) && dom(`.${className}`).remove();
  if (!(pfConfig.articleCreateTimeToTop && dom('.ContentItem-time'))) return;
  dom('.Post-Header').appendChild(
    domC('span', {
      className,
      style: 'color: #8590a6;line-height: 30px;',
      innerHTML: dom('.ContentItem-time').innerText || '',
    })
  );
};
