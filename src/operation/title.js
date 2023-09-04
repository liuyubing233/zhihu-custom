/** 修改网页标题 */
export const changeTitle = () => {
  document.title = pfConfig.globalTitle || storageConfig.cacheTitle;
};

/** 修改网页标题图片 */
export const changeICO = () => {
  const { titleIco } = pfConfig;
  const nId = 'CTZ_ICO';
  if (!ICO_URL[titleIco]) return;
  dom('[type="image/x-icon"]') && dom('[type="image/x-icon"]').remove();
  domById(nId) && domById(nId).remove();
  dom('head').appendChild(
    domC('link', {
      type: 'image/x-icon',
      href: ICO_URL[titleIco],
      id: nId,
      rel: 'icon',
    })
  );
};
