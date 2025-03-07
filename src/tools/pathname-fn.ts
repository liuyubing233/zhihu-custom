/** 判断 pathname 匹配的项并运行对应方法 */
export const pathnameHasFn = (obj: Record<string, Function>) => {
  const { pathname } = location;
  for (let name in obj) {
    pathname.includes(name) && obj[name]();
  }
};
