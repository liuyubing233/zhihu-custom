/** 收藏夹打印 */
export const myCollectionExport = {
  init: function () {
    const elementBox = domC('div', { className: this.className, innerHTML: this.element });
    dom(`.${this.className}`) && dom(`.${this.className}`).remove();
    const elementTypeSpan = this.elementTypeSpan;
    elementBox.querySelector('[name="ctz-export-collection"]').onclick = function () {
      this.innerText = '加载中...';
      this.disabled = true;
      const id = pathname.match(/(?<=\/collection\/)\d+/)[0];
      const offset = 20 * (dom('.Pagination .PaginationButton--current') ? Number(dom('.Pagination .PaginationButton--current').innerText) - 1 : 0);

      fetch(`/api/v4/collections/${id}/items?offset=${offset}&limit=20`, {
        method: 'GET',
        headers: new Headers({
          ...storageConfig.fetchHeaders,
        }),
      })
        .then((response) => {
          return response.json();
        })
        .then((res) => {
          const collectionsHTMLMap = (res.data || []).map((item) => {
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

          const iframe = dom('.ctz-pdf-box-content');
          const collectionsHTML = collectionsHTMLMap.join('');
          const doc = iframe.contentWindow.document;
          doc.body.innerHTML = '';
          if (!doc.head.querySelector('style')) {
            doc.write(`<style type="text/css" id="ctz-css-own">${INNER_CSS}</style>`);
          }
          doc.write(`<div class="ctz-pdf-view">${collectionsHTML}</div>`);

          // 检测图片是否都加载完全 解决打印不全的情况
          const imgLoadPromises = [];
          doc.querySelectorAll('img').forEach((item) => {
            imgLoadPromises.push(
              new Promise((resolve, reject) => {
                item.onload = function () {
                  resolve(true);
                };
              })
            );
          });

          Promise.all(imgLoadPromises).then(() => {
            // 图片加载完成后调用打印方法
            this.innerText = '生成PDF';
            this.disabled = false;
            iframe.contentWindow.print();
          });
        });
    };
    dom('.CollectionDetailPageHeader-title') && dom('.CollectionDetailPageHeader-title').appendChild(elementBox);
  },
  className: 'ctz-export-collection-box',
  element:
    `<button class="ctz-button" name="ctz-export-collection">生成PDF</button>` +
    `<p>仅对当前页码收藏夹内容进行导出</p>` +
    `<p>图片内容过多时请耐心等待</p>` +
    `<p>如果点击没有生成PDF请刷新页面</p>`,
  elementTypeSpan: (type) => {
    const typeObj = {
      zvideo: '<span class="ctz-label-tag" style="color: #12c2e9;">视频</span>',
      answer: '<span class="ctz-label-tag" style="color: #ec7259;">问答</span>',
      article: '<span class="ctz-label-tag" style="color: #00965e;">文章</span>',
    };
    return typeObj[type] || '';
  },
};
