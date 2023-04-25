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
                if (e.code == "Space" && !shootDebounce) {
                    shootDebounce = true;
                    this.game.player.shoot();
                    setTimeout(() => {
                        shootDebounce = false;
                    }, shootTime);
                }
                const index = this.keys.indexOf(e.code);
                this.keys.splice(index, 1);
            }
        })
    }
}