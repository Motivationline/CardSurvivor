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
            damage: 20,
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
            damage: 1,
            speed: 10,
            size: 1,
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
            damage: 1,
            speed: 20,
            sprite: ["projectile", "discus"],
            target: ProjectileTarget.ENEMY,
            targetMode: ProjectileTargetMode.CLOSEST
        },
        "penPlayer": {
            damage: 2,
            speed: 20,
            sprite: ["projectile", "pen"],
            target: ProjectileTarget.ENEMY,
            targetMode: ProjectileTargetMode.CLOSEST,
            rotateInDirection: true,
        },
        "codecivilPlayer": {
            damage: 1,
            speed: 20,
            sprite: ["projectile", "codecivil"],
            target: ProjectileTarget.ENEMY,
            targetMode: ProjectileTargetMode.CLOSEST
        },
        "dividerPlayer": {
            damage: 1,
            speed: 20,
            sprite: ["projectile", "divider"],
            target: ProjectileTarget.ENEMY,
            targetMode: ProjectileTargetMode.CLOSEST
        },
        "chiselPlayer": {
            damage: 1,
            speed: 20,
            sprite: ["projectile", "chisel"],
            target: ProjectileTarget.ENEMY,
            targetMode: ProjectileTargetMode.CLOSEST
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
            damage: 20,
            size: 1,
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
        }
    }
}