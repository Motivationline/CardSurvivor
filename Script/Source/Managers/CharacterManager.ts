namespace Script {
    import ƒ = FudgeCore;
    export class CharacterManager {
        private movementVector: ƒ.Vector2 = new ƒ.Vector2();
        #character: Character;

        constructor(private readonly provider: Provider) {
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

            this.#character.move(this.movementVector);
        }
    }


}