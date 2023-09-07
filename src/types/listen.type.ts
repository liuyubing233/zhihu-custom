export interface IMyListenAnswerItem {
  index: number;
  init: () => void;
  reset: () => void;
  restart: () => void;
}
