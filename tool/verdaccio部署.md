#### verdaccio部署 [官方文档](https://verdaccio.org/docs/zh-CN/what-is-verdaccio.html)

###### 安装

* verdaccio
```javascript
npm install -g verdaccio
或者
yarn global add verdaccio

直接执行：verdaccio
warn --- config file  - /Users/broszhu/.config/verdaccio/config.yaml
warn --- Verdaccio started
warn --- Plugin successfully loaded: verdaccio-htpasswd
warn --- Plugin successfully loaded: verdaccio-audit
warn --- http address - http://localhost:4873/ - verdaccio/4.4.0
fatal--- cannot create server: getaddrinfo ENOTFOUND localhost
```
* nrm
```
npm install -g nrm 

nrm add verdaccio http://localhost:4873/
nrm use verdaccio
```

###### 配置
* 基础配置
```yaml
storage: ./storage # 配置 storage 目录 plugins 类似
i18n:
 web: zh-CN # en-US 中文修改
listen: 0.0.0.0:4873 # 监听所有地址
uplinks:
  npmjs:
    url: https://registry.npm.taobao.org # 配置外部taobao源
    # url: https://registry.npmjs.org/
# 其他 logo title 等配置
```
* 账号配置
```
# 因为是私有源，我们可以设置 config.yaml 中的 max_users: -1 来禁用 npm adduser 命令来创建用户。如果需要添加用户这里介绍两种方法：

# 可以通过安装 htpasswd-for-sinopia 来添加账号
$ npm install htpasswd-for-sinopia -g
$ sinopia-adduser # 在 htpasswd 目录下执行

# verdaccio 的认证是基于 verdaccio-htpasswd，
# 可以通过官方提供的工具来生成 www.htaccesstools.com/htpasswd-ge…，
# 将生成的段字符串添加到 htpasswd 中即可。

```

###### 配置上下文（如果用根域名可以忽略此步骤）
* ngix代理

```
upstream verdaccio_v4 {
    server verdaccio_relative_path_v4:4873;
    keepalive 8;
}

server {
    listen 80 default_server;
    access_log /var/log/nginx/verdaccio.log;
    charset utf-8;

    location ~ ^/verdaccio/(.*)$ {
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header Host $host;
      proxy_set_header X-NginX-Proxy true;
      proxy_pass http://verdaccio_v4/$1;
      proxy_redirect off;
    }
}

upstream, server都在http内

```
* pm2启动
```
VERDACCIO_PUBLIC_URL=xxx pm2 start verdaccio
* xxx * 为反向代理域名
```
