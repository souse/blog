#### 1. 无密访问配置
```
1. cd ~/.ssh  
# 查看当前目录公私钥文件 
# ssh-keygen  如无 则生成

2. 上传公钥到服务器
ssh-copy-id -i [公钥文件] user@host 
# user是你的ssh的用户，host是服务器地址，这时候还要输入密码。
# 例子：ssh-copy-id -i id_rsa.pub root@255.255.255.255

3. ssh-add（可有可无）
ssh-add -K [非.pub结尾的文件] 
# 例如，ssh-add -K id_rsa

3步结束后 可 ssh root@255.255.255.255 无密访问
```
#### 2. 多个ssh配置
```
1. touch  ~/.ssh/config

2. 通过vim编辑config，添加服务器配置信息

Host drank                      // 服务器别名
Hostname 192.168.1.55           // 服务器地址
User admin                      // 服务器用户
Identityfile ~/.ssh/id_rsa      // 服务器公钥对应的【本地私钥】

Host souse                      // 服务器别名
Hostname 192.168.1.55           // 服务器地址
User admin                      // 服务器用户
Identityfile ~/.ssh/id_rsa      // 服务器公钥对应的【本地私钥】
```

```
其他通过密钥进
ssh -i xxx.pem root@255.155.255.255
```
