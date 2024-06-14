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
            hitboxSize: 0.5,
        },
        chair: {
            moveSprite: ["chair", "move"],
            damage: 8,
            desiredDistance: [0, 0],
            health: 10,
            speed: 1.2,
            knockbackMultiplier: 1.2,
            dropXP: 2,
            hitboxSize: 0.5,
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
                                this.modifier,
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
            hitboxSize: 0.6,
            events: {
                // running away causes attacks
                step: function () {
                    let projectileAmount: number = 4;
                    let radiusBetweenProjectiles: number = (2 * Math.PI) / projectileAmount;
                    let startRadius: number = 0;
                    let modification: Partial<ProjectileData> = {
                        damage: 5,
                        speed: 6,
                        range: 4,
                    }
                    let pm = provider.get(ProjectileManager);
                    this.stepAmount = isNaN(this.stepAmount) ? 0 : this.stepAmount + 1;
                    for (let i = 0; i < projectileAmount; i++) {
                        let angle = i * radiusBetweenProjectiles + startRadius + (this.stepAmount % 2) * 0.5 * radiusBetweenProjectiles;
                        let direction = new ƒ.Vector3(Math.cos(angle), Math.sin(angle));
                        pm.createProjectile({ ...projectiles["genericBullet"], ...modification, ...{ direction } }, this.node.mtxWorld.translation, this.modifier);
                    }
                }
            },
        },
        motor: {
            moveSprite: ["motor", "move"],
            size: 1.1,
            damage: 15,
            desiredDistance: [0, 1],
            health: 25,
            speed: 2,
            dropXP: 4,
            hitboxSize: 0.6,
            attacks: [
                {
                    cooldown: 0.81, // how long it dashes, including delay
                    requiredDistance: [1.5, 2.5],
                    windUp: 2, // how long it plans its attack
                    movement: function (_diff: ƒ.Vector3, _mgtSqrd: number, _charPosition: ƒ.Vector3, _frameTimeInSeconds: number) {
                        let dashDuration: number = 0.8 // how long it should be dashing.
                        if (this.currentlyActiveAttack.windUp > 0) return;
                        if (this.currentlyActiveAttack.cooldown > dashDuration) return;
                        this.move(_diff, _mgtSqrd, _frameTimeInSeconds);
                    },
                    attack: function () {
                        let charPosition = provider.get(CharacterManager).character.node.mtxWorld.translation;
                        let direction = ƒ.Vector3.DIFFERENCE(charPosition, this.node.mtxWorld.translation);
                        this.directionOverride = direction;
                        this.speed *= 4.5; // how much faster than "normal" speed should it be? ALSO CHANGE BELOW
                        this.meleeCooldown = 0;
                    },
                    attackEnd: function() {
                        this.directionOverride = undefined;
                        this.speed /= 4.5; // change here
                    }
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
            desiredDistance: [5, Infinity],
            dropXP: 100,
            health: 1000,
            knockbackMultiplier: 0.1,
            size: 3,
            speed: 1,
            events: {
                // running away causes attacks
                step: function () {
                    let projectileAmount: number = 4;
                    let radiusBetweenProjectiles: number = (2 * Math.PI) / projectileAmount;
                    let startRadius: number = 0;
                    let modification: Partial<ProjectileData> = {
                        damage: 10,
                        speed: 5,
                        size: 1,
                    }
                    let pm = provider.get(ProjectileManager);
                    this.stepAmount = isNaN(this.stepAmount) ? 0 : this.stepAmount + 1;
                    for (let i = 0; i < projectileAmount; i++) {
                        let angle = i * radiusBetweenProjectiles + startRadius + (this.stepAmount % 2) * 0.5 * radiusBetweenProjectiles;
                        let direction = new ƒ.Vector3(Math.cos(angle), Math.sin(angle));
                        pm.createProjectile({
                            ...projectiles["flatToast"], ...modification, ...{ direction }
                        }, this.node.mtxWorld.translation, this.modifier);
                    }
                }
            },
            attacks: [
                // 3 waves of toasts
                {
                    weight: 1,
                    requiredDistance: [0, Infinity],
                    cooldown: 2,
                    windUp: 181 / 24,
                    attackSprite: ["bosstoaster", "attack01"],
                    cooldownSprite: ["toaster", "idle"],
                    movement: function () { },
                    events: {
                        fire: function () {
                            let modification: Partial<ProjectileData> = {
                                size: 1,
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
                                    { ...this.modifier, ...{ multiplier: { projectileSize: 2 } } },
                                );
                            }
                        }
                    }
                },

                // run
                {
                    weight: 2,
                    requiredDistance: [3, 6],
                    cooldown: 1,
                    windUp: 0,
                },


                // jump
                {
                    attackSprite: ["bosstoaster", "attack03"],
                    cooldownSprite: ["toaster", "idle"],
                    weight: 1,
                    requiredDistance: [4, 6],
                    cooldown: 5,
                    windUp: 44 / 24,
                    movement: function () { },
                    attack: function () {
                        let modification: Partial<ProjectileData> = {
                            methods: {
                                afterSetup: function () {
                                    let position = this.node.mtxLocal.translation.clone;
                                    this.hazardZone.mtxLocal.translation = position.clone;
                                    this.targetPosition = position;
                                    this.direction = ƒ.Vector3.Y(-1);
                                    this.node.mtxLocal.translateY(20);
                                },
                            }
                        }

                        // move to furthest away point
                        let charPosition = provider.get(CharacterManager).character.node.mtxWorld.translation;
                        this.rigidbody.activate(false);
                        this.node.mtxLocal.translation = new ƒ.Vector3(charPosition.x < 0 ? 11 : -11, charPosition.y < 0 ? 6.5 : -6.5)
                        this.rigidbody.activate(true);

                        let timeBetweenWavesInMS = 1500;
                        let waves: number = 3;
                        let projectilesPerWave: number = 100;
                        for (let i = 0; i < waves; i++) {
                            setTimeout(() => {
                                for (let p = 0; p < projectilesPerWave; p++) {
                                    provider.get(ProjectileManager).createProjectile({ ...projectiles["toastEnemy"], ...modification },
                                        new ƒ.Vector3(Math.random() * 25 - 12.5, Math.random() * 15 - 7.5),
                                        this.modifier,
                                    );
                                }
                            }, timeBetweenWavesInMS * i * ƒ.Time.game.getScale());
                        }
                    },
                },
            ]
        }
    }
}