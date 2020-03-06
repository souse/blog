/**
 * 替换 URL 中某个参数值
 * @param {string} url 
 * @param {string} key 
 * @param {string | number | boolean} value 
 */
const replaceUrlParams = (url, key, value) => {
  const reg = new RegExp(`(${key}=).*?(&|$)`);

  return url.replace(reg, `$1${value}$2`);
}

/**
 * Object 判断
 * @param {*} args 
 */
const isObject = args => {
  return typeof args === 'object' && Object.prototype.toString.call(args) === '[object Object]';
}

/**
 * 获取 URL 中某个参数值
 * @param {string} name 
 */
const getSearchByName = name => {
  const match = RegExp(`[?&]${name}=([^&]*)`).exec(window.location.href);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
};

/**
 * @description 防抖
 * @author souse
 * @date 2019-12-25
 * @param {*} fn 回调函数
 * @param {long} wait ms
 * @returns
 */
function debounce(fn, wait) {
  let timer = null;

  return function() {
    const context = this,
      args = arguments;
    
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }

      timer = setTimeout(() => {
        fn.apply(context, args);
      }, wait);
  }
}

/**
 * @description 截流
 * @author souse
 * @date 2019-12-25
 * @param {*} fn
 * @param {*} delay
 * @returns
 */
function trottle(fn, delay) {
  let timer = null;
  let startTime = Date.now();

  return function() {
    const context = this, 
      args = arguments;
    const curTime = Date.now();
    const remainning = delay - (curTime - startTime);
    
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    if (remainning <= 0) {
      fn.apply(context, args);
      startTime = Date.now();
    } else {
      timer = setTimeout(fn, remainning);
    }
  }
}

function deepClone(obj) {
  if (typeof obj !== 'object') return;
  let newObj = obj instanceof Array ? [] : {};
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const e = obj[key];
      
      newObj[key] = typeof e === 'object' ? arguments.callee(e) : e;
    }
  }
  return newObj;
}