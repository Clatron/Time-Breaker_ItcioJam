import Zombie from "./enemies/Zombie.js";
import Bat from "./enemies/Bat.js";

const TotalEnemies = [Zombie, Bat];
const roundscreen = document.querySelector('.RoundScreen');
const roundelement = document.querySelector('#round');
const enemieselement = document.querySelector('#enemies');

export default class LevelManager {
    constructor(game, /** @type {CanvasRenderingContext2D} */ ctx) {
        this.game = game;
        this.ground = game.ground.y;
        this.ctx = ctx;
        this.vx = 0.5;
        this.round = 1;
        this.score = 0;
        this.Enemies = [];
        window.addEventListener('keydown', (e) => {
            if (e.code == "KeyF") {
                this.spawnEnemy(100);
            }
        })
    }
    startRound() {
        //Round Animation
        roundelement.innerHTML = `Round ${this.round}`;
        enemieselement.innerHTML = `Total Enemies ${this.round * 5}`;
        roundscreen.classList.remove('Blur');
        roundscreen.classList.add('Show');

        setTimeout(() => {
            roundscreen.classList.add('Blur');
            roundscreen.classList.remove('Show');

            const enemiesToSpawn = this.round * 5;
            let left = this.game.width;
            let right = 0;
            for (let i = 1; i <= enemiesToSpawn; i++) {
                const random = Math.floor(Math.random() * 2);
                const randomDistance = Math.floor(Math.random() * 15 + 15);
                
                if (random) {
                    left += randomDistance;
                    this.spawnEnemy(left);
                } else {
                    right -= randomDistance;
                    this.spawnEnemy(right);
                }
            }
        }, 2000)
    }
    spawnEnemy(x) {
        const enemy = Math.floor(Math.random() * TotalEnemies.length);
        const newEnemy = new TotalEnemies[enemy](this.game, x, this.ground);
        this.Enemies.push(newEnemy);
    }
    update(player) { 
        this.Enemies.forEach((enemy) => {
            if (enemy.isDead) {
                const index = this.Enemies.indexOf(enemy);
                this.Enemies.splice(index, 1);
                this.score += 1;
                if (this.Enemies.length == 0) {
                    this.round += 1;
                    this.startRound();
                }
            } else {
                enemy.update(player);
            }
        });
    }
    draw() {
        this.Enemies.forEach((enemy) => enemy.draw(this.ctx));
    }
    reset() {
        //Reset enemies
        this.Enemies = [];

        //Reset score
        this.score = 0;

        //Reset round
        this.round = 1;

        roundscreen.classList.remove('Blur');
    }
}