import Bullet from "../objects/bullet.js";
const shooteffect = /** @type {HTMLAudioElement} */ (document.querySelector('#shoot'));
shooteffect.volume = .4;

export default class Player {
    constructor(game, width, height) {
        this.game = game;
        this.w = width;
        this.h = height;
        this.x = this.game.width / 2 - this.w / 2;
        this.y = game.height - this.h * 2;
        this.ground = game.height - this.h * 2;
        this.vx = 0;
        this.vy = 0;
        this.weight = 0.05;
        this.jumpforce = 2;
        this.dashforce = 3;
        this.Bullets = [];
        this.isDead = false;
    }
    update(state, keys) {
        if (state[0] == "DASHING") {
            (keys.includes('KeyA')) ? this.vx = -this.dashforce : this.vx = this.dashforce;
            setTimeout(() => {
                this.game.state[3] = 1
                setTimeout(() => {
                    this.game.state[3] = 0
                }, 1500)
            }, 150)
        } else {
            if (state[0] == "FORWARD") this.vx = 0.5;
            else if (state[0] == "BACKWARD") this.vx = -0.5;
            else this.vx = 0;
        }

        if (state[1] == "JUMPING") {
            if (this.y == this.ground) {
                this.vy = this.jumpforce;
                this.y -= this.vy;
                this.vy -= this.weight;
            } else {
                this.y -= this.vy;
                this.vy -= this.weight;
                if (Math.floor(this.vy) == 0) this.game.state[1] = "FALLING";
            }
        } else if (state[1] == "FALLING") {
            this.y -= this.vy;
            this.vy -= this.weight;
            if (Math.floor(this.y) == this.ground) {
                this.y = this.ground;
                this.game.state[1] = "DEBOUNCE"

                setTimeout(() => {
                    this.game.state[1] = "IDLE";
                }, 100)
            }
        }

        if (this.x == 0 && this.vx < 0) {
            return;
        } else if (this.x == this.game.width - this.w && this.vx > 0) {
            return;
        } else {
            this.x += this.vx
        }

        this.Bullets.forEach(b => {
            if (b.x > this.game.width || b.x < 0) {
                const index = this.Bullets.indexOf(b);
                this.Bullets.splice(index, 1);
            } else {
                b.update();
            }
        });
    }
    draw(/** @type {CanvasRenderingContext2D} */ ctx) {
        ctx.fillRect(this.x, this.y, this.w, this.h);
        this.Bullets.forEach(b => b.draw(ctx))
    }
    shoot(x, y) {
        let xInCanvas = (this.game.width * x) / window.innerWidth;
        let playerMiddle = this.x + (this.w / 2);
        let vx = 0;

        if (xInCanvas < playerMiddle) vx = -1
        else vx = 1

        this.Bullets.push(new Bullet(this, vx));
        shooteffect.play();
    }
    reset() {
        //Reset player
        this.isDead = false;
        this.x = this.game.width / 2 - this.w / 2;
        this.y = this.game.height - (this.h + this.game.ground.height);

        //Reset bullets
        this.Bullets = [];
    }
}