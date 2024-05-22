namespace Script {
    import ƒ = FudgeCore;
    export class CharacterManager {
        private movementVector: ƒ.Vector2 = new ƒ.Vector2();
        #character: Character;

        constructor(private readonly provider: Provider) {
            if (ƒ.Project.mode === ƒ.MODE.EDITOR) return;

            ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
        }

        get character() {
            return this.#character;
        }
        set character(_char: Character){
            this.#character = _char;
        }

        public setMovement(_direction: ƒ.Vector2) {
            this.movementVector = _direction;
        }

        private update = () => {
            if(!this.#character) return;
            if (gameState === GAMESTATE.PAUSED) return;
            if (gameState === GAMESTATE.IDLE) return;

            this.#character.update(this.movementVector);
        }
    }


}