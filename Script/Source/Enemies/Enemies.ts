namespace Script {
    export const enemies: { [id: string]: Partial<EnemyOptions> } = {
        microwave: {
            moveSprite: ["microwave", "move"],
            damage: 5,
            desiredDistance: [0, 0],
            health: 10,
            speed: 1,
            knockbackMultiplier: 1,
            dropXP: 1,
        },
        toaster: {
            moveSprite: ["toaster", "move"],
            speed: 0.5,
            desiredDistance: [3, 4],
            attacks: [
                {
                    cooldown: 2,
                    requiredDistance: [2, 3],
                    attackSprite: ["toaster", "attack"],
                    cooldownSprite: ["toaster", "idle"],
                    windUp: 1,
                    movement: () => { },
                    events: {
                        fire: function () {
                            provider.get(ProjectileManager).createProjectile(projectiles["toast"],
                                ƒ.Vector3.SUM(
                                    this.node.mtxWorld.translation,
                                    ƒ.Vector3.Y(0.3)
                                )
                            );
                        }
                    }
                }
            ]
        },
        motor: {
            moveSprite: ["motor", "move"],
            speed: 3,
        },
        ventilator: {
            moveSprite: ["ventilator", "move"],
            speed: 0.5,
            desiredDistance: [0, 0],
        },
        chair: {
            moveSprite: ["chair", "move"],
            speed: 0.5,
            desiredDistance: [0, 0],
        },
        closet: {
            
        }
    }
}