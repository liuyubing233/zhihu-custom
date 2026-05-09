import { store } from '../store';
import { createButtonFontSize12, dom, domA, domC, insertAfter, message, myStorage } from '../tools';
import { INNER_CSS } from '../web-resources';

type IProfileExportType = 'answer' | 'article';

const CLASS_PEOPLE_EXPORT_PROGRESS = 'ctz-people-export-progress';
const PROFILE_EXPORT_LIMIT = 20;

const parseJSONAttr = (value: string | null): any => {
  if (!value) return undefined;
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
};

const normalizeContentId = (value: any) => {
  if (value === undefined || value === null) return '';
  const str = String(value);
  const matched = str.match(/\d+/g);
  return matched ? matched[matched.length - 1] : str;
};

const getVisibleProfileItems = (contentClassName: string) =>
  Array.from(domA(`.Profile-main .ListShortcut .List-item .${contentClassName}`)).filter((item) => item.offsetParent || item.getClientRects().length);

const getProfileItemId = (contentItem: HTMLElement, type: IProfileExportType) => {
  const dataZop = parseJSONAttr(contentItem.getAttribute('data-zop'));
  const dataZaExtra = parseJSONAttr(contentItem.getAttribute('data-za-extra-module'));
  const attrId = dataZop?.itemId || dataZaExtra?.card?.content?.token;
  if (attrId) return normalizeContentId(attrId);

  const hrefSelector = type === 'answer' ? 'a[href*="/answer/"]' : 'a[href*="/p/"]';
  const link = contentItem.querySelector(hrefSelector) as HTMLAnchorElement | null;
  const href = link ? link.href || link.getAttribute('href') || '' : '';
  const matched = href.match(type === 'answer' ? /\/answer\/(\d+)/ : /\/p\/(\d+)/);
  return matched ? matched[1] : '';
};

const getExportDataId = (item: any) => normalizeContentId(item && item.id);

const mergeProfileExportData = (...dataList: any[][]) => {
  const data: any[] = [];
  const dataMap = new Map<string, any>();
  dataList.forEach((list) => {
    list.forEach((item) => {
      const id = getExportDataId(item);
      if (!id) {
        data.push(item);
        return;
      }
      if (!dataMap.has(id)) {
        dataMap.set(id, item);
        data.push(item);
      }
    });
  });
  return data;
};

const orderProfileExportData = (data: any[], visibleItems: HTMLElement[], type: IProfileExportType) => {
  const visibleIds = visibleItems.map((item) => getProfileItemId(item, type)).filter(Boolean);
  if (!visibleIds.length || visibleIds.length !== visibleItems.length) return data.slice(0, visibleItems.length);

  const dataMap = new Map<string, any>();
  data.forEach((item) => {
    const id = getExportDataId(item);
    id && dataMap.set(id, item);
  });
  const orderedData = visibleIds.map((id) => dataMap.get(id)).filter(Boolean);
  return orderedData.length === visibleIds.length ? orderedData : data.slice(0, visibleItems.length);
};

const createProfileExportProgress = (eventBtn: HTMLButtonElement) => {
  let nodeProgress = eventBtn.parentElement?.querySelector(`.${CLASS_PEOPLE_EXPORT_PROGRESS}`) as HTMLElement | undefined;
  if (!nodeProgress) {
    nodeProgress = domC('span', {
      className: CLASS_PEOPLE_EXPORT_PROGRESS,
      innerHTML:
        `<span class="ctz-people-export-progress-text">已加载 0/0</span>` +
        `<span class="ctz-people-export-progress-track"><span class="ctz-people-export-progress-bar"></span></span>`,
    });
    insertAfter(nodeProgress, eventBtn);
  }
  return nodeProgress;
};

const updateProfileExportProgress = (nodeProgress: HTMLElement, loaded: number, total: number) => {
  const nodeText = nodeProgress.querySelector('.ctz-people-export-progress-text') as HTMLElement;
  const nodeBar = nodeProgress.querySelector('.ctz-people-export-progress-bar') as HTMLElement;
  const countLoaded = Math.min(loaded, total);
  const percent = total ? Math.floor((countLoaded / total) * 100) : 0;
  nodeText.innerText = `已加载 ${countLoaded}/${total}`;
  nodeBar.style.width = `${percent}%`;
};

const getProfileUrlToken = (requestUrl: string) => {
  const apiMatched = requestUrl.match(/\/api\/v4\/members\/([^/]+)\/(?:answers|articles)/);
  if (apiMatched) return apiMatched[1];
  const pathMatched = location.pathname.match(/\/(?:people|org)\/([^/]+)/);
  return pathMatched ? pathMatched[1] : '';
};

const normalizeProfileExportUrl = (urlValue: string) => {
  if (!urlValue) return '';
  const url = new URL(urlValue, location.origin);
  if (location.protocol === 'https:' && url.protocol === 'http:') {
    url.protocol = 'https:';
  }
  return url.href;
};

const createProfileExportUrl = (apiPath: string, requestUrl: string, offset: number, limit: number) => {
  const token = getProfileUrlToken(requestUrl);
  if (!token) return '';
  const url = new URL(requestUrl || `/api/v4/members/${token}/${apiPath}`, location.origin);
  url.pathname = `/api/v4/members/${token}/${apiPath}`;
  url.searchParams.set('offset', String(offset));
  url.searchParams.set('limit', String(limit));
  return normalizeProfileExportUrl(url.href);
};

const getExportFetchHeaders = () => {
  const headers = new Headers(store.getFetchHeaders());
  ['vod-authorization', 'content-encoding', 'Content-Type', 'content-type'].forEach((name) => headers.delete(name));
  return headers;
};

// 个人主页已改为下拉加载，导出时以当前 DOM 中实际显示的数量为准，从接口第一页重新补齐对应数量的完整内容。
const fetchProfileExportData = async (apiPath: string, requestUrl: string, targetCount: number, nodeProgress: HTMLElement) => {
  const data: any[] = [];
  let offset = 0;
  let nextUrl = createProfileExportUrl(apiPath, requestUrl, offset, Math.min(Math.max(targetCount, 1), PROFILE_EXPORT_LIMIT));
  while (nextUrl && data.length < targetCount) {
    const response = await fetch(nextUrl, {
      method: 'GET',
      headers: getExportFetchHeaders(),
    });
    if (!response.ok) throw new Error(`request failed: ${response.status}`);
    const res = await response.json();
    const currentData = Array.isArray(res.data) ? res.data : [];
    data.push(...currentData);
    updateProfileExportProgress(nodeProgress, data.length, targetCount);
    if (!currentData.length || res.paging?.is_end) break;
    offset += currentData.length;
    nextUrl = normalizeProfileExportUrl(res.paging?.next || createProfileExportUrl(apiPath, requestUrl, offset, PROFILE_EXPORT_LIMIT));
  }
  return data.slice(0, targetCount);
};

const runPeopleExport = async ({
  eventBtn,
  type,
  apiPath,
  contentClassName,
  loadingText,
  buttonText,
  emptyText,
  requestUrl,
  cacheData,
  toHTML,
}: {
  eventBtn: HTMLButtonElement;
  type: IProfileExportType;
  apiPath: string;
  contentClassName: string;
  loadingText: string;
  buttonText: string;
  emptyText: string;
  requestUrl: string;
  cacheData: any[];
  toHTML: (item: any) => string;
}) => {
  const visibleItems = getVisibleProfileItems(contentClassName);
  const total = visibleItems.length;
  const nodeProgress = createProfileExportProgress(eventBtn);
  eventBtn.innerText = loadingText;
  eventBtn.disabled = true;
  updateProfileExportProgress(nodeProgress, 0, total);

  if (!total) {
    eventBtn.innerText = buttonText;
    eventBtn.disabled = false;
    message(emptyText);
    return;
  }

  try {
    const fetchedData = await fetchProfileExportData(apiPath, requestUrl, total, nodeProgress);
    const exportData = orderProfileExportData(mergeProfileExportData(fetchedData, cacheData), visibleItems, type);
    updateProfileExportProgress(nodeProgress, exportData.length, total);
    if (!exportData.length) throw new Error('empty export data');
    if (exportData.length < total) {
      message(`仅加载到 ${exportData.length}/${total} 条内容，已导出可加载部分`, 5000);
    }
    loadIframePrint(eventBtn, exportData.map(toHTML), buttonText);
  } catch (error) {
    eventBtn.innerText = buttonText;
    eventBtn.disabled = false;
    message('个人主页内容导出失败，请稍后重试', 5000);
    console.error(error);
  }
};

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
    await runPeopleExport({
      eventBtn: this as HTMLButtonElement,
      type: 'answer',
      apiPath: 'answers',
      contentClassName: 'AnswerItem',
      loadingText: '加载回答内容中...',
      buttonText: '导出此页回答',
      emptyText: '当前页面没有可导出的回答',
      requestUrl: store.getUserAnswerRequestUrl(),
      cacheData: store.getUserAnswer(),
      toHTML: (item) => `<h1>${item.question?.title || ''}</h1><div>${item.content || ''}</div>`,
    });
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
    await runPeopleExport({
      eventBtn: this as HTMLButtonElement,
      type: 'article',
      apiPath: 'articles',
      contentClassName: 'ArticleItem',
      loadingText: '加载文章内容中...',
      buttonText: '导出此页文章',
      emptyText: '当前页面没有可导出的文章',
      requestUrl: store.getUserArticleRequestUrl(),
      cacheData: store.getUserArticle(),
      toHTML: (item) => `<h1>${item.title || ''}</h1><div>${item.content || ''}</div>`,
    });
  };
  nodeListHeader.appendChild(nButton);
  setTimeout(() => {
    printPeopleArticles();
  }, 500);
};
