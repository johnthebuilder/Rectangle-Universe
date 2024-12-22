export class ControlsHandler {
    constructor(universe) {
        this.universe = universe;
    }

    setupEventListeners() {
        this.universe.container.addEventListener('mousedown', this.startDrag.bind(this));
        window.addEventListener('mousemove', this.drag.bind(this));
        window.addEventListener('mouseup', this.stopDrag.bind(this));
        
        window.addEventListener('resize', () => {
            this.universe.calculateDimensions();
            this.universe.center();
            this.universe.render();
        });
        
        this.setupTouchEvents();
        this.setupRecenterButton();
    }

    setupTouchEvents() {
        this.universe.container.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.startDrag({ clientX: touch.clientX, clientY: touch.clientY });
        });
        
        window.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.drag({ clientX: touch.clientX, clientY: touch.clientY });
        });
        
        window.addEventListener('touchend', this.stopDrag.bind(this));
    }

    setupRecenterButton() {
        document.getElementById('recenterButton').addEventListener('click', () => {
            this.universe.center();
            this.universe.render();
        });
    }

    startDrag(e) {
        this.universe.isDragging = true;
        this.universe.lastMousePos = { x: e.clientX, y: e.clientY };
    }

    drag(e) {
        if (!this.universe.isDragging) return;
        const deltaX = e.clientX - this.universe.lastMousePos.x;
        const deltaY = e.clientY - this.universe.lastMousePos.y;
        this.universe.offset.x += deltaX;
        this.universe.offset.y += deltaY;
        this.universe.lastMousePos = { x: e.clientX, y: e.clientY };
        this.universe.render();
    }

    stopDrag() {
        this.universe.isDragging = false;
    }

    getControlsHTML() {
        return `
            <h1 class="main-title">Welcome to<br>Rectangle Universe</h1>
            <p class="main-subtitle">Please explore!</p>
            <div class="controls">
                <div class="control-group">
                    <label for="xMin">X Min</label>
                    <input type="number" id="xMin" value="${this.universe.boundaries.xMin}">
                </div>
                <div class="control-group">
                    <label for="xMax">X Max</label>
                    <input type="number" id="xMax" value="${this.universe.boundaries.xMax}">
                </div>
                <div class="control-group">
                    <label for="yMin">Y Min</label>
                    <input type="number" id="yMin" value="${this.universe.boundaries.yMin}">
                </div>
                <div class="control-group">
                    <label for="yMax">Y Max</label>
                    <input type="number" id="yMax" value="${this.universe.boundaries.yMax}">
                </div>
                <button id="applyButton">Apply Changes</button>
            </div>
            <div class="controls" style="margin-top: 1rem;">
                <div class="control-group">
                    <label for="purchaseX">Block X</label>
                    <input type="number" id="purchaseX" value="0">
                </div>
                <div class="control-group">
                    <label for="purchaseY">Block Y</label>
                    <input type="number" id="purchaseY" value="0">
                </div>
                <button id="purchaseButton">Purchase Block</button>
            </div>
        `;
    }

    setupControlListeners(content) {
        content.querySelector('#applyButton').addEventListener('click', () => {
            const xMin = parseInt(content.querySelector('#xMin').value);
            const xMax = parseInt(content.querySelector('#xMax').value);
            const yMin = parseInt(content.querySelector('#yMin').value);
            const yMax = parseInt(content.querySelector('#yMax').value);
            
            this.universe.boundaries = { xMin, xMax, yMin, yMax };
            this.universe.render();
        });

        content.querySelector('#purchaseButton').addEventListener('click', () => {
            const x = parseInt(content.querySelector('#purchaseX').value);
            const y = parseInt(content.querySelector('#purchaseY').value);
            this.universe.blockPurchaser.purchaseBlock(x, y);
        });
    }
}