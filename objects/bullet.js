const bullet = /** @type {HTMLImageElement} */ (document.querySelector('#bullet'));

const WIDTH = 10;
const HEIGHT = 4;

export default class Bullet {
    constructor(player, vx) {
        this.player = player;
        this.x = player.x;
        this.y = player.y;
        this.vx = vx;
        this.w = WIDTH;
        this.h = HEIGHT;
    }
    update() {
        this.x += this.vx;
    }
    draw(/** @type {CanvasRenderingContext2D} */ ctx) {
        ctx.drawImage(bullet, 3, 6, WIDTH, HEIGHT, this.x, this.y, this.w, this.h);
    }
}