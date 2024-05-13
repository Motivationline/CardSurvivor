/// <reference path="../Types.ts" />

namespace Script {

    export const projectiles: Projectiles = {
        "toastPlayer": {
            damage: 1,
            speed: 3,
        },
        "toast": {
            damage: 1,
            speed: 3,
            targetMode: ProjectileTargetMode.CLOSEST,
            artillery: true,
        }
    }

}