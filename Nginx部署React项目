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

###### 多项目部署(带上下文)

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
> <Router basename="/report" children={ route } />
