/** 加载基础元素及绑定方法 */
export const initHTML = () => {
  document.body.appendChild(domC('div', { id: 'CTZ_MAIN', innerHTML: INNER_HTML }));
  myBlack.init();
  myMenu.init();
  dom('.ctz-version').innerText = `version: ${GM_info.script.version}`;

  // 添加弹窗底部信息
  dom('.ctz-footer').innerHTML = FOOTER_HTML;

  // 添加背景色选择
  domById('CTZ_BACKGROUND').innerHTML = Object.keys(BACKGROUND_CONFIG)
    .map((key) => {
      const { name, color } = BACKGROUND_CONFIG[key];
      return (
        `<label class="ctz-bg-choose-label">` +
        `<input class="${CLASS_INPUT_CLICK}" name="colorBackground" type="radio" value="${key}"/>` +
        `<div style="background: ${key};border: 2px solid ${key};color: ${color}">${name}</div>` +
        `</label>`
      );
    })
    .join('');

  // 添加隐藏元素
  for (let key in HIDDEN_DIRECITION) {
    const arrHidden = HIDDEN_DIRECITION[key];
    if (!arrHidden || !arrHidden.length) continue;
    const elementItem = dom(`#${key}_HIDDEN>.ctz-set-content`);
    elementItem.innerHTML = arrHidden
      .map(
        (i) =>
          `${i.map(({ label, value }) => `<label><input class="ctz-i" name="${value}" type="checkbox" value="on" />${label}</label>`).join('')}` +
          `<span style="width: 100%; margin: 8px 0; background: #ddd; height: 1px; display:block"></span>`
      )
      .join('');
  }

  // 添加修改网页标题图片
  domById('CTZ_TITLE_ICO').innerHTML = Object.keys(ICO_URL)
    .map((key) => `<label><input class="ctz-i" name="titleIco" type="radio" value="${key}" /><img src="${ICO_URL[key]}" alt="${key}"></label>`)
    .join('');

  // 添加更多默认设置
  domById('CTZ_DEFAULT_SELF').innerHTML = DEFAULT_FUNCTION.map((elementItem, index) => `<div>${index + 1}. ${elementItem}</div>`).join('');

  const hrefUser = userInfo.url ? userInfo.url.replace('/api/v4', '') : '';
  if (hrefUser) {
    // 保存个人主页位置
    const homeLink = domC('a', {
      href: hrefUser,
      target: '_blank',
      innerText: '个人主页',
    });
    dom('#CTZ_BASIS .ctz-content-left').appendChild(homeLink);
  }
};
