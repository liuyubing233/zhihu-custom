import { dom, myStorage } from '../tools';

/** 回填历史记录 */
export const echoHistory = async () => {
  const history = await myStorage.getHistory();
  const { list, view } = history;
  const nodeList = dom('#CTZ_HISTORY_LIST .ctz-set-content');
  const nodeView = dom('#CTZ_HISTORY_VIEW .ctz-set-content');
  nodeList && (nodeList.innerHTML = list.join(''));
  nodeView && (nodeView.innerHTML = view.join(''));
};
