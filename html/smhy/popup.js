/**
 *  弹窗尺寸补偿脚本 (popup.js)
 */
document.addEventListener('DOMContentLoaded', () => {
    // 监听全局点击事件（委托模式，比为每个A标签绑定监听器更省内存、且对动态生成的DOM也有效）
    document.body.addEventListener('click', (event) => {
        // 寻找被点击的、带有 'applet-popup' 类的 a 标签
        const anchor = event.target.closest('.applet-popup');
        
        if (anchor) {
            // 阻止 HTML 原生的默认跳转行为
            event.preventDefault();

            // 1. 读取 HTML 标签中定义的目标视口尺寸 (内宽/内高)
            const targetWidth = parseInt(anchor.dataset.width, 10) || 500;
            const targetHeight = parseInt(anchor.dataset.height, 10) || 400;
            const url = anchor.href;

            // 2. 先以目标尺寸作为初始尺寸打开新窗口 (popup=yes 会创建干净无地址栏的窗口)
            const popup = window.open(
                url, 
                '_blank', 
                `popup=yes,width=${targetWidth},height=${targetHeight},resizable=yes`
            );

            if (popup) {
                // 3. 当新窗口的 DOM 加载完毕时，计算并补偿“系统窗口边框”的厚度
                popup.onload = () => {
                    // outerWidth/Height 为包含浏览器边框、标题栏的物理窗口大小
                    // innerWidth/Height 为网页实际渲染可视区的尺寸
                    const dX = Math.ceil(popup.outerWidth - popup.innerWidth);
                    const dY = Math.ceil(popup.outerHeight - popup.innerHeight);

                    // 只有当获取到的差值合法（非0，防止部分浏览器安全策略限制导致获取为0）时进行调整
                    if (dX > 0 || dY > 0) {
                        popup.resizeTo(targetWidth + dX, targetHeight + dY);
                    }
                };
            }
        }
    });
});