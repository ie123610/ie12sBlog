/**
 * alcsnow.js
 */
(function () {
    // 等待 DOM 树加载完成后初始化
    window.addEventListener('DOMContentLoaded', () => {
        // 直接寻找页面上所有的下雪 canvas 元素
        const canvases = document.querySelectorAll('.alc-snow-canvas');

        canvases.forEach((canvas) => {
            // 1. 直接读取 canvas 元素上的参数
            let snows = parseInt(canvas.getAttribute('data-snows')) || 100;
            if (snows > 500) snows = 500; // 还原 Java 源码中的 500 片上限限制

            const threadSleep = parseInt(canvas.getAttribute('data-threadsleep')) || 80;
            const bgSrc = canvas.getAttribute('data-bg');

            // 设置 Canvas 的画布实际分辨率（以元素设定的宽高或默认550x460为准）
            const width = canvas.clientWidth || 550;
            const height = canvas.clientHeight || 460;
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');

            // 2. 隔离每组容器的全局物理变量
            let wind = 0;
            const snowX = new Array(snows);
            const snowY = new Array(snows);

            // 3. 还原 Java 源码 init() 中的雪花初始随机位置算法
            function initSnow() {
                for (let i = 0; i < snows; i++) {
                    const randX = Math.floor(Math.random() * 40000) - 20000;
                    const randY = Math.floor(Math.random() * 40000) - 20000;
                    snowX[i] = Math.floor((randX % width) / 2) + Math.floor(width / 2);
                    snowY[i] = Math.floor((randY % height) / 2) + Math.floor(height / 2);
                }
            }

            // 4. 核心物理与绘制引擎（一体化渲染：先图后雪）
            function updateAndDraw(bgImage) {
                // 如果背景图加载成功，先绘制背景图填满画布，否则清空画布
                if (bgImage) {
                    ctx.drawImage(bgImage, 0, 0, width, height);
                } else {
                    ctx.clearRect(0, 0, width, height);
                }
                
                // 绘制雪花
                ctx.fillStyle = "white";
                for (let i = 0; i < snows; i++) {
                    ctx.fillRect(snowX[i], snowY[i], 1, 1);

                    const randX = Math.floor(Math.random() * 40000) - 20000;
                    snowX[i] = snowX[i] + (randX % 2) + wind;

                    const randY = Math.floor(Math.random() * 40000) - 20000;
                    snowY[i] = snowY[i] + Math.floor((randY % 6 + 5) / 5) + 1;

                    if (snowX[i] >= width) snowX[i] = 0;
                    if (snowX[i] < 0) snowX[i] = width - 1;
                    if (snowY[i] >= height || snowY[i] < 0) {
                        const resetRand = Math.floor(Math.random() * 40000) - 20000;
                        snowX[i] = Math.abs(resetRand % width);
                        snowY[i] = 0;
                    }
                }

                // 还原 5% 概率随机切换风向逻辑
                const windRand = Math.floor(Math.random() * 200) - 100;
                switch (windRand) {
                    case -2: wind = -2; break;
                    case -1: wind = -1; break;
                    case 0:  wind = 0;  break;
                    case 1:  wind = 1;  break;
                    case 2:  wind = 2;  break;
                }
            }

            // 5. 初始化与背景图预加载
            initSnow();

            if (bgSrc) {
                const img = new Image();
                img.src = bgSrc;
                img.onload = function() {
                    // 图片加载完成后，启动定时器，并将 img 对象传入主循环
                    setInterval(() => updateAndDraw(img), threadSleep);
                };
                img.onerror = function() {
                    // 如果图片加载失败，降级允许无图下雪
                    setInterval(() => updateAndDraw(null), threadSleep);
                };
            } else {
                setInterval(() => updateAndDraw(null), threadSleep);
            }
        });
    });
})();