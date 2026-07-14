class AnFadeApplet {
    constructor(canvasElement) {
        this.canvas = canvasElement;
        
        // 性能优化：添加 willReadFrequently 参数防止现代浏览器报错，且不影响显示效果
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });

        // 1. 读取 HTML 参数
        this.imgSrc1 = this.canvas.dataset.image1;
        this.imgSrc2 = this.canvas.dataset.image2;
        this.speed = parseInt(this.canvas.dataset.speed, 10) || 8;
        this.pauseTime = parseInt(this.canvas.dataset.pause, 10) || 1500;
        
        // 核心物理维度
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.totalPixels = this.width * this.height;

        // 2. 状态机与缓冲区
        this.currentImgIndex = 0; 
        this.isTransitioning = false;
        
        // 基于绝对时间轴生成的浮点进度计数器
        this.stepT = 0;           
        this.maxSteps = 0; 
        this.transitionStartTime = 0; // 特效启动的绝对时间戳

        // 特效播放序列（完全剔除8号空特效）
        this.MODE_SEQUENCE = [0, 1, 2, 3, 4, 5, 6, 7, 7, 9, 9];
        this.sequenceIndex = 0; // 当前在序列中的位置

        this.delayMap = new Int16Array(this.totalPixels); 

        this.imgData1 = null;
        this.imgData2 = null;
        this.outputImageData = this.ctx.createImageData(this.width, this.height);

        // 核心修改：在不改变现有时间轴逻辑的前提下，引入固定阻尼系数（放慢因子）
        // 1.0 为纯数学最快理论速度。1.5 表示等比平滑放慢 1.5 倍。
        const speedDamping = 1.6; 
        this.msPerStep = (100 / this.speed) * speedDamping; 

        this.init();
    }

    async init() {
        const [img1, img2] = await Promise.all([
            this.loadImage(this.imgSrc1),
            this.loadImage(this.imgSrc2)
        ]);

        this.imgData1 = this.extractImageData(img1);
        this.imgData2 = this.extractImageData(img2);

        // 初始渲染
        this.ctx.putImageData(this.imgData1, 0, 0);

        // 严格遵循 pause 时间触发下一次过渡
        setInterval(() => {
            if (!this.isTransitioning) {
                this.startTransition();
            }
        }, this.pauseTime);

        requestAnimationFrame((t) => this.loop(t));
    }

    loadImage(src) {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = src;
            img.onload = () => resolve(img);
            img.onerror = () => {
                const fallback = document.createElement('canvas');
                fallback.width = this.width;
                fallback.height = this.height;
                const fbCtx = fallback.getContext('2d');
                fbCtx.fillStyle = `hsl(${Math.random() * 360}, 60%, 40%)`;
                fbCtx.fillRect(0, 0, this.width, this.height);
                resolve(fallback);
            };
        });
    }

    extractImageData(imageSource) {
        const offscreenCanvas = document.createElement('canvas');
        offscreenCanvas.width = this.width;
        offscreenCanvas.height = this.height;
        const oCtx = offscreenCanvas.getContext('2d', { willReadFrequently: true });
        oCtx.drawImage(imageSource, 0, 0, this.width, this.height);
        return oCtx.getImageData(0, 0, this.width, this.height);
    }

    generateDelayMap(mode) {
        let i = 0;
        const halfW = Math.floor(this.width / 2);
        const halfH = Math.floor(this.height / 2);
        
        let maxDelay = 0; 

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                
                let deltaX = x - halfW;
                let deltaY = y - halfH;
                let val = 0;

                switch (mode) {
                    case 0: // 左右双向百叶窗式向中间聚拢
                        let edgeX = x < halfW ? x : this.width - x;
                        val = Math.floor(edgeX / 2);
                        break;

                    case 1: // 圆形向心/扩散
                        val = Math.floor(Math.sqrt(deltaX * deltaX + deltaY * deltaY) / 2.0);
                        break;

                    case 2: // 随机像素沙化溶解
                        val = Math.floor(Math.random() * 55.0);
                        break;

                    case 3: // 全局均匀对调（延迟全为0）
                        val = 0;
                        break;

                    case 4: // 自上而下线性渐变
                        val = Math.floor(y / 3);
                        break;

                    case 5: // 自左向右线性渐变（常规速）
                        val = Math.floor(x / 10);
                        break;

                    case 6: // 斜对角切入
                        val = Math.floor((x + y) / 5);
                        break;

                    case 7: // 上下双向百叶窗式向中间聚拢
                        let edgeY = y < halfH ? y : this.height - y;
                        val = Math.floor(edgeY / 2);
                        break;

                    case 8: // 空项（已在序列中弃用）
                        val = 0;
                        break;

                    case 9: // 自左向右线性渐变（高速版）
                        val = Math.floor(x / 3);
                        break;
                }
                
                this.delayMap[i] = -val;
                if (val > maxDelay) maxDelay = val;
                i++;
            }
        }

        // 基础混合生命周期 32 步 + 特效最大延迟跨度
        this.maxSteps = 32 + maxDelay;
    }

    startTransition() {
        const currentMode = this.MODE_SEQUENCE[this.sequenceIndex];
        this.generateDelayMap(currentMode);
        this.stepT = 0;
        this.isTransitioning = true;
        this.transitionStartTime = performance.now();
    }

    blendPixels() {
        const fromData = this.currentImgIndex === 0 ? this.imgData1.data : this.imgData2.data;
        const toData = this.currentImgIndex === 0 ? this.imgData2.data : this.imgData1.data;
        const outData = this.outputImageData.data;

        let activePixels = 0;

        for (let i = 0; i < this.totalPixels; i++) {
            let progress = this.stepT + this.delayMap[i];
            let idx = i * 4;

            if (progress >= 0 && progress < 32) {
                activePixels++;
                let ratio = progress / 32; 
                
                outData[idx]     = fromData[idx]     + (toData[idx]     - fromData[idx])     * ratio; 
                outData[idx + 1] = fromData[idx + 1] + (toData[idx + 1] - fromData[idx + 1]) * ratio; 
                outData[idx + 2] = fromData[idx + 2] + (toData[idx + 2] - fromData[idx + 2]) * ratio; 
                outData[idx + 3] = 255; 
            } else if (progress >= 32) {
                outData[idx]     = toData[idx];
                outData[idx + 1] = toData[idx + 1];
                outData[idx + 2] = toData[idx + 2];
                outData[idx + 3] = 255;
            } else {
                outData[idx]     = fromData[idx];
                outData[idx + 1] = fromData[idx + 1];
                outData[idx + 2] = fromData[idx + 2];
                outData[idx + 3] = 255;
            }
        }

        this.ctx.putImageData(this.outputImageData, 0, 0);

        if (activePixels === 0 && this.stepT >= this.maxSteps) {
            this.isTransitioning = false;
            this.currentImgIndex = this.currentImgIndex === 0 ? 1 : 0; 
            this.sequenceIndex = (this.sequenceIndex + 1) % this.MODE_SEQUENCE.length; 
        }
    }

    loop(timestamp) {
        if (this.isTransitioning) {
            const elapsedMs = timestamp - this.transitionStartTime;
            this.stepT = Math.floor(elapsedMs / this.msPerStep);
            this.blendPixels();
        }

        requestAnimationFrame((t) => this.loop(t));
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const fadeCanvases = document.querySelectorAll('.anfade-canvas');
    fadeCanvases.forEach(canvas => {
        new AnFadeApplet(canvas);
    });
});