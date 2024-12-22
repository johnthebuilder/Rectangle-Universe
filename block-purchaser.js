export class BlockPurchaser {
    constructor(universe) {
        this.universe = universe;
        this.purchasedBlocks = new Set();
    }

    purchaseBlock(x, y) {
        const key = `${x},${y}`;
        this.purchasedBlocks.add(key);
        this.universe.render();
    }

    isPurchased(key) {
        return this.purchasedBlocks.has(key);
    }
}