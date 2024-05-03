namespace Script {
    import ƒ = FudgeCore;
    export class Character extends ƒ.Component {
        #animator: SpriteAnimator;
        #walkingSprite: AnimationSprite = {
            fps: 24,
            frames: 24,
            height: 256,
            width: 256,
            totalHeight: 1280,
            totalWidth: 1280,
            wrapAfter: 5,
        };
        #idleSprite: AnimationSprite = {
            fps: 24,
            frames: 24,
            height: 256,
            width: 256,
            totalHeight: 1280,
            totalWidth: 1280,
            wrapAfter: 5,
        };
        prevAnimation: AnimationState = AnimationState.IDLE;
        #layers: CharacterLayer[] = [];

        constructor() {
            super();
            if (ƒ.Project.mode === ƒ.MODE.EDITOR) return;
            this.addEventListener(ƒ.EVENT.NODE_DESERIALIZED, () => {
                this.node.addEventListener(ƒ.EVENT.GRAPH_INSTANTIATED, () => {
                    provider.get(CharacterManager).character = this;
                }, true);
                this.setupAnimator();
            })
        }
        move(_direction: ƒ.Vector2) {
            //TODO: update this to use physics
            this.node.mtxLocal.translate(ƒ.Vector3.SCALE(new ƒ.Vector3(_direction.x, _direction.y), ƒ.Loop.timeFrameGame / 1000));
            this.#animator.setTime()
            if (_direction.magnitudeSquared === 0) {
                this.setAnimation(AnimationState.IDLE);
            } else {
                this.setAnimation(AnimationState.WALKING);
            }

        }

        private setAnimation(_state: AnimationState) {
            if (_state === this.prevAnimation) return;
            this.prevAnimation = _state;

            switch (this.prevAnimation) {
                case AnimationState.IDLE:
                    this.#animator.reset(this.#idleSprite);
                    break;
                case AnimationState.WALKING:
                    this.#animator.reset(this.#walkingSprite);
                    break;
            }
            for(let layer of this.#layers){
                layer.setTexture(_state);
            }
        }
        private setupAnimator = () => {
            this.#animator = new SpriteAnimator(this.#idleSprite);
            for (let child of this.node.getChildren()) {
                child.getComponent(ƒ.ComponentMaterial).mtxPivot = this.#animator.matrix;
                this.#layers.push(child.getComponent(CharacterLayer));
            }
            this.setAnimation(AnimationState.IDLE);
        }
    }

    export enum AnimationState {
        IDLE = "idle",
        WALKING = "walking",
    }
}