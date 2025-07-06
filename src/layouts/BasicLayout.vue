<template>
  <div class="pc-layout">

    <main class="pc-content container">
        <router-view/>
      </main>
    <!-- 底部Tabbar放在根div内，保证只有一个根节点 -->
    <van-tabbar route>
      <van-tabbar-item to="/" icon="home-o">主页</van-tabbar-item>
      <van-tabbar-item to="/message" icon="chat-o">消息</van-tabbar-item>
      <van-tabbar-item to="/team" icon="search">队伍</van-tabbar-item>
      <van-tabbar-item to="/user" icon="friends-o">个人</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup lang="ts">
// PC端布局无需移动端导航逻辑
</script>

<style scoped>
.pc-layout {
  min-height: 100vh;
  background: #f5f7fa;
  display: flex;
  flex-direction: column;
}
.pc-header {
  height: 56px;
  background: #fff;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 0 32px;
  z-index: 100;
}
.logo {
  font-size: 28px;
  margin-right: 16px;
}
.title {
  font-size: 20px;
  font-weight: bold;
  margin-right: 40px;
}
.pc-menu {
  display: flex;
  gap: 24px;
}
.pc-menu a {
  color: #333;
  text-decoration: none;
  font-size: 16px;
  padding: 4px 12px;
  border-radius: 4px;
  transition: background 0.2s, color 0.2s;
}
.pc-menu a.active,
.pc-menu a:hover {
  background: #1677ff;
  color: #fff;
}
.pc-content {
  flex: 1;
  max-width: 1200px;
  margin: 32px auto 0 auto;
  background: none;
}
</style>
