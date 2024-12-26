/**
 * Namespace SystemMenuApi
 *
 * system menu backend api type
 */
declare namespace SystemMenuApi {
  /**
   * 菜单树形结构类型
   */
  export type MenuTreeOption = {
    id: number;
    label: string;
    parentId: number;
    weight: number;
    children?: MenuTreeOption[];
  }

  export interface RoleMenuTree {
    menus: MenuTreeOption[];
    checkedKeys: number[];
  }

  /**
   * 菜单查询参数类型
   */
  export interface MenuQuery {
    keywords?: string;
    menuName?: string;
    status?: string;
  }

  /**
   * 菜单视图对象类型
   */
  export interface MenuVO extends BaseEntity {
    parentName: string;
    parentId: string | number;
    children: MenuVO[];
    menuId: string | number;
    menuName: string;
    orderNum: number;
    path: string;
    component: string;
    queryParam: string;
    isFrame: string;
    isCache: string;
    menuType: MenuTypeEnum;
    visible: string;
    status: string;
    icon: string;
    remark: string;
  }

  export interface MenuForm {
    parentName?: string;
    parentId?: string | number;
    children?: MenuForm[];
    menuId?: string | number;
    menuName: string;
    orderNum: number;
    path: string;
    component?: string;
    queryParam?: string;
    isFrame?: string;
    isCache?: string;
    menuType?: MenuTypeEnum;
    visible?: string;
    status?: string;
    icon?: string;
    remark?: string;
    query?: string;
    perms?: string;
  }


  export enum MenuTypeEnum {
    /**
     * 目录
     */
    M = 'M',
    /**
     * 菜单
     */
    C = 'C',

    /**
     * 按钮
     */
    F = 'F'
  }


}
