import { createCommentHeaders } from '../commons/fetch';
import { createBtnSmallTran, dom, domC } from '../commons/tools';
import { store } from '../store';
import { IZhihuArticlesDataItem } from '../types/zhihu-articles.type';
import { INNER_CSS } from '../web-resources';

/** 查找生成PDF的元素类名 */
const QUERY_CLASS_PDF_IFRAME = '.ctz-pdf-box-content';

const loadIframeAndExport = (eventBtn: HTMLButtonElement, arrHTML: string[], btnText: string) => {
  let max = 0;
  let finish = 0;
  let error = 0;
  const innerHTML = arrHTML.join('');

  const iframe = dom(QUERY_CLASS_PDF_IFRAME) as HTMLIFrameElement;
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
            loadIframeAndExport(me, collectionsHTMLMap, '生成PDF');
          });
      });

    const nodePageHeaderTitle = dom('.CollectionDetailPageHeader-title');
    nodePageHeaderTitle && nodePageHeaderTitle.appendChild(elementBox);
  },
  className: 'ctz-export-collection-box',
  element: `<button class="ctz-button" name="ctz-export-collection">生成PDF</button>` + `<p>仅对当前页内容进行导出</p>`,
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
  const prevButton = nodeAnswerItem.querySelector('.ctz-export-answer');
  if (prevButton) return;
  const nodeUser = nodeAnswerItem.querySelector('.AnswerItem-authorInfo>.AuthorInfo');
  if (!nodeUser) return;
  const nodeButton = createBtnSmallTran('导出当前回答', 'ctz-export-answer');
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
  const prevButton = nodeArticleItem.querySelector('.ctz-export-article');
  if (prevButton) return;
  const nodeUser = nodeArticleItem.querySelector('.ArticleItem-authorInfo>.AuthorInfo') || nodeArticleItem.querySelector('.Post-Header .AuthorInfo-content');
  if (!nodeUser || !topExportContent) return;
  const nodeButton = createBtnSmallTran('导出当前文章', 'ctz-export-article');
  nodeButton.onclick = function () {
    const nodeAnswerUserLink = nodeArticleItem.querySelector('.AuthorInfo-name');
    const nodeAnswerContent = nodeArticleItem.querySelector('.RichContent-inner') || nodeArticleItem.querySelector('.Post-RichTextContainer');
    const innerHTML = `${nodeAnswerUserLink ? nodeAnswerUserLink.innerHTML : ''}${nodeAnswerContent ? nodeAnswerContent.innerHTML : ''}`;
    pdfExport(innerHTML);
  };
  nodeUser.appendChild(nodeButton);
  setTimeout(() => {
    // 是为了解决页面内容被刷新的掉的问题
    addButtonForArticleExportPDF(nodeArticleItem);
  }, 500);
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
  const nDomButtonOnce = createBtnSmallTran('导出当前页回答', 'ctz-people-export-answer-once');
  nDomButtonOnce.onclick = async function () {
    const eventBtn = this as HTMLButtonElement;
    eventBtn.innerText = '加载回答内容中...';
    eventBtn.disabled = true;

    const { search, pathname } = location;
    const matchPageArr = search.match(/page=(\d?)/);
    const page = matchPageArr && matchPageArr.length ? matchPageArr[1] : '1';
    const matchUsernameArr = pathname.match(/people\/([\W\w]+)\//);
    const username = matchUsernameArr && matchUsernameArr.length ? matchUsernameArr[1] : '';
    if (!username) return;
    const requestUrl = `
/api/v4/members/${username}/answers?include=data%5B*%5D.is_normal%2Cadmin_closed_comment%2Creward_info%2Cis_collapsed%2Cannotation_action%2Cannotation_detail%2Ccollapse_reason%2Ccollapsed_by%2Csuggest_edit%2Ccomment_count%2Ccan_comment%2Ccontent%2Ceditable_content%2Cattachment%2Cvoteup_count%2Creshipment_settings%2Ccomment_permission%2Ccreated_time%2Cupdated_time%2Creview_info%2Cexcerpt%2Cpaid_info%2Creaction_instruction%2Cis_labeled%2Clabel_info%2Crelationship.is_authorized%2Cvoting%2Cis_author%2Cis_thanked%2Cis_nothelp%3Bdata%5B*%5D.vessay_info%3Bdata%5B*%5D.author.badge%5B%3F%28type%3Dbest_answerer%29%5D.topics%3Bdata%5B*%5D.author.vip_info%3Bdata%5B*%5D.question.has_publishing_draft%2Crelationship&offset=${
      (+page - 1) * 20
    }&limit=20&sort_by=created`;
    const header = createCommentHeaders(requestUrl);
    // const config = store.getHomeFetch('answer');
    // console.log('config', config);
    // if (!config) return;

    const data = await doHomeFetch(requestUrl, header);
    const content = data.map((item) => `<h1>${item.question.title}</h1><div>${item.content}</div>`);
    loadIframeAndExport(eventBtn, content, '导出当前页回答');
  };
  domListHeader.appendChild(nDomButtonOnce);
  setTimeout(() => {
    addBtnForExportPeopleAnswer();
  }, 500);
};

/** 当前用户文章导出为PDF */
export const addBtnForExportPeopleArticles = () => {
  const { fetchInterceptStatus } = store.getConfig();
  const domListHeader = dom('.Profile-main .List-headerText');
  const domButtonOnce = dom('.ctz-people-export-articles-once');
  if (!domListHeader || domButtonOnce || !fetchInterceptStatus) return;
  const nDomButtonOnce = createBtnSmallTran('导出当前页文章', 'ctz-people-export-articles-once');
  nDomButtonOnce.onclick = async function () {
    const eventBtn = this as HTMLButtonElement;
    const { search, pathname } = location;
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
    const matchUsernameArr = pathname.match(/people\/([\W\w]+)\//);
    const username = matchUsernameArr && matchUsernameArr.length ? matchUsernameArr[1] : '';
    if (!username) return;
    const requestUrl = `https://www.zhihu.com/api/v4/members/${username}/articles?include=data%5B*%5D.comment_count%2Csuggest_edit%2Cis_normal%2Cthumbnail_extra_info%2Cthumbnail%2Ccan_comment%2Ccomment_permission%2Cadmin_closed_comment%2Ccontent%2Cvoteup_count%2Ccreated%2Cupdated%2Cupvoted_followees%2Cvoting%2Creview_info%2Creaction_instruction%2Cis_labeled%2Clabel_info%3Bdata%5B*%5D.vessay_info%3Bdata%5B*%5D.author.badge%5B%3F%28type%3Dbest_answerer%29%5D.topics%3Bdata%5B*%5D.author.vip_info%3B&offset=${
      (+page - 1) * 20
    }&limit=20&sort_by=created`;
    const header = createCommentHeaders(requestUrl);
    const data = await doHomeFetch(requestUrl, header);
    const content = data.map((item) => `<h1>${item.title}</h1><div>${item.content}</div>`);
    loadIframeAndExport(eventBtn, content, '导出当前页文章');
  };
  domListHeader.appendChild(nDomButtonOnce);
};
