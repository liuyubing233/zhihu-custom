// // 'suspensionHomeTab' |

// export type IHeaderName = 'suspensionFind' | 'suspensionUser' | 'suspensionSearch';

// type IHeaderCache = {
//   [key in IHeaderName]?: HTMLElement;
// };

// /** 已经查找完毕 */
// type IHeaderFound = {
//   [key in IHeaderName]?: boolean;
// };

// class Store {
//   cache: IHeaderCache = {};
//   /** 已经查找完毕（会存在未查找到元素的情况 cache 对应的 name 值为 undefined） */
//   found: IHeaderFound = {};

//   constructor() {
//     this.setHeaderCache = this.setHeaderCache.bind(this);
//     this.getHeaderCache = this.getHeaderCache.bind(this);
//     this.setHeaderFound = this.setHeaderFound.bind(this);
//     this.getHeaderFound = this.getHeaderFound.bind(this);
//   }

//   setHeaderCache(keyname: IHeaderName, content: HTMLElement) {
//     this.cache[keyname] = content;
//   }
//   getHeaderCache(keyname: IHeaderName): HTMLElement | undefined {
//     return this.cache[keyname];
//   }
//   setHeaderFound(keyname: IHeaderName) {
//     this.found[keyname] = true;
//   }
//   getHeaderFound(keyname: IHeaderName): boolean {
//     return !!this.found[keyname];
//   }
// }

// export const storeSuspension = new Store();
