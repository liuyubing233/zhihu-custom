/** 关注的内容一键移除 */
export const myFollowRemove = {
  init: function () {
    const me = this;
    clearTimeout(me.timer);
    me.timer = setTimeout(() => {
      pathnameHasFn({
        questions: () => me.addButtons(this.classOb.questions),
        // topics: () => me.addButtons(this.classOb.topics), // 话题跳转页面内会重定向，暂时隐藏
        collections: () => me.addButtons(this.classOb.collections),
      });
    }, 500);
  },
  addButtons: function (initTypeOb) {
    const me = this;
    const { classNameItem, classHref, ctzType } = initTypeOb;
    domA(`.${classNameItem}`).forEach((item) => {
      const elementButton = domC('button', {
        className: `${me.className} ${me.classNameRemove} ctz-button-block`,
        innerText: '移除关注',
        style: 'height: 28px;position: absolute;right: 16px;bottom: 16px;',
      });
      elementButton.onclick = function () {
        const nItem = domP(this, 'class', classNameItem);
        const qHref = nItem.querySelector(classHref) ? nItem.querySelector(classHref).href : '';
        if (!qHref) return;
        const nHref = qHref + `?ctzType=${ctzType}`;
        window.open(nHref);
        if (this.classList.contains(me.classNameRemove)) {
          this.innerText = '添加关注';
          this.classList.remove(me.classNameRemove);
        } else {
          this.innerText = '移除关注';
          this.classList.add(me.classNameRemove);
        }
      };
      item.querySelector(`.${me.className}`) && item.querySelector(`.${me.className}`).remove();
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
  timer: null,
};
