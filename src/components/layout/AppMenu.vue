<script setup lang="ts">
import { ref } from 'vue'

interface MenuItem {
  label: string
  items?: MenuItem[]
  icon?: string
  to?: string
  url?: string
  target?: string
  class?: string
  separator?: boolean
}

const model = ref<MenuItem[]>([
  {
    label: '',
    items: [
      { label: 'Interaktiv xarita', icon: 'pi pi-fw pi-map', to: '/' },
      { label: 'Hisoblash', icon: 'pi pi-fw pi-file-check', to: '/calculate' },
      { label: 'Havoning ifloslanishi', icon: 'pi pi-fw pi-cloud', to: '/pollution' },
      { label: 'Yillik prognoz', icon: 'pi pi-fw pi-chart-line', to: '/yearly' },
    ],
  },
])
</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in model" :key="item">
      <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
      <li v-if="item.separator" class="menu-separator"></li>
    </template>
  </ul>
</template>

<style lang="scss" scoped></style>
