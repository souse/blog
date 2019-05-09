##### 1. 目录结构
    ── src
    ├── api                  # 域名以及请求封装目录
    │   ├── index.js
    │   └── ...
    ├── assets               # 静态资源目录
    │   ├── css
    │   ├── js
    │   └── images
    ├── components           # 功能业务组件文件夹
    │   ├── common
    │   │   └── footer.vue
    │   └── share            
    │       ├── wx-config.vue   
    │       └── index.vue
    ├── directive            # 指令目录
    ├── filters              # 过滤器目录
    ├── mock                 # mock数据目录
    ├── plugins              # 外部插件目录  -- 非必须
    │       └── vant.js
    ├── router               # routers 目录
    │   └── index.js
    │   └── routers
    │       └── common.js
    ├── service              # 后台接口调用封装目录
    │   └── index.js
    ├── store                # store 目录
    ├── ├── hospital 
    │   │   ├── index.js
    │   |   ├── getters.js
    │   └── common
    │       ├── action.js
    │       ├── getters.js
    │       ├── index.js
    │       ├── mutation-types.js
    │       └── mutations.js
    ├── utils                # 公用方法目录
    │       ├── index.js
    │       └── mixins
    ├── views                # view 目录
    │   ├── hospital
    │   │   └── join-org.vue
    │   └── common
    │       └── basic.vue
    ├── App.vue
    └── main.js

> **1. 文件夹全部小写，如果多个单词的 eg: test-demo，尽量名称在两个单词内。**  
> **2. views，components 文件夹内要有index.vue, index.js (非必须)，其他文件名大驼峰 eg: test-demo.vue。**  
> **3. 其他目录内文件名保证小驼峰命名 eg: testDemo.js**

##### 公用库 ts 按着typescript库规则开发。

##### 2. VUEX 使用
    ── store
    ├── index.js           # 我们组装模块并导出 store 的地方
    ├── actions.js         # 根级别的 action
    ├── mutations.js       # 根级别的 mutation
    ├── mutation-types.js  # 根级别的 方便actions，mutations 内方法定义
    ├── modulesA
    │   ├── index.js           
    │   ├── actions.js         
    │   ├── mutations.js       
    │   └── mutation-types.js
    └── modulesB
    │   ├── index.js           
    │   ├── actions.js         
    │   ├── mutations.js       
    │   └── mutation-types.js
> modulesA, modulesB 需要定义命名空间 **namespaced: true**

```
store 错误使用方式
this.$store.state.previewData.title

store 的使用方式统一

store/base/index.js

{
    namespaced: true,
}
//======================
store/index.js

import base from './base';

modules: {
    base
}

//======================
test.vue

import { mapState, mapActions, mapMutations } from 'vuex';

computed: {
    ...mapState('base', {
        hospitalsTypes: state => state.hospitalsTypes,
        hospitalsLevels: state => state.hospitalsLevels
    }),
}

methods: {
    ...mapActions('base', ['_getHospitalsTypes', '_getHospitalsLevels']),
}


```

##### 3. js vue 相关规范 
```javascript
1. 注释
  a. 单行注释 // 这是注释
  b. 多行注释 
    /** 
     ** 注释信息展示 
    **/
2. 其他会在eslint中体现
```
##### 4. CSS命名规范 多单词必带中划线 xx-xx-xx
> 1. 全局样式 g-xxx
> 2. 组件的命名空间  
>   a. 公用业务组件 业务名-container , eg: dialog-container  
>   b. 功能组件     业务名-container , eg: hospital-search-container

##### 5. [eslint](<https://github.com/souse/blog/blob/master/vue/eslint.md>)

