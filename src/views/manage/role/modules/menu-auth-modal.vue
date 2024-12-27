<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue';
import { $t } from '@/locales';
import { fetchRoleMenuTreeOptions } from '@/service/api/system/menu';

defineOptions({
  name: 'MenuAuthModal'
});

interface Props {
  /** the roleId */
  roleId: number;
}

const props = defineProps<Props>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const emit = defineEmits<{
  (e: 'update:roleMenu', data: { roleId: number; checks: number[] }): void;
}>();

const title = computed(() => $t('common.edit') + $t('page.manage.role.menuAuth'));


const menuOptions = shallowRef<SystemMenuApi.MenuTreeOption[]>([]);
const checks = shallowRef<number[]>([]);
const expandedKeys = shallowRef<number[]>([]);


function closeModal() {
  visible.value = false;
}


async function getMenuTree(roleId: number | string) {
  const { error, data } = await fetchRoleMenuTreeOptions(roleId);
  if (data) {
    menuOptions.value = data.menus;
    checks.value = data.checkedKeys;
  }
  if (error) {
    window.$message?.error(error.message);
  }
}

function handleExpandCollapse(checked: boolean) {
  console.log(`handleExpandCollapse${checked}`);
  if (checked) {
    const allKeys = getAllKeys(menuOptions.value);
    expandedKeys.value = allKeys;
  } else {
    expandedKeys.value = [];
  }
}

function handleSelectAll(checked: boolean) {
  console.log(`handleSelectAll${checked}`);
  if (checked) {
    const allKeys = getAllKeys(menuOptions.value);
    checks.value = allKeys;
  } else {
    checks.value = [];
  }
}


function getAllKeys(nodes: SystemMenuApi.MenuTreeOption[]): number[] {
  let keys: number[] = [];
  nodes.forEach(node => {
    keys.push(node.id);
    if (node.children) {
      keys = keys.concat(getAllKeys(node.children));
    }
  });
  return keys;
}


function handleSubmit() {
  console.log(checks.value, props.roleId);
  // 触发自定义事件，将数据传递给父组件
  emit('update:roleMenu', { roleId: props.roleId, checks: checks.value });
  window.$message?.success?.($t('common.modifySuccess'));
  closeModal();
}


watch(visible, val => {
  if (val) {
    getMenuTree(props.roleId);
  }
});
</script>

<template>
  <NModal v-model:show="visible" :title="title" preset="card" class="w-480px">
    <div class="flex-y-center gap-16px pb-12px">
      <NSpace justify="space-between" align="center">
        <NCheckbox @update:checked="handleExpandCollapse">
          {{ $t('common.expandCollapse') }}
        </NCheckbox>
        <NCheckbox @update:checked="handleSelectAll">
          {{ $t('common.selectAllUnselect') }}
        </NCheckbox>
      </NSpace>
    </div>
    <div class="tree-container">
      <NTree
        v-model:checked-keys="checks"
        :data="menuOptions"
        key-field="id"
        :default-expanded-keys="expandedKeys"
        checkable
        cascade
        expand-on-click
        virtual-scroll
        block-line
        class="h-280px"
      />
    </div>
    <template #footer>
      <NSpace justify="end">
        <NButton size="small" class="mt-16px" @click="closeModal">
          {{ $t('common.cancel') }}
        </NButton>
        <NButton type="primary" size="small" class="mt-16px" @click="handleSubmit">
          {{ $t('common.confirm') }}
        </NButton>
      </NSpace>
    </template>
  </NModal>
</template>

<style scoped>
.tree-container {
  border-radius: 8px; /* 圆角半径 */
  border: 1px solid #ccc; /* 边框颜色 */
  padding-left: 2px; /* 内边距 */
  padding-right: 2px;
  overflow: auto;
}
</style>
