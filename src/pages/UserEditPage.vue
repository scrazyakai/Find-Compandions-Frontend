<template>
  <van-form @submit="onSubmit">
    <template v-if="editUser.editKey === 'gender'">
      <van-field
          :value="editUser.currentValue"
          :name="editUser.editKey"
          :label="editUser.editName"
          is-link
          readonly
          @click="showGenderPicker = true"
      />
      <van-popup :show="showGenderPicker" @update:show="showGenderPicker = $event" position="bottom">
        <van-picker
            :columns="genderOptions"
            @confirm="onGenderConfirm"
            @cancel="showGenderPicker = false"
            title="选择性别"
        />
      </van-popup>
    </template>
    <template v-else>
      <van-field
          v-model="editUser.currentValue"
          :name="editUser.editKey"
          :label="editUser.editName"
          :placeholder="`请输入${editUser.editName}`"
      />
    </template>
    <div style="margin: 16px;">
      <van-button round block type="primary" native-type="submit">
        提交
      </van-button>
    </div>
  </van-form>
</template>

<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import { ref, watch } from "vue";
import myAxios from "../plugins/myAxios";
import {Toast} from "vant";
import {getCurrentUser} from "../services/user";

const route = useRoute();
const router = useRouter();

// 性别选择器相关
const showGenderPicker = ref(false);

interface GenderOption {
  text: string;
  value: number;
}

const genderOptions: GenderOption[] = [
  { text: '男', value: 0 },
  { text: '女', value: 1 }
];

// 性别映射
const genderMap: Record<number, string> = {
  0: '男',
  1: '女'
};

interface EditUser {
  editKey: string;
  currentValue: string;
  editName: string;
  rawValue: number | string;
}

// 获取路由查询参数
const getQueryParam = (key: string): string => {
  const value = route.query[key];
  return Array.isArray(value) ? value[0] || '' : value || '';
};

const rawGender = Number(getQueryParam('currentValue'));

const editUser = ref<EditUser>({
  editKey: getQueryParam('editKey'),
  currentValue: getQueryParam('editKey') === 'gender'
    ? genderMap[rawGender] ?? ''
    : getQueryParam('currentValue'),
  editName: getQueryParam('editName'),
  rawValue: getQueryParam('editKey') === 'gender'
    ? (rawGender === 0 || rawGender === 1 ? rawGender : '')
    : getQueryParam('currentValue')
});

// 添加对 editUser.currentValue 的监听
watch(() => editUser.value.currentValue, (newValue, oldValue) => {
  
});

const onGenderConfirm = (value: GenderOption) => {
  editUser.value.currentValue = value.text;
  editUser.value.rawValue = value.value;
  showGenderPicker.value = false;
};

const onSubmit = async () => {
  if (!editUser.value.currentValue.trim()) {
    Toast.fail(`请输入${editUser.value.editName}`);
    return;
  }
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    Toast.fail('用户未登录');
    return;
  }

  

  // 构造请求数据
  const requestData = {
    'id': currentUser.id,
    [editUser.value.editKey]: editUser.value.editKey === 'gender' 
      ? Number(editUser.value.rawValue)  // 确保性别是数字类型
      : editUser.value.currentValue,
  };

  

  const res = await myAxios.post('/user/update', requestData);
  
  
  
  if (res.data > 0) {
    Toast.success('修改成功');
    router.back();
  } else {
    Toast.fail('修改错误');
  }
};
</script>

<style scoped>

</style>
