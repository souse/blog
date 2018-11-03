##### Yeoman搭建脚手架 eg: webpack-react

###### 安装全局依赖

``` 
npm install -g yo
```

###### npm创建项目(generator-webpack-react)

```
(略)
```

###### 安装插件

```
cd generator-webpack-react
npm install -S chalk yeoman-generator yosay
```

> ``` 
> mkdir app && cd app
> touch index.js
> mkdir templates
> ```
>
> index.js 脚手架生成器配置
>
> app/templates 文件夹为脚手架模板文件夹

###### index.js 内容

```javascript
var path = require('path');
var chalk = require('chalk');
var util = require('util');

var Generator = require('yeoman-generator');
var yosay = require('yosay');
var path = require('path');

// 导出模块，使得yo xxx能够运行
module.exports = class extends Generator {
    initializing() {
        this.props = {};
    }
    // 询问用户，根据答案生成不同模板的脚手架
    prompting() {
        var questions = [
            {
                type: 'input',
                name: 'name',
                message: 'package name',
                default: 'react-project',
            },
            {
                type: 'input',
                name: 'version',
                message: 'version',
                default: '0.0.1',
            },
            {
                type: 'input',
                name: 'description',
                message: 'description',
                default: 'a react project ...',
            },
            {
                type: 'input',
                name: 'author',
                message: 'author',
                store: true, // 记住用户的选择
                default: 'souse',
            },
        ];

        return this.prompt(questions).then(
            function(answers) {
                for (var item in answers) {
                    // 把answers里的内容绑定到外层的this，便于后面的调用
                    answers.hasOwnProperty(item) && (this.props[item] = answers[item]);
                }
            }.bind(this),
        );
    }
    // 拷贝文件，搭建脚手架
    writing() {
        this.fs.copy(this.templatePath('src'), this.destinationPath('src'));
        this.fs.copy(this.templatePath('build'), this.destinationPath('build'));
        this.fs.copy(this.templatePath('index.html'), this.destinationPath('index.html'));
        this.fs.copy(this.templatePath('README.md'), this.destinationPath('README.md'));
        this.fs.copy(this.templatePath('.babelrc'), this.destinationPath('.babelrc'));
        this.fs.copy(this.templatePath('.editorconfig'), this.destinationPath('.editorconfig'));
        this.fs.copy(this.templatePath('.eslintrc.js'), this.destinationPath('.eslintrc.js'));
        this.fs.copy(this.templatePath('.gitignore'), this.destinationPath('.gitignore'));
        this.fs.copy(this.templatePath('.prettierrc'), this.destinationPath('.prettierrc'));

        // copyTpl 可以渲染变量
        this.fs.copyTpl(this.templatePath('package.json'), this.destinationPath('package.json'), {
            name: this.props.name,
            version: this.props.version,
            description: this.props.description,
            author: this.props.author,
        });
    }
    // 安装依赖 如果不需要安装依赖可以注销此方法
    install() {
        this.installDependencies({
            yarn: { force: true },
            bower: false,
            npm: false,
        });
    }
    // 生成脚手架后，进行的一些处理
    end() {
        this.log(yosay('Your app has been created successfully!'));
    }
};
```

###### 最后

> ```
> cd generator-webpack-react 
> npm link//将模块link到`/usr/local/lib/node_modules`下并建立链接
> ```

```
上传 
npm login / npm adduser
npm publish
```

###### demo 项目
[generator-webpack-react](https://github.com/souse/generator-webpack-react)
