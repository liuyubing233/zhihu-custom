import { store } from '../store';
import { createButtonFontSize12, dom, domC, insertAfter, myStorage } from '../tools';
import { INNER_CSS } from '../web-resources';

const loadIframePrint = (eventBtn: HTMLButtonElement, arrHTML: string[], btnText: string) => {
  let max = 0;
  let finish = 0;
  let error = 0;
  const innerHTML = arrHTML.join('');

  const iframe = dom('.ctz-pdf-box-content') as HTMLIFrameElement;
  if (!iframe.contentWindow) return;
  const doc = iframe.contentWindow.document;
  doc.body.innerHTML = '';
  if (!doc.head.querySelector('style')) {
    doc.write(`<style type="text/css" id="ctz-css-own">${INNER_CSS}</style>`);
  }
  doc.write(`<div class="ctz-pdf-view"></div>`);
  const nodePDFView = doc.querySelector('.ctz-pdf-view')!;
  const domInner = domC('div', { innerHTML });
  max = domInner.querySelectorAll('img').length;
  domInner.querySelectorAll('img').forEach((imageItem) => {
    // 先将图片内容设置为空
    const dataOriginal = imageItem.getAttribute('data-original');
    if (!dataOriginal) {
      imageItem.setAttribute('data-original', imageItem.src);
    }
    imageItem.src = '';
  });
  nodePDFView.appendChild(domInner);

  const doPrint = () => {
    eventBtn.innerText = btnText;
    eventBtn.disabled = false;
    iframe.contentWindow!.print();
  };
  const imageLoaded = () => {
    eventBtn.innerText = `资源加载进度 ${Math.floor((finish / max) * 100)}%：${finish}/${max}${error > 0 ? `，${error}张图片资源已失效` : ''}`;
    if (finish + error === max) {
      doPrint();
    }
  };
  if (nodePDFView.querySelectorAll('img').length) {
    nodePDFView.querySelectorAll('img').forEach((imageItem, index) => {
      setTimeout(function () {
        imageItem.src = imageItem.getAttribute('data-original')!;
        imageItem.onload = function () {
          finish++;
          imageLoaded();
        };
        imageItem.onerror = function () {
          error++;
          imageLoaded();
        };
      }, Math.floor(index / 5) * 100); // 100ms加载6张图片一组加载，一次性加载太多会拦截
    });
  } else {
    doPrint();
  }
};

/** 收藏夹打印 */
export const myCollectionExport = {
  init: async function () {
    const { fetchInterceptStatus } = await myStorage.getConfig();
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
        const fetchHeaders = store.getFetchHeaders();

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
            loadIframePrint(me, collectionsHTMLMap, '导出此页内容');
          });
      });

    const nodePageHeaderTitle = dom('.CollectionDetailPageHeader-title');
    nodePageHeaderTitle && nodePageHeaderTitle.appendChild(elementBox);
  },
  className: 'ctz-export-collection-box',
  element: `<button class="ctz-button" name="ctz-export-collection">导出此页内容</button>` + `<p>仅对此页内容进行导出</p>`,
  elementTypeSpan: (type: string) => {
    const typeObj: Record<string, string> = {
      answer: '<b style="color: #ec7259">「问题」</b>',
      zvideo: '<b style="color: #12c2e9">「视频」</b>',
      article: '<b style="color: #00965e">「文章」</b>',
    };
    return typeObj[type] || '';
  },
};

/** 导出当前回答 */
export const printAnswer = (contentItem: HTMLElement) => {
  const boxItem = (contentItem.classList.contains('AnswerItem') ? contentItem.parentElement : contentItem) as HTMLElement;
  const prevButton = boxItem.querySelector('.ctz-answer-print');
  if (prevButton) return;
  const nodeUser = boxItem.querySelector('.AnswerItem-authorInfo>.AuthorInfo');
  if (!nodeUser) return;
  const nButton = createButtonFontSize12('导出回答', 'ctz-answer-print');
  nButton.onclick = function () {
    const nodeUser = boxItem.querySelector('.AuthorInfo-name .UserLink-link');
    const nodeContent = boxItem.querySelector('.RichContent-inner');
    const innerHTML = `<h1>${JSON.parse(boxItem.querySelector('.AnswerItem')!.getAttribute('data-zop') || '{}').title}</h1>${nodeUser!.outerHTML + nodeContent!.innerHTML}`;
    loadIframePrint(this as HTMLButtonElement, [innerHTML], '导出回答');
  };
  nodeUser.appendChild(nButton);
};

/** 导出当前文章 */
export const printArticle = async (contentItem: HTMLElement) => {
  const { topExportContent } = await myStorage.getConfig();
  const prevButton = contentItem.querySelector('.ctz-article-print');
  if (prevButton || !topExportContent) return;
  const nodeHeader = contentItem.querySelector('.ArticleItem-authorInfo') || contentItem.querySelector('.Post-Header .Post-Title');
  if (!nodeHeader) return;
  const nButton = createButtonFontSize12('导出文章', 'ctz-article-print', { style: 'margin: 12px 0;' });
  nButton.onclick = function () {
    const nodeTitle = contentItem.querySelector('.ContentItem-title>span') || contentItem.querySelector('.Post-Header .Post-Title');
    const nodeUser = contentItem.querySelector('.AuthorInfo-name');
    const nodeContent = contentItem.querySelector('.RichContent-inner') || contentItem.querySelector('.Post-RichTextContainer');
    const innerHTML = `<h1>${nodeTitle!.innerHTML}</h1>${nodeUser!.innerHTML + nodeContent!.innerHTML}`;
    loadIframePrint(this as HTMLButtonElement, [innerHTML], '导出文章');
  };
  insertAfter(nButton, nodeHeader);
  setTimeout(() => {
    // 是为了解决页面内容被刷新的掉的问题
    printArticle(contentItem);
  }, 500);
};

/** 用户主页 - 导出此页回答 */
export const printPeopleAnswer = async () => {
  const { fetchInterceptStatus } = await myStorage.getConfig();
  const nodeListHeader = dom('.Profile-main .List-headerText');
  const prevButton = dom(`.ctz-people-answer-print`);
  if (!nodeListHeader || prevButton || !fetchInterceptStatus) return;
  const nButton = createButtonFontSize12('导出此页回答', 'ctz-people-answer-print');
  nButton.onclick = async function () {
    const eventBtn = this as HTMLButtonElement;
    eventBtn.innerText = '加载回答内容中...';
    eventBtn.disabled = true;
    const data = store.getUserAnswer();
    const content = data.map((item) => `<h1>${item.question.title}</h1><div>${item.content}</div>`);
    loadIframePrint(eventBtn, content, '导出此页回答');
  };
  nodeListHeader.appendChild(nButton);
  setTimeout(() => {
    printPeopleAnswer();
  }, 500);
};

/** 当前用户文章导出为PDF */
export const printPeopleArticles = async () => {
  const { fetchInterceptStatus } = await myStorage.getConfig();
  const nodeListHeader = dom('.Profile-main .List-headerText');
  const prevButton = dom('.ctz-people-export-articles-once');
  if (!nodeListHeader || prevButton || !fetchInterceptStatus) return;
  const nButton = createButtonFontSize12('导出此页文章', 'ctz-people-export-articles-once');
  nButton.onclick = async function () {
    const eventBtn = this as HTMLButtonElement;
    eventBtn.innerText = '加载文章内容中...';
    eventBtn.disabled = true;
    const data = store.getUserArticle();
    const content = data.map((item) => `<h1>${item.title}</h1><div>${item.content}</div>`);
    loadIframePrint(eventBtn, content, '导出此页文章');
  };
  nodeListHeader.appendChild(nButton);
  setTimeout(() => {
    printPeopleArticles();
  }, 500);
};
