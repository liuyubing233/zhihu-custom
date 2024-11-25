import { dom, domA, domC, domP, pathnameHasFn } from '../commons/tools';

/** 关注的内容一键移除 */
export const myFollowRemove = {
  init: function () {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      pathnameHasFn({
        questions: () => this.addButtons(this.classOb.questions),
        // topics: () => this.addButtons(this.classOb.topics), // 话题跳转页面内会重定向，暂时隐藏
        collections: () => this.addButtons(this.classOb.collections),
      });
    }, 500);
  },
  addButtons: function (initTypeOb: IClassObEntries) {
    const me = this;
    const { classNameItem, classHref, ctzType } = initTypeOb;
    if (dom(`div.PlaceHolder.${classNameItem}`)) {
      this.init();
      return;
    }

    domA(`.${classNameItem}`).forEach((item) => {
      const elementButton = domC('button', {
        className: `${me.className} ${me.classNameRemove} ctz-button-block ctz-button`,
        innerText: '移除关注',
        style: 'position: absolute;right: 16px;bottom: 16px;background: transparent;',
      });
      elementButton.onclick = function () {
        const nodeThis = this as HTMLButtonElement;
        const nItem = domP(nodeThis, 'class', classNameItem);
        const nodeHref = nItem ? (nItem.querySelector(classHref) as HTMLAnchorElement) : undefined;
        const qHref = nodeHref ? nodeHref.href : '';
        if (!qHref) return;
        const nHref = qHref + `?ctzType=${ctzType}`;
        window.open(nHref);
        if (nodeThis.classList.contains(me.classNameRemove)) {
          nodeThis.innerText = '添加关注';
          nodeThis.classList.remove(me.classNameRemove);
        } else {
          nodeThis.innerText = '移除关注';
          nodeThis.classList.add(me.classNameRemove);
        }
      };
      const nodeClassName = item.querySelector(`.${me.className}`);
      nodeClassName && nodeClassName.remove();
      item.appendChild(elementButton);
    });
  },
  className: 'ctz-remove-follow',
  classNameRemove: 'ctz-button-red',
  classOb: {
    questions: {
      // 关注的问题
      classNameItem: 'List-item',
      classHref: '.QuestionItem-title a',
      ctzType: 1,
    },
    topics: {
      // 关注的话题
      classNameItem: 'List-item',
      classHref: '.ContentItem-title .TopicLink',
      ctzType: 2,
    },
    collections: {
      // 关注的收藏夹
      classNameItem: 'List-item',
      classHref: '.ContentItem-title a',
      ctzType: 3,
    },
  },
  timer: undefined,
};

interface IClassObEntries {
  classNameItem: string;
  classHref: string;
  ctzType: number;
}
