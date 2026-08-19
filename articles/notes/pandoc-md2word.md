# Pandoc markdown 转 word

1. 使用 winget 安装 Pandoc `winget install JohnMacFarlane.Pandoc`  
    其类似于 Linux 中的包管理器 安装好后会自动设置系统环境变量

2. 验证安装 `pandoc --version` 需要重启已经打开的终端窗口  
    否则有可能出现找不到程序的错误 vscode 中的集成终端也不例外  

3. 基础转换指令 `pandoc input.md -o output.docx`  
    输出详细日志 `pandoc input.md -o output.docx --verbose`  

4. 图片镶嵌问题 如果使用的是 markdown 语法引用图片 应该不会有问题  
    但如果用的是 html img 元素 就会无法提取  
    这并不是因为其无法识别 而是它把这视作 “原生的行内 HTML 代码 (RawInline)”  
    Word 文档并不是网页 Pandoc 不知道该如何把一段纯 HTML 代码原样转换成 Word 里的元素  
    所以在生成 Word 文档时 默认丢弃所有原生的 HTML 标签  

5. 在不修改源文件的情况下 可以使用Filter（过滤器）来对传入的内容进行预处理  
    Pandoc 从 3.0 开始原生内置了 Lua 解释器 可以使用 lua 脚本来完成此操作  
    将 html img 元素转换成 Markdown 图片写法  
    附加 lua 处理脚本 `pandoc input.md -o output.docx --verbose --lua-filter=./html_img.lua`  

    <details>
    <summary>lua 脚本示例</summary>

    ```
    -- html_img.lua
    function RawInline (el)
     -- 匹配 HTML 格式的行内代码（如 <img> 标签）
     if el.format == 'html' then
       local src = el.text:match('src=["\'](.-)["\']')
      local width = el.text:match('width=["\'](.-)["\']')

      if src then
        local attr = {}
       if width then
          attr["width"] = width
       end
       -- 将 RawInline HTML 动态替换为 Pandoc 标准的 Image 节点
       return pandoc.Image({}, src, "", attr)
      end
     end
    end

    function RawBlock (el)
      -- 匹配独立成行的 HTML 块
     if el.format == 'html' then
       local src = el.text:match('src=["\'](.-)["\']')
       local width = el.text:match('width=["\'](.-)["\']')

       if src then
        local attr = {}
        if width then
         attr["width"] = width
       end
       return pandoc.Para({pandoc.Image({}, src, "", attr)})
      end
      end
    end
    ```
    
    </details>

6. b 站的专栏编辑器在更新后支持从 word 和 markdown 文件导入文件  
    但是其目前似乎并不支持从 链接中提取图片 无论是 html 写法还是 markdown 写法  
    好在 word 中的图片是可以正常提取的 虽然存在图片格式限制  
    通过上述的方法 即可将图片转移到 word 文档中 以便于提取  
    不在需要像过去那样 手动插入图片  