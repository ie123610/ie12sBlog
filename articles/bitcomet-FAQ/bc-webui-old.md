# 比特彗星旧版 WebUI 研究

2026.8.12  

## 前言

旧版 BC WebUI 请求方法整理 以2.21版本的比特彗星为研究基础  
其存在时间较长 适用版本广泛 请求方法 相较于新版 WebUI 更为简单  

但整体比较简陋 存在功能缺失 数据获取不方便 有些信息只能从 HTML 页面中提取  
适合完成简单下载推送和信息查看任务  

旧版 webUI 的输出均为英文 不受 GUI 中语言选项的影响  

---

## 验证和登录

旧版 WebUI 使用 HTTP basic 验证  
GUI 中的 `localhost 客户端免于登录验证` 和 `IP 白名单中的客户端免于登录验证`  
选项不适用于 旧版 WebUI  

调用时在请求头中添加 `Authorization: Basic <Base64-encoded-credentials>`以通过验证  
示例 `Authorization: Basic aWUxMjoxMjM0NTY3OA==`  
`aWUxMjoxMjM0NTY3OA==` 为 `ie12:12345678` 进行 base64 编码后的结果  

在 curl 中可以使用 `-u` 发送用户名和密码  

---

## 添加任务


### 通用内容

没有路径有效性检查 提交无效下载保存路径也可以成功添加任务  
但是因为路径无效 任务会报错停止  

请求后返回 html 内容 需要自行解析并寻找关键词  

* 成功: `Add task succeed! [<a href='/panel/task_detail?id=xxxx'>view new task</a>]`
* 失败: `Add task failed!`
* 任务已经存在: `Task already exists! [<a href='/panel/task_detail?id=xxxx'>view existing task</a>]`

部分选项具有默认值 如保存路径 其与 GUI 中的设置对应  
其不能像 GUI 那样拥有多个候选项目 页面上只会显示一个值  

对于保存路径而言只会显示默认保存目录 无法获取 GUI 中设置的其他候选目录  
获得这些参数需要自行解析 HTML 页面内输入框内容  


### 磁链添加

请求路径：`/panel/task_add_magnet_result`  
请求方法： POST  
表单项目：`url` （磁力链接/torrent文件下载链接） `save_path` （文件下载路径）  

请求示例：  

```
curl -u ie12:12345678 -X POST "http://127.0.0.1:1235/panel/task_add_magnet_result" --data-urlencode "url=magnet:?xt=urn:btih:dafc8c076ca2f3ed376eeae7c76a0d6be2415c45" --data-urlencode "save_path=C:\Users\Administrator\Downloads\"
```

**注意事项**  
url 字段 **不支持纯哈希值需要磁力头**  
v1 v2 磁力均支持 哈希值部分支持 base32 和 十六进制 格式  

url 允许填写 http 链接 BC 会尝试通过此链接下载 torrent 文件  
下载成功后 会自动开始 BT 任务  


### Torrent 文件添加

请求路径：`/panel/task_add_bt`  
请求方法： POST  
表单项目：`torrent_file` （要上传的torrent文件路径） `save_path` （文件下载路径）  

请求示例：  

```
curl -u ie12:12345678 -X POST "http://127.0.0.1:1235/panel/task_add_bt_result" -F "torrent_file=@C:\Users\Administrator\Desktop\ubuntu-26.04-desktop-amd64.iso.torrent" -F "save_path=C:\Users\Administrator\Downloads\"
```


### HTTP/FTP 任务

请求路径：`/panel/task_add_httpftp`  
请求方法： POST  
表单项目：  


| 表单内容 | 是否可选 | 说明 |
|----------------------|----------|------|
| `url` | **必填** | HTTP/FTP 下载链接 |
| `save_path` | **必填** | 保存目录 |
| `connection` | **必填** | 下载线程数 |
| `file_name` | 可选 | 自定义保存文件名 |
| `referrer` | 可选 | 自定义 Referer |
| `user_agent` | 可选 | 自定义 User-Agent |
| `cookie` | 可选 | 自定义 Cookie |
| `checkboxCustomHeadersForMirrors` | 可选 | 是否向镜像地址发送自定义 headers（选中时发送值为 `on`） |
| `checkboxSpeedLimit` | 可选 | 是否启用限速（选中时发送值为 `on`） |
| `textSpeedLimit` | 可选 | 限速值（KB/s），仅在启用限速时生效 |
| `checkboxNeedUsernameAndPassword` | 可选 | 是否需要认证（选中时发送值为 `on`） |
| `textUsername` | 可选 | 认证用户名 |
| `textPassword` | 可选 | 认证密码 |
| `mirror_url_list` | 可选 | 镜像 URL 列表（每行一个） |


基础请求示例：  

```
curl -u ie12:12345678 -X POST "http://127.0.0.1:1235/panel/task_add_httpftp_result" --data-urlencode "url=https://releases.ubuntu.com/26.04/ubuntu-26.04-desktop-amd64.iso" --data-urlencode "save_path=C:\Users\Administrator\Downloads\" --data-urlencode "connection=16"
```

完整参数示例：  

```
curl -u ie12:12345678 -X POST "http://127.0.0.1:1235/panel/task_add_httpftp_result" --data-urlencode "url=http://example.com/file.zip" --data-urlencode "save_path=C:\Downloads" --data-urlencode "connection=32" --data-urlencode "file_name=myfile.zip" --data-urlencode "referrer=https://example.com" --data-urlencode "user_agent=Mozilla/5.0" --data-urlencode "cookie=sessionid=abc123" --data-urlencode "checkboxCustomHeadersForMirrors=on" --data-urlencode "checkboxSpeedLimit=on" --data-urlencode "textSpeedLimit=500" --data-urlencode "checkboxNeedUsernameAndPassword=on" --data-urlencode "textUsername=admin" --data-urlencode "textPassword=123456" --data-urlencode "mirror_url_list=http://mirror1.com/file.zip%0Ahttp://mirror2.com/file.zip"
```


---

## 状态信息获取

少部分信息以 XML 格式输出 大部分需要从 HTML 中解析  

### 获取软件运行状态

请求路径：`/panel/statistics`
请求方法： GET  
返回内容格式：`text/html`

需要自行解析 html 表格中的内容  
其对应 GUI 中的 **统计** 选项卡  

其页面输出信息的详细程度 与高级设置中的 专家模式 开启情况无关  
详细程度总是相当于 GUI 中开启专家模式的情况  


<details>
<summary>可获取信息</summary>

```
+--------------------------------+--------------------------------+
| Version:                       | BitComet(64-bit) 2.21 Stable   |
|                                | Release                        |
| Up Time:                       | 2:18:11                        |
| Overall Tasks:                 | Total: 5 / Running: 0          |
| Long-Term Seeding:             | 4 files ready for seeding      |
| Metadata Downloading:          | None                           |
| Metadata Cache Files:          |                              0 |
| Torrent Exchange Blocklist:    |                              0 |
| Remote Access:                 | Web UI                         |
|                                |
| TCP Connections:               | Established: 4 [MAX:Unlimited] |
|                                | / Half-Open: 0 [MAX:1000] /    |
|                                | Pending: 0                     |
| Established:                   | incoming:4                     |
| Half-Open:                     |                                |
| Pending:                       |                                |
| LAN IP:                        | 192.168.5.200                  |
| WAN IP:                        | ***.***.***.***                |
| BitTorrent Listen Port (TCP):  | 6000 (Opened in                |
|                                | Firewall/Router)               |
| IPv4:                          | Opened in Firewall/Router      |
| IPv6:                          | Not Detected                   |
| BitTorrent Listen Port (UDP):  | 6000 (Opened in                |
|                                | Firewall/Router)               |
| IPv4:                          | Opened in Firewall/Router      |
| IPv6:                          | Not Detected                   |
| uTP IPv4:                      | Not observed                   |
| uTP IPv6:                      | Not observed                   |
| Remote Access Listen Port      | 1235 (Blocked by               |
| (TCP):                         | Firewall/Router)               |
| IPv4:                          | Blocked by Firewall/Router     |
| IPv6:                          | Not Detected                   |
| LSD Listen Port (UDP):         |                           6771 |
| Windows Firewall:              | Added [app allowed, TCP 1235   |
|                                | added, TCP 6000 added, UDP     |
|                                | 6000 added]                    |
| UPnP NAT port mapping:         | Failed [TP-LINK                |
|                                | (http://192.168.5.181/)]       |
|                                |
| Overall Download Rate:         | 0 KB/s [Max: 3.9 GB/s]         |
| TCP Trackers:                  | 0 KB/s                         |
| Metadata download for BT       | 0 KB/s                         |
| tasks:                         |                                |
| Metadata download for torrent  | 0 KB/s                         |
| list:                          |                                |
| Overall Upload Rate:           | 0 KB/s [Max: 3.8 GB/s]         |
| Long-Term Seeding:             | 0 KB/s [MAX:3.8 GB/s]          |
| Remote Access:                 | 3 KB/s                         |
| DHT Network Nodes:             | IPv4: Disabled IPv6: Disabled  |
| DNS Query:                     | Cached: 3 Pending: 0           |
|                                |
| CPU Usage:                     | 0.3% (4 cores 4 threads)       |
| Memory Usage:                  | Working Set: 83.2 MB, Commit   |
|                                | Size: 39.4 MB                  |
| [Process Heap]                 | 12.0 MB                        |
| Disk Cache:                    | 0 B                            |
| Disk Write Buffer:             | 0 B                            |
| TCP Transfer Buffer:           | 4 KB                           |
| UDP Transfer Buffer:           | 0 B                            |
| File List:                     | 0 B                            |
| Torrent List:                  | 1.08 KB                        |
| Metadata Buffer:               | 0 B                            |
| Metadata Download:             | 0 B                            |
| Tracker Log:                   | 0 B                            |
| Task Log:                      | 0 B                            |
| Peer Log:                      | 0 B                            |
| Global Log:                    | 13.2 KB                        |
| Reserved Regions:              | 32.0 KB                        |
| Free Memory:                   | Physical: 3.98 GB/7.99 GB (Min |
|                                | to keep: 1024 MB), Virtual:    |
|                                | 3.64 GB/9.24 GB, Process:      |
|                                | 127.9 TB/127.9 TB              |
| Storage Usage:                 | Local Storage: 111.8 GB /      |
|                                | 255.3 GB (56.1% available)     |
| (C:)                           | 111.8 GB / 255.3 GB (56.1%     |
|                                | available)                     |
| Disk Cache Size:               | Total Size: 0 B                |
| BitTorrent:                    | 0 B (Max: 1024 MB)             |
| HTTP/FTP:                      | 0 B                            |
| Long-Term Seed:                | 0 B (Max: 1024 MB)             |
| Disk Read Statistics:          | Request: 0 (freq: 0.0/s),      |
|                                | Actual Disk Read: 0 (freq:     |
|                                | 0.0/s), Hit Ratio: 0.0%        |
| BitTorrent:                    | Request: 0 (freq: 0.0/s),      |
|                                | Actual Disk Read: 0 (freq:     |
|                                | 0.0/s), Hit Ratio: 0.0%        |
| Long-Term Seed:                | Request: 0 (freq: 0.0/s),      |
|                                | Actual Disk Read: 0 (freq:     |
|                                | 0.0/s), Hit Ratio: 0.0%        |
| Disk Write Statistics:         | Request: 0 (freq: 0.0/s),      |
|                                | Actual Disk Write: 0 (freq:    |
|                                | 0.0/s), Hit Ratio: 0.0%        |
| BitTorrent:                    | Request: 0 (freq: 0.0/s),      |
|                                | Actual Disk Write: 0 (freq:    |
|                                | 0.0/s), Hit Ratio: 0.0%        |
| HTTP/FTP:                      | Request: 0 (freq: 0.0/s),      |
|                                | Actual Disk Write: 0 (freq:    |
|                                | 0.0/s), Hit Ratio: 0.0%        |
| Disk Boost Service:            | Running                        |
|                                |
| Total Downloaded:              | 155.8 MB (this session: 32.9   |
|                                | KB)                            |
| Total Uploaded:                | 20.5 MB (this session: 45.3    |
|                                | KB)                            |
|                                |
| UDP Transfer:                  | bytes recv[36.0 KB]: 0 KB/s,   |
|                                | send[2.05 KB] 0 KB/s           |
|                                | packets recv[434]: 0 pkt/s,    |
|                                | send[105] 0 pkt/s              |
|                                | queue recv: 0, send: 0         |
| DHT                            | bytes recv[0 B]: 0 KB/s,       |
|                                | send[0 B] 0 KB/s               |
|                                | packets recv[0]: 0 pkt/s,      |
|                                | send[0]: 0 pkt/s               |
|                                | queue send: 0                  |
|                                | outbound pps limit: 50,        |
|                                | tokens: 50.0/50, pending       |
|                                | request limit: 65,536, pending |
|                                | requests: 0                    |
|                                | dropped outbound requests      |
|                                | (queue full): 0 (ping: 0,      |
|                                | find_node: 0, get_peers: 0,    |
|                                | announce_peer: 0)              |
|                                | passive replies pending: 0,    |
|                                | pending limit: 2,048, pps      |
|                                | limit: 50, tokens: 50.0/50     |
|                                | dropped passive replies:       |
|                                | 0 (ping: 0, find_node: 0,      |
|                                | get_peers: 0, announce_peer:   |
|                                | 0, error: 0)                   |
|                                | passive reply drop reasons:    |
|                                | queue full 0, expired 0,       |
|                                | per-IP limited 0               |
|                                | maintenance ping sweep: IPv4   |
|                                | idle (0 remaining to scan),    |
|                                | IPv6 idle (0 remaining to      |
|                                | scan)                          |
|                                | get_peers pending: IPv4 0,     |
|                                | IPv6 0                         |
|                                | find_node pending: IPv4 0,     |
|                                | IPv6 0                         |
|                                | announce_peer pending: IPv4 0, |
|                                | IPv6 0                         |
|                                | ping pending: IPv4 0, IPv6 0   |
| UDP tracker                    | bytes recv[0 B]: 0 KB/s,       |
|                                | send[0 B] 0 KB/s               |
|                                | packets recv[0]: 0 pkt/s,      |
|                                | send[0]: 0 pkt/s               |
|                                | queue send: 0                  |
| LTSeed UDP client              | bytes recv[0 B]: 0 KB/s,       |
|                                | send[0 B] 0 KB/s               |
|                                | packets recv[0]: 0 pkt/s,      |
|                                | send[0]: 0 pkt/s               |
|                                | queue send: 0                  |
| LTSeed UDP server              | bytes recv[0 B]: 0 KB/s,       |
|                                | send[0 B] 0 KB/s < 3.8 GB/s    |
|                                | packets recv[0]: 0 pkt/s,      |
|                                | send[0]: 0 pkt/s               |
|                                | queue send: 0                  |
| uTP                            | bytes recv[4.05 KB]: 0 KB/s,   |
|                                | send[2.05 KB] 0 KB/s           |
|                                | packets recv[106]: 0 pkt/s,    |
|                                | send[105]: 0 pkt/s             |
|                                | queue send: 0                  |
| IP/NAT detect                  | bytes recv[109 B]: 0 KB/s,     |
|                                | send[0 B] 0 KB/s               |
|                                | packets recv[1]: 0 pkt/s,      |
|                                | send[0]: 0 pkt/s               |
|                                | queue send: 0                  |
+--------------------------------+--------------------------------+
```

</details>


### 获取任务列表

**XML**  

请求路径：`/panel/task_list_xml`  
请求方法： GET  
返回内容格式：`task_list_xml`

可获取信息：  

**全局信息**（根节点 `<task_list>`）  

| 字段 | 含义 | 示例值 |
|------|------|--------|
| `<up_time>` | 客户端运行时长（秒） | `32198` |
| `<running_task_num>` | 当前正在运行的任务数 | `0` |
| `<total_task_num>` | 任务总数（含已停止、已完成） | `5` |
| `<down_rate>` | 全局下载速率（字符串） | `0 KB/s` |
| `<up_rate>` | 全局上传速率（字符串） | `0 KB/s` |


上传和下载速度部分应该支持“自动量程”  
即当速度大于 1024 KB 时会自动切换单位的 MB  


**任务信息**（每个 `<task>` 节点）  

| 字段 | 含义 | 数据类型 | 示例值 | 适用任务类型 |
|------|------|----------|--------|-------------|
| `<type>` | 任务协议类型 | 字符串 | `BT`, `FTP`, `HTTPS`, `HTTP` | 全部 |
| `<name>` | 任务名称（文件名） | 字符串 | `ubuntu-26.04-desktop-amd64.iso` | 全部 |
| `<id>` | 任务唯一标识（整数） | 整数 | `1007` | 全部 |
| `<size>` | 文件总大小（字节） | 整数 | `6518974464` | 全部 |
| `<state>` | 任务状态（running stopped） | 字符串 | `stopped` | 全部 |
| `<progress_permillage>` | 下载进度（千分比，1000=100%） | 整数 | `5（0.5%）、1000（完成）` | 全部 |
| `<down_speed>` | 当前下载速度（字节/秒） | 整数 | `0` | 全部 |
| `<download_time_left>` | 预估剩余下载时间（秒），`-1` 表示未知 | 整数 | `0` | 全部 |
| `<download_time_elapsed>` | 已下载耗时（秒） | 整数 | `21` | 全部 |
| `<created_time>` | 任务创建时间（Unix 时间戳） | 整数 | `-` | 全部 |
| `<finish_time>` | 任务完成时间（Unix 时间戳），极大值表示未完成 | 整数 | `-` | 全部 |
| `<comment>` | 用户注释（通常为空） | 字符串 | （空） | 全部 |
| `<bytes_downloaded>` | 已下载字节数 | 整数 | `58982400` | BT |
| `<bytes_uploaded>` | 已上传字节数 | 整数 | `0` | BT |
| `<up_speed>` | 当前上传速度（字节/秒） | 整数 | `0` | BT |
| `<total_time_elapsed>` | 总耗时（秒，含上传时间） | 整数 | `21` | BT |
| `<infohash>` | Info Hash（v1，40位十六进制） | 字符串 | `-` | BT |
| `<infohash_v2>` | Info Hash v2（64位十六进制，全零表示未使用） | 字符串 | `-` | BT |
| `<piece_size>` | 分块大小（字节） | 整数 | `262144` | BT |
| `<seeders>` | 当前连接到的种子数 | 整数 | `0` | BT |
| `<total_seeders>` | Tracker 统计的总种子数 | 整数 | `371` | BT |
| `<peers>` | 当前连接到的对等方数 | 整数 | `0` | BT |
| `<total_peers>` | Tracker 统计的总对等方数 | 整数 | `0` | BT |
| `<trackers>` | 跟踪器列表（包含多个 `<URL>` 子节点） | 字符串列表（URL） | `-` | BT |

任务 id 从 `1000` 开始  
此处的任务状态应该只有 running 和 stopped 两种  
即只区分是否在运行 而不区分 是否完成 是否做种 或者 存在错误  

**HTML**  

通过解析 HTML 页面也可以获取任务信息  
不过相比 XML 而已信息量更少 使用也不方便 其多了三个任务状态分类  
通过 XML 中的状态和下载进度也其实可以进行分类  

请求地址：  

* 所有任务 `/panel/task_list`  
* 正在下载`/panel/task_list?group=downloading`  
* 已完成 `/panel/task_list?group=completed`  
* 正在运行 `/panel/task_list?group=active`  

请求方法： GET  

其中的 正在下载 （downloading） 更准确的表达是 未完成  
事实上所有进度不到 100% 的任务都会算在里面  
即使这些任务处于停止状态  


### 任务详情获取

此部分全部需要通过解析 HTML 获取  

#### 摘要（Summary）

请求地址：`/panel/task_detail?id=xxxx&show=summary`  

可用内容示例:  

<details>
<summary>可获取信息</summary>

```
+---------------+---------------------------------------------------------------------------------------------------------------+
|     ITEM      |                                                     VALUE                                                     |
+---------------+---------------------------------------------------------------------------------------------------------------+
| Save location | C:\Users\Administrator\Downloads\种子市场-数据交换                                                            |
| Files size    | 32.0 KB Selected:32.0 KB                                                                                      |
| Progress      | 99.9% ( 14 B left )                                                                                           |
|               |
| Torrent       | C:\Users\Administrator\Desktop\BC测试\BitComet_2.21_比特彗星贴吧解锁高配版\torrents\种子市场-数据交换.torrent |
| InfoHash      | 2842c50d66d646d0068fb1e1a01296c25365408e                                                                      |
|               | Piece size:32.0 KB                                                                                            |
| Comment       |                                                                                                               |
|               |
| Added time    | 2026-08-07 08:36:24                                                                                           |
| Finish time   |                                                                                                               |
| Time elapsed  | 2:09:24(download only)                                                                                        |
|               | 2:09:24(total)                                                                                                |
| Downloaded    | 16.0 KB ( 0 KB/s)                                                                                             |
| Uploaded      | 0 B ( 0 KB/s)                                                                                                 |
+---------------+---------------------------------------------------------------------------------------------------------------+
```
</details>


此部分的实用价值较小 大部分内容在 XML 任务列表中都可以获取  
不过 任务状态多出了 hashing 和 queued  

#### 追踪器（trackers）

请求地址：`/panel/task_detail?id=xxxx&show=trackers`  
获取指定任务的 tracker 列表 及其连接状态 （仅 BT 任务）  

可用内容示例:  

<details>

<summary>可获取信息</summary>

```
+----------------------------------------------------------+---------+----------------+------------------------------------+
|                       TRACKER URL                        | RETRIES | TIME REMAINING |               STATUS               |
+----------------------------------------------------------+---------+----------------+------------------------------------+
| Peer Exchange                                            |       0 |                | 2026-08-10 19:55:10: 26 added,     |
|                                                          |         |                | 91 received in total               |
| DHT Network                                              |       0 |                |                                    |
| DHT IPv6 Network                                         |       0 |                |                                    |
| Long-Term Seeds                                          |       0 | 0:00:56        | 2026-08-10 19:55:07: 0 added,      |
|                                                          |         |                | 0 received in total                |
| Local Service Discovery                                  |       0 | 0:00:06        | 2026-08-10 19:55:07: Announce      |
|                                                          |         |                | pending                            |
| http://1337.abcvg.info/announce                          |       0 | 3:01:45        | 2026-08-10 19:55:08: Logged        |
|                                                          |         |                | in; Tracker returned 64 peers      |
| http://bt1.archive.org:6969/announce                     |       0 |                | 2026-08-10 19:55:07:               |
|                                                          |         |                | Connecting...                      |
| http://bt2.archive.org:6969/announce                     |       0 |                | 2026-08-10 19:55:07:               |
|                                                          |         |                | Connecting...                      |
| http://ipv4announce.sktorrent.eu:6969/announce           |       0 | 0:31:38        | 2026-08-10 19:55:09: Logged        |
|                                                          |         |                | in; Tracker returned 65 peers      |
| http://nyaa.tracker.wf:7777/announce                     |       0 | 2:57:11        | 2026-08-10 19:55:08: Logged        |
|                                                          |         |                | in; Tracker returned 0 peers       |
| http://torrentsmd.com:8080/announce                      |       1 | 0:00:17        | 2026-08-10 19:55:08: Tracker       |
|                                                          |         |                | connection error: HTTP             |
|                                                          |         |                | unsuitable status code [403        |
|                                                          |         |                | Forbidden]                         |
| http://tracker.dhitechnical.com:6969/announce            |       1 | 0:00:19        | 2026-08-10 19:55:09: Tracker       |
|                                                          |         |                | connection error: 10061            |
|                                                          |         |                | 由于目标计算机积极拒绝，无法连接。 |
| http://tracker.renfei.net:8080/announce                  |       0 | 2:57:38        | 2026-08-10 19:55:09: Logged        |
+----------------------------------------------------------+---------+----------------+------------------------------------+
```

</details>

#### 连接 （connection）

请求地址：`/panel/task_detail?id=xxxx&show=connection`  

获取指定任务的连接情况 （仅 HTTP/FTP）  
多线程下载时会显示每个线程及的 下载大小、下载速度、状态  
如果设置了镜像地址应该也会在此处显示  

与日志类似 此部分内容会在软件重启后清空  

<details>
<summary>可获取信息示例</summary>

```
+-----------------------------------------------------------------------+-----------+-----------+--------+
|                                  URL                                  | DOWN RATE | DOWN SIZE | STATUS |
+-----------------------------------------------------------------------+-----------+-----------+--------+
| http://bitcomet-backup.36102025.xyz/archive.BC.v2.X/BitComet_2.10.zip | 0 KB/s    | 2.19 MB   | Stop   |
| http://bitcomet-backup.36102025.xyz/archive.BC.v2.X/BitComet_2.10.zip | 0 KB/s    | 2.85 MB   | Stop   |
| http://bitcomet-backup.36102025.xyz/archive.BC.v2.X/BitComet_2.10.zip | 0 KB/s    | 2.89 MB   | Stop   |
| http://bitcomet-backup.36102025.xyz/archive.BC.v2.X/BitComet_2.10.zip | 0 KB/s    | 2.06 MB   | Stop   |
| http://bitcomet-backup.36102025.xyz/archive.BC.v2.X/BitComet_2.10.zip | 0 KB/s    | 2.20 MB   | Stop   |
| http://bitcomet-backup.36102025.xyz/archive.BC.v2.X/BitComet_2.10.zip | 0 KB/s    | 3.01 MB   | Stop   |
| http://bitcomet-backup.36102025.xyz/archive.BC.v2.X/BitComet_2.10.zip | 0 KB/s    | 2.72 MB   | Stop   |
| http://bitcomet-backup.36102025.xyz/archive.BC.v2.X/BitComet_2.10.zip | 0 KB/s    | 2.77 MB   | Stop   |
| http://bitcomet-backup.36102025.xyz/archive.BC.v2.X/BitComet_2.10.zip | 0 KB/s    | 2.28 MB   | Stop   |
| http://bitcomet-backup.36102025.xyz/archive.BC.v2.X/BitComet_2.10.zip | 0 KB/s    | 769.7 KB  | Stop   |
| http://bitcomet-backup.36102025.xyz/archive.BC.v2.X/BitComet_2.10.zip | 0 KB/s    | 2.35 MB   | Stop   |
| http://bitcomet-backup.36102025.xyz/archive.BC.v2.X/BitComet_2.10.zip | 0 KB/s    | 1.77 MB   | Stop   |
| http://bitcomet-backup.36102025.xyz/archive.BC.v2.X/BitComet_2.10.zip | 0 KB/s    | 1.63 MB   | Stop   |
| http://bitcomet-backup.36102025.xyz/archive.BC.v2.X/BitComet_2.10.zip | 0 KB/s    | 2.42 MB   | Stop   |
| http://bitcomet-backup.36102025.xyz/archive.BC.v2.X/BitComet_2.10.zip | 0 KB/s    | 2.26 MB   | Stop   |
| http://bitcomet-backup.36102025.xyz/archive.BC.v2.X/BitComet_2.10.zip | 0 KB/s    | 2.82 MB   | Stop   |
+-----------------------------------------------------------------------+-----------+-----------+--------+
```
</details>


#### 文件 （files）

请求地址：`/panel/task_detail?id=xxxx&show=files`  

获取指定任务的文件列表  
对于 HTTP/FTP 和 单文件 BT 任务来说意义不大  
因为他们只有一个文件  

<details>
<summary>可获取信息示例</summary>

```
+----------+----------+-----------+------+------------+------------------+
| PRIORITY | PROGRESS | FILE NAME | SIZE |  LT SEED   | OPERATION METHOD |
+----------+----------+-----------+------+------------+------------------+
| Finished | 100%     | 0.txt     | 27 B | No Support |                  |
| Normal   | 0.0%     | 1.txt     | 14 B | No Support |                  |
+----------+----------+-----------+------+------------+------------------+
```

</details>


#### 用户（peers）

请求地址：`/panel/task_detail?id=xxxx&show=peers`  

用于获取指定任务的 用户连接列表 （仅 BT 任务）  

值得注意的是 BC 会保存曾经连接过的用户  
所以即使任务不运行列表里也会有用户  
其输出的用户数量是有限的  

<details>
<summary>可获取信息示例（实际IP无遮挡）</summary>

```
+-----------------------------------------------+----------+-----------+---------+-----------+---------+------------+----------------+-----------------+--------------------+------------------------------------------+-----------------------------+
|                      IP                       | PROGRESS | DOWN RATE | UP RATE | DOWN SIZE | UP SIZE | INITIATION | PEER DOWN RATE | CONNECTION TIME |    CLIENT TYPE     |                 PEER ID                  |           STATUS            |
+-----------------------------------------------+----------+-----------+---------+-----------+---------+------------+----------------+-----------------+--------------------+------------------------------------------+-----------------------------+
| Myself                                        | 99.9%    | 2 KB/s    |         | 0 KB      | 0 KB    |            |                | 0:00:19         | BitComet 2.21      | 2d4243303232312de3abe8248c2d294b97c76d8e |                             |
| 183.7.*.*:32616                           | 50.0%    | 0 KB/s    | 0 KB/s  | 0 KB      | 0 KB    | Local      |                | 0:00:18         | BitComet 2.19      | 2d4243303231392d2fb3601c4f7203d38fc31f94 | _c_C                        |
| 122.235.*.*:19450                           | 50.0%    | 0 KB/s    | 0 KB/s  | 0 KB      | 0 KB    | Local      |                | 0:00:19         | BitComet 2.11      | 2d4243303231312d267f2d669f37d53a00bb9748 | _c_C                        |
| 144.52.*.*:22223                           | 50.0%    | 1 KB/s    | 0 KB/s  | 0 KB      | 0 KB    | Remote     |                | 0:00:03         | BitComet 1.93      | 2d4243303139332d3999d4bf16fdf5b46f89c71c | _c_C                        |
| 221.222.*.*:6000                          | 50.0%    | 0 KB/s    | 0 KB/s  | 0 KB      | 0 KB    | Remote     |                | 0:00:16         | BitComet 2.21      | 2d4243303232312dbaf9e3639e6a7927017503ca | _c_C                        |
| 223.167.*.*:18012                           | 50.0%    | 1 KB/s    | 0 KB/s  | 0 KB      | 0 KB    | Remote     |                | 0:00:05         | BitComet 2.21      | 2d4243303232312d1c1ab1664c37945306cbd0ef | _c_C                        |
| 146.120.*.*:19031                          | 50.0%    | 0 KB/s    | 0 KB/s  | 0 KB      | 0 KB    | Remote     |                | 0:00:02         | qBittorrent/5.2.3  | 2d7142353233302d2147464839542e5f72342d39 | ___C                        |
| 125.95.*.*:22223                           | 50.0%    | 0 KB/s    | 0 KB/s  | 0 KB      | 0 KB    | Remote     |                | 0:00:09         | BitComet 2.05      | 2d4243303230352d3deea31c13743150228c5ea6 | _c_C                        |
| 221.216.*.*:7209                          | 50.0%    | 0 KB/s    | 0 KB/s  | 0 KB      | 0 KB    | Local      |                | 0:00:19         | BitComet 2.12      | 2d4243303231322df43b85b9967f7108af637b06 | _c_C                        |
| 106.114.*.*:59498                         | 50.0%    | 0 KB/s    | 0 KB/s  | 0 KB      | 0 KB    | Remote     |                | 0:00:11         | qBittorrent/5.2.3  | 2d7142353233302d595644214a314559552d7350 | _c_C                        |
| 193.29.*.*:41390                           | 50.0%    | 0 KB/s    | 0 KB/s  | 0 KB      | 0 KB    | Local      |                | 0:00:18         | qBittorrent/5.2.3  | 2d7142353233302d466755306543492832386e2d | _c_C                        |
| 123.172.*.*:21000                         | 50.0%    | 0 KB/s    | 0 KB/s  | 0 KB      | 0 KB    | Remote     |                | 0:00:09         | BitComet 2.06      | 2d4243303230362dd5ffb2b73f15b90951fce520 | _c_C                        |
| 36.56.*.*:24654                              | 50.0%    | 1 KB/s    | 0 KB/s  | 0 KB      | 0 KB    | Remote     |                | 0:00:05         | BitComet 2.17      | 2d4243303231372df88f1264cbb21a3db2e30f00 | _c_C                        |
| 112.91.*.*:6889                             | 0.0%     | 0 KB/s    | 0 KB/s  | 0 KB      | 0 KB    | Local      |                | 0:00:19         | libtorrent/2.0.*.* | 2d4c54323037302d215430784a7477663965656b | _c_C                        |
| 120.41.*.*:22223                           | 50.0%    | 0 KB/s    | 0 KB/s  | 0 KB      | 0 KB    | Local      |                | 0:00:14         | BitComet 2.20      | 2d4243303232302d46d82b8b156bbb47d96c0aa1 | _c_C                        |
| 221.222.*.*:22223                         | 50.0%    | 1 KB/s    | 0 KB/s  | 0 KB      | 0 KB    | Remote     |                | 0:00:05         | BitComet 2.21      | 2d4243303232312d23f42f2a2a82dd5445a26e0e | _c_C                        |
| 14.109.*.*:22224                           | 50.0%    | 0 KB/s    | 0 KB/s  | 0 KB      | 0 KB    | Local      |                | 0:00:04         | BitComet 2.09      | 2d4243303230392d2be68a934e88cc9c042ebc65 | _c_C                        |
| 61.55.*.*:6000                            | 50.0%    | 0 KB/s    | 0 KB/s  | 0 KB      | 0 KB    | Remote     |                | 0:00:11         | BitComet 2.21      | 2d4243303232312d3068356348baafe14790f206 | _c_C                        |
| 112.92.*.*:9027                             | 0.0%     |           |         | 0 KB      | 0 KB    |            |                |                 |                    |                                          | connecting[0]:19            |
| 104.28.*.*:55905                           | 0.0%     |           |         | 0 KB      | 0 KB    |            |                |                 |                    |                                          | connecting[0]:19            |
| 1.27.*.*:38523                            | 0.0%     |           |         | 0 KB      | 0 KB    |            |                |                 |                    |                                          | connecting[0]:19            |
| 223.74.*.*:8080                            | 0.0%     |           |         | 0 KB      | 0 KB    |            |                |                 |                    |                                          | connecting[0]:19            |
| 170.150.*.*:6889                           | 0.0%     |           |         | 0 KB      | 0 KB    |            |                |                 |                    |                                          | connecting[0]:19            |
| 31.217.*.*:59498                          | 0.0%     |           |         | 0 KB      | 0 KB    |            |                |                 |                    |                                          | connecting[0]:0             |
| 118.248.*.*:20092                         | 0.0%     |           |         | 0 KB      | 0 KB    |            |                |                 |                    |                                          | connecting[0]:19            |
| 123.169.*.*:13738                          | 0.0%     |           |         | 0 KB      | 0 KB    |            |                |                 |                    |                                          | connecting[0]:19            |
| 106.37.*.*:6000                            | 0.0%     |           |         | 0 KB      | 0 KB    |            |                |                 |                    |                                          | connecting[0]:19            |
| 113.93.*.*:22223                            | 0.0%     |           |         | 0 KB      | 0 KB    |            |                |                 |                    |                                          | connecting[0]:19            |
| 117.154.*.*:11837                          | 0.0%     |           |         | 0 KB      | 0 KB    |            |                |                 |                    |                                          | connecting[0]:19            |
| 120.229.*.*:22223                          | 0.0%     |           |         | 0 KB      | 0 KB    |            |                |                 |                    |                                          | connecting[0]:19            |
| ...and more...                                |
| 58.212.*.*:6000                             |          |           |         | 0 KB      | 0 KB    |            |                |                 |                    |                                          | new                         |
| 14.104.*.*:21700                          |          |           |         | 0 KB      | 0 KB    |            |                |                 | [DHEv2]            | 2d4243303231332ddb0ea1113890921bc2370c9e | seen[1]:11                  |
| 27.186.*.*:22223                          |          |           |         | 0 KB      | 0 KB    |            |                |                 | [DHEv2]            | 2d4243303232312d52a5c1601ad9c8a6796a47d1 | seen[1]:13                  |
| 36.251.*.*:17887                          |          |           |         | 0 KB      | 0 KB    |            |                |                 | [DHEv2]            | 2d4243303230392d71f66f9a47e48dc66eafac26 | seen[1]:14                  |
| 39.89.*.*:33333                           |          |           |         | 0 KB      | 0 KB    |            |                |                 | [DHEv2]            | 2d4243303231372d112eba22b5c6a77892d0e7de | seen[1]:19                  |
| 111.73.*.*:22223                            |          |           |         | 0 KB      | 0 KB    |            |                |                 | [DHEv2]            | 2d4243303230372d5f2d2edbf9a1571b4dad59de | seen[1]:10                  |
| 111.193.*.*:22223                           |          |           |         | 0 KB      | 0 KB    |            |                |                 | [DHEv2]            | 2d4243303230352d8dac6e795304a45f486ecafa | seen[1]:17                  |
| 111.201.*.*:22223                         |          |           |         | 0 KB      | 0 KB    |            |                |                 | [DHEv2]            | 2d4243303232312dc71e42cb01e0f12601efd38d | seen[1]:13                  |
| 112.192.*.*:22223                          |          |           |         | 0 KB      | 0 KB    |            |                |                 | [DHEv2]            | 2d4243303232302d0c28ba402c6184c530d9d5e9 | seen[1]:14                  |
| 113.128.*.*:55189                         |          |           |         | 0 KB      | 0 KB    |            |                |                 | [DHEv2]            | 2d4243303232312d15822cd1a6c8b464a5e25fbb | seen[1]:10                  |
| 123.88.*.*:7155                           |          |           |         | 0 KB      | 0 KB    |            |                |                 |                    | 2d4243303139382d51fd5bcad7d7d0acb2fe74b2 | seen[1]:9                   |
| 217.217.*.*:6082                          |          |           |         | 0 KB      | 0 KB    |            |                |                 | [DHEv2]            | 2d4243303232312dd1fd19f190aa9bc60b973a6c | seen[1]:19                  |
| 221.197.*.*:22223                         |          |           |         | 0 KB      | 0 KB    |            |                |                 | [DHEv2]            | 2d4243303232312d7a5186263b0f86b61a07277d | seen[1]:13                  |
| 36.163.*.*:8888                           |          |           |         | 0 KB      | 0 KB    |            |                |                 |                    |                                          | dead[1|0|0]:3               |
| 39.182.*.*:16369                           |          |           |         | 0 KB      | 0 KB    |            |                |                 |                    |                                          | dead[1|0|0]:5               |
| 49.75.*.*:65111                            |          |           |         | 0 KB      | 0 KB    |            |                |                 |                    |                                          | dead[1|0|0]:16              |
| 61.55.*.*:62240                           |          |           |         | 0 KB      | 0 KB    |            |                |                 |                    |                                          | dead[1|0|0]:2               |
| 67.21.*.*:61839                             |          |           |         | 0 KB      | 0 KB    |            |                |                 |                    |                                          | dead[1|0|0]:15              |
| 190.104.*.*:31025                          |          |           |         | 0 KB      | 0 KB    |            |                |                 |                    |                                          | dead[1|0|0]:9               |
| 218.28.*.*:56030                           |          |           |         | 0 KB      | 0 KB    |            |                |                 |                    |                                          | dead[1|0|0]:16              |
| 221.222.*.*:25160                         |          |           |         | 0 KB      | 0 KB    |            |                |                 |                    |                                          | dead[1|0|0]:11              |
| 221.222.*.*:55532                         |          |           |         | 0 KB      | 0 KB    |            |                |                 |                    |                                          | dead[1|0|0]:1               |
| 222.217.*.*:6000                          |          |           |         | 0 KB      | 0 KB    |            |                |                 |                    |                                          | dead[1|0|0]:15              |
| 2001:b011:5c0a:f3cc:*:*:*:*:8888   |          |           |         | 0 KB      | 0 KB    |            |                |                 |                    |                                          | dead[1|0|0]:17              |
| 2001:b011:e011:8965:*:*:*:*22924 |          |           |         | 0 KB      | 0 KB    |            |                |                 |                    |                                          | dead[1|0|0]:14              |
| 2408:8207:70:4341:*:*:*:*:6000    |          |           |         | 0 KB      | 0 KB    |            |                |                 |                    |                                          | dead[1|0|0]:18              |
| 2408:8207:72:8c20:*:*:*:*22223    |          |           |         | 0 KB      | 0 KB    |            |                |                 |                    |                                          | dead[1|0|0]:19              |
| 240e:b87:1f9:bf00:*:*:*:*20092   |          |           |         | 0 KB      | 0 KB    |            |                |                 |                    |                                          | dead[1|0|0]:18              |
| 240e:b8f:2da3:7200:*:*:*:*20190  |          |           |         | 0 KB      | 0 KB    |            |                |                 |                    |                                          | dead[1|0|0]:17              |
| 2605:6400:30:f8b7:*:*:*:*53171   |          |           |         | 0 KB      | 0 KB    |            |                |                 |                    |                                          | dead[1|0|0]:17              |
| 2a09:bac5:3980:2646::3d0:56:55905             |          |           |         | 0 KB      | 0 KB    |            |                |                 |                    |                                          | dead[1|0|0]:18              |
| 2a12:bec4:1823:2::a:6082                      |          |           |         | 0 KB      | 0 KB    |            |                |                 |                    |                                          | dead[1|0|0]:15              |
| 31.217.*.*:56865                           |          |           |         | 0 KB      | 0 KB    |            |                |                 |                    | 0000000000000000000000000000000000000000 | banned (anti_leech) : ∞     |
| 31.217.*.*:6890                           |          |           |         | 0 KB      | 0 KB    |            |                |                 |                    | 0000000000000000000000000000000000000000 | banned (peer_ip_banned) : ∞ |
| 31.217.*.*:26060                          |          |           |         | 0 KB      | 0 KB    |            |                |                 |                    | 0000000000000000000000000000000000000000 | banned (peer_ip_banned) : ∞ |
| 31.217.*.*:7541                           |          |           |         | 0 KB      | 0 KB    |            |                |                 |                    | 0000000000000000000000000000000000000000 | banned (anti_leech) : ∞     |
| 31.217.*.*:32103                           |          |           |         | 0 KB      | 0 KB    |            |                |                 |                    | 0000000000000000000000000000000000000000 | banned (anti_leech) : ∞     |
| 42.48.*.*:15247                            |          |           |         | 0 KB      | 0 KB    |            |                |                 |                    | 0000000000000000000000000000000000000000 | banned (peer_ip_banned) : ∞ |
| 42.48.*.*:11713                            |          |           |         | 0 KB      | 0 KB    |            |                |                 |                    | 0000000000000000000000000000000000000000 | banned (peer_ip_banned) : ∞ |
| 42.49.*.*:10659                           |          |           |         | 0 KB      | 0 KB    |            |                |                 |                    | 0000000000000000000000000000000000000000 | banned (peer_ip_banned) : ∞ |
| 42.49.*.*:16047                           |          |           |         | 0 KB      | 0 KB    |            |                |                 |                    | 0000000000000000000000000000000000000000 | banned (peer_ip_banned) : ∞ |
| ...and more...                                |
+-----------------------------------------------+----------+-----------+---------+-----------+---------+------------+----------------+-----------------+--------------------+------------------------------------------+-----------------------------+
```
<details>


#### 任务日志（log）

请求地址：`/panel/task_detail?id=xxxx&show=log`  

获取指定任务的 日志 信息  
没有专门的字段可用于判断日志类型 （信息 警告 错误） 
只能通过分析文本中的关键词来确定类型  

所有任务的日志会在软件重启后清空  

<details>
<summary>可获取信息示例</summary>

```
+---------------------+--------------------------------------------+
|        TIME         |                  MESSAGE                   |
+---------------------+--------------------------------------------+
| 2026-08-09 18:00:03 | Tracker返回 27 个用户。                    |
| 2026-08-09 18:00:03 | Tracker返回 16 个用户。                    |
| 2026-08-09 18:00:03 | Tracker返回 3 个用户。                     |
| 2026-08-09 18:00:27 | 任务正在停止...                            |
| 2026-08-09 18:00:27 | 任务停止。                                 |
| 2026-08-10 19:55:07 | 任务离开等待队列。                         |
| 2026-08-10 19:55:07 | 任务启动。                                 |
| 2026-08-10 19:55:07 | 打开torrent文件：种子市场-数据交换.torrent |
| 2026-08-10 19:55:07 | Tracker返回 20 个用户。                    |
| 2026-08-10 19:55:07 | Tracker返回 45 个用户。                    |
| 2026-08-10 19:55:08 | Tracker返回 55 个用户。                    |
| 2026-08-10 19:55:09 | Tracker返回 92 个用户。                    |
| 2026-08-10 19:55:09 | Tracker返回 65 个用户。                    |
| 2026-08-10 19:55:22 | 任务正在停止...                            |
| 2026-08-10 19:55:22 | 任务停止。                                 |
| 2026-08-10 20:44:01 | 任务离开等待队列。                         |
| 2026-08-10 20:44:01 | 任务启动。                                 |
| 2026-08-10 20:44:01 | 打开torrent文件：种子市场-数据交换.torrent |
| 2026-08-10 20:44:01 | Tracker返回 15 个用户。                    |
| 2026-08-10 20:44:01 | Tracker返回 19 个用户。                    |
+---------------------+--------------------------------------------+
```

<details>

值得注意的是针对 HTTP/FTP 任务还可以获取到每一个线程的日志  
可以看到 HTTP/FTP 的请求和响应内容  

请求地址：`/panel/task_detail?id=xxxx&show=log&log_index=x`

<details>
<summary>可获取信息示例</summary>

```
+---------------------+--------------------------------+
|        TIME         |            MESSAGE             |
+---------------------+--------------------------------+
| 2026-08-10 22:00:28 | 工作线程启动。                 |
| 2026-08-10 22:00:28 | 开始连接test.rebex.net:21...   |
| 2026-08-10 22:00:28 | 连接test.rebex.net:21成功。    |
| 2026-08-10 22:00:28 | 等待欢迎信息……                 |
| 2026-08-10 22:00:29 | 220-Welcome to test.rebex.net! |
|                     | See https://test.rebex.net/    |
|                     | for more information and       |
|                     | terms of use. 220 If you don't |
|                     | have an account, log in as     |
|                     | 'anonymous' or 'ftp'.          |
| 2026-08-10 22:00:29 | USER anonymous                 |
| 2026-08-10 22:00:30 | 331 Anonymous login OK, send   |
|                     | your complete email address as |
|                     | your password.                 |
| 2026-08-10 22:00:30 | PASS                           |
| 2026-08-10 22:00:31 | 230 User 'anonymous' logged    |
|                     | in.                            |
| 2026-08-10 22:00:31 | CWD /pub/example               |
| 2026-08-10 22:00:31 | 250 Directory changed to       |
|                     | "/pub/example".                |
| 2026-08-10 22:00:31 | TYPE I                         |
| 2026-08-10 22:00:31 | 200 TYPE set to I.             |
| 2026-08-10 22:00:31 | SIZE WinFormClient.png         |
| 2026-08-10 22:00:32 | 213 80000                      |
| 2026-08-10 22:00:32 | PASV                           |
| 2026-08-10 22:00:32 | 227 Entering Passive Mode      |
|                     | (194,108,117,16,4,9)           |
| 2026-08-10 22:00:32 | REST 0                         |
| 2026-08-10 22:00:33 | 350 Restarting at 0.           |
| 2026-08-10 22:00:33 | RETR WinFormClient.png         |
| 2026-08-10 22:00:33 | 125 Data connection already    |
|                     | open; starting 'BINARY'        |
|                     | transfer.                      |
| 2026-08-10 22:00:33 | 开始读取数据...                |
| 2026-08-10 22:00:35 | 成功收到 80000 字节数据。      |
| 2026-08-10 22:00:35 | 没有需要下载的区域。           |
| 2026-08-10 22:00:35 | 工作线程停止。                 |
+---------------------+--------------------------------+
```

<details>

---


## 任务控制


### 单任务启停

请求路径：  
* 启动 `/panel/task_action?id=xxxx&action=start`
* 停止 `/panel/task_action?id=xxxx&action=stop`

请求方法： GET  
返回内容格式：302 重定向  

在获取任务 ID 后通过此接口即可控制任务启停  
其不会返回实际内容 而只有一个重定向 指向任务列表  
需要通过任务列表来获取更新后的 任务状态  

**注意** 下载完成的 HTTP/FTP 任务 不会响应启动和停止请求  
其总是处于停止状态  


### 任务删除

请求路径：  
* 仅删除任务 `/panel/task_delete?id=xxxx&action=delete_task`
* 删除任务和下载的文件 `/panel/task_delete?id=xxxx&action=delete_all`

请求方法： GET  
返回内容格式：302 重定向  

在获取任务 ID 后通过此接口即可删除任务  
其不会返回实际内容 而只有一个重定向 指向任务列表  
需要通过任务列表来获取更新后的任务状态（即是否从列表中消失）


### 批量任务控制

请求路径：  

* 开始全部下载 `/panel/tasklist_action?id=start_all_download`
* 开始全部上传 `/panel/tasklist_action?id=start_all_seeding`
* 停止全部任务 `/panel/tasklist_action?id=stop_all`
* 暂停正在运行的任务 `/panel/tasklist_action?id=start_all_download`
* 恢复上次暂停的任务 `/panel/tasklist_action?id=suspend_all`

请求方法： GET  
回内容格式：text/xml  

控制效果对应 系统托盘菜单或悬浮窗口菜单中的同名功能  

返回内容示例:  

```
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<tasklist_action>
  <result>ok</result>
  <id>stop_all</id>
</tasklist_action>

```

### 设置全局限速

请求路径：  

* 设置下载速度限制 `/panel/option_set?key=down_rate_max&value=123`
* 设置上传速度限制 `/panel/option_set?key=up_rate_max&value=123`

请求方法： GET  
回内容格式：text/xml  

单位 KB 设置 0 表示不限制  

**注意** 在 GUI 中上传速度最小为 10 KB/s  
当尝试设置更小数值时会被强制改为 10 KB/s （设置为 0 时除外）  

然而 webUI 中似乎没有这种限制 可以将上传速度设置 在 1KB/s 到 9 KB/s  
设置后的值可以在 webUI 中正常显示 但是在 GUI 中却显示为 “无限制”  

更有意思的是 在 GUI 中查看这个显示有问题的限速后 即使没有修改任何内容  
点击确定按钮 关闭设置窗口 上传限速也会被更新为 无限制  应该是 GUI 界面有限制和校验  

所以在 webUI 中传入的上传速度限制 不应包含 1-9 KB/s 这个区间 下载速度设置不存在此问题  

传入的速度值有一定程度的校验检查 比如传入字母和非数字字符等会报错（invalid number!）  
但似乎没有对 负数 做校验 导致传入负数也能返回成功 列如传入 -1 后速度限制会变成 9999 kb/s  
似乎发生了某种溢出 但这好像不会对软件的运行造成负面影响  

支持 “自动量程” 会根据速度大小调节显示单位 最大单位为 GB  

返回内容示例:  

```
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<option_set>
  <result>ok</result>
  <key>down_rate_max</key>
  <value>123 KB/s</value>
</option_set>
```


---

## 任务列表 RSS 订阅源

请求路径：`/panel/task_list_rss`  
请求方法： GET  
回内容格式：text/xml  

其出现的较晚（v2.03加入）早期版本的 BC 不具有此功能   

设计初衷是通过 RSS 来共享任务列表 方便其他客户端下载  
其仅会输出列表中存在的 BT 任务的名称及其磁力链接  
无论其状态或者进度 不会显示非 BT 任务  

默认不启用 需要在 GUI 设置中手动开启  
访问控制方面可以设置为 公开访问 与 webUI 使用相同用户名和密码  
或使用单独的用户名密码  



