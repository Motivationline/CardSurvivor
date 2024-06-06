namespace Script {
    export const enemies: { [id: string]: Partial<EnemyOptions> } = {
        microwave: {
            moveSprite: ["microwave", "move"],
            damage: 5,
            desiredDistance: [0, 0],
            health: 15,
            speed: 0.8,
            knockbackMultiplier: 1,
            dropXP: 2,
        },
        chair: {
            moveSprite: ["chair", "move"],
            damage: 4,
            desiredDistance: [0, 0],
            health: 10,
            speed: 1.2,
            knockbackMultiplier: 1.2,
            dropXP: 2,
        },
        toaster: {
            moveSprite: ["toaster", "move"],
            desiredDistance: [3, 4],
            health: 10,
            speed: 0.5,
            knockbackMultiplier: 1.2,
            dropXP: 3,
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
                            provider.get(ProjectileManager).createProjectile(projectiles["toastEnemy"],
                                ƒ.Vector3.SUM(
                                    this.node.mtxWorld.translation,
                                    ƒ.Vector3.Y(0.3)
                                ),
                                undefined,
                            );
                        }
                    }
                }
            ]
        },
        closet: {
            moveSprite: ["closet", "move"],
            damage: 30,
            desiredDistance: [0, 0],
            health: 50,
            speed: 0.2,
            knockbackMultiplier: 0.2,
            dropXP: 3,
        },
        motor: {
            moveSprite: ["motor", "move"],
            damage: 10,
            desiredDistance: [0, 1],
            health: 25,
            speed: 2,
            dropXP: 4,
            attacks: [
                {
                    cooldown: 2,
                    requiredDistance: [0, 0],
                    windUp: 2,
                    movement: () => { },
                }
            ]
        },
        ventilator: {
            moveSprite: ["ventilator", "move"],
            damage: 2,
            speed: 2,
            health: 4,
            dropXP: 0.5
        }
    }
}