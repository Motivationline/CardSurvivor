namespace Script {
    export class AnimationManager {

        private shared: { [key: string]: SpriteAnimator[] } = {};
        private unique: Map<number, SpriteAnimator> = new Map();
        private currentUniqueId: number = 0;

        constructor(private readonly provider: Provider) {
            if (ƒ.Project.mode === ƒ.MODE.EDITOR) return;

            ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
        }

        private update = () => {
            if(gameState !== GAMESTATE.PLAYING) return;
            let time = ƒ.Time.game.get();
            for (let type in this.shared) {
                for (let sa of this.shared[type]) {
                    sa.setTime(time);
                }
            }
            for (let sa of this.unique.values()) {
                sa.setTime(time);
            }
        }

        getUniqueAnimationMtx(_sprite: AnimationSprite): [ƒ.Matrix3x3, number] {
            this.currentUniqueId++;
            this.unique.set(this.currentUniqueId, new SpriteAnimator(_sprite));
            return [this.unique.get(this.currentUniqueId).matrix, this.currentUniqueId];
        }
        getAnimationMtx(_sprite: AnimationSprite): ƒ.Matrix3x3 {
            let type = `${_sprite.width}x${_sprite.height}in${_sprite.totalWidth}x${_sprite.totalHeight}with${_sprite.frames}at${_sprite.fps}and${_sprite.wrapAfter}`;
            if (!this.shared[type]) {
                let gameTime: number = ƒ.Time.game.get();
                let animTime = Math.floor((_sprite.frames / _sprite.fps) * 1000);
                this.shared[type] = [
                    new SpriteAnimator(_sprite, gameTime),
                    new SpriteAnimator(_sprite, gameTime + Math.floor((Math.random() * animTime))),
                    new SpriteAnimator(_sprite, gameTime + Math.floor((Math.random() * animTime))),
                    new SpriteAnimator(_sprite, gameTime + Math.floor((Math.random() * animTime))),
                ]
            }

            return this.shared[type][Math.floor(Math.random() * this.shared[type].length)].matrix;
        }

        removeUniqueAnimationMtx(_id: number) {
            this.unique.delete(_id);
        }
    }


}