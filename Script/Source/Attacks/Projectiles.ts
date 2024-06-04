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
            afterSetup: function() {
                if(this.targetPosition){
                    let target: ƒ.Vector3 = this.targetPosition.clone;
                    this.node.mtxLocal.translation = target;
                    this.node.mtxLocal.translate(ƒ.Vector3.Y(10));
                    this.direction = ƒ.Vector3.Y(-1);
                }
            }
        },
        "hammer": {
            damage: 1,
            speed: 20,
            sprite: ["projectile", "hammer_projectile"],
            target: ProjectileTarget.ENEMY,
            targetMode: ProjectileTargetMode.NONE
        },
        "discus": {
            damage: 1,
            speed: 20,
            sprite: ["projectile", "discus_projectile"],
            target: ProjectileTarget.ENEMY,
            targetMode: ProjectileTargetMode.CLOSEST
        },
        "pen": {
            damage: 1,
            speed: 20,
            sprite: ["projectile", "pen_projectile"],
            target: ProjectileTarget.ENEMY,
            targetMode: ProjectileTargetMode.CLOSEST
        },
        "codecivil": {
            damage: 1,
            speed: 20,
            sprite: ["projectile", "codecivil_projectile"],
            target: ProjectileTarget.ENEMY,
            targetMode: ProjectileTargetMode.CLOSEST
        },
        "divider": {
            damage: 1,
            speed: 20,
            sprite: ["projectile", "divider_projectile"],
            target: ProjectileTarget.ENEMY,
            targetMode: ProjectileTargetMode.CLOSEST
        },
        "chisel": {
            damage: 1,
            speed: 20,
            sprite: ["projectile", "chisel_projectile"],
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
        }
    }
}