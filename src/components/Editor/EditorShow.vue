<template>
  <div>
    <div class="ck-content" v-html="bodyContent"></div>
  </div>
</template>

<script>
import 'ckeditor5/ckeditor5.css'
import '@/assets/ckeditor_style.css'

export default {
  props: {
    data: String,
  },
  data() {
    return {
      styles: '',
      bodyContent: '',
      styleElement: null,
    }
  },
  mounted() {
    this.checkHtmlContent()
  },
  watch: {
    data() {
      this.checkHtmlContent()
    },
  },
  methods: {
    checkHtmlContent() {
      if (this.data && typeof this.data === 'string') {
        this.isCompleteHtml = this.data.trim().startsWith('<!DOCTYPE html>')
        if (this.isCompleteHtml) {
          this.parseHtmlContent()
        } else {
          this.bodyContent = this.data
        }
        this.updateStyles()
      } else {
        console.error('Invalid data passed to Show component.')
      }
    },
    parseHtmlContent() {
      const parser = new DOMParser()
      const doc = parser.parseFromString(this.data, 'text/html')
      const styleTags = doc.querySelectorAll('style')
      const styles = Array.from(styleTags)
        .map((style) => style.innerHTML)
        .join('\n')
      const bodyContent = doc.body.innerHTML

      this.styles = styles
      this.bodyContent = bodyContent
    },
    updateStyles() {
      if (this.styleElement) {
        document.head.removeChild(this.styleElement)
      }
      if (this.styles) {
        const scopedStyles = this.styles.replace(/:root/g, '*')
        this.styleElement = document.createElement('style')
        this.styleElement.type = 'text/css'
        this.styleElement.appendChild(document.createTextNode(`.ck-content {${scopedStyles}}`))
        document.head.appendChild(this.styleElement)
      }
    },
  },
  beforeUnmount() {
    if (this.styleElement) {
      document.head.removeChild(this.styleElement)
    }
  },
}
</script>

<style scoped>
.ck-content {
  /* Add any specific styles you want to apply to the ck-content here */
}
</style>
