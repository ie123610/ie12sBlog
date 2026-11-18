# BC Link Format (obsoleted as of v.1.17)

A BC Link contains information for creating a BT task, HTTP task or FTP task. The basic plain format is as following:  

`bc://bt2/${TaskName}/${FileSize}/${InfoHash}/ bc://http2/${TaskName}/?url=${url} bc://ftp2/${TaskName}/?url=${url}`  

In additional, more parameters can be added:  

```
bc://bt2/${TaskName}/${FileSize}/${InfoHash}/?torrent=${torrent_url}&infohash_v2=${InfoHashv2} bc://http2/${TaskName}/?url=${url}&usr=${username}&psd=${password}&refer=${url_referer}&cookie=${url_cookie}&user_agent=${user_agent}&mirror=${mirror_url}&custom_headers_for_mirrors=true bc://ftp2/${TaskName}/?url=${url}&usr=${username}&psd=${password}
```

Finally, with the advantage of hiding details from end-user, the BASE64 encoded format is recommended to distribute for public:  

```
bc://bt/${BASE64_ENCODED} bc://http/${BASE64_ENCODED} bc://ftp/${BASE64_ENCODED} in which ${BASE64_ENCODED} = BASE64_ENCODE( "AA" + "/${TaskName}/..." + "ZZ" )
```

Note: To support various languages besides English, all parameters should be UTF8 + URL_Escape encoded before Base64 encoding.  

Note: If multiple HTTP mirrors available for a HTTP task, multiple "mirror" parameters can be added.  

Note: If "custom_headers_for_mirrors" parameter is true, the "referer", "cookie" and "user_agent" will also be sent to mirror addresses.  

Note: Starting with BitComet v.1.17 BC Links have been replaced by Magnet Links (see below).  