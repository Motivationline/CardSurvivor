namespace Script {
    export class Enemy extends ƒ.Component implements EnemyOptions {
        public speed: number = 1;
        public damage: number = 1;
        public knockbackMultiplier: number = 1;
        public health: number = 1;
        public attacks: EnemyAttack[] = [];
        public moveSprite: AnimationSprite;
        public desiredDistance: [number, number] = [0, 0];
        private currentlyDesiredDistance: [number, number] = [0, 0];
        private currentlyDesiredDistanceSquared: [number, number] = [0, 0];
        public dropXP: number = 0;

        private material: ƒ.ComponentMaterial;
        private enemyManager: EnemyManager;
        private prevDirection: number;
        private currentlyActiveAttack: EnemyAttackActive;

        constructor() {
            super();

            if (ƒ.Project.mode === ƒ.MODE.EDITOR) return;
            this.addEventListener(ƒ.EVENT.NODE_DESERIALIZED, this.deserialized);
        }

        private deserialized = () => {
            if (ƒ.Project.mode === ƒ.MODE.EDITOR) return;

            this.removeEventListener(ƒ.EVENT.NODE_DESERIALIZED, this.deserialized);
            this.material = this.node.getComponent(ƒ.ComponentMaterial);
            this.enemyManager = provider.get(EnemyManager);
        }

        setup(_options: Partial<EnemyOptions>) {
            _options = { ...this, ..._options };
            this.speed = _options.speed;
            this.damage = _options.damage;
            this.knockbackMultiplier = _options.knockbackMultiplier;
            this.health = _options.health;
            this.attacks = _options.attacks;
            this.moveSprite = _options.moveSprite;
            this.desiredDistance = _options.desiredDistance;
            this.dropXP = _options.dropXP;
            this.updateDesiredDistance(this.desiredDistance);
            this.setCentralAnimator(this.moveSprite);
        }

        private updateDesiredDistance(_distance: [number, number]) {
            this.currentlyDesiredDistance = _distance;
            this.currentlyDesiredDistanceSquared = [this.currentlyDesiredDistance[0] * this.currentlyDesiredDistance[0], this.currentlyDesiredDistance[1] * this.currentlyDesiredDistance[1]];
        }

        #uniqueAnimationId: number;
        private setCentralAnimator(_as: AnimationSprite, _unique: boolean = false) {
            if (!_as) return;
            let am: AnimationManager = provider.get(AnimationManager);
            if (this.#uniqueAnimationId) {
                am.removeUniqueAnimationMtx(this.#uniqueAnimationId);
                this.#uniqueAnimationId = undefined;
            }
            if (_unique) {
                [this.material.mtxPivot, this.#uniqueAnimationId] = am.getUniqueAnimationMtx(_as);
            } else {
                this.material.mtxPivot = am.getAnimationMtx(_as);
            }
            if (_as.material)
                this.material.material = _as.material;
        }

        public update(_charPosition: ƒ.Vector3, _frameTimeInSeconds: number) {

            // check distance to player
            let diff = ƒ.Vector3.DIFFERENCE(_charPosition, this.node.mtxLocal.translation);
            let mgtSqrd = diff.magnitudeSquared;

            if (this.currentlyActiveAttack && this.currentlyActiveAttack.movement && this.currentlyActiveAttack.started) {
                this.currentlyActiveAttack.movement(diff, mgtSqrd, _charPosition, _frameTimeInSeconds);
            } else {
                this.move(diff, mgtSqrd, _frameTimeInSeconds);
            }

            // if the enemy has special attacks and none are active, choose one
            this.chooseAttack();

            // if there is a currently active attack, execute it
            this.executeAttack(mgtSqrd, _frameTimeInSeconds);
        }

        private move(_diff: ƒ.Vector3, _mgtSqrd: number, _frameTimeInSeconds: number) {
            //move towards or away from player?
            _diff.normalize(this.speed * Math.min(1, _frameTimeInSeconds));

            if (_mgtSqrd < this.currentlyDesiredDistanceSquared[0]) {
                // we're too close to the player, gotta move away
                _diff.scale(-1);
            } else if (_mgtSqrd > this.currentlyDesiredDistanceSquared[0] && _mgtSqrd < this.currentlyDesiredDistanceSquared[1]) {
                // we're in a good distance to the player, no need to move further
                _diff = ƒ.Vector3.ZERO();
                //TODO: set idle animation
            }
            //TODO: change to physics based movement
            this.node.mtxLocal.translate(_diff, false);

            // rotate visually to face correct direction
            let dir = Math.sign(_diff.x);
            if (dir !== this.prevDirection) {
                this.prevDirection = dir;
                if (this.prevDirection > 0) {
                    this.node.mtxLocal.rotation = new ƒ.Vector3();
                } else if (this.prevDirection < 0) {
                    this.node.mtxLocal.rotation = new ƒ.Vector3(0, 180, 0);
                }
            }
        }

        private chooseAttack() {
            if (this.currentlyActiveAttack || this.attacks.length === 0) return;
            this.currentlyActiveAttack = { ...this.attacks[Math.floor(Math.random() * this.attacks.length)] };
            this.currentlyActiveAttack.started = false;
            this.currentlyActiveAttack.done = false;
            this.updateDesiredDistance(this.currentlyActiveAttack.requiredDistance);
        }

        private executeAttack(_mgtSqrd: number, _frameTimeInSeconds: number) {
            if (!this.currentlyActiveAttack) return;

            if (!this.currentlyActiveAttack.started) {
                // attack hasn't started yet. should we start it?
                if (_mgtSqrd > this.currentlyDesiredDistanceSquared[0] && _mgtSqrd < this.currentlyDesiredDistanceSquared[1]) {
                    // start the attack
                    this.currentlyActiveAttack.started = true;
                    this.setCentralAnimator(this.currentlyActiveAttack.sprite, true);
                }
            }
            if (this.currentlyActiveAttack.started) {
                // attack is ongoingw
                if (this.currentlyActiveAttack.windUp > 0) {
                    // still preparing
                    this.currentlyActiveAttack.windUp -= _frameTimeInSeconds;
                } else if (!this.currentlyActiveAttack.done) {
                    // time to execute attack
                    this.currentlyActiveAttack.done = true;
                    this.currentlyActiveAttack.attack();
                } else {
                    //we're on cooldown now
                    this.currentlyActiveAttack.cooldown -= _frameTimeInSeconds;
                    if (this.currentlyActiveAttack.cooldown < 0) {
                        // cooldown is up, we're ready to do something else
                        this.currentlyActiveAttack = undefined;
                        this.updateDesiredDistance(this.desiredDistance);
                        this.setCentralAnimator(this.moveSprite);
                    }
                }

            }
        }

        public getDamaged(_dmg: number) {
            this.health -= _dmg;
            if (this.health > 0) return;

            this.enemyManager.removeEnemy(this);
            //TODO: drop XP
        }
    }

    export interface EnemyOptions {
        speed: number;
        damage: number;
        knockbackMultiplier: number;
        health: number;
        attacks: EnemyAttack[];
        moveSprite: AnimationSprite;
        desiredDistance: [number, number];
        dropXP: number;
    }

    export interface EnemyAttack {
        requiredDistance: [number, number];
        windUp: number;
        cooldown: number;
        sprite: AnimationSprite;
        attack: () => void;
        movement?: (_diff: ƒ.Vector3, _mgtSqrd: number, _charPosition: ƒ.Vector3, _frameTimeInSeconds: number) => void;
    }
    interface EnemyAttackActive extends EnemyAttack {
        started?: boolean;
        done?: boolean;
    }
    export interface AnimationSprite {
        width: number;
        height: number;
        totalWidth: number;
        totalHeight: number;
        frames: number;
        fps: number;
        wrapAfter: number;
        material?: ƒ.Material;
    }
}