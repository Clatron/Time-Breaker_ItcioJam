import Bullet from "../objects/bullet.js";
const playerText = document.querySelector('#player');
const shooteffect = /** @type {HTMLAudioElement} */ (document.querySelector('#shoot'));
shooteffect.volume = .4;

export default class Player {
    constructor(game, width, height) {
        this.game = game;
        this.w = width;
        this.h = height;
        this.x = this.game.width / 2 - this.w / 2;
        this.y = game.height - (15 + height);
        this.ground = game.height - (15 + height);
        this.vx = 0;
        this.vy = 0;
        this.weight = 0.05;
        this.jumpforce = 2;
        this.dashforce = 3;
        this.Bullets = [];
        this.isDead = false;
        this.lastDir = "FORWARD";
        this.smash = false;
        this.frame = 0;
        setInterval(() => {
            if (this.frame == 3) {
                this.frame = 0;
            } else {
                this.frame += 1;
            }
        }, 250);
    }
    update(state, keys) {
        if (state[4] == "SMASHING") {
            if (this.smash) {
                this.y += this.vy;

                if (Math.floor(this.y) >= this.ground) {
                    this.y = this.ground;
                    this.game.state[4] = "IDLE";
                    this.vy = 0;
                    this.smash = false;
                }
            } else {
                this.smash = true;
                this.vy = this.jumpforce;
                this.game.state[1] = "IDLE";
                this.game.state[2] = 0;
            }
        }
        else if (state[0] == "DASHING") {
            (keys.includes('KeyA')) ? this.vx = -this.dashforce : this.vx = this.dashforce;
            setTimeout(() => {
                this.game.state[3] = 1
                setTimeout(() => {
                    this.game.state[3] = 0
                }, 1500)
            }, 150)
        } else {
            if (state[0] == "FORWARD") {
                this.vx = 0.5;
                this.lastDir = "FORWARD";
            }
            else if (state[0] == "BACKWARD") {
                this.vx = -0.5;
                this.lastDir = "BACKWARD";
            }
            else this.vx = 0;
        }

        if (state[1] == "JUMPING" && state[4] != "SMASHING") {
            if (this.y == this.ground) {
                this.vy = this.jumpforce;
                this.y -= this.vy;
                this.vy -= this.weight;
            } else {
                this.y -= this.vy;
                this.vy -= this.weight;
                if (Math.floor(this.vy) == 0) this.game.state[1] = "FALLING";
            }
        } else if (state[1] == "FALLING"  && state[4] != "SMASHING") {
            this.y -= this.vy;
            this.vy -= this.weight;
            if (Math.floor(this.y) == this.ground) {
                this.y = this.ground;
                this.game.state[1] = "DEBOUNCE";

                setTimeout(() => {
                    this.game.state[2] = 0;
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
        if (this.game.state[0] == "IDLE") {
            ctx.drawImage(playerText, 0, 0, 15, 30, this.x, this.y, this.w, this.h);
        } else {
            ctx.drawImage(playerText, this.w * this.frame, 30, 15, 30, this.x, this.y, this.w, this.h);
        }
        //ctx.fillRect(this.x, this.y, this.w, this.h);
        this.Bullets.forEach(b => b.draw(ctx))
    }
    shoot() {
        let vx = 3;

        if (this.game.state[0] == "FORWARD") {
            vx = 3;
        } else if (this.game.state[0] == "BACKWARD") {
            vx = -3;
        } else {
            (this.lastDir == "FORWARD") ? vx = 3 : vx = -3;
        }

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