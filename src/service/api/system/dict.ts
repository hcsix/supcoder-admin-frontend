import { listRequest, request } from '../../request';
import UserForm = SystemUserApi.UserForm;
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

/** 修改用户 */
export function fetchUpdateDictType(data: UserForm) {
  return request({
    url: '/system/user',
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
