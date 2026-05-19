/** 页面操作 */
import { dom, domA, domC } from '../../tools';

const SELECTOR_RIGHT_ANCHOR = '#CTZ_DIALOG_RIGHT_ANCHOR';
const CLASS_RIGHT_ANCHOR_ITEM = 'ctz-right-anchor-item';
const CLASS_RIGHT_ANCHOR_TARGET = 'target';

/** 菜单初始化 */
export const initMenu = (domMain: HTMLElement) => {
  const { hash } = location;
  const arrayHash = [...domA('#CTZ_DIALOG_MENU>div', domMain)].map((i: HTMLElement) => i.dataset.href || '');
  const chooseId = arrayHash.find((i) => i === hash || hash.replace(i, '') !== hash);
  fnChangeMenu(dom(`#CTZ_DIALOG_MENU>div[data-href="${chooseId || arrayHash[0]}"]`, domMain) as HTMLElement, domMain);
};

export const onChangeMenu = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  const dataHref = target.dataset.href || '';
  if (dataHref) {
    location.hash = dataHref;
    fnChangeMenu(target, document.body);
    return;
  }
};

const fnChangeMenu = (target: HTMLElement, domMain: HTMLElement) => {
  const currentHref = target.dataset.href || '';
  const chooseId = currentHref.replace(/#/, '');
  if (!chooseId) return;
  domA('#CTZ_DIALOG_MENU>div', domMain).forEach((item) => item.classList.remove('target'));
  domA('#CTZ_DIALOG_MAIN>div', domMain).forEach((item) => (item.style.display = chooseId === item.id ? 'block' : 'none'));
  domA('.ctz-right-title-content>div', domMain).forEach((item) => (item.style.display = currentHref === item.dataset.id ? 'block' : 'none'));
  const nodeMain = dom('#CTZ_DIALOG_MAIN', domMain);
  nodeMain && (nodeMain.scrollTop = 0);
  target.classList.add('target');
  updateRightTitleAnchor(domMain);
};

/**
 * 通过初始创建标题，切换路由通过显示隐藏的方式显示
 * innerHTML 等设置内容的方式需要时间长会存在卡顿问题（估计是原网页冗余内容太多，导致数据泄露，时间长了之后会卡顿）
 */
export const createHTMLRightTitle = (domMain: HTMLElement = document.body) => {
  const { hash } = location;
  const arr = [...dom('#CTZ_DIALOG_MENU', domMain)!.childNodes].map((item) => {
    const itemDom = item as HTMLElement;
    return {
      name: itemDom.textContent,
      commit: itemDom.dataset.commit || '',
      href: itemDom.dataset.href || '',
    };
  });
  dom('.ctz-right-title-content', domMain)!.innerHTML = arr
    .map(
      ({ name, commit, href }, index) => `<div data-id="${href}" style="display: ${(!hash && index === 0) || hash === href ? 'block' : 'none'}">${name}<span>${commit}</span></div>`
    )
    .join('');
  updateRightTitleAnchor(domMain);
};

/** 点击右侧顶部的小标题导航后滚动到对应设置分类 */
export const onChangeRightTitleAnchor = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  const nodeAnchor = target.closest(`.${CLASS_RIGHT_ANCHOR_ITEM}`) as HTMLElement | null;
  const anchorId = nodeAnchor?.dataset.anchorId || '';
  if (!anchorId) return;
  event.preventDefault();
  event.stopPropagation();
  const nodeMain = dom('#CTZ_DIALOG_MAIN');
  const nodeTitle = getCurrentTitleList().find((item) => item.dataset.anchorId === anchorId);
  if (!nodeMain || !nodeTitle) return;
  setRightTitleAnchorTarget(anchorId);
  nodeMain.scrollTo({ top: getTitleOffsetTop(nodeTitle, nodeMain), behavior: 'smooth' });
};

/** 右侧内容滚动时同步高亮当前小标题 */
export const onScrollRightTitleAnchor = () => updateRightTitleAnchorTarget();

const updateRightTitleAnchor = (domMain: HTMLElement = document.body) => {
  const nodeAnchor = dom(SELECTOR_RIGHT_ANCHOR, domMain);
  if (!nodeAnchor) return;
  const currentTitleList = getCurrentTitleList(domMain);
  nodeAnchor.innerHTML = '';
  if (currentTitleList.length <= 1) {
    nodeAnchor.style.display = 'none';
    return;
  }

  currentTitleList.forEach((item, index) => {
    const anchorId = `${getCurrentContentId(domMain)}-${index}`;
    item.dataset.anchorId = anchorId;
    const button = domC('button', {
      type: 'button',
      className: CLASS_RIGHT_ANCHOR_ITEM,
      innerText: getTitleText(item),
    });
    button.dataset.anchorId = anchorId;
    nodeAnchor.appendChild(button);
  });

  nodeAnchor.style.display = 'flex';
  updateRightTitleAnchorTarget(domMain);
};

const updateRightTitleAnchorTarget = (domMain: HTMLElement = document.body) => {
  const nodeAnchor = dom(SELECTOR_RIGHT_ANCHOR, domMain);
  const nodeMain = dom('#CTZ_DIALOG_MAIN', domMain);
  const currentTitleList = getCurrentTitleList(domMain);
  if (!nodeAnchor || !nodeMain || currentTitleList.length <= 1) return;

  let anchorId = currentTitleList[0].dataset.anchorId || '';
  if (!nodeMain.clientHeight) {
    setRightTitleAnchorTarget(anchorId, domMain);
    return;
  }

  const currentTop = nodeMain.scrollTop + 4;
  currentTitleList.forEach((item) => {
    if (getTitleOffsetTop(item, nodeMain) <= currentTop) {
      anchorId = item.dataset.anchorId || anchorId;
    }
  });
  if (nodeMain.scrollHeight > nodeMain.clientHeight + 4 && nodeMain.scrollTop + nodeMain.clientHeight >= nodeMain.scrollHeight - 4) {
    anchorId = currentTitleList[currentTitleList.length - 1].dataset.anchorId || anchorId;
  }
  setRightTitleAnchorTarget(anchorId, domMain);
};

const setRightTitleAnchorTarget = (anchorId: string, domMain: HTMLElement = document.body) => {
  domA(`.${CLASS_RIGHT_ANCHOR_ITEM}`, domMain).forEach((item) => {
    item.classList.toggle(CLASS_RIGHT_ANCHOR_TARGET, item.dataset.anchorId === anchorId);
  });
};

const getCurrentContentId = (domMain: HTMLElement = document.body) => {
  const nodeTarget = dom('#CTZ_DIALOG_MENU>div.target', domMain);
  return (nodeTarget?.dataset.href || '').replace(/#/, '');
};

const getCurrentTitleList = (domMain: HTMLElement = document.body) => {
  const currentContentId = getCurrentContentId(domMain);
  const nodeCurrentContent = currentContentId ? dom(`#${currentContentId}`, domMain) : undefined;
  return nodeCurrentContent ? [...domA('.ctz-title', nodeCurrentContent)] : [];
};

const getTitleText = (nodeTitle: HTMLElement) => {
  const text = [...nodeTitle.childNodes]
    .filter((item) => item.nodeType === Node.TEXT_NODE)
    .map((item) => item.textContent || '')
    .join('')
    .trim();
  return (text || nodeTitle.textContent || '').replace(/\s+/g, ' ');
};

const getTitleOffsetTop = (nodeTitle: HTMLElement, nodeMain: HTMLElement) => nodeTitle.getBoundingClientRect().top - nodeMain.getBoundingClientRect().top + nodeMain.scrollTop;
