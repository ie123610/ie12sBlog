# Cloudflare Pages 不显示 .html 和 末尾斜杠问题

2026.5.18  

## 遇到的问题

在使用 Cloudflare Pages 时可能会发现 **其不会显示 html 文件的扩展名**  
当尝试访问的页面是以 `.html` 结尾时其会被重定向到一个不带扩展名的路径  
例如输入地址 `/1.html` 访问后被重定向到了 `/1`  

此外在输入地址的时候 有些页面路径的末尾并没有 **斜杠**  
但访问后会被重定向到带末尾斜杠的路径 例如 `/path/abc` 重定向到 `/path/abc/`  

这个问题比较多见于静态网站生成器例如 Hugo、Hexo、Jekyll 等  
本博客使用的 Docusaurus 也存在这个问题  

---

## Pages 处理特征

Cloudflare Pages 处理行为参考：  

| 输入的原始 URL | 实际寻找的文件 | 浏览器地址最终栏显示的 URL| 目的/效果 |
| :---: | :---: | :---: | :---: |
| `/contact` | `contact.html` | `/contact` | 直接提供服务 |
| `/contact.html` | `contact.html` | `/contact` | 自动重定向（去掉 .html 后缀） |
| `/about/` | `about/index.html` | `/about/` | 直接提供服务（目录默认页） |
| `/about/index.html` | `about/index.html` | `/about/` | 自动重定向（去掉 index.html） |

去除 .html 扩展名是 Cloudflare Pages 的一个特性 此特性是强制性的无法关闭 **但有办法绕过**  

至于末尾斜杠问题 其实和静态站点生成工具所生成的目录结构有关  
其生成的物理目录可能为 `/path/文章文件名/index.html` 而超链接为 `/path/文章文件名`  

这样的链接在CF看来请求的是 `/path/文章文件名.html` 而然这个文件并不存在 所以发出重定向  
重定向到 `/path/文章文件名/` 以显示该目录下的 index.html 内容 这种重定向对真人来说没有什么影响  
甚至大部分人可能都不会注意到 **但这些重定向对SEO有影响**  

现代 SSG（静态站点生成器）在生成超链接时 **大都默认采用无尾随斜杠设计**  
与之对应的 像 vercel 这样的托管平台会采用 隐式重写（Internal Rewrite）这样一来就不用发重定向  
地址栏里依然显示 `/path/文章文件名` 而显示的内容对应物理目录 `/path/文章文件名/index.html`  

其类似于 Cloudflare Pages 中 `_redirects` 文件里于内部重写 (Rewrite) 或代理 (Proxy) 的 200 状态码  
与之不同的是在 vercel 之类的平台上此为默认行为  

---

## 解决方法

虽然我们无法关闭这些特性 但是我们可以通过其他的方法来解决问题  

### 显示.html 扩展名 并避免重定向

这个问题主要发生在添加站点认证时 在站点的根目录放置一个包含指定识别码的html文件  
有些站长工具支持重定向 而有些不支持例如百度 其中接收到308重定向后会报错  

这个时候就可以给验证文件 **多添加一个 html 扩展名** 即将 `1.html` 修改为 `1.html.html`  
这样在访问 `/1.html` 的时候就不会接收到重定向了 有趣的是访问 `/1.html.html` 会被重定向回来  

还有一种方法是使用 `.htm` 而不是 `.html` 作为扩展名 不过在站点认证的场景下不太适用  
cf pages 只会通过重定向的方式去掉 `.html` 扩展名 而不会修改 `.htm`  

`.htm` 和 `.html` 在含义上没有任何区别 只不过前者满足 8.3 命名规则 此为早期FAT文件系统的限制  
其限制文件及目录名主体最多8个字节（英文字符） 扩展名最多3个字节中间以点（.）分隔  

在现在的系统中已经没有这种限制 应优先使用 `.html` 为保持兼容性 `.htm` 其依然可以使用  
CF pages 应该也是处于兼容的考虑 而未对 `.htm` 扩展名进行调整  


### 末尾斜杠问题 

静态网站生成器 在设计的时候其实也考虑到了平台不默认支持隐性重定向的情况  
**可以通过调整配置文件** 使得所生成的内部链接末尾包含斜杠  
Docusaurus的配置方法是在 docusaurus.config.js 中添加 `trailingSlash: true`  

**示例**  

```
...
/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'ie12sBlog',
  tagline: 'ie12的博客',
  favicon: 'img/favicon.ico',
  url: 'https://ie12blog.36102025.xyz',
  baseUrl: '/',
  trailingSlash: true, //新增内容
...
```

开启后 Docusaurus 会对所有指向内部的链接末尾都加上斜杠  
即使其有明确的扩展名 例如将 `/rss.xml` 变成 `/rss.xml/`   
最简单的解决方法是写完整路径 即包括协议与域名 就像填写站外链接那样  

此外Docusaurus还提供 `pathname://` 其可以使链接保持原样 不会被添加斜杠或进行其他处理  
示例： `href: 'pathname:///rss.xml',` 注意 前缀后面是 3个斜杠 因为协议本身占 2 个斜杠  
后面紧跟的根目录路径占第 3 个  

---

## 参考

* [Serving Pages · Cloudflare Pages docs](https://developers.cloudflare.com/pages/configuration/serving-pages/#route-matching)
* [Any updates on Route matching vs .html? - Developers / Cloudflare Pages - Cloudflare Community](https://community.cloudflare.com/t/any-updates-on-route-matching-vs-html/559126)
* [Cloudflare Pages truncates URLs by removing the ".html" extension - Application Performance - Cloudflare Community](https://community.cloudflare.com/t/cloudflare-pages-truncates-urls-by-removing-the-html-extension/609238/8)
* [Prevent truncating and removal of page name extensions? - Developers / Cloudflare Pages - Cloudflare Community](https://community.cloudflare.com/t/prevent-truncating-and-removal-of-page-name-extensions/388845/10)
* [https://community.cloudflare.com/t/is-there-an-option-prevent-removing-the-html-suffix/494412/3](https://community.cloudflare.com/t/is-there-an-option-prevent-removing-the-html-suffix/494412/3)
* [Trailing Slash in my URLs - Developers / Cloudflare Pages - Cloudflare Community](https://community.cloudflare.com/t/trailing-slash-in-my-urls/803480/3)
* [[Bug]: pageview 和 commentCount 计数对于path 最后有没有一个/ 是做两个path，其实应该是一个 · Issue #1400 · walinejs/waline](https://github.com/walinejs/waline/issues/1400)
* [网站使用cloudflare pages 后百度验证报 308 错误 - 知乎](https://zhuanlan.zhihu.com/p/7376780016)
* [百度收录 Cloudflare Page 显示 308 报错 - 漠北残月的博客](https://blog.ovvv.top/posts/e7163e6b/)
* [Prevent truncating and removal of page name extensions? - Developers / Cloudflare Pages - Cloudflare Community](https://community.cloudflare.com/t/prevent-truncating-and-removal-of-page-name-extensions/388845)
* [htm 与 html 的区别](https://www.runoob.com/note/10456)
* [Routing | Docusaurus | Routes become HTML files](https://docusaurus.io/docs/advanced/routing#routes-become-html-files)
* [Routing | Docusaurus | Escaping from SPA redirects](https://docusaurus.io/docs/advanced/routing#escaping-from-spa-redirects)
* [docusaurus.config.js | Docusaurus](https://docusaurus.io/docs/api/docusaurus-config#trailingSlash)