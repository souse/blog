##### MYSQL

###### 1. 安装

```shell
1. wget https://dev.mysql.com/get/mysql80-community-release-el7-3.noarch.rpm
2. rpm -ivh mysql80-community-release-el7-3.noarch.rpm
3. 初始化：
		yum install mysql-server
4. 启动：
		systemctl start mysqld.service
5. 重置密码：
		I: mysql -u root
		（登录时有可能报这样的错：ERROR 2002 (HY000): Can‘t connect to local MySQL server through socket ‘/var/lib/mysql/mysql.sock‘ (2)，原因是/var/lib/mysql的访问权限问题。下面的命令把/var/lib/mysql的拥有者改为当前用户：）
		II: sudo chown -R openscanner:openscanner /var/lib/mysql
	  III: mysql > use mysql;
	  			mysql > update user set password=password(‘123456‘) where user=‘root‘;
	  			mysql > exit;
6. 有问题在处理
```

###### 2. 创建数据库

```sql
mysqladmin -u root -p create cnpmjs
```



##### CNPM 安装配置

###### 1. 安装

```
npm i -g cnpmjs.org
or
git clone https://github.com/cnpm/cnpmjs.org.git
```

###### 2. 配置config

```javascript
cd 到 cnpmjs.org 目录
修改配置 config/index.js

/*
 * server configure //服务器配置
 */
 
registryPort: 7001,         //仓库访问端口（执行发布安装）
webPort: 7002,              //展示查询站点访问端口
bindingHost: '',   //监听绑定的 Host，默认127.0.0.1，外网访问注释掉此项即可


/**
* database config //数据库相关设置
*/

database: {
    db: 'cnpmjs',      //数据库名称
    username: 'root',       //数据库访问账号
    password: '123456',           //数据库访问密码
    
    // the sql dialect of the database
    // - currently supported: 'mysql', 'sqlite', 'postgres', 'mariadb'
    dialect: 'mysql',       //使用数据库，默认sqlite，这里我们改成mysql
    
    // custom host; default: 127.0.0.1
    host: '127.0.0.1',      //数据库访问IP，通常127.0.0.1
    
    // custom port; default: 3306
    port: 3306,             //数据库访问端口，通常3306
    
    
// 模块文件存储，默认将发布的私有模块跟缓存公共模块存储在本地文件系统中，路径~/.cnpmjs.org/nfs ,也就是模块文件都存储在这个目录下；或者可以选择三方储存方式比如七牛等，着这里配置插件；也支持接口开发扩展储存；

nfs: require('fs-cnpm')({
    dir: path.join(dataDir, 'nfs')
}),
    
// registry url name //模块注册列表访问域名，默认r.cnpmjs.org，安装模块时会到这个域名下查找，这个默认设置略坑，建议没有外网域名的先清空回头再配
registryHost: '',


// default system admins    //默认管理员账号
  admins: {
    // name: email
    //fengmk2: 'fengmk2@gmail.com',
    admin: 'admin@cnpmjs.org',
    //dead_horse: 'dead_horse@qq.com',
  },
  
 
/*
 * registry mode config  私有模块发布相关配置
*/

  //是否开启私有模式，默认为 false；
  //私有模式下只有管理员能发布模块，其他账号只有同步权限
  //非私有模式，注册用户都可以发布模块
  enablePrivate: false, 

  // registry scopes
  //若为非私有模式发布则此项必填，非管理员发布模块式命名必须以scopes字段开头，模块命名示例“@cnpm/packagename”
  //更多了解npm-scope请查阅https://docs.npmjs.com/misc/scope
  scopes: [ '@cnpm', '@cnpmtest', '@cnpm-test' ],

  // 私有模块非scopes白名单，各种非以scope方式发布的老模块的白名单管理，数组形式维护
  privatePackages: [],


/**
* sync configs 同步源仓库相关设置
*/

//npm官方registry地址，不会直接从这个地址同步模块，但有时会从这里获取模块信息，除非必要请勿更改
officialNpmRegistry: 'https://registry.npmjs.com',
officialNpmReplicate: 'https://replicate.npmjs.com',

//同步模块上游registry地址
sourceNpmRegistry: 'https://registry.npm.taobao.org',

//上游registry是否是cnpm，默认true，若要使用npm官方地址作为同步上游，请设置为false
sourceNpmRegistryIsCNpm: true,

//若安装时模块不存在，是否向源registry进行同步，默认true
syncByInstall: true,

// 同步模式选项
// none: 不进行同步，只管理用户上传的私有模块，公共模块直接从上游获取
// exist: 只同步已经存在于数据库的模块
// all: 定时同步所有源registry的模块
syncModel: 'exist', // 'none', 'all', 'exist'

// 同步时间间隔，默认10分钟
syncInterval: '10m',


// 是否同步模块中devDependencies，默认false
syncDevDependencies: false,

//用户账号系统接入，可以扩展接入公司的账号系统
//本文暂不涉及，详见https://github.com/cnpm/cnpmjs.org/wiki/Use-Your-Own-User-Authorization
userService: null,

//另外一个比较坑的默认设置,默认false，踩坑记录里详细说
enableAbbreviatedMetadata: true,
```

###### 3. 配置数据库

```sql
> mysql use cnpmjs;
> mysql docs/db.sql;
> show tables; // 查看16个表是否导入完全
```

###### 4. 配置主页

* `services/package.js`文件中添加方法：

```javascript
/**
 * 显示所有的模块
 */
exports.listAllModules = function* () {
  var rows = yield Module.findAll({
    attributes: [
      'name', 'description', 'version',
    ]
  });
  return rows;
};
```

* 添加`controllers/web/package/list_all.js`文件。内容：

```javascript
'use strict';

var packageService = require('../../../services/package');

module.exports = function* listAllModules() {
  var tasks = {};

  tasks = packageService.listAllModules()

  var packages = yield tasks;
  yield this.render('all', {
    title: 'all packages',
    packages: packages
  });
};
```

* 在`routes/web.js`文件中添加路由处理：

```javascript
// 首先引入方法
var listAll = require('../controllers/web/package/list_all');
// 再添加路由处理
app.get('/all', listAll)
```

* 在首页的总数中添加超链接，直接跳转到列表页面。更改`public/js/readme.js`文件：

```javascript
$('#total-packages').html(${humanize(data.doc_count)});
// 更改为
$('#total-packages').html(`<a href="/all">${humanize(data.doc_count)}</a>`);
```

* 添加`view/web/all.html`文件，内容如下：

```javascript
<style>
  #all .package {
    padding: 10px;
    font-size: 18px;
    border-bottom: 1px solid #ddd;
  }
  
  #all .alert a {
    font-size: 20px;
  }

  #all .package-description {
    margin: 0.5em 0;
    font-size: 16px;
  }
  
</style>
  <div id="all">
      <h1>All packages</h1>
      <% if (!packages.length) { %>
      <div class="alert alert-warning">
        no package
      </div>
      <% } else {%>
        <% for (var i = 0; i < packages.length; i++) {
          var item = packages[i];
        %>
        <div class="package">
          <a href="/package/<%= item.name %>" class="package-name"><%= item.name %></a>
          <p class="package-description"><%= item.description %></p>
        </div>
        <% } %>
      <% } %>
  </div>
```

* 添加自定义readme文件（配置文件`config/index.js`中更改）

```javascript
// 自定义首页显示的readme文件
customReadmeFile: 'docs/web/custome_readme.md', // you can use your custom readme file instead the cnpm one
```

[请参考](http://gehaiqing.com/blog/2019/10/21/cnpmjs-build-private-registry/)

###### 5. 发布scope包

```shell
npm init --scope=scopename
# 作用域模块默认发布是私有的，这时如果要发布成公用模块，添加 access=public 参数
npm publish --access=public
```



[参考1](https://zhuanlan.zhihu.com/p/35773211)

[参考2主页配置](http://gehaiqing.com/blog/2019/10/21/cnpmjs-build-private-registry/)

[参考3 scope包](http://huang-x-h.github.io/2016/06/09/using-npm-scoped-package/)

