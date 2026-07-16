# 在 WinXP 虚拟机上录制 midi 背景音乐（视频）

2026.7.7  

目标在 Windows XP 虚拟机上录制带有 midi 音乐的视频  
虚拟机：VMware Workstation 录制软件：FSCapture  

FSCapture 在 XP 虚拟机上不会显示录制系统声音的选项  
应该是因为 winXP 时还没有统一的现代音频API 外加 VM虚拟机的声卡驱动可能存在问题  

若直接选择 vm虚拟声卡的麦克风进行录制会提示 “使用的设备标识号已超出本地系统范围”  
我们需要别的解决方法  

前置教程：`https://www.zhihu.com/question/28556054`  

<details>
<summary>图片存档</summary>

<img loading="lazy" src="../../images/vm-xp-midi/backup.png" width="60%" />

</details>

软件下载：  
* VB Audio-cable：[链接](https://vb-audio.com/Cable/index.htm)  
 建议下载 Old package （2015）  

* Voicemeeter：[链接](https://vb-audio.com/Voicemeeter/)  

实测中 VB Audio-cable 的虚拟设备名称似乎和教程中的不一样  
教程中为 Virtual Cable 1 测试时为 VB-Audio-Point 应该是版本不同造成的  

按照前置教程配置完成后就可以在虚拟机内录制到媒体声音  
包括系统提示声音 视频和一般歌曲的的声音  

但其并不包括 midi 音乐的声音 其应该属于软件合成器声音  
尤其是在使用 winXP 自带的波表合成器时  

我们需要一个第三方软来替代系统自带的演奏器  
让 midi 音乐输出到 Voicemeeter 的虚拟输出设备中  

这里使用的是 VirtualMIDISynth 下载软件：[链接](https://coolsoft.altervista.org/en/virtualmidisynth#download)  

安装后添加 **音色文件**  
这里希望还原 win 自带波表合成器的效果 即 `C:\WINDOWS\system32\drivers\gm.dls` 音色文件  
将其转换为 `.sf2` 文件以供 VirtualMIDISynth 加载  

音色格式转换网站：[链接](https://spessasus.github.io/SpessaFont/)  
上传 gm.dls 后不用进行任何编辑 直接保存到 SF2 即可  

<img loading="lazy" src="../../images/vm-xp-midi/dls-sf2.png" width="60%" />

<br />

<img loading="lazy" src="../../images/vm-xp-midi/midi-player-1.png" width="60%" />

<br />

设置为系统默认 midi 播放器  

<img loading="lazy" src="../../images/vm-xp-midi/midi-player-2.png" width="60%" />

<br />

将声音输出到 Voicemeeter 的虚拟输出设备  

<img loading="lazy" src="../../images/vm-xp-midi/midi-player-3.png" width="60%" />

<br />

打开 FSCapture 的麦克风设置 选择 VoiceMeeter vaio 同时播放 midi 音乐  
观察音量指示器 有显示则说明设置均正确 可以准备进行录制  

<img loading="lazy" src="../../images/vm-xp-midi/midi-player-4.png" width="60%" />

<br />

注意在录制过程中 需要保持 Voicemeeter 和 VirtualMIDISynth 处于运行状态  

