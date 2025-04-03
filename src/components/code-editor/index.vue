<template>
  <div ref="editor" class="code-editor"></div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { EditorView, basicSetup } from '@codemirror/basic-setup';
import { EditorState } from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';

export default {
  name: 'CodeEditor',
  setup() {
    const editor = ref(null); // DOM 元素引用
    let view = null; // CodeMirror 实例

    onMounted(() => {
      // 初始化 CodeMirror 编辑器
      view = new EditorView({
        state: EditorState.create({
          doc: 'console.log("Hello, CodeMirror!");', // 初始内容
          extensions: [
            basicSetup, // 基础功能（行号、折叠等）
            javascript(), // JavaScript 语言支持
            EditorView.lineWrapping, // 自动换行
          ],
        }),
        parent: editor.value, // 挂载到 DOM 元素
      });
    });

    return {
      editor,
    };
  },
};
</script>

<style>
.code-editor {
  border: 1px solid #ddd;
  height: 300px;
}
</style>
