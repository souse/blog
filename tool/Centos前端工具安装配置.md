#### 全新服务器前端工具安装配置

#####  `系统` centos

> 查看系统版本号:  cat /etc/redhat-release ， [How to Check CentOS Version](<https://www.thegeekdiary.com/how-to-check-centos-version/>) 

##### 1. NVM 

```
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
或者
$ wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
```

##### 2. NodeJs

```
nvm install 10.15.3 # node版本
```

##### 3. 常用nrm , yarn, pm2等

```
1. npm install -g nrm yarn pm2
2. nrm add lux [url] # url 为仓库地址 
3. nrm use lux # 切换为私有仓库
```

##### 4. nginx [安装](<https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-centos-7>)

```
yum install epel-release
yum install nginx
```

##### 5.其他非必须 mongodb[安装](<https://tecadmin.net/install-mongodb-on-centos/>), redis[安装](<https://www.digitalocean.com/community/tutorials/how-to-install-secure-redis-centos-7>)

```
vi /etc/yum.repos.d/mongodb.repo

[MongoDB]
name=MongoDB Repository
baseurl=http://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/4.0/x86_64/
gpgcheck=0
enabled=1

yum install mongodb-org
```

```
yum install epel-release

yum install redis -y
```



