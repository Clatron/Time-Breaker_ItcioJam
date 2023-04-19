export default class Ground {
    constructor(game, height, y, texture) {
        this.game = game;
        this.width = height;
        this.height = height;
        this.x = 0;
        this.y = y;
        this.texture = document.querySelector('#ground');
    }
    update() {

    }
    draw(/** @type {CanvasRenderingContext2D} */ ctx) {
        const repeatCount = this.game.width / this.width;
        for (let i = 0; i < repeatCount; i++ ) {
            ctx.drawImage(this.texture, this.width * i, this.y, this.width, this.height)
        }
    }
}