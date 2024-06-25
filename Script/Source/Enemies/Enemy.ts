/// <reference path="../Animateable.ts" />
namespace Script {
    export class Enemy extends Animateable implements EnemyOptions, Hitable {
        public speed: number = 1;
        public damage: number = 1;
        public knockbackMultiplier: number = 1;
        public health: number = 1;
        public attacks: EnemyAttack[] = [];
        public moveSprite: AnimationSprite;
        public desiredDistance: [number, number] = [0, 0];
        public directionOverride: ƒ.Vector3;
        private currentlyDesiredDistance: [number, number] = [0, 0];
        private currentlyDesiredDistanceSquared: [number, number] = [0, 0];
        public dropXP: number = 0;
        public size: number = 1;
        public events?: { [name: string]: (_event?: CustomEvent<any>) => void; };
        public hitboxSize: number;
        public shadow?: { size?: number; position?: ƒ.Vector2; };
        public boss?: boolean;

        private enemyManager: EnemyManager;
        private prevDirection: number;
        private currentlyActiveAttack: EnemyAttackActive;
        private rigidbody: ƒ.ComponentRigidbody;
        private touchingPlayer: boolean;
        private meleeCooldown: number;
        private modifier: PassiveCardEffectObject = {};
        private invulnerable: boolean = false;
        public isSpawning: boolean = false;

        private stunned: number = 0;

        private static defaults: EnemyOptions = {
            attacks: [],
            damage: 1,
            speed: 1,
            desiredDistance: [0, 0],
            dropXP: 1,
            size: 1,
            health: 1,
            knockbackMultiplier: 1,
            moveSprite: {
                fps: 1,
                frames: 1,
                height: 256,
                width: 256,
                totalHeight: 256,
                totalWidth: 256,
                wrapAfter: 1,
            },
            directionOverride: undefined,
            events: undefined,
            hitboxSize: 0.4,
            boss: false,
        }

        constructor() {
            super();

            if (ƒ.Project.mode === ƒ.MODE.EDITOR) return;
            this.addEventListener(ƒ.EVENT.NODE_DESERIALIZED, this.deserializedListener);
        }

        protected deserializedListener = () => {
            this.removeEventListener(ƒ.EVENT.NODE_DESERIALIZED, this.deserializedListener);
            this.enemyManager = provider.get(EnemyManager);
            this.rigidbody = this.node.getComponent(ƒ.ComponentRigidbody);
            this.rigidbody.effectGravity = 0;
            this.rigidbody.effectRotation = new ƒ.Vector3(0, 0, 0);
            this.rigidbody.addEventListener(ƒ.EVENT_PHYSICS.COLLISION_ENTER, this.onCollisionEnter);
            this.rigidbody.addEventListener(ƒ.EVENT_PHYSICS.COLLISION_EXIT, this.onCollisionExit);
        }

        setup(_options: Partial<EnemyOptions>, _modifier: PassiveCardEffectObject) {
            _options = { ...Enemy.defaults, ..._options };
            let cm = provider.get(CardManager);
            this.speed = cm.modifyValue(_options.speed, PassiveCardEffect.MOVEMENT_SPEED, _modifier);
            this.damage = cm.modifyValue(_options.damage, PassiveCardEffect.DAMAGE, _modifier);
            this.knockbackMultiplier = cm.modifyValue(_options.knockbackMultiplier, PassiveCardEffect.KNOCKBACK, _modifier);
            this.health = cm.modifyValue(_options.health, PassiveCardEffect.HEALTH, _modifier);
            this.attacks = _options.attacks;
            this.desiredDistance = _options.desiredDistance;
            this.dropXP = cm.modifyValue(_options.dropXP, PassiveCardEffect.XP, _modifier);
            this.directionOverride = _options.directionOverride;
            this.updateDesiredDistance(this.desiredDistance);
            this.moveSprite = this.getSprite(_options.moveSprite);
            this.setCentralAnimator(this.moveSprite);
            this.stunned = 0;
            this.boss = _options.boss;
            this.size = cm.modifyValue(_options.size, PassiveCardEffect.ENEMY_SIZE, _modifier);
            this.events = _options.events;

            this.node.mtxLocal.scaling = ƒ.Vector3.ONE(this.size);

            this.modifier = _modifier ?? {};
            this.meleeCooldown = Math.random();
            this.rigidbody.mtxPivot.scaling = ƒ.Vector3.ONE(_options.hitboxSize);
            this.invulnerable = false;
            this.currentlyActiveAttack = undefined;

            this.shadow = {
                ...{
                    size: 1,
                    position: new ƒ.Vector2(0, -0.25),
                }, ..._options.shadow
            };

            let shadow = this.node.getChild(0);
            if (this.shadow.size) shadow.mtxLocal.scaling = ƒ.Vector3.ONE(this.shadow.size);
            if (this.shadow.position) shadow.mtxLocal.translation = new ƒ.Vector3(this.shadow.position.x, this.shadow.position.y, this.node.mtxLocal.translation.z);

            //hide for spawning
            (<EnemyGraphInstance>this.node).isSpawning = true;
            this.isSpawning = true;
            this.node.getComponent(ƒ.ComponentMesh).activate(false);
            this.node.getChild(0).activate(false);
            this.node.getChild(1).activate(true);
            this.rigidbody.activate(false);
            setTimeout(() => {
                this.rigidbody.activate(true);
                this.node.getChild(0).activate(true);
                this.node.getChild(1).activate(false);
                this.node.getComponent(ƒ.ComponentMesh).activate(true);
                this.isSpawning = false;
                (<EnemyGraphInstance>this.node).isSpawning = false;
            }, 1000);

            _options.afterSetup?.call(this);


        }

        private updateDesiredDistance(_distance: [number, number]) {
            this.currentlyDesiredDistance = _distance;
            this.currentlyDesiredDistanceSquared = [this.currentlyDesiredDistance[0] * this.currentlyDesiredDistance[0], this.currentlyDesiredDistance[1] * this.currentlyDesiredDistance[1]];
        }

        public update(_charPosition: ƒ.Vector3, _frameTimeInSeconds: number) {
            if (this.isSpawning) return;
            if (this.stunned > 0) {
                this.stunned = Math.max(0, this.stunned - _frameTimeInSeconds);
                if (this.stunned <= 0) {
                    this.setCentralAnimator(this.moveSprite);
                }
                return;
            }

            // check distance to player
            let diff = ƒ.Vector3.DIFFERENCE(_charPosition, this.node.mtxLocal.translation);
            let mgtSqrd = diff.magnitudeSquared;

            if (this.currentlyActiveAttack && this.currentlyActiveAttack.movement && this.currentlyActiveAttack.started) {
                this.currentlyActiveAttack.movement.call(this, diff, mgtSqrd, _charPosition, _frameTimeInSeconds);
            } else {
                this.move(diff, mgtSqrd, _frameTimeInSeconds);
            }

            this.meleeAttack(_frameTimeInSeconds);

            // if the enemy has special attacks and none are active, choose one
            this.chooseAttack();

            // if there is a currently active attack, execute it
            this.executeAttack(mgtSqrd, _frameTimeInSeconds);

        }

        public stun(_time: number): void {
            if (this.stunned <= 0) {
                this.removeAnimationEventListeners();
                let am: AnimationManager = provider.get(AnimationManager);
                if (this.uniqueAnimationId) {
                    am.removeUniqueAnimationMtx(this.uniqueAnimationId);
                    this.uniqueAnimationId = undefined;
                }

                let sa = new SpriteAnimator(this.moveSprite, 0);
                this.material.mtxPivot = sa.matrix;
            }
            this.stunned += _time;
            this.currentlyActiveAttack = undefined;
        }

        private move(_diff: ƒ.Vector3, _mgtSqrd: number, _frameTimeInSeconds: number) {
            if (this.directionOverride) {
                // do we have a movement override?
                let direction = this.directionOverride.clone;
                direction.normalize(this.speed);
                //TODO: change to physics based movement
                // this.node.mtxLocal.translate(direction, false);
                this.rigidbody.setVelocity(direction);
            } else {
                // normal movement
                _diff.normalize(this.speed);

                //move towards or away from player?
                if (_mgtSqrd < this.currentlyDesiredDistanceSquared[0]) {
                    // we're too close to the player, gotta move away
                    _diff.scale(-1);
                } else if (_mgtSqrd > this.currentlyDesiredDistanceSquared[0] && _mgtSqrd < this.currentlyDesiredDistanceSquared[1]) {
                    // we're in a good distance to the player, no need to move further
                    _diff = ƒ.Vector3.ZERO();
                    //TODO: set idle animation
                }
                //TODO: change to physics based movement
                // this.node.mtxLocal.translate(_diff, false);
                this.rigidbody.setVelocity(_diff);
            }

            // rotate visually to face correct direction
            let dir = Math.sign(_diff.x);
            if (dir !== this.prevDirection && dir !== 0) {
                this.prevDirection = dir;
                if (this.prevDirection > 0) {
                    this.node.getComponent(ƒ.ComponentMesh).mtxPivot.rotation = new ƒ.Vector3();
                } else if (this.prevDirection < 0) {
                    this.node.getComponent(ƒ.ComponentMesh).mtxPivot.rotation = new ƒ.Vector3(0, 180, 0);
                }
            }
        }

        private meleeAttack(_frameTimeInSeconds: number) {
            // are we touching the player?
            if (this.touchingPlayer) {
                this.meleeCooldown -= _frameTimeInSeconds;
                if (this.meleeCooldown < 0) {
                    this.meleeCooldown = 1;
                    let character = provider.get(CharacterManager).character;
                    // let mag = ƒ.Vector3.DIFFERENCE(character.node.mtxWorld.translation, this.node.mtxWorld.translation).magnitudeSquared;
                    // if (mag < 0.64 /* 0.8² (player hitbox size) TODO: update this if player or enemy size changes */)
                    character.hit({ damage: this.damage, type: HitType.MELEE });
                    // console.log(this.rigidbody.collisions);
                }
            }
        }

        private chooseAttack() {
            if (this.currentlyActiveAttack || this.attacks.length === 0) return;

            let totalWeight = 0;
            for (let attack of this.attacks) {
                totalWeight += attack.weight ?? 1;
            }
            let selectedWeight = Math.random() * totalWeight;
            for (let attack of this.attacks) {
                selectedWeight -= attack.weight ?? 1;
                if (selectedWeight <= 0) {
                    this.currentlyActiveAttack = { ...attack }; // spread to have new object
                    break;
                }
            }

            this.currentlyActiveAttack.started = false;
            this.currentlyActiveAttack.done = false;
            this.updateDesiredDistance(this.currentlyActiveAttack.requiredDistance);
            this.currentlyActiveAttack.abortTimer = 5;
        }

        private executeAttack(_mgtSqrd: number, _frameTimeInSeconds: number) {
            if (!this.currentlyActiveAttack) return;

            if (!this.currentlyActiveAttack.started) {
                // attack hasn't started yet. should we start it?
                if (_mgtSqrd > this.currentlyDesiredDistanceSquared[0] && _mgtSqrd < this.currentlyDesiredDistanceSquared[1]) {
                    // start the attack
                    this.currentlyActiveAttack.attackStart?.call(this);
                    this.currentlyActiveAttack.started = true;
                    this.setCentralAnimator(this.getSprite(this.currentlyActiveAttack.attackSprite), true);
                }
                // have we been attempting to start for too long?
                this.currentlyActiveAttack.abortTimer -= _frameTimeInSeconds;
                if (this.currentlyActiveAttack.abortTimer < 0) {
                    this.currentlyActiveAttack = undefined;
                    return;
                }
            }
            if (this.currentlyActiveAttack.started) {
                // attack is ongoing
                if (this.currentlyActiveAttack.windUp > 0) {
                    // still preparing
                    this.currentlyActiveAttack.windUp -= _frameTimeInSeconds;
                } else if (!this.currentlyActiveAttack.done) {
                    // time to execute attack
                    this.currentlyActiveAttack.done = true;
                    this.currentlyActiveAttack.attack?.call(this);
                    this.setCentralAnimator(this.getSprite(this.currentlyActiveAttack.cooldownSprite), true);
                } else {
                    //we're on cooldown now
                    this.currentlyActiveAttack.cooldown -= _frameTimeInSeconds;
                    if (this.currentlyActiveAttack.cooldown < 0) {
                        // cooldown is up, we're ready to do something else
                        this.updateDesiredDistance(this.desiredDistance);
                        this.setCentralAnimator(this.moveSprite);
                        this.currentlyActiveAttack.attackEnd?.call(this);
                        this.currentlyActiveAttack = undefined;
                    }
                }

            }
        }

        protected setCentralAnimator(_as: AnimationSprite, _unique: boolean = false): void {
            super.setCentralAnimator(_as, _unique, this.eventListener);
        }

        private eventListener = (_event: CustomEvent) => {
            if (this.isSpawning) return;
            // walk event
            if (!(this.currentlyActiveAttack && this.currentlyActiveAttack.events && this.currentlyActiveAttack.events[_event.type])) {
                if (!this.events) return;
                if (!this.events[_event.type]) return;
                this.events[_event.type].call(this, _event);
                return;
            }
            // attack event
            if (!this.currentlyActiveAttack) return;
            if (!this.currentlyActiveAttack.events) return;
            if (!this.currentlyActiveAttack.events[_event.type]) return;
            this.currentlyActiveAttack.events[_event.type].call(this, _event);

        }

        private onCollisionEnter = (_event: ƒ.EventPhysics) => {
            if (_event.cmpRigidbody.node.name !== "character") return;
            this.touchingPlayer = true;
        }
        private onCollisionExit = (_event: ƒ.EventPhysics) => {
            if (_event.cmpRigidbody.node.name !== "character") return;
            this.touchingPlayer = false;
        }

        public hit(_hit: Hit): number {
            if (this.invulnerable && isFinite(_hit.damage)) return _hit.damage;
            this.health -= _hit.damage;
            //display damage numbers
            this.enemyManager.displayDamage(_hit.damage, this.node.mtxWorld.translation);
            this.enemyManager.enemyTookDamage();
            //TODO apply knockback
            if (_hit.stun) {
                this.stun(_hit.stun);
            }
            if (this.health > 0) return _hit.damage;

            this.enemyManager.removeEnemy(this);
            this.removeAnimationEventListeners();
            if (isFinite(_hit.damage)) {
                this.enemyManager.addXP(this.dropXP);
            } else {
                this.enemyManager.addXP(this.dropXP / 2);
            }
            return _hit.damage + this.health;
        }
    }

    export interface EnemyOptions {
        speed: number;
        damage: number;
        knockbackMultiplier: number;
        health: number;
        attacks: EnemyAttack[];
        moveSprite: AnimationSprite | [string, string];
        desiredDistance: [number, number];
        dropXP: number;
        directionOverride?: ƒ.Vector3;
        boss?: boolean,
        size?: number;
        events?: { [name: string]: (_event?: CustomEvent) => void; };
        hitboxSize?: number;
        afterSetup?: () => void;
        shadow?: {
            size?: number;
            position?: ƒ.Vector2;
        };
    }

    export interface EnemyAttack {
        requiredDistance: [number, number];
        windUp: number;
        cooldown: number;
        attackSprite?: AnimationSprite | [string, string];
        cooldownSprite?: AnimationSprite | [string, string];
        attack?: () => void;
        movement?: (_diff: ƒ.Vector3, _mgtSqrd: number, _charPosition: ƒ.Vector3, _frameTimeInSeconds: number) => void;
        attackStart?: () => void;
        attackEnd?: () => void;
        events?: { [name: string]: (_event?: CustomEvent) => void; }
        weight?: number;
    }
    interface EnemyAttackActive extends EnemyAttack {
        started?: boolean;
        done?: boolean;
        abortTimer?: number;
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
        events?: AnimationEvent[];
    }

    export interface AnimationEvent {
        frame: number,
        event: string,
    }
}