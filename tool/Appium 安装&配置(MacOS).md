### Appium 安装&配置(MacOS) <span style="font-size: 18px;font-weight: bold; color: #888">默认已经安装python环境</span>

> 官网 [地址](http://appium.io/)  
>
> 纯native app自带框架： 
>
> iOS 9.0.3+:  XCUITest
>
> Android 4.2+:  UiAutomator

`基础环境，Node, Xcode, Xcode Command Line Tools`

###### 1. 安装appium, appium-doctor

```shell
sudo npm install -g appium
# 如果提示权限相关的话需要可执行下面这段代码
# sudo npm install -g appium --unsafe-perm=true 
sudo npm install -g appium-doctor
```

> 安装完成后执行 appium-doctor 检测结果如下图，圈内东西须都 ✔︎ 有 ✗ 的 warning警告安装相应的配置处理掉。

![WX20210527-095509.png](http://ww1.sinaimg.cn/large/002YCSEBgy1gqwr5wycgsj60vw0hkn3w02.jpg)

###### 2. 基础依赖安装

* jdk1.8以上

* Android sdk (<font size=2><u>安装 android studio 或者 android adt 二者都会自带安装 android sdk</u>)</font>

  <font size="3">配置android环境</font>

  ```shell
  # 配置android环境变量
  # vi .zshrc
  export ANDROID_HOME=/Users/leitianxiao/Library/Android/sdk
  export PATH=$PATH:${ANDROID_HOME}/tools
  export PATH=$PATH:${ANDROID_HOME}/platform-tools
  # source .zshrc
  ```

###### 3. 其他依赖<span style="font-size: 14px">(全局或项目中安装)</span>

> opencv4nodejs, ffmpeg, mjpeg-consumer, set-simulator-location, idb and idb_companion, ios-deploy

```shell
	sudo npm install -g opencv4nodejs mjpeg-consumer
	
	brew install ffmpeg lyft/formulae/set-simulator-location 
	
	brew tap facebook/fb
	brew install idb-companion
	pip3 install fb-idb
	
	brew tap wix/brew
	brew install applesimutils
	
	sudo npm install -g ios-deploy —unsafe-perm=true
	
	# bundletool.jar ⚠️警告的处理
	1. https://github.com/google/bundletool/releases下载bundletool.jar的最新版本 & 改名为bundletool.jar
	2. 在android sdk目录下，创建一个子目录bundle-tool，把bundletool.jar放在这个子目录下，
	   给这个子目录和这个jar文件，增加权限执行
		   chmod +x bundle-tool
		   chmod +x bundletool.jar
	3. 在全局变量PATH中，增加bundletool.jar的路径 vi .zshrc
	    export PATH=PATH:{PATH}:PATH:ANDROID_HOME/bundle-tool
	    然后 source .zshrc
	4. 若有 gst-launch-1.0 and gst-inspect-1.0 的警告 可尝试
	    brew install gstreamer gst-plugins-base gst-plugins-good gst-plugins-bad gst-plugins-ugly gst-ffmpeg
```

###### 4. Android 手机的 Appium & inspector功能配置

> 插上手机 打开开发者模式，允许usb调试<span style="font-size: 12px; font-weight: bold;">不同的android手机自行百度如何打开开发者模式</span>



* 启动appium客户端后 直接点击 start server 按钮，然后点击右上角🔍搜索图标，如下图新增配置，配置完成点击 启动会话

![WX20210527-112034.png](http://ww1.sinaimg.cn/large/002YCSEBgy1gqwtj4q3onj60v60juq5z02.jpg)

* 启动会话后可根据 相关属性查找 对应元素 如下图

> 可根据文档写相关 dom 查询 [文档](http://appium.io/docs/en/commands/element/find-element/)

![11111.png](http://ww1.sinaimg.cn/large/002YCSEBgy1gqwtnxeb0fj611d0mh7c702.jpg)

###### 5. DEMO gitee


