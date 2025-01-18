<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { fetchAddDictType, fetchUpdateDictType } from '@/service/api';
import { $t } from '@/locales';

defineOptions({
  name: 'DictOperateDrawer'
});

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: SystemDictApi.DictType | null;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const { formRef, validate, restoreValidation } = useNaiveForm();
const { defaultRequiredRule } = useFormRules();

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: $t('page.manage.dict.addDict'),
    edit: $t('page.manage.dict.editDict')
  };
  return titles[props.operateType];
});

type Model = Pick<SystemDictApi.DictType, 'dictName' | 'dictType' | 'remark' | 'createTime'> & {
  dictId: number | null;
};

const model = ref(createDefaultModel());

function createDefaultModel(): Model {
  return {
    dictId: null,
    dictName: '',
    dictType: '',
    remark: '',
    createTime: ''
  };
}

type RuleKey = Extract<keyof Model, 'dictName' | 'dictType'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  dictName: defaultRequiredRule,
  dictType: defaultRequiredRule
};

function handleInitModel() {
  model.value = createDefaultModel();

  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(model.value, props.rowData);
  }
}

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();
  const commonParams = {
    dictName: model.value.dictName,
    dictType: model.value.dictType,
    remark: model.value.remark
  };
  // dictId不为空说明是已经存在的数据，需要调用更新接口
  if (model.value.dictId) {
    await updateDict({ commonParams });
  } else {
    await addDict({ commonParams });
  }
  closeDrawer();
  emit('submitted');
}

async function addDict({ commonParams }: { commonParams: any }) {
  const requestParams: SystemDictApi.DictType = {
    ...commonParams
  };
  const { error } = await fetchAddDictType(requestParams);
  if (error) {
    window.$message?.error(error.message);
    return;
  }
  window.$message?.success($t('common.updateSuccess'));
}

async function updateDict({ commonParams }: { commonParams: any }) {
  const requestParams: SystemDictApi.DictType = {
    ...commonParams,
    dictId: model.value.dictId
  };
  const { error } = await fetchUpdateDictType(requestParams);
  if (error) {
    window.$message?.error(error.message);
    return;
  }
  window.$message?.success($t('common.updateSuccess'));
}

watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    restoreValidation();
  }
});
</script>

<template>
  <NDrawer v-model:show="visible" display-directive="show" :width="360">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <NForm ref="formRef" :model="model" :rules="rules">
        <NFormItem :label="$t('page.manage.dict.dictName')" path="dictName">
          <NInput v-model:value="model.dictName" :placeholder="$t('page.manage.dict.form.dictName')" />
        </NFormItem>

        <NFormItem :label="$t('page.manage.dict.dictType')" path="dictType">
          <NInput v-model:value="model.dictType" :placeholder="$t('page.manage.dict.form.dictType')" />
        </NFormItem>

        <NFormItem :label="$t('page.manage.dict.dictDesc')" path="remark">
          <NInput v-model:value="model.remark" :placeholder="$t('page.manage.dict.form.dictDesc')" />
        </NFormItem>
      </NForm>
      <template #footer>
        <NSpace :size="16">
          <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
          <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped></style>
