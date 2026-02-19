---
sidebar_label: 设置视频预览播放器
---

# 比特彗星常见问题-设置视频预览播放器

2024.11.05  

**问：** 如何设置比特彗星的预览播放器？  

**答：** 可通过高级设置中的这两个选项进行控制  
* `ui.preview_program_path`  
* `ui.preview_program_detection`  


其中`ui.preview_program_path`表示自定义播放器程序路径  

而`ui.preview_program_detection`则表示是否使用自定义路径的播放器  
默认值为 **是** 即使用刚才`ui.preview_program_path`中指定的播放器  
若设置为 **否** 则直接使用系统默认播放器 即使已填写自定义播放器也会被忽略  

值得注意的是`ui.preview_program_detection`选项在2.01中才加入  
在之前只有`ui.preview_program_path`  

这意味着 **在2.01之前** 的版本中想要使用预览则必须指定播放器路径  
**并不支持自动使用系统默认播放器**  

**示例**  
<img loading="lazy" src="../../images/BC-player-path/fill-path.jpg" width="60%" />
<img loading="lazy" src="../../images/BC-player-path/auto-detect.jpg" width="60%" />


**问：** 那在2.01之后想要直接使用系统默认的播放器就只需要把`ui.preview_program_detection`  
改成**否** 就行了 而`ui.preview_program_path`不用动？  

而要使用自定义播放器路径就填一下 `ui.preview_program_path`  
`ui.preview_program_detection`不动？  

**答：** 是的  

**问：** 要是启用了自定义播放器路径 但是在路径中没有填写任何内容会发生什么呢？  

**答：** 他会弹出一个窗口让你选择播放器路径 同时推荐比特彗星的影音之星播放器  

**示例**  
<img loading="lazy" src="../../images/BC-player-path/movie-audio-star.jpg" width="60%" />

**问：** 比特彗星所推荐的影音之星播放器可以用吗？  

**答：** 不是很建议使用 其已经比较陈旧了 可以使用 [VLC](https://www.videolan.org/) 或 [PotPlayer](https://potplayer.org/en/) 这样更加流行的播放器  


---

参考：

* [cometbbs-2.01测试版](https://www.cometbbs.com/t/201%E6%B5%8B%E8%AF%95%E7%89%88/86510)

