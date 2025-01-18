import { listRequest, request } from '../../request';
import PaginatingResponse = App.Service.PaginatingResponse;

/** Get user info */
/**
 * 查询字典列表
 *
 * @param query
 */
export function fetchGetDictTypeList(params?: SystemDictApi.DictTypeSearchParams) {
  return listRequest<PaginatingResponse<SystemDictApi.DictType>>({
    url: '/system/dict/type/list',
    method: 'get',
    params
  }).then(response => {
    if (response && response.data?.rows) {
      response.data.rows = response.data.rows.map(dictType => ({
        ...dictType,
        id: dictType.dictId
      }));
    }
    if (response?.data && params) {
      response.data.pageNum = params.pageNum ?? 1;
      response.data.pageSize = params.pageSize ?? 10;
    }
    return response;
  });
}

/** 新增字典 */
export function fetchAddDictType(data: Pick<SystemDictApi.DictTypeForm, 'dictName' | 'dictType' | 'remark'>) {
  return request({
    url: '/system/dict/type',
    method: 'post',
    data
  });
}

/** 修改字典 */
export function fetchUpdateDictType(data: SystemDictApi.DictTypeForm) {
  return request({
    url: '/system/dict/type',
    method: 'put',
    data
  });
}

/**
 * 删除用户
 *
 * @param userId 用户ID
 */
export function fetchDelDictType(userId: Array<string | number> | string | number) {
  return request({
    url: `/system/user/${userId}`,
    method: 'delete'
  });
}
