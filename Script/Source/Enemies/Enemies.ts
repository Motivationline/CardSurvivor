namespace Script {
    export const enemies: { [id: string]: Partial<EnemyOptions> } = {
        microwave: {
            moveSprite: ["microwave", "move"],
            size: 0.9,
            damage: 10,
            desiredDistance: [0, 0],
            health: 15,
            speed: 0.8,
            knockbackMultiplier: 1,
            dropXP: 2,
        },
        chair: {
            moveSprite: ["chair", "move"],
            damage: 8,
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
                    requiredDistance: [2, 5],
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
            size: 1.5,
            damage: 50,
            desiredDistance: [0, 0],
            health: 50,
            speed: 0.2,
            knockbackMultiplier: 0.2,
            dropXP: 3,
        },
        motor: {
            moveSprite: ["motor", "move"],
            size: 1.1,
            damage: 20,
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
            size: 0.5,
            damage: 5,
            speed: 2,
            health: 4,
            dropXP: 0.5
        },
        mixer: {
            moveSprite: ["mixer", "move"],
            damage: 30,
            desiredDistance: [2, 3],
            health: 25,
            speed: 1.5,
            dropXP: 5,
            attacks: [
                {
                    cooldown: 4,
                    requiredDistance: [0, 0],
                    attackSprite: ["mixer", "digup"],
                    cooldownSprite: ["mixer", "idle"],
                    windUp: 2,
                    movement: () => { },
                }
            ]
        },

        toasterBoss: {
            moveSprite: ["toaster", "move"],
            damage: 30,
            desiredDistance: [0, Infinity],
            dropXP: 100,
            health: 1000,
            knockbackMultiplier: 0.1,
            size: 3,
            speed: 1,
            attacks: [
                // 3 waves of toasts
                {
                    requiredDistance: [0, Infinity],
                    cooldown: 2,
                    windUp: 181 / 24,
                    attackSprite: ["bosstoaster", "attack01"],
                    cooldownSprite: ["toaster", "idle"],
                    events: {
                        fire: function () {
                            let modification: Partial<ProjectileData> = {
                                size: 2,
                                methods: {
                                    afterSetup: function () {
                                        let delta = new ƒ.Vector3(Math.random() * 5 - 2.5, Math.random() * 5 - 2.5);
                                        this.hazardZone.mtxLocal.translate(delta);
                                        this.targetPosition.add(delta);
                                    },
                                }
                            }
                            for (let i: number = 0; i < 5; i++) {
                                provider.get(ProjectileManager).createProjectile({ ...projectiles["toastEnemy"], ...modification },
                                    ƒ.Vector3.SUM(
                                        this.node.mtxWorld.translation,
                                        ƒ.Vector3.Y(0.3)
                                    ),
                                    undefined,
                                );
                            }
                        }
                    }
                },

                // running away
                // {
                //     requiredDistance: [5, 6],
                //     cooldown: 
                // },

                // jump
            ]
        }
    }
}