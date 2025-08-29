import { store } from '../store';
import { fnLog } from './dom';

/** 调用「不感兴趣」接口 */
export const doFetchNotInterested = ({ id, type }: { id: string; type: string }) => {
  const nHeader = store.getFetchHeaders() as Record<string, string>;
  delete nHeader['vod-authorization'];
  delete nHeader['content-encoding'];
  delete nHeader['Content-Type'];
  delete nHeader['content-type'];
  const idToNum = +id;
  if (String(idToNum) === 'NaN') {
    fnLog(`调用不感兴趣接口错误，id为NaN, 原ID：${id}`);
    return;
  }

  fetch('/api/v4/zrec-feedback/uninterested', {
    body: `scene_code=RECOMMEND&content_type=1&content_token=${id}&uninterested_type=less_similar&feed_deliver_type=Normal&desktop=true`,
    method: 'POST',
    headers: new Headers({
      ...nHeader,
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    }),
  }).then((res) => res.json());
};

/** 拦截请求 */
export const interceptionResponse = (res: Response, pathRegexp: RegExp, fn: (r: any) => void) => {
  if (pathRegexp.test(res.url)) {
    res
      .clone()
      .json()
      .then((r) => fn(r));
  }
};
