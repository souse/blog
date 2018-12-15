> 1. [keep-alive 缓存讲解](https://www.jianshu.com/p/04d8017b56ff)
> 2. [vue生命周期探究](https://segmentfault.com/a/1190000008879966)

##### vue 文档总结
```
不要在选项属性或回调上使用箭头函数，
比如 created: () => console.log(this.a) 或 vm.$watch('a', newValue => this.myMethod())。
因为箭头函数是和父级上下文绑定在一起的，this 不会是如你所预期的 Vue 实例，
经常导致 Uncaught TypeError: Cannot read property of undefined 或 Uncaught TypeError: this.myMethod is not a function 之类的错误。
```

###### 注意事项
由于 JavaScript 的限制，Vue 不能检测以下变动的数组：

当你利用索引直接设置一个项时，例如：vm.items[indexOfItem] = newValue
当你修改数组的长度时，例如：vm.items.length = newLength
举个例子：

```javascript
var vm = new Vue({
  data: {
    items: ['a', 'b', 'c']
  }
})
vm.items[1] = 'x' // 不是响应性的
vm.items.length = 2 // 不是响应性的
```
为了解决第一类问题，以下两种方式都可以实现和 
vm.items[indexOfItem] = newValue 相同的效果，同时也将触发状态更新：
```javascript
// Vue.set
Vue.set(vm.items, indexOfItem, newValue)
// Array.prototype.splice
vm.items.splice(indexOfItem, 1, newValue)
```
你也可以使用 vm.$set 实例方法，该方法是全局方法 Vue.set 的一个别名：
```javascript
vm.$set(vm.items, indexOfItem, newValue)
```
为了解决第二类问题，你可以使用 splice：
```javascript
vm.items.splice(newLength)
```
