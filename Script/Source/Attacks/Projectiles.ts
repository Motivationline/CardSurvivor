/// <reference path="../Types.ts" />

namespace Script {

    export const projectiles: Projectiles = {
        "toast": {
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
        "anvil": {
            damage: 20,
            speed: 20,
            impact: [{
                type: "aoe",
                aoe: "anvilImpact"
            }],
            sprite: ["projectile", "toast"],
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