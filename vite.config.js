import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

function resolve(dir) {
  return path.join(__dirname, dir);
}
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve('./src'),
      assets: resolve('./src/assets'),
      comps: resolve('./src/components'),
      layout: resolve('./src/layout'),
      views: resolve('./src/views'),
      router: resolve('./src/router'),
      store: resolve('./src/store'),
      styles: resolve('./src/common/styles'),
      utils: resolve('./src/common/utils'),
      apis: resolve('./src/common/apis'),
      plugins: resolve('./src/common/plugins'),
      mixins: resolve('./src/common/mixins'),
      uses: resolve('./src/common/uses'),
      config: resolve('./src/common/config')
    }
  },
  css: {
    postcss: {
      /* plugins: [
        {
          postcssPlugin: 'internal:charset-removal',
          AtRule: {
            charset: atRule => {
              if (atRule.name === 'charset') {
                atRule.remove()
              }
            },
          },
        },
      ], */
    },
    preprocessorOptions: {
      scss: {
        charset: false,
        additionalData: `
          @use "styles/variables" as *;
          @use "styles/mixins" as *;
        `
      }
    }
  },
  plugins: [vue()]
});
