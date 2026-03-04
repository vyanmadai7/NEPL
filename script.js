const NEPL_APP = {
    init() {
        this.canvas = document.getElementById('hero-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.totalFrames = 80;
        this.images = [];
        this.state = { targetFrame: 0, currentFrame: 0 };

        this.preload();
        this.bindEvents();
        this.render();
    },

    preload() {
        for (let i = 1; i <= this.totalFrames; i++) {
            const img = new Image();
            img.src = `frames/ezgif-frame-${String(i).padStart(3, '0')}.png`;
            this.images.push(img);
        }
    },

    bindEvents() {
        window.addEventListener('scroll', () => {
            const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);

            this.state.targetFrame = Math.floor(scrollPercent * (this.totalFrames - 1));

            const overlays = document.querySelectorAll('.overlay-text');
            overlays.forEach((el, i) => {
                const step = 0.15;
                const active = scrollPercent > (i * step) && scrollPercent < (i + 1) * step;
                el.classList.toggle('active', active);
            });
        });

        const observer = new IntersectionObserver(entries => {
            entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view') });
        }, { threshold: 0.1 });

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

        window.addEventListener('resize', () => this.resize());
        this.resize();
    },

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },

    render() {
        this.state.currentFrame += (this.state.targetFrame - this.state.currentFrame) * 0.1;

        const img = this.images[Math.round(this.state.currentFrame)];
        if (img && img.complete) {
            const cw = this.canvas.width;
            const ch = this.canvas.height;
            this.ctx.clearRect(0, 0, cw, ch);

            const imgRatio = img.width / img.height;
            const canvasRatio = cw / ch;
            let dW, dH;

            if (canvasRatio > imgRatio) {
                dW = cw;
                dH = cw / imgRatio;
            } else {
                dH = ch;
                dW = ch * imgRatio;
            }

            this.ctx.drawImage(img, (cw - dW) / 2, (ch - dH) / 2, dW, dH);
        }

        requestAnimationFrame(() => this.render());
    }
};

document.addEventListener('DOMContentLoaded', () => NEPL_APP.init());