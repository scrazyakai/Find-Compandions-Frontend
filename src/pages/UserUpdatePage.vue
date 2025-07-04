<template>
  <div v-if="user">
    <van-cell center>
      <template #title>
        <div style="text-align: center;">
          <van-image
              round
              width="100" height="100"
              :src="user.avatarUrl"
              style="margin-bottom: 5px;" 
              @click="toEdit('avatarUrl', '头像', user.avatarUrl)" 
          />
          <div>头像</div>
        </div>
      </template>
    </van-cell>
    <van-cell title="昵称" is-link :value="user.username" @click="toEdit('username', '昵称', user.username)"/>
    <van-cell title="账号" :value="user.userAccount"/>
    <van-cell title="性别" is-link :value="genderMap[Number(user.gender)]" @click="toEdit('gender', '性别', user.gender)"/>
    <van-cell title="电话" is-link :value="user.phone" @click="toEdit('phone', '电话', user.phone)"/>
    <van-cell title="邮箱" is-link :value="user.email" @click="toEdit('email', '邮箱', user.email)"/>
    <van-cell title="星球编号" :value="user.planetCode"/>
    <van-cell title="注册时间" :value="user.createTime"/>
  </div>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import myAxios from "../plugins/myAxios";
import {Toast, Image} from "vant";
import {getCurrentUser} from "../services/user";

// const user = {
//   id: 1,
//   username: '鱼皮',
//   userAccount: 'dogYupi',
//   avatarUrl: 'https://636f-codenav-8grj8px727565176-1256524210.tcb.qcloud.la/img/logo.png',
//   gender: '男',
//   phone: '123112312',
//   email: '12345@qq.com',
//   planetCode: '1234',
//   createTime: new Date(),
// }

const user = ref();

onMounted(async () => {
  user.value = await getCurrentUser();
})

const router = useRouter();

const toEdit = (editKey: string, editName: string, currentValue: string) => {
  router.push({
    path: '/user/edit',
    query: {
      editKey,
      editName,
      currentValue,
    }
  })
}

const genderMap: Record<number, string> = {
  0: '男',
  1: '女'
};
</script>

<style scoped>

</style>