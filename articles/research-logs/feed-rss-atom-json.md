# Feed RSS ATOM 以及 Feed JSON

2026.3.21  

## Feed

Feed 是一个比较宽泛的概念 可以将其理解为 **订阅源** 即一种用于定期更新内容的数据格式  
至于实际使用的协议来说 主要是RSS和ATOM 所以也可以认为其是对RSS和ATOM的统称  
不过当提及订阅的时候人们大概会用RSS来指代所有类型的订阅  

---

## RSS

RSS是一种消息来源格式规范，用以聚合多个网站更新的内容并自动通知网站订阅者  
使用RSS后网站订阅者无需手动查看网站是否有新的内容 RSS能将多个网站的更新集成并以摘要形式呈现  
有助于订阅者快速获取重要信息 并选择性点击查看  

RSS可以是以下三种解释中任何一种的缩写，但其实这三者都是指同一种联合供稿（Syndication）的技术  

* RSS 2.0（Really Simple Syndication）
* RSS 0.91, RSS 1.0（RDF（Resource Description Framework）Site Summary）
* RSS 0.9 and 1.0（Rich Site Summary）

RSS 2.X 规范 在全球大部分网站得到使用 但其并没有通过W3C、IETF或者ISO等国际标准化组织进行标准化  
其规范发布在 [RSS Advisory Board](https://www.rssboard.org/rss-specification)上  

最新版由RSS咨询委员会于2009年3月30日发布 版本为2.0.11  

**示例文件**

<details>
<summary>RSS 2.0示例</summary>

```
        <?xml version="1.0"?>
        <rss version="2.0">
          
        <channel>
           <title>Feed Title</title>
           <link>http://yourwebsite.com/</link>
           <description>Feed Description</description>
           <language>en-us</language>
           <pubDate>Mon, 03 Jan 2005 12:00:00 GMT</pubDate>
            
        <item>
           <title>Article Title</title>
           <link>http://yourwebsite.com/articlelink.html</link>
           <description>Your content included here.</description>
        </item>
        <item>
           <title>Sports</title>
           <link>http://yourwebsite.com/sportslink.html</link>
           <description>Your content included here.</description>
        </item>
            
        </channel>
        </rss>
```
</details>

---

### ATOM

ATOM（Atom Syndication Format）与RSS一样基于XML格式 其是IETF的建议标准（RFC 4287）  
借鉴了各种版本RSS的使用经验 被设计作为RSS的替代品 发展Atom的动机在于解决 RSS 2.0 所存在的一些问题  

* RSS 2.0可能包含文本或经过编码的HTML内容，同时却没有提供明确的区分办法；相比之下，Atom则提供了明确的标签（也就是typed）。
* RSS 2.0的description标签可以包含全文或摘要（尽管该标签的英文含义为描述或摘要）。Atom则分别提供了summary和content标签，用以区分摘要和内容，同时Atom允许在summary中添加非文本内容。
* RSS 2.0存在多种非标准形式的应用，而Atom具有统一的标准，这便于内容的聚合和发现。
* Atom有符合XML标准的命名空间，RSS 2.0却没有。
* Atom通过XML内置的xml:base标签来指示相对地址（URI），RSS 2.0则无相应的机制区分相对地址和绝对地址。
* Atom通过XML内置的xml:lang，而RSS采用自己的language标签。
* Atom强制为每个条目设定唯一的ID，这将便于内容的跟踪和更新。
* Atom 1.0允许条目单独成为文档，RSS 2.0则只支持完整的种子文档，这可能产生不必要的复杂性和带宽消耗。
* Atom按照 RFC 3339标准（ISO 8601标准的一个子集）表示时间 ，而RSS 2.0中没有指定统一的时间格式。
* Atom 1.0具有在IANA注册了的MIME类型，而RSS 2.0所使用的application/rss+xml并未注册。
* Atom 1.0标准包括一个XML schema，RSS 2.0却没有。
* Atom是IETF组织标准化程序下的一个开放的发展中标准，RSS 2.0则不属于任何标准化组织，而且它不是开放版权的。

**示例文件**  

<details>
<summary>ATOM 1.0示例</summary>

```
        <?xml version="1.0" encoding="utf-8"?>
        <feed xmlns="http://www.w3.org/2005/Atom">

          <title> Feed Title </title> 
          <link href=" http://yourwebsite.com/"/>
          <updated>2003-12-13T18:30:02Z</updated>
          <author> 
            <name>Your Name</name>
          </author> 
          <id>urn:uuid:60a76c80-d399-11d9-b93C-0003939e0af6</id>

          <entry>
            <title>Article Title</title>
            <link href=" http://yourwebsite.com/articlelink.html "/>
            <id>urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a</id>
            <updated>2003-12-13T18:30:02Z</updated>
            <summary>Some text.</summary>
          </entry>
          <entry>
            <title>Sports</title>
            <link href=" http://yourwebsite.com/sportslink.html "/>
            <id>urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344e45ab90</id>
            <updated>2003-12-14T13:30:55Z</updated>
            <summary>Some text.</summary>
          </entry>

        </feed>

```
</details>


---

## 命名空间扩展

在RSS 2.0 可以通过命名空间来使用Atom元素  

XML 命名空间提供避免元素命名冲突的方法  
命名空间依靠的是标签内的 xmlns 属性所定义  
声明的语法为 `xmlns:前缀="URI"`  

在XML头部声明中添加 `<rss xmlns:atom="http://www.w3.org/2005/Atom">`  

与RSS 2.0 原先的声明 `<rss version="2.0">` 相混合后就变成了  
`<rss xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">`  
这样在后面就可以使用 ATOM中的元素了  

比较常见的为 `atom:link` 元素 其放在 channel中  
用于实现“自我引用”即记录订阅URL也就是XML文件的地址 这是RSS规范本身无法实现的  
`<atom:link href="http://dallas.example.com/rss.xml" rel="self" type="application/rss+xml" />`  


<details>
<summary>RSS扩展ATOM示例</summary>

```
<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title>ie12sBlog</title>
        <link>https://ie12blog.36102025.xyz</link>
        <description>ie12的博客</description>
        <lastBuildDate>Wed, 04 Mar 2026 11:58:59 GMT</lastBuildDate>
        <docs>https://validator.w3.org/feed/docs/rss2.html</docs>
        <generator>Docusaurus Custom RSS Plugin</generator>
        <language>zh</language>
        <copyright>CC BY-SA 4.0</copyright>
        <atom:link href="https://ie12blog.36102025.xyz/rss.xml" rel="self" type="application/rss+xml"/>
        <item>
            <title><![CDATA[战地1 EA反作弊无法启动 ExitType: 115 (0)]]></title>
            <link>https://ie12blog.36102025.xyz/articles/research-logs/ea-anti-cheat-115-0/</link>
            <guid isPermaLink="false">https://ie12blog.36102025.xyz/articles/research-logs/ea-anti-cheat-115-0/</guid>
            <pubDate>Wed, 04 Mar 2026 00:00:00 GMT</pubDate>
            <description><![CDATA[发布于 2026.03.04]]></description>
        </item>
        <item>
            <title><![CDATA[Lucky 执行批处理报错和乱码问题]]></title>
            <link>https://ie12blog.36102025.xyz/articles/research-logs/lucky-cmd-error/</link>
            <guid isPermaLink="false">https://ie12blog.36102025.xyz/articles/research-logs/lucky-cmd-error/</guid>
            <pubDate>Wed, 18 Feb 2026 00:00:00 GMT</pubDate>
            <description><![CDATA[发布于 2026.02.18]]></description>
        </item>
```
</details>

ATOM和RSS都基于XML 均可以添加命名空间（XML Namespaces 即 xmlns） 来扩展功能  
只不过RSS推出较早（1999）市场占有率高 早期版本混乱 存在一些功能上的缺失  
所以现在能见到大部分订阅源中都是在 RSS 2.0 基础上 使用ATOM元素来扩展  

而推出更晚（2005）更规范的ATOM不需要RSS中的元素 其也相对少见  
好在现代阅读器对RSS和ATOM的解析基本都不存在问题 因为两者基本都已经停止演进  

当然在一些比较特殊订阅源比如YouTube订阅源 以ATOM为基础 使用了大量的扩展  
包括 YouTube的自定义扩展和雅虎的media扩展  

```
<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns:media="http://search.yahoo.com/mrss/" xmlns="http://www.w3.org/2005/Atom">
```

不过这个 雅虎的media扩展 已经被RSS咨询委员会 收编 [链接](https://www.rssboard.org/media-rss)  
原先的链接已经失效 当然通过 网页时光机 还是可以看到的  

* `http://search.yahoo.com/mrss/` [网页时光机](https://web.archive.org/web/20260301000000*/http://search.yahoo.com/mrss/)
* ` http://video.search.yahoo.com/mrss` [网页时光机](https://web.archive.org/web/20260000000000*/http://video.search.yahoo.com/mrss)


YouTube这个空间声明中的链接似乎没有真正的内容  
`xmlns:yt="http://www.youtube.com/xml/schemas/2015`  
从网页时光机记录的内容看来其 始终只有404页面  

当然这其实也是符合XML规则的  
在XML空间命名中 xmlns 内的URL(其实应该是 URI )只是用于保证唯一性  
防止冲突即防止出现两个完全相同的声明元素  

这个URI (Uniform Resource Identifier)和URL (Uniform Resource Locator)不同  
URL 的目的是告诉东西在哪儿（定位） 而URI的目的是告诉这个东西是什么（标识）  

URL相当于是一个坐标 方便你找到/访问内容  
而URI只是一个名字/编号 告诉你这个是什么 并不能说明东西在哪里  
而坐标也可以当名字用 但是名字/编号不能当坐标用  

很多情况下会放置超链接 指向对应的规范文件  
既起到的防重复功能 也顺便宣传一下规范 当然这并不是必须的  
只要满足唯一性就是符合XML规则的  

<details>
<summary>YouTube订阅源示例</summary>

```
<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns:media="http://search.yahoo.com/mrss/" xmlns="http://www.w3.org/2005/Atom">
 <link rel="self" href="http://www.youtube.com/feeds/videos.xml?channel_id=UCBR8-60-B28hp2BmDPdntcQ"/>
 <id>yt:channel:BR8-60-B28hp2BmDPdntcQ</id>
 <yt:channelId>BR8-60-B28hp2BmDPdntcQ</yt:channelId>
 <title>YouTube</title>
 <link rel="alternate" href="https://www.youtube.com/channel/UCBR8-60-B28hp2BmDPdntcQ"/>
 <author>
  <name>YouTube</name>
  <uri>https://www.youtube.com/channel/UCBR8-60-B28hp2BmDPdntcQ</uri>
 </author>
 <entry>
  <id>yt:video:p4rSShLE8zI</id>
  <yt:videoId>p4rSShLE8zI</yt:videoId>
  <yt:channelId>UCBR8-60-B28hp2BmDPdntcQ</yt:channelId>
  <title>POV the view is the destination @bayflight #views #flying #sunset</title>
  <link rel="alternate" href="https://www.youtube.com/shorts/p4rSShLE8zI"/>
  <author>
   <name>YouTube</name>
   <uri>https://www.youtube.com/channel/UCBR8-60-B28hp2BmDPdntcQ</uri>
  </author>
  <published>2026-03-21T13:00:27+00:00</published>
  <updated>2026-03-21T13:04:53+00:00</updated>
  <media:group>
   <media:title>POV the view is the destination @bayflight #views #flying #sunset</media:title>
   <media:content url="https://www.youtube.com/v/p4rSShLE8zI?version=3" type="application/x-shockwave-flash" width="640" height="390"/>
   <media:thumbnail url="https://i1.ytimg.com/vi/p4rSShLE8zI/hqdefault.jpg" width="480" height="360"/>
   <media:description></media:description>
   <media:community>
    <media:starRating count="44" average="5.00" min="1" max="5"/>
    <media:statistics views="567"/>
   </media:community>
  </media:group>
 </entry>
```
</details>


---

## JSON Feed

JSON Feed 与 RSS 和 ATOM 不同其使用 JSON格式书写而非XML  
相比起XML JSON格式更容易阅读和解析 有利于简化开发过程  
其在2017 才推出 支持相对有限 详见 [jsonfeed.org](https://www.jsonfeed.org/2017/05/17/announcing-json-feed.html)  


<details>
<summary>JSON Feed 1.1示例</summary>

```
{
    "version": "https://jsonfeed.org/version/1.1",
    "title": "My Example Feed",
    "home_page_url": "https://example.org/",
    "feed_url": "https://example.org/feed.json",
    "items": [
        {
            "id": "2",
            "content_text": "This is a second item.",
            "url": "https://example.org/second-item"
        },
        {
            "id": "1",
            "content_html": "<p>Hello, world!</p>",
            "url": "https://example.org/initial-post"
        }
    ]
}

```
</details>



---

## 格式验证工具

RSS/ATOM: https://validator.w3.org/feed/  
Feed JSON: https://validator.jsonfeed.org/  

---

## 参考

* [JSON Feed 与 Podcast Feed 构建实践](https://jimmysong.io/zh/book/hugo-handbook/search-subscription/json-podcast-feeds/)
* [Announcing JSON Feed](https://www.jsonfeed.org/2017/05/17/announcing-json-feed.html)
* [博客园-RSS介绍、RSS 2.0规范说明和示例代码](https://www.cnblogs.com/tuyile006/p/3691024.html)  
* [网页时光机-RSS介绍、RSS 2.0规范说明和示例代码](https://web.archive.org/web/20120506000359/http://www.bobopo.com/article/code/rss_2_0_spec.htm)  
* [RSS-维基百科](https://zh.wikipedia.org/wiki/RSS)
* [RSS,ATOM,FEED是什么有什么区别](https://seonoco.com/blog/rss-atom-feed-different)
* [博客园-ATOM和RSS的区别](https://www.cnblogs.com/yjmyzz/archive/2009/02/19/1393972.html)
* [网页时光机-使用 RSS 和 Atom 实现新闻联合](https://web.archive.org/web/20111130184024/http://www.ibm.com/developerworks/cn/web/wa-syndrssatom/index.html)
* [UserPreferencesRss20AndAtom10Compared](https://intertwingly.net/wiki/pie/Rss20AndAtom10Compared)
* [XML 命名空间 | 菜鸟教程](https://www.runoob.com/xml/xml-namespaces.html)


