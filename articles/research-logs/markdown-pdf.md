# 使用简单方法在 Markdown 中展示 PDF 文件

2026.6.18  

## 纯原生方案

Markdown 支持 html 元素 可以使用 iframe 或者 object 来显示网页  
再配合上浏览器自带的 PDF 预览功能即可实现在 Markdown 文件中放置一个或多个 PDF 预览  

### 使用 iframe 元素

示例：  

```

<details>

<summary>PDF 文件预览</summary>

<p>如果您的浏览器不支持 PDF 预览，请 <a href="/file.pdf">点击此处下载</a>。</p>

<iframe src="/files/example.pdf" loading="lazy" width="100%" height="600px">
</iframe>

</details>

```

使用 details 元素使 iframe 折叠 避免内容过长影响阅读  
通过 `loading="lazy"` 让其在折叠时不被加载以节约资源  

不支持 PDF 预览的提示应该加在 iframe 的外部 details 的内部  
如果写在 iframe 内部 那么只有在浏览器 不支持 iframe 时才会显示提示  
当 iframe 指向内容无法加载时 这些提示是无法显示的  


### 使用 object 元素

使用 object 元素和 iframe 的方法差不多  

示例：  

```

<details>

<summary>PDF 文件预览</summary>

<p>如果您的浏览器不支持 PDF 预览，请 <a href="/file.pdf">点击此处下载</a>。</p>

<object data="/file.pdf" type="application/pdf" width="100%" height="500px">
</object>

</details>

```

object 原生支持显示替代文本显示 不过其应该只有在收到的媒体类型与 type 设置不符时才会生效  
其不支持 `loading="lazy"` 即处于折叠状态依然会加载  


### 小结

使用 iframe 和 object 元素外加 浏览器自带的 PDF 预览功能  
即可较为简单的实现在 markdown 中展示 PDF 文件  

不过这个原生方案的局限性很大  
其完全依赖浏览器的 PDF 预览功能 若浏览器不支持则完全无法显示  
在有些浏览器中还会触发自动下载 用户体验较差  


---

## 第三方 PDF 渲染器

使用第三方 PDF 渲染器可以有效的减少对浏览器自身 PDF 功能的依赖  
具有更强的兼容性 其基本由 js 脚本驱动 受浏览器和系统平台的影响较小  

### 本地托管

即将 PDF 渲染器与网站文件放置在一起  
这里使用的是的 Mozilla 的 [PDF.js](https://mozilla.github.io/pdf.js/) 建议使用带 legacy 的版本 以提高兼容性  

下载压缩包后解压缩 若使用 静态站点生成器（SSG）一般会有一个 static 文件夹  
在生成站点时 不会对其中的内容进行处理 将插件放在其中即可  

其中有一个 web 文件夹 内含 viewer.html 这个就是 PDF 预览页面  
调用方法就是在请求这个 html 文件的后面 加上需要显示的 PDF 文件名称即可  

示例： `/pdfjs-legacy/web/viewer.html?file=123.pdf`  
可以先使用绝对路径在浏览器中打开 确定显示正常后再填入 iframe 中  
实际使用时应采用相对路径 包括后面的 PDF 文件路径

由于其依赖 js 脚本 当浏览器禁用 JavaScript 后无法正常显示 PDF文件内容  
但能显示 viewer.html 上阅读器的基础内容 使得用户较难辨别目标内容是否正常加载  

可以通过放置 noscript 元素来解决此问题  
在启用 JavaScript 的情况下 noscript 所包裹的内容不会被显示  
我们可以将警告信息放置在其中 使其在 js 脚本被禁用时显示  

示例：  

```

<noscript>
<strong><mark>警告 JavaScript 已经禁用 PDF 预览将不会加载</mark></strong>
</noscript>

```

这里还使用了 strong 和 mark 元素对提示信息进行加粗和高亮  
其胜在书写简单 不用写 class 和内联 style  
当然要是希望其有更好的呈现效果 还是需要通过 CSS 来实现  

最终组合：  

```
<details>

<summary>PDF 文件预览</summary>

<p>如果预览无法加载请 <a href="/file.pdf">点击此处下载文件</a>。</p>

<noscript>
<strong><mark>警告 JavaScript 已经禁用 PDF 预览将不会加载</mark></strong>
</noscript>

<iframe src="/files/example.pdf" loading="lazy" width="100%" height="600px">
</iframe>

</details>

```

截图  



### 使用在线服务

使用在线的文档展示服务和地托管差不多 只是将请求地址转移到了外部站点上  
而且 PDF 文件的地址必须是可被访问的绝对地址  

优点是不需要在自己的站点上添加新的内容  
缺点也很明显 预览文件需要写绝对地址 未来迁移时需要进行地址替换  
用户不一定能连接上这些服务器 而且这些服务未来也可能发生变化  

可以直接使用 PDF.js 的官方服务 不过其所提供版本较新  
使用了很多 js 新特性和新方法 旧的浏览器不一定支持  
地址：`https://mozilla.github.io/pdf.js/web/viewer.html`  

谷歌的 Google Docs Viewer 也不错 不仅能预览 PDF 文件 大部分常见的文件类型其实都可以预览  
功能是十分强大的 就是连通性会差一些 地址：`https://docs.google.com/viewer?url=文件的绝对路径&embedded=true`  
如果不需要使用 iframe 进行嵌入的话 后面的 `&embedded=true` 可以不要  

微软的 Office Web Viewer 似乎并不支持 PDF  
但是用来预览 word 文档 幻灯片和 Excel 表格还是不错的  
地址：`https://view.officeapps.live.com/op/view.aspx?src=文档绝对路径`  

此部分参考：[embedded-file-viewer.md](https://gist.github.com/tzmartin/1cf85dc3d975f94cfddc04bc0dd399be)  


---

## 转换成位图

上述的这些方案主要适用于自建站点 如果 markdown 文件发布于托管平台   
在一般情况下出于安全性考虑 平台的解析器会忽略这些元素  
不会将其转换成对应的 html 内容 一般以纯文本的形式呈现  

想要在这些平台上显示 PDF 文件的内容 唯一可行的方法恐怕就是将 PDF 转换成图片加以展示  
对较短的文件来说可以转换成一张完整的图片 较长时应按照页数分成多张  
最好再添加一个用于下载原始 PDF 文件的超链接  


