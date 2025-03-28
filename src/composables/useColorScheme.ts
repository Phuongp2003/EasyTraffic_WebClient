import { useColorMode } from '@vueuse/core'
import { computed } from 'vue'

export const useColorScheme = () => {
  const colorMode = useColorMode({
    attribute: 'class',
    modes: {
      dark: 'dark',
      light: 'light',
    },
    storageKey: 'ezf-color-scheme',
  })

  const isDark = computed(() => colorMode.value === 'dark')
  const toggleDark = () => {
    colorMode.value = colorMode.value === 'dark' ? 'light' : 'dark'
  }

  return {
    isDark,
    toggleDark,
    mode: colorMode,
  }
}
