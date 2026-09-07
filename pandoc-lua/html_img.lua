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