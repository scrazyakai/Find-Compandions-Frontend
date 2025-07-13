<script setup lang="ts">
import { useRoute } from 'vue-router';
import BasicLayout from "./layouts/BasicLayout.vue";
const route = useRoute();
</script>

<template>
  <BasicLayout v-if="route.meta.showTabbar !== false" />
  <router-view v-else />
</template>

<style>

</style>
