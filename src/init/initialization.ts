import { changeTitle } from "../methods/page-title";
import { store } from "../store";

let observerTitle: MutationObserver;
export const initialization = () => {
  store.setStorageConfigItem('cacheTitle', document.title);
  changeTitle()
  observerTitle && observerTitle.disconnect();
  observerTitle = new MutationObserver((records) => {
    changeTitle()
  });
  observerTitle.observe(document.querySelector('title')!, { characterData: true, subtree: true, childList: true });
};