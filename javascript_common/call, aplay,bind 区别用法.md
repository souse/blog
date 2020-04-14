###### call, apply, bind 区别用法

> call、apply、bind的作用是改变函数运行时this的指向

```javascript
1. call 方法第一个参数是要绑定给this的值，后面传入的是一个参数列表。当第一个参数为null、undefined的时候，默认指向window。

eg:
var obj = {
    message: 'My name is: '
};

function getName(firstName, lastName) {
    console.log(this.message + firstName + ' ' + lastName)
}

// 此时obj 绑定给了this this.message 值为 'My name is'
getName.call(obj, 'Zhang', 'San'); 

```

```javascript
2. apply接受两个参数，第一个参数是要绑定给this的值，第二个参数是一个参数数组。当第一个参数为null、undefined的时候，默认指向window。

eg:
var obj = {
    message: 'My name is: '
};

function getName(firstName, lastName) {
    console.log(this.message + firstName + ' ' + lastName)
}

// 注意参数传值方式
getName.apply(obj, ['Zhang', 'San']);

```



> 可以看到，obj 是作为函数上下文的对象，函数 getName 中 this 指向了 obj 这个对象。参数 firstName 和 lastName 是放在数组中传入 getName 函数。
>
> ```javascript
> call和apply可用来借用别的对象的方法。
> eg:
> var Person1  = function () {
>     this.name = 'Demo';
> }
> var Person2 = function () {
>     this.getname = function () {
>         console.log(this.name);
>     }
>     Person1.call(this); // 此时Person2继承了name属性
> }
> var person = new Person2();
> person.getname();
> 
> ```



```javascript
3. bind和call很相似，第一个参数是this的指向，从第二个参数开始是接收的参数列表。区别在于bind方法返回值是函数以及bind接收的参数列表的使用。

bind返回值是函数， eg:
var obj = {
    name: 'Tom'
};

function printName() {
    console.log(this.name)
}

var dom = printName.bind(obj); // dom is a function

上面demo中 bind 方法不会立即执行，而是返回一个改变了上下文 this 后的函数。而原函数 printName 中的 this 并没有被改变，依旧指向全局对象 window。

参数使用 eg:
function fn(a, b, c) {
    console.log(a, b, c);
}
var fn1 = fn.bind(null, 'Eom');

fn('A', 'B', 'C');            // A B C
fn1('A', 'B', 'C');           // Eom A B
fn1('B', 'C');                // Eom B C
fn.call(null, 'Eom');         // Eom undefined undefined

call 是把第二个及以后的参数作为 fn 方法的实参传进去，而 fn1 方法的实参实则是在 bind 中参数的基础上再往后排。

eg: 
var obj = {
    message: 'test',
    showMessage: function (event) {
        console.log(this.message, event.type);
    }
};
var dom = document.getElementById('btn');
dom.addEventlistener('click', showMessage.bind(obj)); // 此时showMessage中的this指向obj

###### 实现一个bind
if (!Function.prototype.bind) {
    Function.prototype.bind = function () {
        var self = this,                        // 保存原函数
            context = [].shift.call(arguments), // 保存需要绑定的this上下文
            args = [].slice.call(arguments);    // 剩余的参数转为数组
        return function () {                    // 返回一个新函数
            self.apply(context, [].concat.call(args, [].slice.call(arguments)));
        }
    }
}
```

```javascript
汇总
1. bind返回对应函数, 便于稍后调用； apply, call则是立即调用。
2. 在 ES6 的箭头函数下, call 和 apply 将失效, 对于箭头函数来说:

Function.prototype.call2 = function(context) {
  context = context || window;
  context.fn = this;

  var args = [];

  for (var i = 1; i < arguments.length; i++) {
    args.push('arguments[' + i + ']');
  }

  var result = eval('context.fn('+ args +')');
  delete context.fn;

  return result;
};

Function.prototype.apply2 = function (context, args) {
  context = Object(context) || window;
  context.fn = this;

  var result;
  if (args) {
    result = context.fn(args);
  } else {
    var arr = [];

    for (let i = 0; i < args.length; i++) {
      arr.push('arr[' + i + ']');
    }
    result = eval('context.fn(' + arr + ')');
  }

  delete context.fn;
  return  result;
}

```

>延伸阅读
>
>1. 箭头函数体内的 this 对象, 就是定义时所在的对象, 而不是使用时所在的对象;所以不需要类似于`var _this = this`这种丑陋的写法
>2. 箭头函数不可以当作构造函数，也就是说不可以使用 new 命令, 否则会抛出一个错误
>3. 箭头函数不可以使用 arguments 对象,，该对象在函数体内不存在. 如果要用, 可以用 Rest 参数代替
>4. 不可以使用 yield 命令, 因此箭头函数不能用作 Generator 函数。[Generator 函数](https://link.jianshu.com/?t=http%3A%2F%2Fwww.ruanyifeng.com%2Fblog%2F2015%2F04%2Fgenerator.html)、[Generator 函数的异步应用](https://link.jianshu.com/?t=http%3A%2F%2Fes6.ruanyifeng.com%2F%23docs%2Fgenerator-async)
