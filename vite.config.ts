import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'url';
import AutoImport from 'unplugin-auto-import/vite';
import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

function getPath(dir) {
  return fileURLToPath(new URL(dir, import.meta.url));
}

// https://cn.vitejs.dev/config/
// export default defineConfig({
//   plugins: [vue()]
// })
export default defineConfig(({command, mode, ssrBuild, ...others}) => {
  console.log('command: ', command);
  console.log('mode: ', mode);
  console.log('ssrBuild: ', ssrBuild);
  console.log('others: ', others);
  return {
    plugins: [
      vue(),
      AutoImport({
        imports: [
          'vue',
          {
            'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar']
          }
        ]
      }),
      Components({
        resolvers: [NaiveUiResolver()]
      })
    ],
    envDir: getPath('./env-config'),
    envPrefix: ['VITE', 'APP'],
    // publicDir: 'public', // 指定public文件文件夹，该文件夹下的资源会被原封不动的移动到打包后的项目根目录下
    resolve: {
      alias: {
        '@': getPath('./src'),
        '@assets': getPath('./src/assets'),
        '@comps': getPath('./src/components'),
        '@views': getPath('./src/components/views'),
        '@utils': getPath('./src/components/utils'),
      }
    },
    // css: {
    //   preprocessorOptions: {
    //     scss: {
    //       additionalData: ``
    //     }
    //   }
    // }
  };
});
