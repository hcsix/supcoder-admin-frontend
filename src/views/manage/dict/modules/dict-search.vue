<script setup lang="ts">
import { computed } from 'vue';
import { $t } from '@/locales';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
const { defaultRequiredRule } = useFormRules();

defineOptions({
  name: 'DictSearch'
});

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const { formRef, validate, restoreValidation } = useNaiveForm();

const model = defineModel<SystemDictApi.DictTypeSearchParams>('model', { required: true });

type RuleKey = Extract<keyof SystemDictApi.DictTypeSearchParams, 'dictName' | 'dictType'>;

const rules = computed<Record<RuleKey, App.Global.FormRule>>(() => {
  return {
    dictName: defaultRequiredRule,
    dictType: defaultRequiredRule
  };
});

async function reset() {
  await restoreValidation();
  emit('reset');
}

async function search() {
  await validate();
  emit('search');
}
</script>

<template>
  <NCard :bordered="false" size="small" class="card-wrapper">
    <NCollapse>
      <NCollapseItem :title="$t('common.search')" name="user-search">
        <NForm ref="formRef" :model="model" :rules="rules" label-placement="left" :label-width="80">
          <NGrid responsive="screen" item-responsive>
            <NFormItemGi span="24 s:12 m:8" :label="$t('page.manage.dict.dictName')" class="pr-24px">
              <NInput v-model:value="model.dictName" :placeholder="$t('page.manage.dict.form.dictName')" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:8" :label="$t('page.manage.dict.dictType')" class="pr-24px">
              <NInput v-model:value="model.dictType" :placeholder="$t('page.manage.dict.form.dictType')" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:8" :label="$t('common.createdTime')" path="range" class="pr-24px">
              <NDatePicker v-model:value="model.createTimeRange" type="daterange" clearable />
            </NFormItemGi>
            <NFormItemGi span="24 m:24" class="pr-24px">
              <NSpace class="w-full" justify="end">
                <NButton @click="reset">
                  <template #icon>
                    <icon-ic-round-refresh class="text-icon" />
                  </template>
                  {{ $t('common.reset') }}
                </NButton>
                <NButton type="primary" ghost @click="search">
                  <template #icon>
                    <icon-ic-round-search class="text-icon" />
                  </template>
                  {{ $t('common.search') }}
                </NButton>
              </NSpace>
            </NFormItemGi>
          </NGrid>
        </NForm>
      </NCollapseItem>
    </NCollapse>
  </NCard>
</template>

<style scoped></style>
