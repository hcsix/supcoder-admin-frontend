<script setup lang="ts">
import { NButton, NForm, NFormItem, NInput, NModal, NSpace } from 'naive-ui';
import { computed, reactive } from 'vue';
import { fetchUpdateUserPwd } from '@/service/api';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({
  name: 'ResetPwdModal'
});

const visible = defineModel<boolean>('visible', {
  default: false
});

const { formRef, validate } = useNaiveForm();

interface FormModel {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
const model: FormModel = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

function closeModal() {
  // 重置表单数据
  model.oldPassword = '';
  model.newPassword = '';
  model.confirmPassword = '';
  visible.value = false;
}

type RuleRecord = Partial<Record<keyof FormModel, App.Global.FormRule[]>>;

const rules = computed<RuleRecord>(() => {
  const { formRules, createConfirmPwdRule } = useFormRules();

  return {
    oldPassword: formRules.pwd,
    newPassword: formRules.pwd,
    confirmPassword: createConfirmPwdRule(model.newPassword)
  };
});

async function handleSubmit() {
  await validate();
  const { data } = await fetchUpdateUserPwd(model.oldPassword, model.newPassword);
  const res = data.data;
  if (res.code !== 200) {
    window.$message?.error(res.message);
  } else {
    window.$message?.success($t('page.login.common.validateSuccess'));
    closeModal();
  }
}
</script>

<template>
  <NModal v-model:show="visible" :title="$t('page.login.resetPwd.title')" preset="card" class="w-480px">
    <NForm ref="formRef" :model="model" :rules="rules" label-width="80px">
      <NFormItem :label="$t('page.login.common.originalPassword')" path="oldPassword">
        <NInput
          v-model:value="model.oldPassword"
          type="password"
          show-password-on="click"
          :placeholder="$t('page.login.common.passwordPlaceholder')"
        />
      </NFormItem>
      <NFormItem :label="$t('page.login.common.newPassword')" path="newPassword">
        <NInput
          v-model:value="model.newPassword"
          type="password"
          show-password-on="click"
          :placeholder="$t('page.login.common.passwordPlaceholder')"
        />
      </NFormItem>
      <NFormItem :label="$t('page.login.common.confirmNewPassword')" path="confirmPassword">
        <NInput
          v-model:value="model.confirmPassword"
          type="password"
          show-password-on="click"
          :placeholder="$t('page.login.common.confirmPasswordPlaceholder')"
        />
      </NFormItem>
    </NForm>
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
/* 添加一些样式以美化页面 */
.n-form-item {
  margin-bottom: 16px;
}
</style>
