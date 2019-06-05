### linux下安装node

> 1. 下载稳定版 v6.10.3 到本地

  &emsp;&emsp;```wget https://nodejs.org/dist/v6.10.3/node-v6.10.3-linux-x64.tar.xz```
  
> 2. 下载完成后, 将其解压

&emsp;&emsp;```tar xvJf node-v6.10.3-linux-x64.tar.xz```

> 3. 将解压的 Node.js 目录移动到 /usr/local 目录下

&emsp;&emsp;```mv node-v6.10.3-linux-x64 /usr/local/node-v6```

> 4. 配置 node 软链接到 /bin 目录

&emsp;&emsp;```ln -s /usr/local/node-v6/bin/node /bin/node```

> 5. 配置和使用 npm

&emsp;&emsp;```ln -s /usr/local/node-v6/bin/npm /bin/npm```

> 6. 配置环境变量

&emsp;&emsp;```echo 'export PATH=/usr/local/node-v6/bin:$PATH' >> /etc/prof```

> 7. 生效环境变量

&emsp;&emsp;```source /etc/profile```

`软连不是最好的， 也可以这么来`[Installing NodeJs](https://computingforgeeks.com/installing-node-js-10-lts-on-centos-7-fedora-29-fedora-28/)
