class LakeApplet {
    constructor(canvasElement) {
        this.canvas = canvasElement;
        this.ctx = this.canvas.getContext('2d');

        // 1. 读取 HTML 参数
        this.imgSrc = this.canvas.dataset.image;
        this.overlaySrc = this.canvas.dataset.overlay;
        this.rocking = this.canvas.dataset.rocking === 'true';

        // 2. 状态机
        this.frameIndex = 0; // P 变量 (0-11 滚动帧)
        this.waveIndex = 0;  // W 变量 (0-49 摇晃步数)
        this.maxWaveSteps = 50;
        this.isAnimating = true; // 点击可控制暂停/恢复
        this.isLoaded = false;

        // ⏳ 严格还原 Java 的 Thread.sleep(50L) 锁帧时钟
        this.lastFrameTime = 0;
        this.frameInterval = 50; 

        // 3. 核心物理图层高度（原图的高度）
        this.R = 0; // 对应原图高度
        this.Q = 0; // 对应原图宽度

        // 4. 离屏帧序列环画布
        this.framesRingCanvas = null;

        this.init();
    }

    async init() {
        this.Q = this.canvas.width;
        let defaultHeight = this.canvas.height;

        try {
            // A. 尝试同步等待图片加载
            this.bgImage = await this.loadImage(this.imgSrc);
            this.R = this.bgImage.height; // 水波分界线
        } catch (err) {
            console.warn("Lake applet background image load failed, triggering downgrade: ", err);
            // 降级方案：创建一个全透明(或你可以指定颜色)的内存画布作为替代 background
            const fallbackBg = document.createElement('canvas');
            fallbackBg.width = this.Q;
            fallbackBg.height = defaultHeight;
            const fbCtx = fallbackBg.getContext('2d');
            fbCtx.fillStyle = "rgba(255, 255, 255, 0.1)"; // 微弱的白色占位，让空转也有轮廓
            fbCtx.fillRect(0, 0, this.Q, defaultHeight);
            
            this.bgImage = fallbackBg;
            this.R = defaultHeight;
        }

        try {
            this.overlayImage = this.overlaySrc ? await this.loadImage(this.overlaySrc) : null;
        } catch (err) {
            console.warn("Lake applet overlay image load failed, continuing without overlay: ", err);
            this.overlayImage = null; // 覆盖图加载失败时直接忽略，不影响主流程
        }

        // B. 执行预渲染算法
        this.preRender();
        this.isLoaded = true;

        // C. 绑定原版点击水面暂停/恢复动画事件
        this.canvas.addEventListener('mouseup', () => {
            this.isAnimating = !this.isAnimating;
        });

        // D. 启动动画引擎
        requestAnimationFrame((t) => this.loop(t));
    }

    loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = src;
            img.onload = () => resolve(img);
            img.onerror = reject;
        });
    }

    // 核心修正部分：在 getContext('2d') 中显式声明 willReadFrequently: true 优化高频回读
    preRender() {
        // 1. 创建基础倒影画布
        const baseReflectCanvas = document.createElement('canvas');
        baseReflectCanvas.width = this.Q;
        baseReflectCanvas.height = this.R + 1;
        
        // 关键修复：显式通知浏览器该离屏 Canvas 包含大量的 CPU 逐行像素级读取（getImageData）
        const baseCtx = baseReflectCanvas.getContext('2d', { willReadFrequently: true });

        // 在 Y=1 处画入风景原图
        baseCtx.drawImage(this.bgImage, 0, 1, this.Q, this.R);

        // 严格执行 Java 逐行 copyArea 的镜像翻转操作
        for (let n = 0; n < this.R >> 1; n++) {
            let topRow = baseCtx.getImageData(0, n, this.Q, 1);
            let bottomRow = baseCtx.getImageData(0, this.R - 1 - n, this.Q, 1);
            baseCtx.putImageData(bottomRow, 0, n);
            baseCtx.putImageData(topRow, 0, this.R - 1 - n);
        }

        // 2. 创建 12 帧超大组合胶片画布
        this.framesRingCanvas = document.createElement('canvas');
        this.framesRingCanvas.width = 13 * this.Q;
        this.framesRingCanvas.height = this.R;
        const ringCtx = this.framesRingCanvas.getContext('2d');

        // 将基础镜像底片放在第 12 格
        ringCtx.drawImage(baseReflectCanvas, 12 * this.Q, 0);

        // 3. 嵌套物理水波采样算法 -> 对应 Java 的 J(Graphics g, int n)
        for (let n = 0; n < 12; n++) {
            let d = (Math.PI * 2 * n) / 12.0;
            let targetX = (12 - n) * this.Q;

            for (let n3 = 0; n3 < this.R; n3++) {
                // David Griffiths 透视正弦波公式核心复刻
                let n4 = Math.floor(((this.R / 14) * (n3 + 8.0) * Math.sin(((this.R / 14) * (this.R - n3)) / (n3 + 1) + d)) / this.R);
                
                let sourceY = n3 + n4;
                // 越界安全限幅
                if (sourceY < 0) sourceY = 0;
                if (sourceY >= this.R) sourceY = this.R - 1;

                // 捕获像素行并平移（模拟 copyArea）
                let rowData = baseCtx.getImageData(0, sourceY, this.Q, 1);
                ringCtx.putImageData(rowData, targetX, n3);
            }

            // 如果有漂浮叠加层 (如小船)
            if (this.overlayImage) {
                let sW = this.overlayImage.width;
                let sT = this.overlayImage.height;
                ringCtx.drawImage(this.overlayImage, n * this.Q + ((this.Q - sW) >> 1), -(sT >> 1));
            }
        }

        // 4. 将 overlay 图片追加渲染 to 基础正景画布图上
        baseCtx.drawImage(this.bgImage, 0, 1, this.Q, this.R);
        if (this.overlayImage) {
            let sW = this.overlayImage.width;
            let sT = this.overlayImage.height;
            baseCtx.drawImage(this.overlayImage, (this.Q - sW) >> 1, this.R - (sT >> 1));
        }
        this.baseReflectCanvas = baseReflectCanvas;
    }

    loop(timestamp) {
        let elapsed = timestamp - this.lastFrameTime;

        if (elapsed >= this.frameInterval) {
            this.lastFrameTime = timestamp - (elapsed % this.frameInterval);

            if (this.isAnimating && this.isLoaded) {
                // 水波序列滚动
                if (++this.frameIndex === 12) this.frameIndex = 0;
                // 小船上下摇晃周期滚动
                if (++this.waveIndex === this.maxWaveSteps) this.waveIndex = 0;
            }

            let n = this.rocking ? Math.floor(((this.R / 8) * Math.sin((Math.PI * 2 * this.waveIndex) / this.maxWaveSteps)) / 8.0) - Math.floor(this.R / 8) : 0;

            if (this.isLoaded) {
                // 关闭现代 Canvas 的抗锯齿，复刻原版 copyArea 的粗糙像素颗粒感
                this.ctx.imageSmoothingEnabled = false;

                // 渲染动作 -> 复刻方法 E(Graphics g)
                if (this.rocking) {
                    // 1. 绘制水波（动态帧拼接）
                    this.ctx.drawImage(this.framesRingCanvas, -this.frameIndex * this.Q, this.R + n);
                    this.ctx.drawImage(this.framesRingCanvas, (12 - this.frameIndex) * this.Q, this.R + n);
                    
                    // 2. 绘制上半部分风景原图（盖在水波上方，精准重叠咬合）
                    this.ctx.drawImage(this.baseReflectCanvas, 0, 0, this.Q, this.R + 1, 0, n - 1, this.Q, this.R + 1);
                } else {
                    // 无摆动模式
                    // 1. 绘制下半部分水波
                    this.ctx.drawImage(this.framesRingCanvas, (12 - this.frameIndex) * this.Q, 0, this.Q, this.R, 0, this.R, this.Q, this.R);
                    
                    // 2. 绘制上半部分风景原图（微调坐标至 Y=0，向下完美覆盖到分界线）
                    this.ctx.drawImage(this.bgImage, 0, 0, this.Q, this.R);
                    if (this.overlayImage) {
                        let sW = this.overlayImage.width;
                        let sT = this.overlayImage.height;
                        this.ctx.drawImage(this.overlayImage, (this.Q - sW) >> 1, this.R - (sT >> 1));
                    }
                }
            }
        }

        requestAnimationFrame((t) => this.loop(t));
    }
}

// 通过类名选择器自动实例化（支持多个画布）
window.addEventListener('DOMContentLoaded', () => {
    const lakeCanvases = document.querySelectorAll('.lake-canvas');
    lakeCanvases.forEach(canvas => {
        new LakeApplet(canvas);
    });
});