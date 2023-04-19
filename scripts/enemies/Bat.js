const RECOVER_TIME = 1500;

export default class Bat {
    constructor(game, x, ground) {
        this.w = 10
        this.h = 10
        this.x = Math.floor(Math.random() * (game.width + 1));
        this.y = 0 - this.h;
        this.vx = 0.15;
        this.vy = 0.4;
        this.ground = ground;
        this.isGrounded = false;
        this.isRecovering = false;
        this.isLocked = false;
        this.isDead = false;
    }
    update(player) {
        if (this.isGrounded) {
            if (this.x > player.x) {
                this.x -= this.vx
            } else {
                this.x += this.vx;
            }
        } else if (this.isRecovering) {
            if (!this.isLocked) {
                this.isLocked = true;
                setTimeout(() => {
                    this.isGrounded = true;
                    this.y -= this.h;
                }, RECOVER_TIME);
            }
        } else {
            this.y += this.vy;
            if (this.y + this.h >= this.ground) {
                this.isRecovering = true;
            }
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