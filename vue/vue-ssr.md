##### 记录vue ssr 相关信息

##### 其他
* [nuxtjs 踩坑](https://github.com/yingye/Blog/issues/6)
* [nuxtjs 注意](https://zhuanlan.zhihu.com/p/44896776)

* 注意事项
  ```javascript
  ...
  data() {
    return {
      name: 'tom'
    }  
  },
  /**
  * asyncData, fetch 只在 page 中有效(会执行)
  * 都可通过service拉取数据 无window 对象
  **/
  asyncData (context) { // context 属性 => (https://zh.nuxtjs.org/api/context)
    return { project: 'nuxt' } // 返回值会注入到 上面data中
  },
  fetch(context) { // context 属性同 asyncData 中 context
    // 这里专业操作 store 
    // 返回一个Promise nuxt 会等待promise 完成填充store后渲染组件
  },
  // 使用时需要注意 beforeCreate, created 服务端和客户端都会调用
  // 注意 window 对象的合理使用
  beforeCreate() {},
  created() {}
  ...
  ```

>  无 keep-alive // activated、deactivated 生命周期不生效
>
> static  目录文件不会被编译

* 可拓展资源

  ```javascript
  // axios-module
  // proxy-module
  // router-module
  ```

* 其他

  ```javascript
  // nuxtServerInit
  // middleware
  // validate
  ```

##### 三、部署

* 发布

  * Nginx 部署

    ```nginx
    upstream nuxtapp {
        server  0.0.0.0:3000;
    }
    
    server {
        listen          4000;
    
        server_name     10.177.11.197;
        index           index.html index.htm;
        location /detection/ {
            proxy_set_header    X-Real-Ip $remote_addr;
            proxy_set_header    X-Forward-For $proxy_add_x_forwarded_for;
            proxy_set_header    X-Nginx-Proxy true;
            proxy_pass          http://nuxtapp;
            proxy_redirect off;
        }
    
        # access_log  /usr/local/etc/nginx/nuxt_logs/nuxtapp.log;
    }
    ```

  * Shell 脚本

    ```shell
    #!/usr/bin/env bash
    . ~/.bashrc
    cd /opt/pica-detection/
    npm install
    # ENV 对应的环境 dev test uat prod
    ENV=test npm run build
    pm2 delete pica-detection
    ENV=test pm2 start npm --name "pica-detection" -- start
    ```
