const LAYOUT_PREFIX = 'layout.';
const VIEW_PREFIX = 'view.';
const FIRST_LEVEL_ROUTE_COMPONENT_SPLIT = '$';

export function getLayoutAndPage(component?: string | null) {
  let layout = '';
  let page = '';

  const [layoutOrPage = '', pageItem = ''] = component?.split(FIRST_LEVEL_ROUTE_COMPONENT_SPLIT) || [];

  layout = getLayout(layoutOrPage);
  page = getPage(pageItem || layoutOrPage);

  return { layout, page };
}

function getLayout(layout: string) {
  return layout.startsWith(LAYOUT_PREFIX) ? layout.replace(LAYOUT_PREFIX, '') : '';
}

function getPage(page: string) {
  return page.startsWith(VIEW_PREFIX) ? page.replace(VIEW_PREFIX, '') : '';
}

export function transformLayoutAndPageToComponent(layout: string, page: string) {
  const hasLayout = Boolean(layout);
  const hasPage = Boolean(page);

  if (hasLayout && hasPage) {
    return `${LAYOUT_PREFIX}${layout}${FIRST_LEVEL_ROUTE_COMPONENT_SPLIT}${VIEW_PREFIX}${page}`;
  }

  if (hasLayout) {
    return `${LAYOUT_PREFIX}${layout}`;
  }

  if (hasPage) {
    return `${VIEW_PREFIX}${page}`;
  }

  return '';
}

/**
 * Get route name by route path
 *
 * @param routeName
 */
export function getRoutePathByRouteName(routeName: string) {
  return `/${routeName.replace(/_/g, '/')}`;
}

/**
 * Get path param from route path
 *
 * @param routePath route path
 */
export function getPathParamFromRoutePath(routePath: string) {
  const [path, param = ''] = routePath.split('/:');

  return {
    path,
    param
  };
}

/**
 * Get route path with param
 *
 * @param routePath route path
 * @param param path param
 */
export function getRoutePathWithParam(routePath: string, param: string) {
  if (param.trim()) {
    return `${routePath}/:${param}`;
  }

  return routePath;
}


/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 */
// eslint-disable-next-line max-params
export function handleTree<T>(data: any[], id?: string, parentId?: string, children?: string): T[] {
  const config: {
    id: string;
    parentId: string;
    childrenList: string;
  } = {
    id: id || 'id',
    parentId: parentId || 'parentId',
    childrenList: children || 'children'
  };
  const childrenListMap: any = {};
  const nodeIds: any = {};
  const tree: T[] = [];
  for (const d of data) {
    const pid = d[config.parentId];
    if (childrenListMap[pid] === null) {
      childrenListMap[pid] = [];
    }
    nodeIds[d[config.id]] = d;
    childrenListMap[pid].push(d);
  }
  for (const d of data) {
    const pid = d[config.parentId];
    if (nodeIds[pid] === null) {
      tree.push(d);
    }
  }
  const adaptToChildrenList = (o: any) => {
    if (childrenListMap[o[config.id]] !== null) {
      o[config.childrenList] = childrenListMap[o[config.id]];
    }
    if (o[config.childrenList]) {
      for (const c of o[config.childrenList]) {
        adaptToChildrenList(c);
      }
    }
  };

  for (const t of tree) {
    adaptToChildrenList(t);
  }

  return tree;
};
