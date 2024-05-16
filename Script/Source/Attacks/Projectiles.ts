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
        }
    }


    export const areasOfEffect: AreasOfEffect = {
        "toastImpact": {
            variant: "explosion",
            damage: 10,
            size: 1,
            sprite: ["aoe", "explosion"],
            duration: 1,
            events: {
                "explode": function (_event) {
                    this.explode();
                }
            }
        }
    }

}