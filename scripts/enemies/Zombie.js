const zombieText = document.querySelector('#zombie');

export default class Zombie {
    constructor(game, x, ground) {
        this.w = 15
        this.h = 30
        this.x = x
        this.y = ground - this.h;
        this.vx = 0.25;
        this.isDead = false;
        this.isStunned = false;
        this.stunTimeout = 2000;
        this.directionRight = false;
        this.frame = 0;
        setInterval(() => {
            if (this.frame == 2) {
                this.frame = 0
            } else {
                this.frame++;
            }
        }, 333);
    }
    update(player) {
        if (!this.isStunned) {
            if (this.x > player.x) {
                this.directionRight = false;
                this.x -= this.vx
            } else {
                this.directionRight = true;
                this.x += this.vx;
            }
        }

        if (!this.isStunned && player.x < this.x + this.w && player.x + player.w > this.x && player.y < this.y + this.h && player.y + player.h > this.y) {
            if (!player.smash) {
                player.isDead = true;
            } else {
                this.isStunned = true;
                setTimeout(() => {
                    this.isStunned = false;
                }, this.stunTimeout);
            }
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
        ctx.drawImage(zombieText, 10 + (this.frame * 15), (this.directionRight * 24), 15, 28, this.x, this.y + 3, this.w, this.h);
        //ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}