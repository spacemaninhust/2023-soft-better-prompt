# 软件存档
## 中国软件杯大赛A11大模型任务prompt方向

相关的介绍文档另列内容，README主要围绕部署模块

目前仓库内容只是前后端的空壳，核心大模型暂时只在本地部署

相关的部署快捷命令在makefile中

本地clone后，使用

```makefile
flask initdb
flask run
```

即可

如果出现了页面加载的问题，使用

```
cd fe && npm i && npm run build
```

重新生成静态文件再启动flask

## 部署都是基于Linux系统，Win系统下的部署需要支持make命令
