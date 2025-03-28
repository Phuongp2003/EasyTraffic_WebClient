<template>
  <div class="main-container article-editor">
    <div
      class="editor-container editor-container_classic-editor editor-container_include-style editor-container_include-block-toolbar editor-container_include-word-count"
      ref="editorContainerElement"
    >
      <div class="editor-container__editor">
        <div ref="editorElement">
          <ckeditor
            v-if="editor && config"
            :editor="editor"
            :config="config"
            :model-value="modelValue"
            @update:model-value="handleChange"
            @ready="onReady"
          />
        </div>
      </div>
      <div class="editor_container__word-count" ref="editorWordCountElement"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, useTemplateRef } from 'vue'
import { Ckeditor } from '@ckeditor/ckeditor5-vue'

import {
  ClassicEditor,
  Alignment,
  Autoformat,
  AutoImage,
  AutoLink,
  Autosave,
  BalloonToolbar,
  BlockQuote,
  BlockToolbar,
  Bold,
  Bookmark,
  CloudServices,
  Code,
  CodeBlock,
  Essentials,
  FindAndReplace,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  FullPage,
  GeneralHtmlSupport,
  Heading,
  Highlight,
  HorizontalLine,
  HtmlComment,
  HtmlEmbed,
  ImageBlock,
  ImageCaption,
  ImageEditing,
  ImageInline,
  ImageInsert,
  ImageInsertViaUrl,
  ImageResize,
  ImageStyle,
  ImageTextAlternative,
  ImageToolbar,
  ImageUpload,
  ImageUtils,
  Indent,
  IndentBlock,
  Italic,
  Link,
  LinkImage,
  List,
  ListProperties,
  MediaEmbed,
  PageBreak,
  Paragraph,
  PasteFromOffice,
  RemoveFormat,
  SourceEditing,
  SpecialCharacters,
  SpecialCharactersArrows,
  SpecialCharactersCurrency,
  SpecialCharactersEssentials,
  SpecialCharactersLatin,
  SpecialCharactersMathematical,
  SpecialCharactersText,
  Strikethrough,
  Style,
  Subscript,
  Superscript,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TextPartLanguage,
  TextTransformation,
  TodoList,
  Underline,
  WordCount,
} from 'ckeditor5'
import MyUploadAdapter from '@/plugins/MyUploadAdapter'
import translations from 'ckeditor5/translations/vi.js'
import '@/assets/ckeditor_style.css'
import 'ckeditor5/ckeditor5.css'

// const editorMenuBar = useTemplateRef( 'editorMenuBarElement' );
const editorWordCount = useTemplateRef('editorWordCountElement')

const isLayoutReady = ref(false)

const editor = ClassicEditor

const props = defineProps({
  modelValue: {
    type: String,
    default: '<h2>Hãy bắt đầu bài viết của bạn nào!</h2>',
  },
  defData: { type: String },
})

const emit = defineEmits(['update:model-value'])

function handleChange(data: string) {
  emit('update:model-value', data)
}

const config = computed(() => {
  if (!isLayoutReady.value) {
    return null
  }

  return {
    initialData:
      props.defData != null ? props.defData : '<h2>Hãy bắt đầu bài viết của bạn nào!</h2>',
    toolbar: {
      items: [
        'sourceEditing',
        '|',
        'heading',
        'style',
        '|',
        'fontSize',
        'fontFamily',
        'fontColor',
        'fontBackgroundColor',
        '|',
        'bold',
        'italic',
        'underline',
        '|',
        'link',
        'insertImage',
        'insertTable',
        'highlight',
        'blockQuote',
        'codeBlock',
        '|',
        'alignment',
        '|',
        'bulletedList',
        'numberedList',
        'todoList',
        'outdent',
        'indent',
      ],
      shouldNotGroupWhenFull: false,
    },
    plugins: [
      Alignment,
      Autoformat,
      AutoImage,
      AutoLink,
      Autosave,
      BalloonToolbar,
      BlockQuote,
      BlockToolbar,
      Bold,
      Bookmark,
      CloudServices,
      Code,
      CodeBlock,
      Essentials,
      FindAndReplace,
      FontBackgroundColor,
      FontColor,
      FontFamily,
      FontSize,
      FullPage,
      GeneralHtmlSupport,
      Heading,
      Highlight,
      HorizontalLine,
      HtmlComment,
      HtmlEmbed,
      ImageBlock,
      ImageCaption,
      ImageEditing,
      ImageInline,
      ImageInsert,
      ImageInsertViaUrl,
      ImageResize,
      ImageStyle,
      ImageTextAlternative,
      ImageToolbar,
      ImageUpload,
      ImageUtils,
      Indent,
      IndentBlock,
      Italic,
      Link,
      LinkImage,
      List,
      ListProperties,
      MediaEmbed,
      PageBreak,
      Paragraph,
      PasteFromOffice,
      RemoveFormat,
      // SimpleUploadAdapter,
      SourceEditing,
      SpecialCharacters,
      SpecialCharactersArrows,
      SpecialCharactersCurrency,
      SpecialCharactersEssentials,
      SpecialCharactersLatin,
      SpecialCharactersMathematical,
      SpecialCharactersText,
      Strikethrough,
      Style,
      Subscript,
      Superscript,
      Table,
      TableCaption,
      TableCellProperties,
      TableColumnResize,
      TableProperties,
      TableToolbar,
      TextPartLanguage,
      TextTransformation,
      TodoList,
      Underline,
      WordCount,
    ],
    extraPlugins: [
      function (editor) {
        /*************  ✨ Codeium Command ⭐  *************/
        /**

/******  13da8f8d-534b-4422-8380-165cbc8382b0  *******/ editor.plugins.get(
          'FileRepository',
        ).createUploadAdapter = (loader) => {
          return new MyUploadAdapter(loader, import.meta.env.VITE_API_BASE_URL)
        }
      },
    ],
    balloonToolbar: [
      'bold',
      'italic',
      '|',
      'link',
      'insertImage',
      '|',
      'bulletedList',
      'numberedList',
    ],
    blockToolbar: [
      'fontSize',
      'fontColor',
      'fontBackgroundColor',
      '|',
      'bold',
      'italic',
      '|',
      'link',
      'insertImage',
      'insertTable',
      '|',
      'bulletedList',
      'numberedList',
      'outdent',
      'indent',
    ],
    fontFamily: {
      supportAllValues: true,
    },
    fontSize: {
      options: [10, 12, 14, 'default', 18, 20, 22],
      supportAllValues: true,
    },
    heading: {
      options: [
        {
          model: 'paragraph',
          title: 'Paragraph',
          class: 'ck-heading_paragraph',
        },
        {
          model: 'heading1',
          view: 'h1',
          title: 'Heading 1',
          class: 'ck-heading_heading1',
        },
        {
          model: 'heading2',
          view: 'h2',
          title: 'Heading 2',
          class: 'ck-heading_heading2',
        },
        {
          model: 'heading3',
          view: 'h3',
          title: 'Heading 3',
          class: 'ck-heading_heading3',
        },
        {
          model: 'heading4',
          view: 'h4',
          title: 'Heading 4',
          class: 'ck-heading_heading4',
        },
        {
          model: 'heading5',
          view: 'h5',
          title: 'Heading 5',
          class: 'ck-heading_heading5',
        },
        {
          model: 'heading6',
          view: 'h6',
          title: 'Heading 6',
          class: 'ck-heading_heading6',
        },
      ],
    },
    htmlSupport: {
      allow: [
        {
          name: /^.*$/,
          styles: true,
          attributes: true,
          classes: true,
        },
      ],
    },
    image: {
      toolbar: [
        'toggleImageCaption',
        'imageTextAlternative',
        '|',
        'imageStyle:inline',
        'imageStyle:wrapText',
        'imageStyle:breakText',
        '|',
        'resizeImage',
      ],
    },
    language: 'vi',
    licenseKey: 'GPL',
    link: {
      addTargetToExternalLinks: true,
      defaultProtocol: 'https://',
      decorators: {
        toggleDownloadable: {
          mode: 'manual',
          label: 'Downloadable',
          attributes: {
            download: 'file',
          },
        },
      },
    },
    list: {
      properties: {
        styles: true,
        startIndex: true,
        reversed: true,
      },
    },
    menuBar: {
      isVisible: true,
    },
    placeholder: 'Type or paste your content here!',
    style: {
      definitions: [
        {
          name: 'Article category',
          element: 'h3',
          classes: ['category'],
        },
        {
          name: 'Title',
          element: 'h2',
          classes: ['document-title'],
        },
        {
          name: 'Subtitle',
          element: 'h3',
          classes: ['document-subtitle'],
        },
        {
          name: 'Info box',
          element: 'p',
          classes: ['info-box'],
        },
        {
          name: 'Side quote',
          element: 'blockquote',
          classes: ['side-quote'],
        },
        {
          name: 'Marker',
          element: 'span',
          classes: ['marker'],
        },
        {
          name: 'Spoiler',
          element: 'span',
          classes: ['spoiler'],
        },
        {
          name: 'Code (dark)',
          element: 'pre',
          classes: ['fancy-code', 'fancy-code-dark'],
        },
        {
          name: 'Code (bright)',
          element: 'pre',
          classes: ['fancy-code', 'fancy-code-bright'],
        },
      ],
    },
    table: {
      contentToolbar: [
        'tableColumn',
        'tableRow',
        'mergeTableCells',
        'tableProperties',
        'tableCellProperties',
      ],
    },
    translations: [translations],
  }
})

onMounted(() => {
  isLayoutReady.value = true
})

function onReady(editor) {
  ;[...editorWordCount.value.children].forEach((child) => child.remove())

  // [ ...editorMenuBar.value.children ].forEach( child => child.remove() );

  const wordCount = editor.plugins.get('WordCount')
  editorWordCount.value.appendChild(wordCount.wordCountContainer)

  // editorMenuBar.value.appendChild( editor.ui.view.menuBarView.element );
}
</script>
