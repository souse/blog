##### 发布NPM包

###### 1. 创建npm账号

```
注册一个npm账号
命令行工具添加账号(npm adduser)
```

###### 2. 创建一个node的模块

```
npm init (注意创建模块前，先去npm官网确认模块名是否未被占用)
```

> log
>
> ```
> name: (npm-demo) test-publish-npm
> version: (1.0.0) 0.0.0
> description: npm test
> entry point: (index.js) 
> test command: make test
> git repository: 
> keywords: npm test demo
> author: souse
> license: (ISC) 
> ```

###### 3. 发布npm包

```
1.npm publish . (基于当前目录进行发布)
```

> log
>
> ```
> npm notice
> npm notice 📦  web-buried-point@1.0.4
> npm notice === Tarball Contents ===
> npm notice 758B  package.json
> npm notice 54B   LICENSE
> npm notice 1.5kB README.md
> npm notice 1.6kB lib/index.js
> npm notice 783B  src/buried-error.js
> npm notice 1.4kB src/index.js
> npm notice 1.3kB src/send-data.js
> npm notice 238B  src/util.js
> npm notice === Tarball Details ===
> npm notice name:          web-buried-point
> npm notice version:       1.0.4
> npm notice package size:  3.4 kB
> npm notice unpacked size: 7.6 kB
> npm notice shasum:        6dd1ff0e220aa91fb71e924d90f305434572e45e
> npm notice integrity:     sha512-yuxnLbLMI/jZL[...]4C7fCAlFhZXhw==
> npm notice total files:   8
> npm notice
> + web-buried-point@1.0.4
> ```

###### 4. 包升级

```
每次update自己代码 需要publish的需要更改一下package.json中 version 版本号再 npm publish
```
