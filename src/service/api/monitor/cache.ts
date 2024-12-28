import { request } from '../../request';
import CacheDetail = MonitorCacheApi.CacheDetail;

/**
 * 查询在线用户列表
 *
 * @param query
 */
export function fetchCacheDetail() {
  return request<CacheDetail>({
    url: '/monitor/cache',
    method: 'get',
  });
}

