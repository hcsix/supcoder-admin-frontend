<script setup lang="tsx">
import { ref } from 'vue';
import type { Ref } from 'vue';
import { NButton, NPopconfirm, NTag } from 'naive-ui';
import { useBoolean } from '@sa/hooks';
import { useAppStore } from '@/store/modules/app';
import { useTable, useTableOperate } from '@/hooks/common/table';
import { $t } from '@/locales';
import { yesOrNoRecord } from '@/constants/common';
import { enableStatusRecord, menuTypeRecord } from '@/constants/business';
import SvgIcon from '@/components/custom/svg-icon.vue';
import { fetchDelMenu, fetchGetMenuList } from '@/service/api';
import MenuOperateModal, { type OperateType } from './modules/menu-operate-modal.vue';

const appStore = useAppStore();

const { bool: visible, setTrue: openModal } = useBoolean();

const wrapperRef = ref<HTMLElement | null>(null);

const { columns, columnChecks, data, loading, getData, getDataByPage } = useTable({
  apiFn: fetchGetMenuList,
  columns: () => [
    {
      key: 'menuName',
      title: $t('page.manage.menu.menuName'),
      align: 'left',
      minWidth: 120,
      render: row => {
        const { i18nKey, menuName } = row;

        const label = i18nKey ? $t(i18nKey) : menuName;

        return <span>{label}</span>;
      }
    },

    {
      key: 'menuType',
      title: $t('page.manage.menu.menuType'),
      align: 'center',
      width: 80,
      render: row => {
        if (row.menuType === null) {
          return null;
        }
        const tagMap: Record<SystemMenuApi.MenuTypeEnum, NaiveUI.ThemeColor> = {
          M: 'default',
          C: 'primary',
          F: 'info'
        };
        const label = $t(menuTypeRecord[row.menuType]);
        return <NTag type={tagMap[row.menuType]}>{label}</NTag>;
      }
    },

    {
      key: 'icon',
      title: $t('page.manage.menu.icon'),
      align: 'center',
      width: 60,
      render: row => {
        // const icon = row.iconType === '1' ? row.icon : undefined;
        // const localIcon = row.iconType === '2' ? row.icon : undefined;
        const icon = row.icon;
        // <SvgIcon icon={icon} localIcon={localIcon} class="text-icon" />
        return (
          <div class="flex-center">
            <SvgIcon icon={icon} class="text-icon" />
          </div>
        );
      }
    },
    {
      key: 'status',
      title: $t('page.manage.menu.menuStatus'),
      align: 'center',
      width: 80,
      render: row => {
        if (row.status === null) {
          return null;
        }
        const tagMap: Record<Api.Common.EnableStatus, NaiveUI.ThemeColor> = {
          0: 'success',
          1: 'warning'
        };
        const label = $t(enableStatusRecord[row.status]);

        return <NTag type={tagMap[row.status]}>{label}</NTag>;
      }
    },
    {
      key: 'visible',
      title: $t('page.manage.menu.hideInMenu'),
      align: 'center',
      width: 80,
      render: row => {
        const hide: CommonType.YesOrNo = row.visible ? 'Y' : 'N';

        const tagMap: Record<CommonType.YesOrNo, NaiveUI.ThemeColor> = {
          Y: 'error',
          N: 'default'
        };

        const label = $t(yesOrNoRecord[hide]);

        return <NTag type={tagMap[hide]}>{label}</NTag>;
      }
    },
    {
      key: 'id',
      width: 90,
      title: $t('page.manage.menu.id'),
      align: 'center'
    },
    {
      key: 'parentId',
      title: $t('page.manage.menu.parentId'),
      width: 90,
      align: 'center'
    },
    {
      key: 'orderNum',
      title: $t('page.manage.menu.order'),
      align: 'center',
      width: 60
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 230,
      render: row => (
        <div class="flex-center justify-end gap-8px">
          {row.menuType === 'M' && (
            <NButton type="primary" ghost size="small" onClick={() => handleAddChildMenu(row)}>
              {$t('page.manage.menu.addChildMenu')}
            </NButton>
          )}
          <NButton type="primary" ghost size="small" onClick={() => handleEdit(row)}>
            {$t('common.edit')}
          </NButton>
          <NPopconfirm onPositiveClick={() => handleDelete(row.id)}>
            {{
              default: () => $t('common.confirmDelete'),
              trigger: () => (
                <NButton type="error" ghost size="small">
                  {$t('common.delete')}
                </NButton>
              )
            }}
          </NPopconfirm>
        </div>
      )
    }
  ]
});

const { checkedRowKeys, onDeleted } = useTableOperate(data, getData);

const operateType = ref<OperateType>('add');

function handleAdd() {
  operateType.value = 'add';
  openModal();
}

async function handleDelete(id: number | string) {
  // request
  console.log(id);
  const { error } = await fetchDelMenu(id);
  if (error) {
    window.$message?.error(error.message);
    return;
  }
  onDeleted();
}

/** the edit menu data or the parent menu data when adding a child menu */
const editingData: Ref<SystemMenuApi.Menu | null> = ref(null);

function handleEdit(item: SystemMenuApi.Menu) {
  operateType.value = 'edit';
  editingData.value = { ...item };
  openModal();
}

function handleAddChildMenu(item: SystemMenuApi.Menu) {
  operateType.value = 'addChild';
  editingData.value = { ...item };
  openModal();
}

const allPages = ref<string[]>([]);

async function getAllPages() {
  // const { data: pages } = await fetchGetAllPages();
  // allPages.value = pages || [];
}

function init() {
  getAllPages();
}

// init
init();
</script>

<template>
  <div ref="wrapperRef" class="flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <NCard :title="$t('page.manage.menu.title')" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :hide-batch-delete="true"
          :loading="loading"
          @add="handleAdd"
          @refresh="getData"
        />
      </template>
      <NDataTable
        v-model:checked-row-keys="checkedRowKeys"
        :columns="columns"
        :data="data"
        size="small"
        :flex-height="!appStore.isMobile"
        :scroll-x="1088"
        :loading="loading"
        :row-key="row => row.id"
        remote
        class="sm:h-full"
      />
      <MenuOperateModal
        v-model:visible="visible"
        :operate-type="operateType"
        :row-data="editingData"
        :all-pages="allPages"
        @submitted="getDataByPage"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
