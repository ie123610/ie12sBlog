# Windows 传输动画


Resource Hacker 提取
AVI文件
视频编码格式 `Run length encoded 8bpp RGB image`

一系列使用RLE压缩的8位（256色）位图，按顺序打包在AVI容器中

AVI源文件



字段	含义	为什么这样设计
Run length encoded	游程编码（RLE）	最简单的无损压缩，CPU解码极快，适合大面积纯色
8bpp	8位每像素（256色）	系统调色板模式，节省内存和存储
RGB image	颜色空间	实际使用调色板索引，非真彩色
在AVI容器中	包装格式	利用系统已有的AVI播放框架


IE浏览器下载动画 （IE8+风格）  
<img src="../../images/win-animation/ie8-download.gif" width="60%" height="60%" />

IE浏览器下载动画 (IE7-/Win9X风格)  
<img src="../../images/win-animation/ie7-download.gif" width="60%" height="60%" />

资源管理器 复制文件动画 （Windows XP 风格 ）  
<img src="../../images/win-animation/winxp-copy-file.gif" width="60%" height="60%" />

资源管理器 复制文件动画 （Windows 9X 风格 ）  
<img src="../../images/win-animation/win9X-copy-file.gif" width="60%" height="60%" />

