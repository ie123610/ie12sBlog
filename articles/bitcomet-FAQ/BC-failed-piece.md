---
sidebar_label: 分块校验失败问题
---

# 比特彗星常见问题-分块校验失败问题

2023.08.16  

**问：** 任务的下载速度很快 但任务进度涨的很慢  
**甚至下载大小超过了文件大小**  

<img loading="lazy" src="../../images/BC-failed-piece/BC-failed-piece-1.jpg" width="60%" height="60%" />


**答：** 选中任务 切换到 **任务日志** 选项卡 查看是否有分块校验错误的记录  

**问：** 有分块校验失败 丢弃数据的记录  

<img loading="lazy" src="../../images/BC-failed-piece/BC-failed-piece-2.jpg" width="60%" height="60%" />

**答：** 到 高级设置中 搜索 **分块**  
将 `bittorrent.separate_sources_for_failed_piece` 设置为 **是**  

<img loading="lazy" src="../../images/BC-failed-piece/BC-failed-piece-3.jpg" width="60%" height="60%" />

**注意！**  

在某些旧版本中该选项似乎存在一些问题 设置为 是 时反而会发生错误  
若遇到该错误后 请切换 `bittorrent.separate_sources_for_failed_piece` 的值  

**若原来为 是 则改为 否**  
**若原来为 否 则改为 是**  


---

参考和转载：  
* https://www.cometbbs.com/t/87262
* https://www.cometbbs.com/t/70498
* https://www.cometbbs.com/t/32488
* https://www.cometbbs.com/t/85239
* https://www.cometbbs.com/t/73168/9


