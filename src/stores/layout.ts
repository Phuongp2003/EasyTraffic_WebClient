import { defineStore } from 'pinia'

export const useLayoutStore = defineStore('layout', {
  state: () => ({
    sidebarOpen: localStorage.getItem('sidebarOpen') !== 'false',
    activeMenuItem: '/' as string,
  }),
  actions: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
      localStorage.setItem('sidebarOpen', this.sidebarOpen.toString())
    },
    setActiveMenuItem(path: string) {
      this.activeMenuItem = path
    },
  },
})
