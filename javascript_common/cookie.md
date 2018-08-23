##### cookie

> * 若设置了cookie 每次请求都会随请求发送到服务端。
>
> * cookie在性质上是绑定在特定域名下的，有跨域限制。
>
> * 构成：值，域，路径，失效时间，安全标志
>
>   ```javascript
>   值：存储在cookie中的字符串值，必须用URL编码；
>   域：cookie是对哪个域有效的，那么向该域发送请求都会包含cookie，**对子域有效**；
>   路径：设置cookie的路径；
>   失效时间：指cookie何时被删除的时间戳；
>   安全标志：指定后，cookie只能在使用SSL链接的时才发送到服务器。
>   ```

```javascript
CookieUtil = {
    get: function(name) {
        var cookieName = encodeURIComponent(name) + '=',
            cookieStart = document.cookie.indexOf(cookieName),
            cookieValue = null;
        
        if (cookieStart > -1) {
            var cookieEnd = document.cookie.indexOf(';', cookieStart);
            
            if (cookieEnd == -1){
                cookieEnd = document.cookie.length;
            }
            cookieValue = document.cookie.substring(cookieStart + cookieName.length,                cookieEnd);
        }
        return cookieValue;
    },
    set: function(name, value, expires, path, domain, secure) {
        var cookieText = encodeURIComponent(name) + '=' + encodeURIComponent(value);
        
        if (expires instanceof Date) {
          cookieText += '; expires=' + expires.toGMTString();    
        }
        
        if (path) {
            cookieText += '; path=' + path;
        }
        
        if (domain) {
            cookieText += '; domain=' + domain;
        }
        
        if (secure) {
            cookieText += ';' + secure;
        }
        
        document.cookie = cookieText;
    },
    del: function(name, path, domain, secure) {
      this.set(name, '', new Date(0), path, domain, secure);    
    }
};
```

###### 子cookie

[子cookie了解](https://blog.csdn.net/caomiao2006/article/details/45133531)



