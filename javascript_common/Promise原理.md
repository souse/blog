###### Promise: 
* [Promise原理](https://segmentfault.com/a/1190000009478377)
* [实现一个完美符合Promise/A+规范的Promise](https://github.com/forthealllight/blog/issues/4)
* [解读Promise内部实现原理](https://juejin.im/post/5a30193051882503dc53af3c)
* [Promise原理及实现 #180 ](https://github.com/louzhedong/blog/issues/180)

> 简单实现下 方便理解
```javascript
/* eslint-disable */
export default class PromiseH {
  static PENDING = 'pending';
  static FULFILLED = 'fulfilled';
  static REJCET = 'reject';

  constructor(executor) {
    this.state = PromiseH.PENDING;
    this.value = null;
    this.callbacks = [];

    try {
      executor(this.resolve.bind(this), this.reject.bind(this));  
    } catch (error) {
      this.reject(error);  
    }
  }

  resolve(value) {
    if (PromiseH.PENDING) {
      this.state = PromiseH.FULFILLED;
      this.value = value;
      
      setTimeout(() => {
        this.callbacks.map(callback => {
          callback.onFulfilled(value);
        });
      });
    }
  }

  reject(reason) {
    if (PromiseH.PENDING) {
      this.state = PromiseH.REJCET;
      this.value = reason;

      setTimeout(() => {
        this.callbacks.map(callback => {
          callback.onRjected(reason);
        });
      });
    }
  }

  then(onFulfilled, onRjected) {
    if (typeof onFulfilled !== 'function') {
      onFulfilled = () => this.value;
    }

    if (typeof onRjected !== 'function') {
      onRjected = () => this.value
    }

    let promise = new PromiseH((resolve, reject) => {
      if (this.state === PromiseH.PENDING) {
        this.callbacks.push({
          onFulfilled: value => {
            this.parse(promise, resolve, reject, onFulfilled(value));
          }, 
          onRjected: reason => {
            this.parse(promise, resolve, reject, onRjected(reason));
          }
        });
      }
  
      if (this.state === PromiseH.FULFILLED) {
        setTimeout(() => {
          this.parse(promise, resolve, reject, onFulfilled(this.value));
        });
      }
  
      if (this.state === PromiseH.REJCET) {
        setTimeout(() => {
          this.parse(promise, resolve, reject, onRjected(this.value));
        });
      }
    });

    return promise;
  }

  parse(promise, resolve, reject, result) {
    if (promise === result) {
      throw new TypeError('Change cycle detected.');
    }

    try {
      if (result instanceof PromiseH) {
        result.then(resolve, reject);
      } else {
        resolve(result);
      }
    } catch (error) {
      reject(error);
    }  
  }

  static resolve(value) {
    return new PromiseH((resolve, reject) => {
      if (value instanceof Promise) {
        value.then(resolve, reject);
      } else {
        resolve(value);
      }
    });
  }

  static reject(value) {
    return new PromiseH((resolve = null, reject) => {
      reject(value);
    });
  }

  static all(promises) {
    return new PromiseH((resolve, reject) => {
      let results = [];
      
      promises.forEach(promise => {
        promise.then(
          value => {
            results.push(value);
          }, 
          reason => {
            reject(reason);
          }
        );
      });
      resolve(results);
    });
  }

  static race(promises) {
    return new PromiseH((resolve, reject) => {
      promises.forEach(promise => {
        promise.then(
          value => {
            resolve(value);
          }, 
          reason => {
            reject(reason);
          }
        );
      });
    });  
  }
}
```
