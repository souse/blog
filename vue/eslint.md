##### package.json，内部提交校验
```
...
"scripts": {
  "lint": "vue-cli-service lint --fix",
},
"gitHooks": {
"pre-commit": "lint-staged"
},
"lint-staged": {
"*.js": [
  "vue-cli-service lint",
  "git add"
],
"*.vue": [
  "vue-cli-service lint",
  "git add"
]
},
  
...
```

##### .eslintrc.js
```javascript
module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'eslint:recommended', // @vue/cli-plugin-eslint
    'plugin:prettier/recommended', // eslint-plugin-prettier
    'plugin:vue/recommended' // @vue/eslint-config-prettier
  ],
  rules: {
    'no-console': 'off',
    'no-unused-vars': [
      'error',
      { vars: 'all', args: 'none', ignoreRestSiblings: false }
    ],
    'vue/max-attributes-per-line': [ 
      'error',
      {
        singleline: 3,
        multiline: {
          max: 1,
          allowFirstLine: false
        }
      }
    ],
    'vue/require-default-prop': true, // 对于prop 需要默认值
    'vue/no-v-html': false,
    'vue/html-self-closing': false, // 避免和 eslint-plugin-prettier 关闭此配置
    'prettier/prettier': [
      'error',
      {
        semi: true,
        tabWidth: 2,
        singleQuote: true,
        trailingComma: 'none',
        bracketSpacing: true,
        jsxBracketSameLine: false, // jsx > 是否另起一行
        arrowParens: 'avoid',
        proseWrap: 'preserve'
      }
    ]
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
};

```