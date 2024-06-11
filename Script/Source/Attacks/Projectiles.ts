/// <reference path="../Types.ts" />

namespace Script {

    export const projectiles: Projectiles = {
        "toastEnemy": {
            damage: 1,
            speed: 20,
            artillery: true,
            impact: [{
                type: "aoe",
                aoe: "toastImpact"
            }],
            sprite: ["projectile", "toast"],
            target: ProjectileTarget.PLAYER,
        },
        "anvilPlayer": {
            damage: 0,
            speed: 20,
            impact: [{
                type: "aoe",
                aoe: "anvilImpact"
            }],
            sprite: ["projectile", "anvil"],
            target: ProjectileTarget.ENEMY,
            targetMode: ProjectileTargetMode.RANDOM,
            methods: {
                afterSetup: function () {
                    this.targetPosition = provider.get(EnemyManager).getEnemy(this.targetMode)?.mtxWorld.translation.clone;
                    if (this.targetPosition) {
                        let target: ƒ.Vector3 = this.targetPosition.clone;
                        this.node.mtxLocal.translation = target;
                        this.node.mtxLocal.translate(ƒ.Vector3.Y(10));
                        this.direction = ƒ.Vector3.Y(-1);
                    }
                }
            }
        },
        "hammerPlayer": {
            damage: 8,
            speed: 7,
            size: 0.6,
            sprite: ["projectile", "hammer"],
            target: ProjectileTarget.ENEMY,
            targetMode: ProjectileTargetMode.NONE,
            methods: {
                afterSetup: function () {
                    this.direction = new ƒ.Vector3(0.5 - Math.random() * 1, 1, 0);
                },
                preMove: function (_fts: number) {
                    this.direction.y = Math.max(-1, this.direction.y - (_fts * (10 / this.speed)));
                }
            }
        },
        "discusPlayer": {
            damage: 5,
            speed: 20,
            range: 15,
            sprite: ["projectile", "discus"],
            target: ProjectileTarget.ENEMY,
            targetMode: ProjectileTargetMode.NONE,

            methods: {
                afterSetup: function () {
                    let enemy = provider.get(EnemyManager).getEnemy(ProjectileTargetMode.CLOSEST);
                    this.tracking = {
                        stopTrackingAfter: Infinity,
                        startTrackingAfter: 0,
                        stopTrackingInRadius: 0,
                        strength: 1,
                        target: enemy,
                    } satisfies ProjectileTracking;
                },
                preUpdate: function () {
                    let target: EnemyGraphInstance = this.tracking.target;
                    if (!target?.getParent()) {
                        let newEnemy = provider.get(EnemyManager).getEnemy(ProjectileTargetMode.CLOSEST, this.node.mtxWorld.translation);
                        this.tracking.target = newEnemy;
                    }
                },
                postHit: function (_hitable: Hitable) { 
                    let newEnemy = provider.get(EnemyManager).getEnemy(ProjectileTargetMode.CLOSEST, (<Enemy>_hitable).node.mtxWorld.translation, [(<EnemyGraphInstance>(<Enemy>_hitable).node)]);
                    this.tracking.target = newEnemy;
                },
            }
        },
        "penPlayer": {
            damage: 2,
            speed: 20,
            range: 4,
            sprite: ["projectile", "pen"],
            target: ProjectileTarget.ENEMY,
            targetMode: ProjectileTargetMode.CLOSEST,
            rotateInDirection: true,
        },
        "codeCivilPlayer": {
            damage: 3,
            speed: 20,
            sprite: ["projectile", "codecivil"],
            target: ProjectileTarget.ENEMY,
            targetMode: ProjectileTargetMode.FURTHEST,
            methods: {
                afterSetup: function() {
                    this.minDamage = this.damage;
                    this.maxDamage = this.damage * 10;
                    this.totalDistance = 0;
                },
                postMove: function(_frameTimeInSeconds: number) {
                    this.totalDistance += this.speed * _frameTimeInSeconds;
                    this.damage = Math.min(this.maxDamage, this.minDamage * (Math.max(1, this.totalDistance)));
                }
            }
        },
        "dividerPlayer": {
            damage: 5,
            speed: 10,
            range: 12,
            sprite: ["projectile", "divider"],
            target: ProjectileTarget.ENEMY,
            targetMode: ProjectileTargetMode.CLOSEST,
            methods: {
                afterSetup: function() {
                    this.tracking = {
                        target: provider.get(CharacterManager).character.node,
                        startTrackingAfter: 0.5,
                        stopTrackingAfter: 0.5,
                        strength: 0.1,
                    } satisfies ProjectileTracking
                },
            }
        },
        "chiselPlayer": {
            damage: 15,
            speed: 15,
            range: 6,
            sprite: ["projectile", "chisel"],
            target: ProjectileTarget.ENEMY,
            targetMode: ProjectileTargetMode.CLOSEST,
            rotateInDirection: true,
        },
        "needlePlayer": {
            damage: 5,
            speed: 0,
            size: 1,
            sprite: ["aoe", "needles"],
            target: ProjectileTarget.ENEMY,
            targetMode: ProjectileTargetMode.NONE,
        }
    }


    export const areasOfEffect: AreasOfEffect = {
        "toastImpact": {
            variant: "explosion",
            damage: 10,
            size: 1,
            sprite: ["aoe", "explosion"],
            duration: 1,
            target: ProjectileTarget.PLAYER,
            events: {
                "explode": function (_event) {
                    this.explode();
                }
            },
        },
        "anvilImpact": {
            variant: "explosion",
            damage: 10,
            size: 1.5,
            sprite: ["aoe", "explosion"],
            duration: 1,
            target: ProjectileTarget.ENEMY,
            events: {
                "explode": function (_event) {
                    this.explode();
                }
            },
        },
        "lightbulbPlayer": {
            variant: "explosion",
            damage: 5,
            size: 2,
            duration: 16 / 24,
            sprite: ["aoe", "lightbulb"],
            stunDuration: 1,
            target: ProjectileTarget.ENEMY,
            events: {
                "explode": function (_event) {
                    this.explode();
                }
            },
        },
        "smokeMaskPlayer": {
            variant: "explosion",
            damage: 2,
            size: 2,
            duration: 30 / 24,
            sprite: ["aoe", "smokemask"],
            target: ProjectileTarget.ENEMY,
            events: {
                "explode": function (_event) {
                    this.explode();
                }
            },
        }
    }
}