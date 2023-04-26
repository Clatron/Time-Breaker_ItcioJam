import Player from "./components/player.js";
import Ground from "./components/ground.js";
import InputHandler from "./hooks/inputHandler.js";
import LevelManager from "./scripts/levelManager.js";

const canvas = /** @type {HTMLCanvasElement} */ (document.querySelector('#main'));
const startGame = (document.querySelectorAll('#startGame'));
const menu = document.querySelector('.Menu');
const deathscreen = document.querySelector('.DeathScreen');
const theme = /** @type {HTMLAudioElement} */ (document.querySelector('#theme'));
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false
ctx.font = "10px Arial";

const WIDTH = 300;
const HEIGHT = 150;
const PLAYER_WIDTH = 15;
const PLAYER_HEIGHT = 30;
const GROUND_HEIGHT = 15;

const KeyBindings = {
    "KeyD": "FORWARD",
    "KeyA": "BACKWARD",
    "KeyW": "JUMPING",
    "ShiftLeft": "DASHING",
    "KeyC": "SMASH",
}

ctx.width = WIDTH;
ctx.height = HEIGHT;

class Game {
    constructor(width, height, playerWidth, playerHeight) {
        this.width = width;
        this.height = height;
        this.inputs = new InputHandler(this);
        this.player = new Player(this, playerWidth, playerHeight);
        this.ground = new Ground(this, GROUND_HEIGHT, this.height - GROUND_HEIGHT);
        this.state = ["IDLE", "IDLE", 0, 0, "IDLE"]; //x and y and JumpDebounce and DashDebounce and Smashing
        this.score = 0;
        this.bestScore = 0;
        this.round = 1;
        this.levelManager = new LevelManager(this, ctx);
    }
    update() {
        this.setState();
        this.player.update(this.state, this.inputs.keys);
        this.levelManager.update(this.player);
        this.score = this.levelManager.score;
        this.round = this.levelManager.round;

        if (this.score > this.bestScore) this.bestScore = this.score;
    }
    draw(/** @type {CanvasRenderingContext2D} */ ctx) {
        this.player.draw(ctx);
        this.ground.draw(ctx);
        this.levelManager.draw();

        ctx.fillText(`Round: ${this.round}`, 10, 10);
        ctx.fillText(`Score: ${this.score}`, 10, 20);
        ctx.fillText(`Best score: ${this.bestScore}`, 225, 20);
    }
    setState() {
        this.state[0] = "IDLE";
        
        if (this.inputs.keys.includes('ShiftLeft') && this.state[3] == 0) {
            this.state[0] = KeyBindings.ShiftLeft;
        } else {
            if (this.inputs.keys.includes('KeyD')) this.state[0] = KeyBindings.KeyD;
            if (this.inputs.keys.includes('KeyA')) {
                if (this.state[0] != "IDLE") {
                    this.state[0] = "IDLE";
                } else {
                    this.state[0] = KeyBindings.KeyA;
                }
            }
        }

        console.log([this.state[1] != "IDLE", this.inputs.keys.includes('KeyC'), this.state[4] == "IDLE"]);
        if (this.inputs.keys.includes('KeyW') && this.state[1] == "IDLE" && this.state[2] == 0) {
            this.state[1] = KeyBindings.KeyW;
            this.state[2] = 1;
        } else if (this.state[1] != "IDLE" && this.inputs.keys.includes('KeyC') && this.state[4] == "IDLE") {
            this.state[4] = "SMASHING";
        }
    }
}

const game = new Game(WIDTH, HEIGHT, PLAYER_WIDTH, PLAYER_HEIGHT);

startGame[0].onclick = () => {
    menu.classList.add('Hide');
    game.levelManager.startRound();
    animate();
    theme.play();
}
startGame[1].onclick = () => {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    menu.classList.remove('Hide');
    deathscreen.classList.remove('Show');

    //Reset states
    game.state = ["IDLE", "IDLE", 0, 0, "IDLE"];

    //Reset player & bullets
    game.player.reset();

    //Reset enemies & score
    game.levelManager.reset();

    theme.pause();
    theme.currentTime = 0;
}


function animate() {
    if (game.player.isDead) {
        deathscreen.classList.add('Show');
    } else {
        ctx.clearRect(0, 0, 300, 150);
        game.update();
        game.draw(ctx);
        requestAnimationFrame(animate);
    }
}