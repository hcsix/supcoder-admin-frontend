export {};

declare global {
  export interface Window {
    /** NProgress instance */
    NProgress?: import('nprogress').NProgress;
    /** Loading bar instance */
    $loadingBar?: import('naive-ui').LoadingBarProviderInst;
    /** Dialog instance */
    $dialog?: import('naive-ui').DialogProviderInst;
    /** Message instance */
    $message?: import('naive-ui').MessageProviderInst;
    /** Notification instance */
    $notification?: import('naive-ui').NotificationProviderInst;
  }

  interface BaseEntity {
    createBy?: any;
    createDept?: any;
    createTime?: string;
    updateBy?: any;
    updateTime?: any;
  }


  /** Build time of the project */
  export const BUILD_TIME: string;
}

