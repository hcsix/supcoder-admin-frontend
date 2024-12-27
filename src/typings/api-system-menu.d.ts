/**
 * Namespace SystemMenuApi
 *
 * system menu backend api type
 */
declare namespace SystemMenuApi {


  import CommonSearchParams = Api.Common.CommonSearchParams;
  import CommonRecord = Api.Common.CommonRecord;
  import MenuPropsOfRoute = Api.SystemManage.MenuPropsOfRoute;
  /**
   * menu type
   *
   * - "1": directory
   * - "2": menu
   */
  type MenuType = '1' | '2';


  /**
   * 菜单查询参数类型
   */
  type MenuSearchParams = CommonType.RecordNullable<
    Pick<Menu, 'menuName' | 'status' > &
    CommonSearchParams
  >;


  type Menu = CommonRecord<{
    parentName: string;
    /** parent menu id */
    parentId: number| number;
    children?: Menu[] | null;
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
  }> &
    MenuPropsOfRoute;

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
