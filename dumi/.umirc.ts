import { defineConfig } from 'dumi';

export default defineConfig({
  externals: {
    react: 'window.React',
    'react-dom': 'window.ReactDOM',
  },
  favicon: 'https://tiiit-cn.oss-cn-shenzhen.aliyuncs.com/favicon.ico',
  hash: true,
  logo: 'https://tiiit-cn.oss-cn-shenzhen.aliyuncs.com/logo.jpeg',
  locales: [['zh-CN', '中文']],
  mode: 'site',
  // 单语言配置方式如下
  navs: [
    null, // null 值代表保留约定式生成的导航，只做增量配置
    {
      title: 'GitHub',
      path: 'https://github.com/chenhaihong/mese',
    },
  ],
  scripts: [
    'https://cdn.staticfile.org/react/16.13.1/umd/react.production.min.js',
    'https://cdn.staticfile.org/react-dom/16.13.1/umd/react-dom.production.min.js',
  ],
  outputPath: 'docs-dist',
  title: 'mese',
  // more config: https://d.umijs.org/config
});
