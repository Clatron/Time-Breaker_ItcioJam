export default class Zombie {
    constructor(game, x, ground) {
        this.w = 15
        this.h = 30
        this.x = x
        this.y = ground - this.h;
        this.vx = 0.25;
        this.isDead = false;
    }
    update(player) {
        if (this.x > player.x) {
            this.x -= this.vx
        } else {
            this.x += this.vx;
        }

        if (player.x < this.x + this.w && player.x + player.w > this.x && player.y < this.y + this.h && player.y + player.h > this.y) {
            player.isDead = true;
        }

        player.Bullets.forEach(b => {
            if (b.x < this.x + this.w && b.x + b.w > this.x && b.y < this.y + this.h && b.y + b.h > this.y) {
                const index = player.Bullets.indexOf(b);
                player.Bullets.splice(index, 1);

                this.isDead = true;
            }
        });
    }
    draw(/** @type {CanvasRenderingContext2D} */ ctx) {
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}