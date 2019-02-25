###### 单项目根目录部署(不带上下文)

```
server {
    listen       8807;
    server_name  localhost;
    
    root /Users/drank/Desktop/bymm/performanceReport/dist;  
    index index.html;
    location / {
        try_files $uri /index.html;
    }
}
```

###### 多项目部署(带上下文) ```BrowserRouter```

```
server {
    listen       8805;
    server_name  localhost;
    
    root /Users/drank/Desktop/bymm/performanceReport/dist;
    location /report {
        # root html;
        index index.html;
        try_files $uri /index.html;
    }
}
```

> eg：新增上下文 report   =>      localhost:8805/report/xxx
>
> React 需在Router里面配置 basename="/report" 
>
> ```<BrowserRouter basename="/report">otherRouters</BrowserRouter>```

###### VUE 多项目 和 React 类似 可能上面那个有些问题

```
server {
    listen       8805; # 8805 可以是80
    server_name  localhost;
    
    root /Users/drank/Desktop/bymm/performanceReport; # 根目录固定不变
    location /report {
        index index.html;
        try_files $uri $uri/ /report/index.html; # 根目录下的report目录
    }
}
```
vue config => publicPath: '/report/' [publicpath](https://cli.vuejs.org/zh/config/#publicpath)  
vue router => base: '/report/' [base](https://router.vuejs.org/zh/api/#base)


