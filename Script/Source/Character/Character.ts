namespace Script {
    import ƒ = FudgeCore;
    export class Character extends ƒ.Component implements Hittable {
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
        #healthElement: HTMLProgressElement;
        private prevDirection: number = 0;
        health: number = 100;
        maxHealth: number = 100;
        private rigidbody: ƒ.ComponentRigidbody;
        private cardManager: CardManager;
        speed: number = 1;
        private visualChildren: ƒ.Node[] = [];

        constructor() {
            super();
            if (ƒ.Project.mode === ƒ.MODE.EDITOR) return;
            this.addEventListener(ƒ.EVENT.NODE_DESERIALIZED, () => {
                this.node.addEventListener(ƒ.EVENT.GRAPH_INSTANTIATED, () => {
                    provider.get(CharacterManager).character = this;
                    this.init();
                    this.setupAnimator();
                }, true);
            });
        }

        private init() {
            this.#healthElement = <HTMLProgressElement>document.getElementById("healthbar");
            this.rigidbody = this.node.getComponent(ƒ.ComponentRigidbody);
            this.cardManager = provider.get(CardManager);

            this.visualChildren = this.node.getChildrenByName("visuals")[0].getChildren();
        }

        move(_direction: ƒ.Vector2, _time: number) {
            //TODO: update this to use physics
            this.rigidbody.setVelocity(ƒ.Vector3.SCALE(new ƒ.Vector3(_direction.x, _direction.y), this.cardManager.modifyValuePlayer(this.speed, PassiveCardEffect.MOVEMENT_SPEED)));
            this.#animator.setTime()
            if (_direction.magnitudeSquared === 0) {
                this.setAnimation(AnimationState.IDLE);
            } else {
                this.setAnimation(AnimationState.WALKING);
            }
            let dir = Math.sign(_direction.x);
            if (dir !== this.prevDirection && dir !== 0) {
                this.prevDirection = dir;
                if (this.prevDirection > 0) {
                    this.changeVisualDirection();
                } else if (this.prevDirection < 0) {
                    this.changeVisualDirection(180);
                }
            }

            // for (let collision of this.rigidbody.collisions) {
            //     if (collision.node.name === "enemy") {
            //         this.hit({ damage: collision.node.getComponent(Enemy).damage * _time });
            //     }
            // }
        }

        update(_direction: ƒ.Vector2) {
            let time: number = Math.min(1, ƒ.Loop.timeFrameGame / 1000);
            this.move(_direction, time);

            // regenerate health
            if (gameState === GAMESTATE.PLAYING) {
                let regeneration: number = this.cardManager.modifyValuePlayer(0, PassiveCardEffect.REGENERATION);
                if (regeneration > 0) {
                    this.health = Math.min(this.maxHealth, this.health + regeneration);
                    this.updateHealthVisually();
                }
            }
        }

        hit(_hit: Hit): number {
            this.health -= _hit.damage;
            //TODO display damage numbers
            //update display
            this.updateHealthVisually();
            if (this.health > 0) return _hit.damage;

            // TODO: Game Over
            return 0;
        }

        private changeVisualDirection(_rot: number = 0) {
            for (let child of this.visualChildren) {
                let mesh = child.getComponent(ƒ.ComponentMesh);
                if (mesh) mesh.mtxPivot.rotation = new ƒ.Vector3(0, _rot, 0);
            }
        }

        private updateHealthVisually() {
            this.#healthElement.max = this.maxHealth;
            this.#healthElement.value = this.health;
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
            for (let layer of this.#layers) {
                layer.setTexture(_state);
            }
        }
        private setupAnimator = () => {
            this.#animator = new SpriteAnimator(this.#idleSprite);
            for (let child of this.visualChildren) {
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