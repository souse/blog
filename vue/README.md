> 1. [keep-alive 缓存讲解](https://www.jianshu.com/p/04d8017b56ff)
> 2. [vue生命周期探究](https://segmentfault.com/a/1190000008879966)

#### vue 文档总结
```
不要在选项属性或回调上使用箭头函数，
比如 created: () => console.log(this.a) 或 vm.$watch('a', newValue => this.myMethod())。
因为箭头函数是和父级上下文绑定在一起的，this 不会是如你所预期的 Vue 实例，
经常导致 Uncaught TypeError: Cannot read property of undefined 或 Uncaught TypeError: this.myMethod is not a function 之类的错误。
```

##### 注意事项
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

##### 对象更改检测注意事项
还是由于 JavaScript 的限制，Vue 不能检测对象属性的添加或删除：
```javascript
var vm = new Vue({
  data: {
    a: 1
  }
})
// `vm.a` 现在是响应式的

vm.b = 2
// `vm.b` 不是响应式的
```
对于已经创建的实例，Vue 不能动态添加根级别的响应式属性。
但是，可以使用 Vue.set(object, key, value) 方法向嵌套对象添加响应式属性。例如，对于：

```javascript
var vm = new Vue({
  data: {
    userProfile: {
      name: 'Anika'
    }
  }
})
```
你可以添加一个新的 age 属性到嵌套的 userProfile 对象：
```javascript
Vue.set(vm.userProfile, 'age', 27)
```
你还可以使用 vm.$set 实例方法，它只是全局 Vue.set 的别名：

```javascript
vm.$set(vm.userProfile, 'age', 27)
```
```
有时你可能需要为已有对象赋予多个新属性，比如使用 Object.assign() 
或 _.extend()。在这种情况下，你应该用两个对象的属性创建一个新的对象。
所以，如果你想添加新的响应式属性，不要像这样：
```

```javascript
Object.assign(vm.userProfile, {
  age: 27,
  favoriteColor: 'Vue Green'
})
```
你应该这样做：
```javascript
vm.userProfile = Object.assign({}, vm.userProfile, {
  age: 27,
  favoriteColor: 'Vue Green'
})
```
##### [事件修饰符](https://cn.vuejs.org/v2/guide/events.html#%E4%BA%8B%E4%BB%B6%E4%BF%AE%E9%A5%B0%E7%AC%A6)

.stop .prevent .capture .self .once .passive
```javascript
在事件处理程序中调用 event.preventDefault() 或 event.stopPropagation() 是非常常见的需求。
尽管我们可以在方法中轻松实现这点，但更好的方式是：方法只有纯粹的数据逻辑，而不是去处理 DOM 事件细节。

<!-- 阻止单击事件继续传播 -->
<a v-on:click.stop="doThis"></a>

<!-- 提交事件不再重载页面 -->
<form v-on:submit.prevent="onSubmit"></form>

<!-- 修饰符可以串联 -->
<a v-on:click.stop.prevent="doThat"></a>

<!-- 只有修饰符 -->
<form v-on:submit.prevent></form>

<!-- 添加事件监听器时使用事件捕获模式 -->
<!-- 即元素自身触发的事件先在此处理，然后才交由内部元素进行处理 -->
<div v-on:click.capture="doThis">...</div>

<!-- 只当在 event.target 是当前元素自身时触发处理函数 -->
<!-- 即事件不是从内部元素触发的 -->
<div v-on:click.self="doThat">...</div>
```
```
使用修饰符时，顺序很重要；相应的代码会以同样的顺序产生。
因此，用 v-on:click.prevent.self 会阻止所有的点击，而 v-on:click.self.prevent 只会阻止对元素自身的点击。

```
##### [v-model 修饰符](https://cn.vuejs.org/v2/guide/forms.html#%E4%BF%AE%E9%A5%B0%E7%AC%A6)
> [v-model 组件上使用](https://cn.vuejs.org/v2/guide/components.html#%E5%9C%A8%E7%BB%84%E4%BB%B6%E4%B8%8A%E4%BD%BF%E7%94%A8-v-model)
> [$emit v-on:event](https://cn.vuejs.org/v2/guide/components.html#%E4%BD%BF%E7%94%A8%E4%BA%8B%E4%BB%B6%E6%8A%9B%E5%87%BA%E4%B8%80%E4%B8%AA%E5%80%BC)
> [自定义组件的 v-model](https://cn.vuejs.org/v2/guide/components-custom-events.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BB%84%E4%BB%B6%E7%9A%84-v-model)

###### [基础组件的自动化全局注册](https://cn.vuejs.org/v2/guide/components-registration.html#%E5%9F%BA%E7%A1%80%E7%BB%84%E4%BB%B6%E7%9A%84%E8%87%AA%E5%8A%A8%E5%8C%96%E5%85%A8%E5%B1%80%E6%B3%A8%E5%86%8C)

###### [具名插槽](https://cn.vuejs.org/v2/guide/components-slots.html#%E5%85%B7%E5%90%8D%E6%8F%92%E6%A7%BD)

###### [访问父级组件实例](https://cn.vuejs.org/v2/guide/components-edge-cases.html#%E8%AE%BF%E9%97%AE%E7%88%B6%E7%BA%A7%E7%BB%84%E4%BB%B6%E5%AE%9E%E4%BE%8B)

###### [问子组件实例或子元素](https://cn.vuejs.org/v2/guide/components-edge-cases.html#%E8%AE%BF%E9%97%AE%E5%AD%90%E7%BB%84%E4%BB%B6%E5%AE%9E%E4%BE%8B%E6%88%96%E5%AD%90%E5%85%83%E7%B4%A0)

###### [依赖注入](https://cn.vuejs.org/v2/guide/components-edge-cases.html#%E4%BE%9D%E8%B5%96%E6%B3%A8%E5%85%A5)

###### [程序化的事件侦听器](https://cn.vuejs.org/v2/guide/components-edge-cases.html#%E7%A8%8B%E5%BA%8F%E5%8C%96%E7%9A%84%E4%BA%8B%E4%BB%B6%E4%BE%A6%E5%90%AC%E5%99%A8)

###### [组件之间的循环引用](https://cn.vuejs.org/v2/guide/components-edge-cases.html#%E7%BB%84%E4%BB%B6%E4%B9%8B%E9%97%B4%E7%9A%84%E5%BE%AA%E7%8E%AF%E5%BC%95%E7%94%A8)
> 对于A中有B B中有A的组件，异步加载引用

##### [混入](https://cn.vuejs.org/v2/guide/mixins.html)

##### [自定义指令](https://cn.vuejs.org/v2/guide/custom-directive.html)

##### [事件 & 按键修饰符](https://cn.vuejs.org/v2/guide/render-function.html#%E4%BA%8B%E4%BB%B6-amp-%E6%8C%89%E9%94%AE%E4%BF%AE%E9%A5%B0%E7%AC%A6)









