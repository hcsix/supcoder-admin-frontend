/* eslint-disable */
/* prettier-ignore */
// Generated by elegant-router
// Read more: https://github.com/soybeanjs/elegant-router

declare module "@elegant-router/types" {
  type ElegantConstRoute = import('@elegant-router/vue').ElegantConstRoute;

  /**
   * route layout
   */
  export type RouteLayout = "base" | "blank";

  /**
   * route map
   */
  export type RouteMap = {
    "root": "/";
    "not-found": "/:pathMatch(.*)*";
    "403": "/403";
    "404": "/404";
    "500": "/500";
    "about": "/about";
    "home": "/home";
    "iframe-page": "/iframe-page/:url";
    "login": "/login/:module(pwd-login|code-login|register|reset-pwd|bind-wechat)?";
    "manage": "/manage";
    "manage_dict": "/manage/dict";
    "manage_menu": "/manage/menu";
    "manage_role": "/manage/role";
    "manage_user": "/manage/user";
    "manage_user-detail": "/manage/user-detail/:id";
    "monitor": "/monitor";
    "monitor_cache": "/monitor/cache";
    "monitor_log": "/monitor/log";
    "monitor_log_login": "/monitor/log/login";
    "monitor_log_operate": "/monitor/log/operate";
    "monitor_online": "/monitor/online";
    "settings": "/settings";
    "settings_account": "/settings/account";
    "settings_profile": "/settings/profile";
    "user-center": "/user-center";
  };

  /**
   * route key
   */
  export type RouteKey = keyof RouteMap;

  /**
   * route path
   */
  export type RoutePath = RouteMap[RouteKey];

  /**
   * custom route key
   */
  export type CustomRouteKey = Extract<
    RouteKey,
    | "root"
    | "not-found"
  >;

  /**
   * the generated route key
   */
  export type GeneratedRouteKey = Exclude<RouteKey, CustomRouteKey>;

  /**
   * the first level route key, which contain the layout of the route
   */
  export type FirstLevelRouteKey = Extract<
    RouteKey,
    | "403"
    | "404"
    | "500"
    | "about"
    | "home"
    | "iframe-page"
    | "login"
    | "manage"
    | "monitor"
    | "settings"
    | "user-center"
  >;

  /**
   * the custom first level route key
   */
  export type CustomFirstLevelRouteKey = Extract<
    CustomRouteKey,
    | "root"
    | "not-found"
  >;

  /**
   * the last level route key, which has the page file
   */
  export type LastLevelRouteKey = Extract<
    RouteKey,
    | "403"
    | "404"
    | "500"
    | "iframe-page"
    | "login"
    | "about"
    | "home"
    | "manage_dict"
    | "manage_menu"
    | "manage_role"
    | "manage_user-detail"
    | "manage_user"
    | "monitor_cache"
    | "monitor_log_login"
    | "monitor_log_operate"
    | "monitor_online"
    | "settings_account"
    | "settings_profile"
    | "user-center"
  >;

  /**
   * the custom last level route key
   */
  export type CustomLastLevelRouteKey = Extract<
    CustomRouteKey,
    | "root"
    | "not-found"
  >;

  /**
   * the single level route key
   */
  export type SingleLevelRouteKey = FirstLevelRouteKey & LastLevelRouteKey;

  /**
   * the custom single level route key
   */
  export type CustomSingleLevelRouteKey = CustomFirstLevelRouteKey & CustomLastLevelRouteKey;

  /**
   * the first level route key, but not the single level
  */
  export type FirstLevelRouteNotSingleKey = Exclude<FirstLevelRouteKey, SingleLevelRouteKey>;

  /**
   * the custom first level route key, but not the single level
   */
  export type CustomFirstLevelRouteNotSingleKey = Exclude<CustomFirstLevelRouteKey, CustomSingleLevelRouteKey>;

  /**
   * the center level route key
   */
  export type CenterLevelRouteKey = Exclude<GeneratedRouteKey, FirstLevelRouteKey | LastLevelRouteKey>;

  /**
   * the custom center level route key
   */
  export type CustomCenterLevelRouteKey = Exclude<CustomRouteKey, CustomFirstLevelRouteKey | CustomLastLevelRouteKey>;

  /**
   * the center level route key
   */
  type GetChildRouteKey<K extends RouteKey, T extends RouteKey = RouteKey> = T extends `${K}_${infer R}`
    ? R extends `${string}_${string}`
      ? never
      : T
    : never;

  /**
   * the single level route
   */
  type SingleLevelRoute<K extends SingleLevelRouteKey = SingleLevelRouteKey> = K extends string
    ? Omit<ElegantConstRoute, 'children'> & {
        name: K;
        path: RouteMap[K];
        component: `layout.${RouteLayout}$view.${K}`;
      }
    : never;

  /**
   * the last level route
   */
  type LastLevelRoute<K extends GeneratedRouteKey> = K extends LastLevelRouteKey
    ? Omit<ElegantConstRoute, 'children'> & {
        name: K;
        path: RouteMap[K];
        component: `view.${K}`;
      }
    : never;
  
  /**
   * the center level route
   */
  type CenterLevelRoute<K extends GeneratedRouteKey> = K extends CenterLevelRouteKey
    ? Omit<ElegantConstRoute, 'component'> & {
        name: K;
        path: RouteMap[K];
        children: (CenterLevelRoute<GetChildRouteKey<K>> | LastLevelRoute<GetChildRouteKey<K>>)[];
      }
    : never;

  /**
   * the multi level route
   */
  type MultiLevelRoute<K extends FirstLevelRouteNotSingleKey = FirstLevelRouteNotSingleKey> = K extends string
    ? ElegantConstRoute & {
        name: K;
        path: RouteMap[K];
        component: `layout.${RouteLayout}`;
        children: (CenterLevelRoute<GetChildRouteKey<K>> | LastLevelRoute<GetChildRouteKey<K>>)[];
      }
    : never;
  
  /**
   * the custom first level route
   */
  type CustomSingleLevelRoute<K extends CustomFirstLevelRouteKey = CustomFirstLevelRouteKey> = K extends string
    ? Omit<ElegantConstRoute, 'children'> & {
        name: K;
        path: RouteMap[K];
        component?: `layout.${RouteLayout}$view.${LastLevelRouteKey}`;
      }
    : never;

  /**
   * the custom last level route
   */
  type CustomLastLevelRoute<K extends CustomRouteKey> = K extends CustomLastLevelRouteKey
    ? Omit<ElegantConstRoute, 'children'> & {
        name: K;
        path: RouteMap[K];
        component?: `view.${LastLevelRouteKey}`;
      }
    : never;

  /**
   * the custom center level route
   */
  type CustomCenterLevelRoute<K extends CustomRouteKey> = K extends CustomCenterLevelRouteKey
    ? Omit<ElegantConstRoute, 'component'> & {
        name: K;
        path: RouteMap[K];
        children: (CustomCenterLevelRoute<GetChildRouteKey<K>> | CustomLastLevelRoute<GetChildRouteKey<K>>)[];
      }
    : never;

  /**
   * the custom multi level route
   */
  type CustomMultiLevelRoute<K extends CustomFirstLevelRouteNotSingleKey = CustomFirstLevelRouteNotSingleKey> =
    K extends string
      ? ElegantConstRoute & {
          name: K;
          path: RouteMap[K];
          component: `layout.${RouteLayout}`;
          children: (CustomCenterLevelRoute<GetChildRouteKey<K>> | CustomLastLevelRoute<GetChildRouteKey<K>>)[];
        }
      : never;

  /**
   * the custom route
   */
  type CustomRoute = CustomSingleLevelRoute | CustomMultiLevelRoute;

  /**
   * the generated route
   */
  type GeneratedRoute = SingleLevelRoute | MultiLevelRoute;

  /**
   * the elegant route
   */
  type ElegantRoute = GeneratedRoute | CustomRoute;
}
