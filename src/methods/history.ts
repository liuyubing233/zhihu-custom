import { myStorage } from '../commons/storage';
import { dom } from '../commons/tools';

/** 回填历史记录 */
export const echoHistory = async () => {
  const history = await myStorage.initHistory();
  const { list, view } = history;
  const nodeList = dom('#CTZ_HISTORY_LIST .ctz-set-content');
  const nodeView = dom('#CTZ_HISTORY_VIEW .ctz-set-content');
  nodeList && (nodeList.innerHTML = list.join('<br/>'));
  nodeView && (nodeView.innerHTML = view.join('<br/>'));
};
