import { dom } from "../commons/tools";
import { store } from "../store";

/** 回填历史记录 */
export const echoHistory = () => {
  const { list, view } = store.getHistory();
  const nodeList = dom('#CTZ_HISTORY_LIST .ctz-set-content');
  const nodeView = dom('#CTZ_HISTORY_VIEW .ctz-set-content');
  nodeList && (nodeList.innerHTML = list.join('<br/>'));
  nodeView && (nodeView.innerHTML = view.join('<br/>'));
};
