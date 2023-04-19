let shootDebounce = false;
let shootTime = 690;

export default class InputHandler {
    constructor(game) {
        this.game = game;
        this.keys = [];
        this.takeInput();
    }
    takeInput() {
        window.addEventListener('keydown', (e) => {
            if (!this.keys.includes(e.code)) {
                this.keys.push(e.code);
            }
        })
        window.addEventListener('keyup', (e) => {
            if (this.keys.includes(e.code)) {
                if (e.code == "Space") {
                    this.game.state[2] && (this.game.state[2] = 0);
                }
                const index = this.keys.indexOf(e.code);
                this.keys.splice(index, 1);
            }
        })
        window.addEventListener('mouseup', (e) => {
            if (!shootDebounce) {
                shootDebounce = true;
                this.game.player.shoot(e.x, e.y);
                setTimeout(() => {
                    shootDebounce = false;
                }, shootTime);
            }
        })
    }
}