import { defineConfig } from 'vite';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getThemeVariables } = require('antd/dist/theme');
import react from '@vitejs/plugin-react';

const isDev = process.env.NODE_ENV === 'development';
// eslint-disable-next-line no-console
console.log('process.env.NODE_ENV', process.env.NODE_ENV);

// https://vitejs.dev/config/
// const libBuild = defineConfig({
//   root: './',
//   base: '/dist/',
//   build: {
//     outDir: './dist',
//     emptyOutDir: false,
//     lib: {
//       entry: './inspect.ts',
//       name: 'BproxyInspect',
//       fileName: 'inspect',
//       formats: ['umd'],
//     },
//   },
//   css: {
//     preprocessorOptions: {
//       less: {
//         modifyVars: getThemeVariables({
//           dark: true,
//           compact: true,
//         }),
//         javascriptEnabled: true,
//       },
//     },
//   },
// });

const pageBuild = defineConfig({
  root: './', // html 所在位置
  build: {
    outDir: './dist',
    emptyOutDir: true,
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: getThemeVariables({
          dark: true,
          compact: true,
        }),
        javascriptEnabled: true,
      },
    },
  },
  server: {
    port: 8889,
    open: true,
  },
  plugins: [react()],
});

// const config = !isDev ? libBuild : pageBuild;
export default pageBuild;
