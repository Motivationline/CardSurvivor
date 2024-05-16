/// <reference path="../Types.ts" />

namespace Script {

    export const projectiles: Projectiles = {
        "toastPlayer": {
            damage: 1,
            speed: 3,
            sprite: ["toaster", "projectile"],
        },
        "toast": {
            damage: 1,
            speed: 3,
            targetMode: ProjectileTargetMode.CLOSEST,
            artillery: true,
            impact: [{
                type: "aoe",
                aoe: "toastImpact"
            }],
            sprite: ["projectile", "toast"],
        }
    }


    export const areasOfEffect: AreasOfEffect = {
        "toastImpact": {
            variant: "explosion",
            damage: 10,
            size: 1,
            sprite: ["aec", "explosion"],
            duration: 1,
            events: {
                "explode": function (_event) {
                    this.explode();
                }
            }
        }
    }

}