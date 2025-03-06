<template>
  <router-view></router-view>
</template>
<script setup lang="ts">
console.log('process.env: ', process.env.NODE_ENV); // process.env:  development
console.log('import.meta: ', import.meta.env)
/**
 * {
    "APP_API": "https://dev/api",
    "BASE_URL": "/",
    "MODE": "dev",
    "DEV": true,
    "PROD": false,
    "SSR": false
  }
 */
</script>
<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.carousel-img {
  width: 100%;
  height: 240px;
  object-fit: cover;
}
</style>
