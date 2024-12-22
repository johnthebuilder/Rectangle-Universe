// Import our modules
import { GridRenderer } from './grid-renderer.js';
import { ControlsHandler } from './controls-handler.js';
import { BlockPurchaser } from './block-purchaser.js';

class RectangleUniverse {
    constructor() {
        this.container = document.getElementById('universe');
        this.offset = { x: 0, y: 0 };
        this.isDragging = false;
        this.lastMousePos = { x: 0, y: 0 };
        
        this.boundaries = {
            xMin: -50,
            xMax: 50,
            yMin: -50,
            yMax: 50
        };

        this.gridRenderer = new GridRenderer(this);
        this.controlsHandler = new ControlsHandler(this);
        this.blockPurchaser = new BlockPurchaser(this);
        
        this.calculateDimensions();
        this.center();
        this.setupEventListeners();
        this.render();
    }

    calculateDimensions() {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        
        const maxBlockSizeW = screenWidth / Math.floor(screenWidth / 80);
        const maxBlockSizeH = screenHeight / Math.floor(screenHeight / 80);
        this.blockSize = Math.min(maxBlockSizeW, maxBlockSizeH);

        this.totalBlocksWide = Math.floor(screenWidth / this.blockSize);
        this.totalBlocksHigh = Math.floor(screenHeight / this.blockSize);

        this.mainGridWidth = this.totalBlocksWide - 2;
        this.mainGridHeight = this.totalBlocksHigh - 1;

        this.mainWidth = this.mainGridWidth * this.blockSize;
        this.mainHeight = this.mainGridHeight * this.blockSize;
    }

    center() {
        this.offset = {
            x: this.blockSize,
            y: this.blockSize
        };
    }

    setupEventListeners() {
        this.controlsHandler.setupEventListeners();
    }

    render() {
        this.container.innerHTML = '';
        this.gridRenderer.render();
    }
}

window.addEventListener('load', () => {
    new RectangleUniverse();
});