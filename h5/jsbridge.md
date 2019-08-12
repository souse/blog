```javascript
/*
 * @Author: souse 
 * @Date: 2019-08-09 14:59:05 
 * @Last Modified by: souse
 * @Last Modified time: 2019-08-12 15:32:45
 * @Descript 和app交互的接口调用 单例模式
 */

const ARRAY_CLASS = '[object Array]';
const _toString = Object.prototype.toString;

 /**
  * set default options
  */
export const JsBridgeOptions = {
  GLOBAL_NAME: 'rocNative',
  NATIVE_IOS_NAME: 'rociOS',
  NATIVE_ANDROID_NAME: '__rocAndroid',
  initMethodsWithCallBack: ['getToken'], // value is string
  initMethodsWithoutCallBack: ['appInit', 'goBack'] // value is string
}

/**
 * @description 初始化
 * @author souse
 * @date 2019-08-09
 * @export
 * @param {*} [options=JsBridgeOptions]
 */
export default function PicaJsBridge(options = JsBridgeOptions) {
  const initMethodsWithCallBack = options.initMethodsWithCallBack;
  const initMethodsWithoutCallBack = options.initMethodsWithoutCallBack;

  this._callbakFns = {};
  this._callbackId = 0;
  this._GLOBAL_NAME = options.GLOBAL_NAME;
  this._NATIVE_IOS_NAME = options.NATIVE_IOS_NAME;
  this._NATIVE_ANDROID_NAME = options.NATIVE_ANDROID_NAME;
  
  this.isIOS = this._isIos();
  this.isAndroid = this._isAndroid();
  this.isWeb = this._isWeb();
  
  if (_toString.call(initMethodsWithCallBack) === ARRAY_CLASS && initMethodsWithCallBack.length !== 0) {
    this.registerMethods(initMethodsWithCallBack, true);
  }
  if (_toString.call(initMethodsWithoutCallBack) === ARRAY_CLASS && initMethodsWithoutCallBack.length !== 0) {
    this.registerMethods(initMethodsWithoutCallBack, false);
  }

  this.mountToWindow();
}

// is ios flag
PicaJsBridge.prototype._isIos = function() {
  return !!(window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers[this._NATIVE_IOS_NAME]);
}

// is android flag
PicaJsBridge.prototype._isAndroid = function () {
  return !!window[this._NATIVE_ANDROID_NAME];
}

// is web flag
PicaJsBridge.prototype._isWeb = function() {
  return !this.isIOS && !this.isAndroid;
}

// register method width callback in window
PicaJsBridge.prototype._registerMethod = function(method) {
  const _this = this;

  _this[method] = (param) => {
    return new Promise((response, reject) => {
      _this._callNative(method, param, function(result) {
        response(result);
      }) ? void 0 : reject(`${method} not handled.`);
    });
  }
}

// register method widthout callback in window
PicaJsBridge.prototype._registerMethodWithoutMethod = function(method) {
  const _this = this;
  
  _this[method] = (param) => {
    return new Promise((response, reject) => {
      _this._callNative(method, param, null) ? response('success') : reject(`${method} not handled.`);
    });
  }
}

// window call app method
PicaJsBridge.prototype._callNative = function(name, param, callbackFn) {
  let callbackId = 0, pm;

  if (typeof callbackFn === 'function') {
    this._callbackId++;
    callbackId = this._callbackId;
    this._callbakFns[callbackId] = callbackFn;
  }

  pm = JSON.stringify({ 
    name,
    callbackId: callbackId ? callbackId.toString() : '',
    param: param || {}
  });

  if (this.isAndroid) {
    window[this._NATIVE_ANDROID_NAME].postMessage(pm);
    return true;
  }

  if (this.isIOS) {
    window.webkit.messageHandlers[this._NATIVE_IOS_NAME].postMessage(pm);
    return true;
  }

  return false;
}

// app call window method
PicaJsBridge.prototype.__nativeCall = function(name, callbackId, result) {
  const fun = callbackId  && this._callbakFns[callbackId];
  
  delete this._callbakFns[callbackId];

  if (fun && typeof fun === 'function') fun(result);
}

// batch register methods
PicaJsBridge.prototype.registerMethods = function(methods = [], widthCallback) {
  if (undefined === widthCallback)
    throw Error('widthCallback flag not defined, registerMethods should take second param value(true/false) for is not has callback.');

  methods.forEach(m => {
    widthCallback === true ? this._registerMethod(m) : this._registerMethodWithoutMethod(m)
  });  
}

// async call app method do not need register
PicaJsBridge.prototype.asyncCallNative = function(method, param) {
  const _this = this;
  
  return new Promise(resolve => {
    _this._callNative(method, param, function(result) {
      resolve(result);
    });
  });
}

// call app method direct without register and callback
PicaJsBridge.prototype.callNative = function(method, param) {
  return this._callNative(method, param, null);
}

// register jsbridge to window
PicaJsBridge.prototype.mountToWindow = function() {
  window[this._GLOBAL_NAME] = this;
}
```

