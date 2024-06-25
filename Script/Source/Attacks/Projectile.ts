/// <reference path="../Types.ts" />
/// <reference path="../Animateable.ts" />

namespace Script {

    export class ProjectileComponent extends Animateable implements Projectile {
        tracking: ProjectileTracking;
        direction: ƒ.Vector3;
        targetPosition: ƒ.Vector3;
        damage: number;
        size: number;
        speed: number;
        range: number;
        piercing: number;
        target: ProjectileTarget;
        diminishing: boolean;
        artillery: boolean;
        rotateInDirection: boolean;
        impact: ActiveEffect[];
        targetMode: ProjectileTargetMode;
        lockedToEntity: boolean;
        sprite: AnimationSprite;
        stunDuration: number;
        dontNormalizeMovement: boolean;
        private hazardZone: HitZoneGraphInstance;
        private prevDistance: number;
        private modifiers: PassiveCardEffectObject = {};
        private functions: ProjectileFunctions = {};

        protected static defaults: Projectile = {
            targetPosition: undefined,
            direction: new ƒ.Vector3(),
            piercing: 0,
            range: Infinity,
            size: 1,
            speed: 2,
            damage: 1,
            stunDuration: 0,
            target: ProjectileTarget.ENEMY,
            tracking: undefined,
            diminishing: false,
            targetMode: ProjectileTargetMode.NONE,
            lockedToEntity: false,
            impact: undefined,
            artillery: false,
            rotateInDirection: false,
            dontNormalizeMovement: false,
            sprite: ["projectile", "toast"],
            methods: {},
            hitboxSize: 1,
        }

        constructor() {
            super();

            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            this.addEventListener(ƒ.EVENT.NODE_DESERIALIZED, this.init)
        }

        protected init = () => {
            this.removeEventListener(ƒ.EVENT.NODE_DESERIALIZED, this.init)

            // setup physics
            this.node.getComponent(ƒ.ComponentRigidbody).addEventListener(ƒ.EVENT_PHYSICS.TRIGGER_ENTER, this.onTriggerEnter);
            this.node.getComponent(ƒ.ComponentRigidbody).addEventListener(ƒ.EVENT_PHYSICS.TRIGGER_EXIT, this.onTriggerExit);
        }

        async setup(_options: Partial<Projectile>, _modifier: PassiveCardEffectObject): Promise<void> {
            _options = { ...ProjectileComponent.defaults, ..._options };
            this.functions = _options.methods;
            if (this.functions.beforeSetup) {
                this.functions.beforeSetup.call(this, _options, _modifier);
            }
            let limitation: string = undefined;
            if (_options.target === ProjectileTarget.ENEMY) {
                if (provider.get(CharacterManager).isMoving())
                    limitation = "stopped";
            }
            let cm = provider.get(CardManager);
            this.direction = _options.direction;
            this.targetPosition = _options.targetPosition;
            this.tracking = _options.tracking;
            this.damage = cm.modifyValue(_options.damage, PassiveCardEffect.DAMAGE, _modifier, limitation);
            this.size = cm.modifyValue(_options.size, PassiveCardEffect.PROJECTILE_SIZE, _modifier, limitation);
            this.speed = cm.modifyValue(_options.speed, PassiveCardEffect.PROJECTILE_SPEED, _modifier, limitation);
            this.range = cm.modifyValue(_options.range, PassiveCardEffect.PROJECTILE_RANGE, _modifier, limitation);
            this.piercing = cm.modifyValue(_options.piercing, PassiveCardEffect.PROJECTILE_PIERCING, _modifier, limitation);
            this.target = _options.target;
            this.artillery = _options.artillery;
            this.rotateInDirection = _options.rotateInDirection;
            this.diminishing = _options.diminishing;
            this.impact = _options.impact;
            this.targetMode = _options.targetMode;
            this.lockedToEntity = _options.lockedToEntity;
            this.sprite = this.getSprite(_options.sprite);
            this.setCentralAnimator(this.sprite);

            this.node.mtxLocal.scaling = ƒ.Vector3.ONE(this.size);
            this.node.getComponent(ƒ.ComponentRigidbody).mtxPivot.scaling = ƒ.Vector3.ONE(_options.hitboxSize);

            this.hazardZone = undefined;
            this.prevDistance = Infinity;
            this.modifiers = _modifier;

            //TODO rotate projectile towards flight direction

            if (this.artillery) {
                let pos = new ƒ.Vector3();
                if (this.target === ProjectileTarget.PLAYER) {
                    pos = provider.get(CharacterManager).character.node.mtxWorld.translation.clone;
                } else if (this.target === ProjectileTarget.ENEMY) {
                    pos = provider.get(EnemyManager).getEnemy(this.targetMode)?.mtxWorld.translation.clone;
                    if (!pos) return this.remove();
                }
                let hzSize = this.size;
                for (let impact of this.impact) {
                    hzSize = Math.max(hzSize, cm.modifyValue(1, PassiveCardEffect.PROJECTILE_SIZE, impact.modifiers));
                }
                let hz = await provider.get(ProjectileManager).createHitZone(pos, hzSize);
                this.tracking = {
                    strength: 1,
                    target: hz,
                    startTrackingAfter: 1
                }
                this.hazardZone = hz;
                this.direction = ƒ.Vector3.Y(this.speed);
                this.targetPosition = pos;
            }

            if (this.targetMode !== ProjectileTargetMode.NONE) {
                let targetPosition = provider.get(EnemyManager).getEnemy(this.targetMode)?.mtxWorld.translation.clone;
                if (!targetPosition) {
                    return this.remove()
                };
                this.direction = ƒ.Vector3.DIFFERENCE(targetPosition, this.node.mtxLocal.translation);
            }

            if (this.tracking) {
                this.tracking = { ...{ stopTrackingAfter: Infinity, stopTrackingInRadius: 0, strength: 1, startTrackingAfter: 0 }, ...this.tracking }
            }

            this.node.getComponent(ƒ.ComponentMesh).mtxPivot.rotation = new ƒ.Vector3();

            if (this.functions.afterSetup) {
                this.functions.afterSetup.call(this);
            }
        }

        update(_charPosition: ƒ.Vector3, _frameTimeInSeconds: number) {
            if (this.functions.preUpdate) this.functions.preUpdate.call(this, _charPosition, _frameTimeInSeconds);
            if (this.functions.preMove) this.functions.preMove.call(this, _frameTimeInSeconds);
            this.move(_frameTimeInSeconds);
            if (this.functions.postMove) this.functions.postMove.call(this, _frameTimeInSeconds);
            this.rotate();
            if (this.functions.postUpdate) this.functions.postUpdate.call(this, _charPosition, _frameTimeInSeconds);
        }

        public removeAttachments(): void {
            this.removeHazardZone();
        }

        private removeHazardZone() {
            if (!this.hazardZone) return;

            ƒ.Recycler.store(this.hazardZone);
            this.hazardZone.getParent().removeChild(this.hazardZone);
            this.hazardZone = undefined;
        }

        protected move(_frameTimeInSeconds: number) {
            if (this.tracking && this.tracking.target) {
                this.tracking.startTrackingAfter -= _frameTimeInSeconds;
                if (this.tracking.startTrackingAfter <= 0) {
                    this.tracking.stopTrackingAfter -= _frameTimeInSeconds;
                    let diff = ƒ.Vector3.DIFFERENCE(this.tracking.target.mtxWorld.translation, this.node.mtxWorld.translation);

                    // we need to track a certain node, so modify direction accordingly
                    this.direction = ƒ.Vector3.SUM(diff.scale(this.tracking.strength ?? 1), this.direction.scale(1 - (this.tracking.strength ?? 1)));

                    // this.direction.add(ƒ.Vector3.SCALE(diff, (this.tracking.strength ?? 1) * Math.min(_frameTimeInSeconds, 1)));

                    let mgtSqrd = diff.magnitudeSquared;
                    if (this.tracking.stopTrackingAfter <= 0 || (mgtSqrd <= Math.pow(this.tracking.stopTrackingInRadius, 2) && mgtSqrd !== 0)) {
                        // console.log("stop tracking", this.tracking.stopTrackingAfter)
                        // end of tracking
                        this.tracking = undefined;
                    }
                }
            }
            let dir = this.direction.clone;
            if (dir.magnitudeSquared > 0 && !this.dontNormalizeMovement)
                dir.normalize(Math.min(1, _frameTimeInSeconds) * this.speed);
            else
                dir.scale(Math.min(1, _frameTimeInSeconds) * this.speed);
            this.node.mtxLocal.translate(dir);
            this.range -= dir.magnitude;
            if (this.range < 0) {
                this.remove();
            }

            //TODO check if flew past target position (due to lag?) and still explode
            if (this.targetPosition) {
                let distanceToTarget = ƒ.Vector3.DIFFERENCE(this.targetPosition, this.node.mtxWorld.translation).magnitudeSquared;
                if (this.targetPosition && (this.node.mtxWorld.translation.equals(this.targetPosition, 0.5) || distanceToTarget > this.prevDistance)) {
                    this.prevDistance = distanceToTarget;
                    if (this.artillery && this.tracking.startTrackingAfter > 0) return;
                    // target position reached
                    this.removeHazardZone();

                    if (this.impact && this.impact.length) {
                        for (let impact of this.impact) {
                            //TODO implement impacts
                            switch (impact.type) {
                                case "projectile":
                                    provider.get(ProjectileManager).createProjectile(projectiles[impact.projectile], this.targetPosition, provider.get(CardManager).combineEffects(impact.modifiers, this.modifiers));
                                    break;
                                case "aoe":
                                    provider.get(ProjectileManager).createAOE(areasOfEffect[impact.aoe], this.targetPosition, provider.get(CardManager).combineEffects(impact.modifiers, this.modifiers));
                                    break;
                            }
                        }
                    }
                    this.remove();
                }
            }
            // remove projectile if outside of room
            if (this.node.cmpTransform.mtxLocal.translation.magnitudeSquared > 18500 /* 15 width, 25 height playarea => max magnSqr = 850 */) {
                this.remove();
            }
        }

        protected rotate() {
            if (!this.rotateInDirection) return;
            let refVector = ƒ.Vector3.X(1);
            let angle = Math.acos(ƒ.Vector3.DOT(this.direction, refVector) / (refVector.magnitude * this.direction.magnitude));
            angle = angle * 180 / Math.PI * Math.sign(this.direction.y);
            let pivot = this.node.getComponent(ƒ.ComponentMesh).mtxPivot;
            pivot.rotation = new ƒ.Vector3(pivot.rotation.x, pivot.rotation.y, angle);
        }

        protected onTriggerEnter = (_event: ƒ.EventPhysics) => {
            if (this.artillery || this.targetPosition) return;
            if (_event.cmpRigidbody.node.name === "enemy" && this.target === ProjectileTarget.ENEMY) {
                this.hit(_event.cmpRigidbody.node.getComponent(Enemy))
            } else if (_event.cmpRigidbody.node.name === "character" && this.target === ProjectileTarget.PLAYER) {
                this.hit(_event.cmpRigidbody.node.getComponent(Character))
            }
        }
        protected onTriggerExit = (_event: ƒ.EventPhysics) => {
            // console.log("onTriggerExit", _event);
        }

        protected hit(_hitable: Hitable) {
            if ((<EnemyGraphInstance>(<Enemy>_hitable)?.node)?.untargetable) return;
            if (this.functions.preHit) this.functions.preHit.call(this, _hitable);
            _hitable.hit({ damage: this.damage, stun: this.stunDuration, type: HitType.PROJECTILE });
            this.piercing--;
            if (this.functions.postHit) this.functions.postHit.call(this, _hitable);
            if (this.piercing < 0) this.remove();
        }

        private remove() {
            provider.get(ProjectileManager).removeProjectile(this);
            this.removeHazardZone();
        }
    }

}