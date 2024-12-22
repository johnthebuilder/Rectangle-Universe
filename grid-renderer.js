export class GridRenderer {
    constructor(universe) {
        this.universe = universe;
    }

    wrapCoordinate(value, min, max) {
        const range = max - min + 1;
        const offset = value - min;
        const wrappedOffset = ((offset % range) + range) % range;
        return wrappedOffset + min;
    }

    render() {
        const extraBlocks = 2;
        const startX = Math.floor((-this.universe.offset.x) / this.universe.blockSize) - extraBlocks;
        const startY = Math.floor((-this.universe.offset.y) / this.universe.blockSize) - extraBlocks;
        const endX = Math.ceil((window.innerWidth - this.universe.offset.x) / this.universe.blockSize) + extraBlocks;
        const endY = Math.ceil((window.innerHeight - this.universe.offset.y) / this.universe.blockSize) + extraBlocks;

        // Draw grid cells
        this.renderGridCells(startX, startY, endX, endY);
        
        // Draw main areas
        this.renderMainAreas(startX, startY, endX, endY);
    }

    renderGridCells(startX, startY, endX, endY) {
        for (let y = startY; y <= endY; y++) {
            for (let x = startX; x <= endX; x++) {
                const wrappedX = this.wrapCoordinate(x, this.universe.boundaries.xMin, this.universe.boundaries.xMax);
                const wrappedY = this.wrapCoordinate(-y, this.universe.boundaries.yMin, this.universe.boundaries.yMax);
                
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.style.width = `${this.universe.blockSize}px`;
                cell.style.height = `${this.universe.blockSize}px`;
                cell.style.transform = `translate(${x * this.universe.blockSize + this.universe.offset.x}px, ${y * this.universe.blockSize + this.universe.offset.y}px)`;
                
                const key = `${wrappedX},${wrappedY}`;
                if (this.universe.blockPurchaser.isPurchased(key)) {
                    cell.classList.add('purchased-block');
                } else {
                    this.setGridCellColor(cell, wrappedX, wrappedY);
                }
                cell.innerText = `(${wrappedX}, ${wrappedY})`;
                
                this.universe.container.appendChild(cell);
            }
        }
    }

    setGridCellColor(cell, x, y) {
        const xRatio = (x - this.universe.boundaries.xMin) / (this.universe.boundaries.xMax - this.universe.boundaries.xMin);
        const yRatio = (y - this.universe.boundaries.yMin) / (this.universe.boundaries.yMax - this.universe.boundaries.yMin);
        
        const r = Math.floor(xRatio * 255);
        const g = Math.floor((xRatio + yRatio) * 127.5);
        const b = Math.floor(yRatio * 255);
        
        cell.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
        cell.style.color = (r * 0.299 + g * 0.587 + b * 0.114) > 186 ? '#000' : '#fff';
    }

    renderMainAreas(startX, startY, endX, endY) {
        const xRange = this.universe.boundaries.xMax - this.universe.boundaries.xMin + 1;
        const yRange = this.universe.boundaries.yMax - this.universe.boundaries.yMin + 1;

        for (let yOffset = Math.floor(startY / yRange) * yRange; yOffset <= endY; yOffset += yRange) {
            for (let xOffset = Math.floor(startX / xRange) * xRange; xOffset <= endX; xOffset += xRange) {
                this.renderMainArea(xOffset, yOffset);
            }
        }
    }

    renderMainArea(xOffset, yOffset) {
        const mainArea = document.createElement('div');
        mainArea.className = 'main-area';
        mainArea.style.width = `${this.universe.mainWidth}px`;
        mainArea.style.height = `${this.universe.mainHeight}px`;
        mainArea.style.transform = `translate(${xOffset * this.universe.blockSize + this.universe.offset.x}px, ${yOffset * this.universe.blockSize + this.universe.offset.y}px)`;
        
        this.renderMainBlocks(mainArea);
        this.renderMainContent(mainArea);
        
        this.universe.container.appendChild(mainArea);
    }

    renderMainBlocks(mainArea) {
        for (let y = 0; y < this.universe.mainGridHeight; y++) {
            for (let x = 0; x < this.universe.mainGridWidth; x++) {
                const block = document.createElement('div');
                block.className = 'main-block';
                block.style.width = `${this.universe.blockSize}px`;
                block.style.height = `${this.universe.blockSize}px`;
                block.style.left = `${x * this.universe.blockSize}px`;
                block.style.top = `${y * this.universe.blockSize}px`;
                mainArea.appendChild(block);
            }
        }
    }

    renderMainContent(mainArea) {
        const content = document.createElement('div');
        content.className = 'main-content';
        content.innerHTML = this.universe.controlsHandler.getControlsHTML();
        mainArea.appendChild(content);
        
        this.universe.controlsHandler.setupControlListeners(content);
    }
}