export interface IMyListenAnswerItem {
  index: number;
  init: () => Promise<void>;
  reset: () => void;
  restart: () => void;
}
