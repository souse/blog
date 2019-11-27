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