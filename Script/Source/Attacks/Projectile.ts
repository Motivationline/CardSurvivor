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
        impact: ActiveEffect[];
        targetMode: ProjectileTargetMode;
        lockedToEntity: boolean;
        sprite: AnimationSprite;
        private hazardZone: HitZoneGraphInstance;

        protected static defaults: Projectile = {
            targetPosition: undefined,
            direction: new ƒ.Vector3(),
            piercing: 0,
            range: Infinity,
            size: 0.5,
            speed: 2,
            damage: 1,
            target: ProjectileTarget.PLAYER,
            tracking: undefined,
            diminishing: false,
            targetMode: ProjectileTargetMode.NONE,
            lockedToEntity: false,
            impact: undefined,
            artillery: false,
            sprite: ["projectile", "toast"],
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

        async setup(_options: Partial<Projectile>, _manager: CardManager): Promise<void> {
            _options = { ...ProjectileComponent.defaults, ..._options };
            this.direction = _options.direction;
            this.targetPosition = _options.targetPosition;
            this.tracking = _options.tracking;
            this.damage = _options.target === ProjectileTarget.PLAYER ? _options.damage : _manager.modifyValuePlayer(_options.damage, PassiveCardEffect.DAMAGE);
            this.size = _options.target === ProjectileTarget.PLAYER ? _options.size : _manager.modifyValuePlayer(_options.size, PassiveCardEffect.PROJECTILE_SIZE);
            this.speed = _options.target === ProjectileTarget.PLAYER ? _options.speed : _manager.modifyValuePlayer(_options.speed, PassiveCardEffect.PROJECTILE_SPEED);
            this.range = _options.target === ProjectileTarget.PLAYER ? _options.range : _manager.modifyValuePlayer(_options.range, PassiveCardEffect.PROJECTILE_RANGE);
            this.piercing = _options.target === ProjectileTarget.PLAYER ? _options.piercing : _manager.modifyValuePlayer(_options.piercing, PassiveCardEffect.PROJECTILE_PIERCING);
            this.target = _options.target;
            this.artillery = _options.artillery;
            this.diminishing = _options.diminishing;
            this.impact = _options.impact;
            this.targetMode = _options.targetMode;
            this.lockedToEntity = _options.lockedToEntity;
            this.sprite = this.getSprite(_options.sprite);
            this.setCentralAnimator(this.sprite);

            this.node.mtxLocal.scaling = ƒ.Vector3.ONE(this.size);

            this.hazardZone = undefined;
            //TODO rotate projectile towards flight direction

            if (this.artillery) {
                let pos = new ƒ.Vector3();
                if (this.target === ProjectileTarget.PLAYER) {
                    pos = await provider.get(CharacterManager).character.node.mtxWorld.translation.clone;
                }
                let hz = await provider.get(ProjectileManager).createHitZone(pos)
                this.tracking = {
                    strength: 200,
                    target: hz,
                    startTrackingAfter: 1
                }
                this.hazardZone = hz;
                this.direction = ƒ.Vector3.Y(this.speed);
                this.targetPosition = pos;
            }

            if (this.tracking) {
                this.tracking = { ...{ stopTrackingAfter: Infinity, stopTrackingInRadius: 0, strength: 1, startTrackingAfter: 0 }, ...this.tracking }
            }
        }

        update(_charPosition: ƒ.Vector3, _frameTimeInSeconds: number) {
            this.move(_frameTimeInSeconds);
        }

        protected move(_frameTimeInSeconds: number) {
            if (this.tracking) {
                this.tracking.startTrackingAfter -= _frameTimeInSeconds;
                if (this.tracking.startTrackingAfter <= 0) {
                    this.tracking.stopTrackingAfter -= _frameTimeInSeconds;
                    let diff = ƒ.Vector3.DIFFERENCE(this.tracking.target.mtxWorld.translation, this.node.mtxWorld.translation);

                    // we need to track a certain node, so modify direction accordingly
                    this.direction.add(ƒ.Vector3.SCALE(diff, (this.tracking.strength ?? 1) * Math.min(_frameTimeInSeconds, 1)));

                    let mgtSqrd = diff.magnitudeSquared;
                    if (this.tracking.stopTrackingAfter <= 0 || (mgtSqrd <= Math.pow(this.tracking.stopTrackingInRadius, 2) && mgtSqrd !== 0)) {
                        console.log("stop tracking", this.tracking.stopTrackingAfter,)
                        // end of tracking
                        this.tracking = undefined;
                    }
                }
            }
            let dir = this.direction.clone;
            dir.normalize(Math.min(1, _frameTimeInSeconds) * this.speed);
            this.node.mtxLocal.translate(dir);

            if (this.targetPosition && this.node.mtxWorld.translation.equals(this.targetPosition, 0.5)) {
                if (this.artillery && this.tracking.startTrackingAfter > 0) return;
                // target position reached
                if (this.hazardZone) {
                    ƒ.Recycler.store(this.hazardZone);
                    this.hazardZone.getParent().removeChild(this.hazardZone);
                    this.hazardZone = undefined;
                }

                if (this.impact && this.impact.length) {
                    for (let impact of this.impact) {
                        //TODO implement impacts
                        switch (impact.type) {
                            case "projectile":
                                provider.get(ProjectileManager).createProjectile(projectiles[impact.projectile], this.targetPosition)
                                break;
                            case "aoe":
                                provider.get(ProjectileManager).createAOE(areasOfEffect[impact.aoe], this.targetPosition);
                                break;
                        }
                    }
                }
                provider.get(ProjectileManager).removeProjectile(this);
            }
        }

        protected onTriggerEnter = (_event: ƒ.EventPhysics) => {
            if (_event.cmpRigidbody.node.name === "enemy" && this.target === ProjectileTarget.ENEMY) {
                this.hit(_event.cmpRigidbody.node.getComponent(Enemy))
            } else if (_event.cmpRigidbody.node.name === "character" && this.target === ProjectileTarget.PLAYER) {
                if (this.artillery) return;
                this.hit(_event.cmpRigidbody.node.getComponent(Character))
            }
        }
        protected onTriggerExit = (_event: ƒ.EventPhysics) => {
            // console.log("onTriggerExit", _event);
        }

        protected hit(_hittable: Hittable) {
            console.log("hit", _hittable);
        }
    }

}