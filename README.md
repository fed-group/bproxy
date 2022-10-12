<div style="text-align: center;">
  <img src="https://sta-op.douyucdn.cn/front-publish/fed-ci-static-bed-online/icon.14605cf0.ico" />
</div>

# bproxy

## 集抓包、调试、mock 于一身的前端开发利器

## 开发

```bash
# 确保 node 版本 16 以上
nvm use 16.13.0
npm i pnpm -g
# nrm use taobao 使用淘宝源安装依赖
pnpm install

# 1、先构建一下 birdge 和 utils 包
yarn build
# 2、启动服务端
yarn start-server
# 3、启动 Web
yarn start-client
```
