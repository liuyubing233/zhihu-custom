import { dom, domC, promisePercent } from '../commons/tools';
import { store } from '../store';
import { IPromisePercentCallbackParams } from '../types';
import { INNER_CSS } from '../web-resources';

/** 查找生成PDF的元素类名 */
const QUERY_CLASS_PDF_IFRAME = '.ctz-pdf-box-content';

/** 收藏夹打印 */
export const myCollectionExport = {
  init: function () {
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

            const iframe = dom(QUERY_CLASS_PDF_IFRAME) as HTMLIFrameElement;
            if (iframe.contentWindow) {
              const collectionsHTML = collectionsHTMLMap.join('');
              const doc = iframe.contentWindow.document;
              doc.body.innerHTML = '';
              if (!doc.head.querySelector('style')) {
                doc.write(`<style type="text/css" id="ctz-css-own">${INNER_CSS}</style>`);
              }
              doc.write(`<div class="ctz-pdf-view">${collectionsHTML}</div>`);

              // 检测图片是否都加载完全 解决打印不全的情况
              const imgLoadPromises: Array<Promise<any>> = [];
              doc.querySelectorAll('img').forEach((item) => {
                imgLoadPromises.push(
                  new Promise((resolve, reject) => {
                    item.onload = function () {
                      resolve(true);
                    };
                  })
                );
              });

              const callbackLoadImg = (params: IPromisePercentCallbackParams) => {
                const { numberFinished, numberTotal, percent } = params;
                me.innerText = `资源加载进度 ${percent}，已完成/总数：${numberFinished}/${numberTotal}...`;
              };

              promisePercent(imgLoadPromises, callbackLoadImg).then(() => {
                // 图片加载完成后调用打印方法
                me.innerText = '生成PDF';
                me.disabled = false;
                iframe.contentWindow && iframe.contentWindow.print();
              });
            }
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
export const myAnswerPDF = {
  addBtn: (nodeAnswerItem: HTMLElement) => {
    const nClass = 'ctz-export-answer';
    const prevButton = nodeAnswerItem.querySelector(`.${nClass}`);
    prevButton && prevButton.remove();
    const nodeUser = nodeAnswerItem.querySelector('.AnswerItem-authorInfo>.AuthorInfo');
    if (!nodeUser) return;
    const nodeButton = domC('button', {
      innerHTML: '导出当前回答',
      className: `ctz-button ${nClass}`,
      style: 'margin-left: 8px;padding: 2px 8px;height: auto;font-size: 12px;',
    });

    nodeButton.onclick = function () {
      const iframe = dom(QUERY_CLASS_PDF_IFRAME) as HTMLIFrameElement;
      const nodeAnswerUserLink = nodeAnswerItem.querySelector('.AuthorInfo-name');
      const nodeAnswerContent = nodeAnswerItem.querySelector('.RichContent-inner');
      if (!iframe.contentWindow || !nodeAnswerContent) return;
      const doc = iframe.contentWindow.document;
      doc.body.innerHTML = '';
      doc.write(`${nodeAnswerUserLink ? nodeAnswerUserLink.innerHTML : ''}${nodeAnswerContent.innerHTML}`);
      iframe.contentWindow.print();
    };
    nodeUser.appendChild(nodeButton);
  },
};

/** 文章添加导出为 PDF 按钮 */
export const myArticlePDF = {
  addBtn: (nodeArticleItem: HTMLElement) => {
    const nClass = 'ctz-export-article';
    const prevButton = nodeArticleItem.querySelector(`.${nClass}`);
    prevButton && prevButton.remove();
    const nodeUser = nodeArticleItem.querySelector('.ArticleItem-authorInfo>.AuthorInfo') || nodeArticleItem.querySelector('.Post-Header .AuthorInfo-content');
    if (!nodeUser) return;
    const nodeButton = domC('button', {
      innerHTML: '导出当前文章',
      className: `ctz-button ${nClass}`,
      style: 'margin-left: 8px;padding: 2px 8px;height: auto;font-size: 12px;',
    });

    nodeButton.onclick = function () {
      const iframe = dom(QUERY_CLASS_PDF_IFRAME) as HTMLIFrameElement;
      const nodeAnswerUserLink = nodeArticleItem.querySelector('.AuthorInfo-name');
      const nodeAnswerContent = nodeArticleItem.querySelector('.RichContent-inner') || nodeArticleItem.querySelector('.Post-RichTextContainer');
      if (!iframe.contentWindow || !nodeAnswerContent) return;
      const doc = iframe.contentWindow.document;
      doc.body.innerHTML = '';
      doc.write(`${nodeAnswerUserLink ? nodeAnswerUserLink.innerHTML : ''}${nodeAnswerContent.innerHTML}`);
      iframe.contentWindow.print();
    };
    nodeUser.appendChild(nodeButton);
  },
};
