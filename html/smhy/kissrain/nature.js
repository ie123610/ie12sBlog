class NatureApplet {
    // 1. 构造函数改为接收 Canvas 元素对象本身，不再写死 ID
    constructor(canvasElement) {
        this.canvas = canvasElement;
        this.ctx = this.canvas.getContext('2d');
        
        // 解析来自当前 Canvas 的“Applet 参数”
        this.bgSrc = this.canvas.dataset.graphic;
        this.season = this.canvas.dataset.season === 'summer' ? 'summer' : (this.canvas.dataset.season === 'winter' ? 'winter' : 'winter');
        this.accumulate = this.canvas.dataset.accumulate === 'yes';
        this.maxCount = parseInt(this.canvas.dataset.fallcount) || 100;
        this.rndDirection = this.canvas.dataset.randomdir === 'yes';
        this.rainColor = `#${this.canvas.dataset.raincolor || '91A4A4'}`;
        
        // 核心限速锁帧变量
        this.lastFrameTime = 0;
        this.fpsInterval = parseInt(this.canvas.dataset.speed) || 75;

        // 核心状态机
        this.lrDir = 2;
        this.wndSpeed = 0;
        this.radius = 2;
        this.maxSpeed = 8;
        
        // 积雪高度场数组
        this.heightField = new Array(this.canvas.width).fill(this.canvas.height);
        
        // 初始化粒子池
        this.particles = [];
        
        this.init();
    }

    init() {
        // 2. 还原 alcsnow 的逻辑：无论图片是否存在，立刻初始化粒子位置，防止阻塞
        this.setupParticles();

        if (this.bgSrc) {
            this.bgImage = new Image();
            this.bgImage.crossOrigin = "anonymous";
            this.bgImage.src = this.bgSrc;
            
            this.bgImage.onload = () => {
                // 图片加载成功，启动动画循环
                requestAnimationFrame((t) => this.loop(t));
            };
            
            this.bgImage.onerror = () => {
                // 核心修复：图片加载失败时，将 bgImage 设为 null，降级启动无图特效
                this.bgImage = null;
                requestAnimationFrame((t) => this.loop(t));
            };
        } else {
            // 没有配置背景图，直接无图启动
            this.bgImage = null;
            requestAnimationFrame((t) => this.loop(t));
        }
    }

    setupParticles() {
        for (let i = 0; i < this.maxCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                speed: Math.floor(Math.random() * this.maxSpeed) + 3
            });
        }
    }

    updateWind() {
        if (!this.rndDirection) return;
        
        let stat = Math.floor(Math.random() * 100);
        if (this.season === 'winter') {
            if (stat > 0 && stat < 5) {
                this.lrDir = 1;
                this.wndSpeed = Math.floor(Math.random() * 5);
            } else if (stat > 55 && stat < 60) {
                this.lrDir = 3;
                this.wndSpeed = Math.floor(Math.random() * 5);
            } else if (stat > 98) {
                this.lrDir = 2;
            }
        } else if (this.season === 'summer') {
            if (stat > 0 && stat < 5) {
                this.lrDir = 1;
                this.wndSpeed = Math.floor(Math.random() * -5);
            } else if (stat > 55 && stat < 60) {
                this.lrDir = 3;
                this.wndSpeed = Math.floor(Math.random() * 5);
            } else if (stat > 98) {
                this.lrDir = 2;
                this.wndSpeed = 0;
            }
        }
    }

    snow() {
        this.updateWind();
        this.ctx.fillStyle = '#FFFFFF';

        this.particles.forEach(p => {
            p.y += p.speed;
            
            if (this.lrDir === 1) p.x -= this.wndSpeed;
            if (this.lrDir === 3) p.x += this.wndSpeed;

            if (p.x < 0) p.x = this.canvas.width - 1;
            if (p.x > this.canvas.width) p.x = 1;

            let currentX = Math.floor(p.x);
            if (p.y >= this.heightField[currentX]) {
                if (this.accumulate && currentX > 0 && currentX < this.canvas.width - 1) {
                    if (Math.random() * 100 > 50) {
                        this.heightField[currentX] -= (this.radius + 1);
                        this.heightField[currentX - 1] -= (this.radius + 2);
                        this.heightField[currentX + 1] -= (this.radius + 2);
                    }
                }
                p.y = 0;
                p.x = Math.random() * this.canvas.width;
            }

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, this.radius / 2, 0, Math.PI * 2);
            this.ctx.fill();
        });

        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 1;
        for (let i = 0; i < this.canvas.width; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i, this.heightField[i]);
            this.ctx.lineTo(i, this.canvas.height);
            this.ctx.stroke();
        }
    }

    rain() {
        this.updateWind();
        this.ctx.strokeStyle = this.rainColor;
        this.ctx.lineWidth = 1.0;

        this.particles.forEach(p => {
            p.y += p.speed;
            
            if (this.lrDir === 1) p.x += this.wndSpeed;
            if (this.lrDir === 3) p.x += this.wndSpeed;

            if (p.x < 0) p.x = this.canvas.width - 1;
            if (p.x > this.canvas.width) p.x = 1;
            if (p.y > this.canvas.height) {
                p.y = 0;
                p.x = Math.random() * this.canvas.width;
            }

            let xOffset = Math.floor(this.wndSpeed / 2);
            this.ctx.beginPath();
            this.ctx.moveTo(p.x, p.y);
            this.ctx.lineTo(p.x + xOffset, p.y + 2);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(p.x, p.y + 1);
            this.ctx.lineTo(p.x + xOffset, p.y + 3);
            this.ctx.stroke();
        });
    }

    loop(timestamp) {
        let elapsed = timestamp - this.lastFrameTime;

        if (elapsed >= this.fpsInterval) {
            this.lastFrameTime = timestamp - (elapsed % this.fpsInterval);

            // 3. 渲染背景时增加判断：如果 bgImage 存在则画图，否则清空画布（类似 alcsnow）
            if (this.bgImage) {
                this.ctx.drawImage(this.bgImage, 0, 0, this.canvas.width, this.canvas.height);
            } else {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }

            if (this.season === 'winter') {
                this.snow();
            } else if (this.season === 'summer') {
                this.rain();
            }
        }

        requestAnimationFrame((t) => this.loop(t));
    }
}

// 4. 采用类似 alcsnow.js 的 IIFE 自动化扫描加载机制
(function () {
    window.addEventListener('DOMContentLoaded', () => {
        // 扫描页面上所有指定 class 的 canvas
        const canvases = document.querySelectorAll('.alc-nature-canvas');
        canvases.forEach((canvas) => {
            // 为每个 canvas 独立实例化一个特效类
            new NatureApplet(canvas);
        });
    });
})();