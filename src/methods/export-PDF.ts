import { dom, domC, promisePercent } from '../commons/tools';
import { store } from '../store';
import { IPromisePercentCallbackParams } from '../types';
import { IZhihuArticlesDataItem } from '../types/zhihu-articles.type';
import { INNER_CSS } from '../web-resources';

/** 查找生成PDF的元素类名 */
const QUERY_CLASS_PDF_IFRAME = '.ctz-pdf-box-content';

const styleButton = 'margin-left: 8px;padding: 2px 8px;height: auto;font-size: 12px;background: transparent;';

const loadIframeAndExport = (eventBtn: HTMLButtonElement, innerHTML: string, btnText: string) => {
  const iframe = dom(QUERY_CLASS_PDF_IFRAME) as HTMLIFrameElement;
  if (!iframe.contentWindow) return;
  const doc = iframe.contentWindow.document;
  doc.body.innerHTML = '';
  if (!doc.head.querySelector('style')) {
    doc.write(`<style type="text/css" id="ctz-css-own">${INNER_CSS}</style>`);
  }
  doc.write(`<div class="ctz-pdf-view">${innerHTML}</div>`);

  // 检测图片是否都加载完全 解决打印不全的情况
  const imgLoadPromises: Array<Promise<boolean>> = [];
  doc.querySelectorAll('img').forEach((item) => {
    const realSrc = item.getAttribute('data-original') || item.getAttribute('data-actualsrc') || item.src;
    item.src = realSrc || '';
    imgLoadPromises.push(
      new Promise((resolve) => {
        item.onload = function () {
          resolve(true);
        };
      })
    );
  });

  const callbackLoadImg = (params: IPromisePercentCallbackParams) => {
    const { numberFinished, numberTotal, percent } = params;
    eventBtn.innerText = `资源加载进度 ${percent}：${numberFinished}/${numberTotal}`;
  };

  promisePercent(imgLoadPromises, callbackLoadImg).then(() => {
    // 图片加载完成后调用打印方法
    eventBtn.innerText = btnText;
    eventBtn.disabled = false;
    iframe.contentWindow!.print();
  });
};

/** 收藏夹打印 */
export const myCollectionExport = {
  init: function () {
    const { fetchInterceptStatus } = store.getConfig();
    if (!fetchInterceptStatus) return;
    const { pathname } = location;
    const elementBox = domC('div', { className: `${this.className}`, innerHTML: this.element });
    const nodeThis = dom(`.${this.className}`);
    nodeThis && nodeThis.remove();
    const elementTypeSpan = this.elementTypeSpan;
    const nodeCollection = elementBox.querySelector('[name="ctz-export-collection"]') as HTMLButtonElement;
    nodeCollection &&
      (nodeCollection.onclick = function () {
        const me = this as HTMLButtonElement;
        me.innerText = '加载中...';
        me.disabled = true;
        const matched = pathname.match(/(?<=\/collection\/)\d+/);
        const id = matched ? matched[0] : '';
        if (!id) return;
        const nodeCurrent = dom('.Pagination .PaginationButton--current');
        const offset = 20 * (nodeCurrent ? Number(nodeCurrent.innerText) - 1 : 0);
        const fetchHeaders = store.getStorageConfigItem('fetchHeaders') as HeadersInit;

        fetch(`/api/v4/collections/${id}/items?offset=${offset}&limit=20`, {
          method: 'GET',
          headers: new Headers(fetchHeaders),
        })
          .then((response) => {
            return response.json();
          })
          .then((res) => {
            // 收藏夹数据返回内容
            const collectionsHTMLMap = (res.data || []).map((item: any) => {
              const { type, url, question, content, title } = item.content;
              switch (type) {
                case 'zvideo':
                  return (
                    `<div class="ctz-pdf-dialog-item">` +
                    `<div class="ctz-pdf-dialog-title">${elementTypeSpan(type)}${title}</div>` +
                    `<div>视频链接：<a href="${url}" target="_blank">${url}</a></div>` +
                    `</div>`
                  );
                case 'answer':
                case 'article':
                default:
                  return (
                    `<div class="ctz-pdf-dialog-item">` +
                    `<div class="ctz-pdf-dialog-title">${elementTypeSpan(type)}${title || question.title}</div>` +
                    `<div>内容链接：<a href="${url}" target="_blank">${url}</a></div>` +
                    `<div>${content}</div>` +
                    `</div>`
                  );
              }
            });
            const collectionsHTML = collectionsHTMLMap.join('');
            loadIframeAndExport(me, collectionsHTML, '生成PDF');
          });
      });

    const nodePageHeaderTitle = dom('.CollectionDetailPageHeader-title');
    nodePageHeaderTitle && nodePageHeaderTitle.appendChild(elementBox);
  },
  className: 'ctz-export-collection-box',
  element:
    `<button class="ctz-button" name="ctz-export-collection">生成PDF</button>` +
    `<p>仅对当前页码收藏夹内容进行导出</p>` +
    `<p>图片内容过多时请耐心等待</p>` +
    `<p>如果点击没有生成PDF请刷新页面</p>`,
  elementTypeSpan: (type: string) => {
    const typeObj: Record<string, string> = {
      zvideo: '<span class="ctz-label-tag" style="color: #12c2e9;">视频</span>',
      answer: '<span class="ctz-label-tag" style="color: #ec7259;">问答</span>',
      article: '<span class="ctz-label-tag" style="color: #00965e;">文章</span>',
    };
    return typeObj[type] || '';
  },
};

/** 回答添加导出为 PDF 按钮 */
export const addButtonForAnswerExportPDF = (nodeAnswerItem: HTMLElement) => {
  const nClass = 'ctz-export-answer';
  const prevButton = nodeAnswerItem.querySelector(`.${nClass}`);
  prevButton && prevButton.remove();
  const nodeUser = nodeAnswerItem.querySelector('.AnswerItem-authorInfo>.AuthorInfo');
  if (!nodeUser) return;
  const nodeButton = domC('button', {
    innerHTML: '导出当前回答',
    className: `ctz-button ${nClass}`,
    style: styleButton,
  });

  nodeButton.onclick = function () {
    const nodeAnswerUserLink = nodeAnswerItem.querySelector('.AuthorInfo-name');
    const nodeAnswerContent = nodeAnswerItem.querySelector('.RichContent-inner');
    const innerHTML = `${nodeAnswerUserLink ? nodeAnswerUserLink.innerHTML : ''}${nodeAnswerContent ? nodeAnswerContent.innerHTML : ''}`;
    pdfExport(innerHTML);
  };
  nodeUser.appendChild(nodeButton);
};

/** 文章添加导出为 PDF 按钮 */
export const addButtonForArticleExportPDF = (nodeArticleItem: HTMLElement) => {
  const { topExportContent } = store.getConfig();
  const nClass = 'ctz-export-article';
  const prevButton = nodeArticleItem.querySelector(`.${nClass}`);
  prevButton && prevButton.remove();
  const nodeUser = nodeArticleItem.querySelector('.ArticleItem-authorInfo>.AuthorInfo') || nodeArticleItem.querySelector('.Post-Header .AuthorInfo-content');
  if (!nodeUser || !topExportContent) return;
  const nodeButton = domC('button', {
    innerHTML: '导出当前文章',
    className: `ctz-button ${nClass}`,
    style: styleButton,
  });

  nodeButton.onclick = function () {
    const nodeAnswerUserLink = nodeArticleItem.querySelector('.AuthorInfo-name');
    const nodeAnswerContent = nodeArticleItem.querySelector('.RichContent-inner') || nodeArticleItem.querySelector('.Post-RichTextContainer');
    const innerHTML = `${nodeAnswerUserLink ? nodeAnswerUserLink.innerHTML : ''}${nodeAnswerContent ? nodeAnswerContent.innerHTML : ''}`;
    pdfExport(innerHTML);
  };
  nodeUser.appendChild(nodeButton);
};

/** 直接打印元素内容为PDF */
const pdfExport = (content: string) => {
  const iframe = dom(QUERY_CLASS_PDF_IFRAME) as HTMLIFrameElement;
  if (!iframe.contentWindow || !content) return;
  const doc = iframe.contentWindow.document;
  doc.body.innerHTML = '';
  doc.write(content);
  iframe.contentWindow.print();
};

const doHomeFetch = (url: string, headers: HeadersInit): Promise<any[]> => {
  return new Promise((resolve) => {
    if (!url) {
      resolve([]);
    } else {
      fetch(url, {
        method: 'GET',
        headers: new Headers(headers),
      })
        .then((response) => response.json())
        .then((res) => resolve(res.data));
    }
  });
};

/** 当前用户所有回答导出为PDF */
export const addBtnForExportPeopleAnswer = () => {
  const { fetchInterceptStatus } = store.getConfig();
  const domListHeader = dom('.Profile-main .List-headerText');
  const domButtonOnce = dom('.ctz-people-export-answer-once');
  if (!domListHeader || domButtonOnce || !fetchInterceptStatus) return;
  const nDomButtonOnce = domC('button', {
    innerHTML: '导出当前页回答',
    className: `ctz-button ctz-people-export-answer-once`,
    style: styleButton,
  });

  nDomButtonOnce.onclick = async function () {
    const eventBtn = this as HTMLButtonElement;
    eventBtn.innerText = '加载回答内容中...';
    eventBtn.disabled = true;
    const config = store.getHomeFetch('answer');
    if (!config) return;
    const data = await doHomeFetch(config.url, config.header);
    const content = data.map((item) => `<h1>${item.question.title}</h1><div>${item.content}</div>`).join('');
    loadIframeAndExport(eventBtn, content, '导出当前页回答');
  };

  domListHeader.appendChild(nDomButtonOnce);
};

/** 当前用户文章导出为PDF */
export const addBtnForExportPeopleArticles = () => {
  const { fetchInterceptStatus } = store.getConfig();
  const domListHeader = dom('.Profile-main .List-headerText');
  const domButtonOnce = dom('.ctz-people-export-articles-once');
  if (!domListHeader || domButtonOnce || !fetchInterceptStatus) return;
  const nDomButtonOnce = domC('button', {
    innerHTML: '导出当前页文章',
    className: `ctz-button ctz-people-export-articles-once`,
    style: styleButton,
  });

  nDomButtonOnce.onclick = async function () {
    const eventBtn = this as HTMLButtonElement;
    const { search } = location;
    const page = search.replace('?page=', '') || '1';
    eventBtn.innerText = '加载文章内容中...';
    eventBtn.disabled = true;
    const prevData: IZhihuArticlesDataItem[] = [];
    if (page === '1') {
      // 文章第一页内容为 script 标签生成部分
      const domScript = dom('#js-initialData');
      if (!domScript) return;
      const scriptData = JSON.parse(domScript.innerText);
      const articles = scriptData.initialState.entities.articles;
      for (let key in articles) {
        prevData.push(articles[key]);
      }
    }
    const config = store.getHomeFetch('articles');
    if (!config) return;
    const data = await doHomeFetch(config.url, config.header);
    const content = data.map((item) => `<h1>${item.title}</h1><div>${item.content}</div>`).join('');
    loadIframeAndExport(eventBtn, content, '导出当前页文章');
  };
  domListHeader.appendChild(nDomButtonOnce);
};
