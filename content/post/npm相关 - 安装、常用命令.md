---
title: 'npm相关 - 安装、常用命令'
date: '2024-07-29'
summary: "记录npm的一些快查命令"
tags: ["技术", "环境配置"]
---
#### 安装NVM和最新NPM
1. 安装nvm，打开你的终端，然后输入以下命令：

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
```

2. 重启你的终端，然后验证nvm是否成功安装，输入以下命令：

```bash
nvm --version
```

3. 使用nvm安装新的Node.js版本，输入以下命令：

```bash
nvm install node
```

这将会安装最新版本的Node.js。

4. 切换到新安装的Node.js版本，输入以下命令：

```bash
nvm use node
```

5. 验证Node.js版本，输入以下命令：

```bash
node -v
```

现在你应该可以更新npm到最新版本了。再次尝试运行以下命令：

```bash
npm install -g npm@latest
```

##### 管理npm的包
- 查看npm安装过的包
```
npm list -g --depth=0

/Users/wuyiwai/.nvm/versions/node/v20.2.0/lib
├── cnpm@9.2.0
├── corepack@0.17.2
├── hexo-cli@4.3.1
└── npm@9.6.6
```
- 如果你想查看特定项目的npm包，你可以在项目的根目录下运行以下命令：
```
npm list --depth=0

wuyiwai@ /Users/wuyiwai
├── hexo-render-pug@2.1.4
├── hexo-renderer-jade@0.4.0
├── hexo-renderer-pug@3.0.0
├── hexo-renderer-stylus@1.1.0
└── hexo@7.0.0-rc2
```
- 移除npm安装的包
```
npm remove xx1 xx2 xx3
或者
npm uninstall xx1 xx2 xx3
```

这里只记录一次简单的npm安装的过程和一些超级常见的命令：
- `npm install -g <package>` - 全局安装指定包
- `npm install <package>` 安装指定的包作为当前项目的依赖
- `npm install` / `npm update` - 安装/更新 当前项目的所有依赖项
- `npm install <package>` / `npm update <package>` - 安装或更新指定包
- `npm list` - 列出当前项目所有依赖项
- `npm list -g` - 列出全局安装的所有包
- `npm search <package>` - 搜索与指定名称匹配的包
- `npm show <package>` - 显示指定包的详细信息
- `npm config` - 管理npm的配置设置

更多命令可以阅读官方文档：https://docs.npmjs.com/cli/v10/commands