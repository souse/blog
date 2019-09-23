#### 前端: lerna 包管理

##### 序

> 前端组件化开发的过程中会有很多公用业务组件，非业务组件，其中不乏有组件依赖组件的现象。
>
> 一个包升级，其他包都得手动升级，为了解决这种依赖嵌套问题，lerna给出了很好的方案，下面
>
> 是围绕learn来讲一些其使用规则。

##### lerna介绍

> 用于管理多个JavaScript包的工具，自动处理各个package之间的依赖关系，自动发布。

##### 安装

```
$ npm install -g lerna
或者
$ yarn global add lerna
```

##### 初始化项目

```
$ lerna init #默认固定模式(Fixed mode)，packages下的所有包共用一个版本号(version)
$ lerna init --independent #独立模式(Independent mode)，每一个包有一个独立的版本号
```

> 初始完成后默认是 每个包都有自己node_modules，可以通过如下配置达到只有一个node_modules，

``` json
// 根目录
// package.json内添加属性
"private": true,
"workspaces": [
  "packages/*"
],
// lerna.json
"useWorkspaces": true,
"npmClient": "npm", // 默认就是npm，可以自行换yarn

```

* package.json

```json
{
  "name": "root",
  "private": true,
  "workspaces": [
    "packages/*",
    "packages/@pica-h5/*"
  ],
  "devDependencies": {
    "lerna": "^3.16.4"
  }
}
```

* learn.json

```json
{
  "packages": [
    "packages/*"
  ],
  "version": "independent",
  "useWorkspaces": true,
  "npmClient": "npm",
  "command": {
    "publish": {
      "ignoreChanges": [
        "ignored-file",
        "*.md"
      ],
      "message": "chore(release): publish"
    },
    "bootstrap": {
      "ignore": "component-*"
    }
  }
}
```



##### 初始化包 & 添加包依赖 & 导入本地包 <font size=2 color="888">在根目录下操作</font>

* **初始化**

```shell
# 添加package
$ lerna create pica-demo1 # pica-demo1包会放在 packages 下面
$ lerna create date-picker packages/@pica-h5 # @pica-h5文件夹必须先存在，且需在 package.json 中 workspaces 数组中新增 "packages/@pica-h5/*"
```

* **添加包依赖**

```shell
# 增加package 依赖
# 增加本地或者远程package做为当前项目packages里面的依赖
$ lerna add <package>[@version] [--dev] [--exact]
# --dev devDependencies 替代 dependencies
# --exact 安装准确版本，eg: "^1.0.0" ➜ "1.10.0"

# 添加 pica-demo1 到所有包 除了他自己
$ lerna add pica-demo1

# 添加 pica-demo1 到所有以pica-demo开头的包中
$ lerna add pica-demo1 packages/pica-demo*

# 添加 pica-demo1 到包 pica-demo2 的开发环境依赖，可去除 --dev
$ lerna add pica-demo1 --scope=pica-demo2 --dev
```

* **导入本地包**

```shell
$ lerna import <path-to-external-repository>
$ lerna import /user/.../package-name # 当前learn 项目必须提交过
```

##### 发布

```javascript
$ lerna publish // 根据提示一步步操作即可
```

> 会打tag，上传git，上传npm

##### 其他操作

```javascript
// 查看包列表
$ lerna list
// 卸载包
$ lerna exec -- <command> [..args] // 在所有包中运行该命令
eg: 
$ lerna exec --scope=pica-demo1  yarn remove pica-demo2 // 将 pica-demo1 中 pica-demo2移除
$ lerna exec -- yarn remove vue // 卸载所有包中vue
// 包是否发生过变更
lerna diff // or lerna update
// 清理 node_modules
lerna clean
// run package script
eg:
$ lerna run build // 执行所有包的 build 命令
$ lerna run --scope pica-demo1 test // 运行 pica-demo1 模块下的 test
// 软链
$ lerna link //  同 npm run link
```

##### learn.json说明

```json
{
  "version": "1.0.0",
  "packages": [
    "packages/*",
    "packages/@pica-h5"
  ],
  "npmClient": "npm",
  "publish": {
    "ignoreChanges": [
      "ignored-file",
      "*.md"
    ]
  }
}
```

> version：当前库的版本
> packages：指定包所在的目录
> npmClient： 允许指定命令使用的client， 默认是 npm
> command.publish.ignoreChanges：可以指定那些目录或者文件的变更不会被publish

##### 总结

**<font face="微软雅黑" color="#888" size=2>多包管理过程中，推荐使用 independent模式，不用每次升级一个包版本时其他包也被动升级。可以借助工具做 eslint校验, prettier格式化代码，提交代码hook检查等。</font>**

