namespace Script {
    export const eliteModifier: PassiveCardEffectObject = {
        multiplier: {
            enemySize: 2,
            damage: 2,
            health: 10,
            movementSpeed: 0.8,
            knockback: 0.1,
            xp: 6,
        }
    }


    export const pools: Pools = {
        "electronics": [
            ["microwave", "chair"], // --0
            ["toaster", "closet"], // --1
            ["mixer"], // --2
            ["ventilator"], // --3
            ["motor"], // --4
            ["toaster"], // --5
            ["closet"] // --6
        ]
    }

    export const rooms: Rooms = {
        "electronics": [
            // room 1
            {
                duration: 20,
                defaultWave: {
                    enemies: [{ pool: 0 }],
                    amount: 3,
                    duration: 6,
                    minEnemiesOverride: 1,
                },
                waveAmount: 4,
                bonus: {
                    multiplier: {
                        health: 0.3,
                        damage: 1,
                        xp: 5,
                    }
                }
            },
            // room 2
            {
                duration: 25,
                defaultWave: {
                    enemies: [{ pool: 0 }],
                    amount: 4,
                    duration: 5,
                    minEnemiesOverride: 2,
                },
                waveAmount: 5,
                bonus: {
                    multiplier: {
                        health: 0.3,
                        damage: 1,
                        xp: 4,
                    }
                }
            },
            // room 3
            {
                duration: 30,
                defaultWave: {
                    enemies: [
                        { pool: 0, weight: 9 },
                        { pool: 1, weight: 1 },
                    ],
                    amount: 5,
                    duration: 6,
                    minEnemiesOverride: 2,
                },
                waveAmount: 6,
                waves: [
                    {
                        enemies: [
                            { pool: 1 }
                        ],
                        amount: 2,
                        duration: 10,
                    },
                    {
                        enemies: [
                            { pool: 0, weight: 9 },
                            { pool: 1, weight: 1 },
                        ],
                        amount: 5,
                        duration: 6,
                        minEnemiesOverride: 0,
                    }
                ],
                bonus: {
                    multiplier: {
                        health: 0.4,
                        damage: 1,
                        xp: 2,
                    }
                }
            },
            // room 4
            {
                duration: 35,
                defaultWave: {
                    enemies: [
                        { pool: 0, weight: 8 },
                        { pool: 1, weight: 2 },
                    ],
                    amount: 5,
                    duration: 6,
                    minEnemiesOverride: 2,
                },
                waveAmount: 6,
                bonus: {
                    multiplier: {
                        health: 0.6,
                        damage: 1,
                        xp: 2,
                    }
                }
            },
            // room 5 - ELITE
            {
                duration: 40,
                defaultWave: {
                    enemies: [
                        { pool: 0, weight: 6 },
                        { pool: 1, weight: 4 },
                    ],
                    amount: 5,
                    duration: 6,
                    minEnemiesOverride: 2,
                },
                waveAmount: 6,
                waves: [
                    {
                        enemies: [
                            { pool: 0, elite: true },
                        ],
                        amount: 1,
                        duration: 10,
                    },
                    {
                        enemies: [
                            { pool: 0, weight: 6 },
                            { pool: 1, weight: 4 },
                        ],
                        amount: 5,
                        duration: 6,
                        minEnemiesOverride: 0,
                    }
                ],
                bonus: {
                    multiplier: {
                        health: 0.8,
                        damage: 1,
                        xp: 1.5,
                    }
                }
            },
            // room 6
            {
                duration: 45,
                defaultWave: {
                    enemies: [
                        { pool: 0, weight: 5 },
                        { pool: 1, weight: 5 },
                    ],
                    amount: 6,
                    duration: 8,
                    minEnemiesOverride: 2,
                },
                waveAmount: 6,
                bonus: {
                    multiplier: {
                        health: 1,
                        damage: 1.2,
                        xp: 1.2,
                    }
                }
            },
            // room 7
            {
                duration: 50,
                defaultWave: {
                    enemies: [
                        { pool: 0, weight: 5 },
                        { pool: 1, weight: 3 },
                        { pool: 2, weight: 2 },
                    ],
                    amount: 8,
                    duration: 10,
                    minEnemiesOverride: 2,
                },
                waveAmount: 6,
                waves: [
                    {
                        enemies: [
                            { pool: 2 },
                        ],
                        amount: 2,
                        duration: 10,
                    },
                    {
                        enemies: [
                            { pool: 0, weight: 5 },
                            { pool: 1, weight: 3 },
                            { pool: 2, weight: 2 },
                        ],
                        amount: 8,
                        duration: 10,
                        minEnemiesOverride: 0,
                    }
                ],
                bonus: {
                    multiplier: {
                        health: 1.2,
                        damage: 1.2,
                        xp: 1,
                    }
                }
            },
            // room 8 - SCHWARM
            {
                duration: 50,
                defaultWave: {
                    enemies: [
                        { pool: 0 },
                    ],
                    amount: 3,
                    duration: 0.75,
                    minEnemiesOverride: 2,
                },
                waveAmount: 75,
                bonus: {
                    multiplier: {
                        health: 0.2,
                        movementSpeed: 1.5,
                        damage: 0.8,
                        xp: 0.3,
                        enemySize: 0.6,
                    }
                }
            },
            // room 9
            {
                duration: 55,
                defaultWave: {
                    enemies: [
                        { pool: 0, weight: 3 },
                        { pool: 1, weight: 4 },
                        { pool: 2, weight: 3 },
                    ],
                    amount: 8,
                    duration: 10,
                    minEnemiesOverride: 2,
                },
                waveAmount: 7,
                bonus: {
                    multiplier: {
                        health: 1.3,
                        damage: 1.3,
                        xp: 1,
                    }
                }
            },
            // room 10 - BOSS ----------------------------------------------------------------------------------------
            {
                duration: 60,
                boss: true,
                canStopAfter: true,
                defaultWave: {
                    amount: 1,
                    duration: 60,
                    enemies: ["toasterBoss"],
                },
                waveAmount: 1
            },
            // room 11
            {
                duration: 60,
                defaultWave: {
                    enemies: [
                        { pool: 0, weight: 6 },
                        { pool: 5, weight: 2 },
                        { pool: 6, weight: 2 }
                    ],
                    amount: 6,
                    duration: 8,
                    minEnemiesOverride: 2,
                },
                waveAmount: 7,
                waves: [{
                    enemies: [
                        { pool: 5 },
                        { pool: 6 }
                    ],
                    amount: 2,
                    duration: 5,
                    minEnemiesOverride: 0,
                },
                {
                    enemies: [
                        { pool: 0, weight: 6 },
                        { pool: 5, weight: 2 },
                        { pool: 6, weight: 2 }
                    ],
                    amount: 6,
                    duration: 8,
                    minEnemiesOverride: 0,
                }],
                bonus: {
                    multiplier: {
                        health: 3,
                        enemySize: 1.1,
                        movementSpeed: 1.6,
                        damage: 2,
                        xp: 1.5,
                    }
                }
            },
            // room 12 - ELITE
            {
                duration: 60,
                defaultWave: {
                    enemies: [
                        { pool: 0, weight: 6 },
                        { pool: 5, weight: 2 },
                        { pool: 6, weight: 2 }
                    ],
                    amount: 5,
                    duration: 8,
                    minEnemiesOverride: 2,
                },
                waveAmount: 8,
                waves: [{
                    enemies: [{ pool: 4, elite: true }],
                    amount: 1,
                    duration: 10,
                    minEnemiesOverride: 0,
                    bonus: {
                        multiplier: {
                            health: 0.8,
                            enemySize: 0.9,
                        }
                    }
                },
                {
                    enemies: [
                        { pool: 0, weight: 6 },
                        { pool: 5, weight: 2 },
                        { pool: 6, weight: 2 }
                    ],
                    amount: 5,
                    duration: 8,
                    minEnemiesOverride: 0,
                }],
                bonus: {
                    multiplier: {
                        health: 3.5,
                        enemySize: 1.1,
                        movementSpeed: 1.6,
                        damage: 2,
                        xp: 1.5,
                    }
                }
            },
            // room 13 - VENTILATOR -- ADD VENTILATOR SWARM ABILITY
            {
                duration: 60,
                defaultWave: {
                    enemies: [
                        { pool: 0, weight: 6 },
                        { pool: 2, weight: 3 },
                        { pool: 4, weight: 2 },
                    ],
                    amount: 5,
                    duration: 8,
                    minEnemiesOverride: 2,
                },
                waveAmount: 8,
                /*
                waves: [{
                    enemies: [{ pool: 3 }],
                    amount: 1,
                    duration: 4,
                    minEnemiesOverride: 0,
                },
                {
                    enemies: [
                        { pool: 0, weight: 6 },
                        { pool: 2, weight: 3 },
                        { pool: 4, weight: 2 },
                    ],
                    amount: 5,
                    duration: 8,
                    minEnemiesOverride: 0,
                }],
                */
                bonus: {
                    multiplier: {
                        health: 5,
                        enemySize: 1.1,
                        movementSpeed: 1.5,
                        damage: 2.5,
                        xp: 1.5,
                    }
                }
            },
            // room 14 - SCHWARM
            {
                duration: 60,
                defaultWave: {
                    enemies: [
                        { pool: 0, weight: 6 },
                        { pool: 5, weight: 1 },
                        { pool: 6, weight: 1 },
                    ],
                    amount: 5,
                    duration: 1,
                    minEnemiesOverride: 2,
                },
                waveAmount: 60,
                bonus: {
                    multiplier: {
                        health: 0.2,
                        movementSpeed: 1.8,
                        damage: 0.5,
                        xp: 0.25,
                        enemySize: 0.6,
                    }
                }
            },
            // room 15 - ELITE -- ADD VENTILATOR SWARM ENEMY
            {
                duration: 60,
                defaultWave: {
                    enemies: [
                        { pool: 0, weight: 40 },
                        { pool: 2, weight: 20 },
                        { pool: 4, weight: 10 },
                        { pool: 5, weight: 15 },
                        { pool: 6, weight: 15 },
                    ],
                    amount: 6,
                    duration: 8,
                    minEnemiesOverride: 2,
                },
                waveAmount: 8,
                waves: [{
                    enemies: [{ pool: 2, elite: true }],
                    amount: 1,
                    duration: 10,
                    minEnemiesOverride: 0,
                },
                {
                    enemies: [
                        { pool: 0, weight: 40 },
                        { pool: 2, weight: 20 },
                        { pool: 4, weight: 10 },
                        { pool: 5, weight: 15 },
                        { pool: 6, weight: 15 },
                    ],
                    amount: 6,
                    duration: 8,
                    minEnemiesOverride: 0,
                }],
                bonus: {
                    multiplier: {
                        health: 4,
                        enemySize: 1.1,
                        movementSpeed: 1.6,
                        damage: 3,
                        xp: 1.5,
                    }
                }
            },
            // room 16
            {
                duration: 60,
                defaultWave: {
                    enemies: [
                        { pool: 0, weight: 6 },
                        { pool: 2, weight: 3 },
                        { pool: 4, weight: 1 },
                    ],
                    amount: 4,
                    duration: 3,
                    minEnemiesOverride: 2,
                },
                waveAmount: 20,
                bonus: {
                    multiplier: {
                        health: 3,
                        enemySize: 1.1,
                        movementSpeed: 1.7,
                        damage: 3,
                        xp: 1,
                    }
                }
            },
            // room 17 - ADD VENTILATOR SWARM ENEMY
            {
                duration: 60,
                defaultWave: {
                    enemies: [
                        { pool: 0, weight: 4 },
                        { pool: 2, weight: 2 },
                        { pool: 5, weight: 2 },
                        { pool: 6, weight: 2 },
                    ],
                    amount: 10,
                    duration: 10,
                    minEnemiesOverride: 2,
                },
                waveAmount: 7,
                bonus: {
                    multiplier: {
                        health: 4,
                        enemySize: 1.2,
                        movementSpeed: 1.8,
                        damage: 3,
                        xp: 1.2,
                    }
                }
            },
            // room 18 - ELITES
            {
                duration: 60,
                defaultWave: {
                    enemies: [
                        { pool: 0, weight: 6 },
                        { pool: 5, weight: 2 },
                        { pool: 6, weight: 2 }
                    ],
                    amount: 5,
                    duration: 8,
                    minEnemiesOverride: 2,
                },
                waveAmount: 5,
                waves: [{
                    enemies: [
                        { pool: 0, elite: true },
                        { pool: 0 }
                    ],
                    amount: 8,
                    duration: 12,
                    minEnemiesOverride: 1,
                    bonus: {
                        multiplier: {
                            health: 0.9,
                            enemySize: 0.9,
                        }
                    }
                },
                {
                    enemies: [
                        { pool: 5, elite: true },
                        { pool: 5 }
                    ],
                    amount: 6,
                    duration: 12,
                    minEnemiesOverride: 1,
                    bonus: {
                        multiplier: {
                            health: 0.9,
                            enemySize: 0.9,
                        }
                    }
                },
                {
                    enemies: [
                        { pool: 6, elite: true },
                        { pool: 6 }
                    ],
                    amount: 6,
                    duration: 12,
                    minEnemiesOverride: 1,
                    bonus: {
                        multiplier: {
                            health: 0.9,
                            enemySize: 0.9,
                        }
                    }
                },
                {
                    enemies: [
                        { pool: 2, elite: true },
                        { pool: 2 }
                    ],
                    amount: 5,
                    duration: 12,
                    minEnemiesOverride: 1,
                    bonus: {
                        multiplier: {
                            health: 0.9,
                            enemySize: 0.9,
                        }
                }
                },
                {
                    enemies: [
                        { pool: 4, elite: true },
                        { pool: 4 }
                    ],
                    amount: 4,
                    duration: 12,
                    minEnemiesOverride: 1,
                    bonus: {
                        multiplier: {
                            health: 0.9,
                            enemySize: 0.9,
                        }
                    }
                },
                ],
                bonus: {
                    multiplier: {
                        health: 3.5,
                        enemySize: 1.1,
                        movementSpeed: 1.6,
                        damage: 3.5,
                        xp: 0.8,
                    }
                }
            },
            // room 19
            {
                duration: 60,
                defaultWave: {
                    enemies: [
                        { pool: 0, weight: 3 },
                        { pool: 1, weight: 3 },
                        { pool: 2, weight: 2 },
                        { pool: 4, weight: 2 },
                    ],
                    amount: 8,
                    duration: 10,
                    minEnemiesOverride: 2,
                },
                waveAmount: 7,
                bonus: {
                    multiplier: {
                        health: 1.3,
                        enemySize: 1.3,
                        movementSpeed: 0.8,
                        damage: 4,
                        xp: 1.5,
                    }
                }
            },
            // room 20 - FINAL BOSS
            {
                duration: 60,
                boss: true,
                canStopAfter: true,
                defaultWave: {
                    amount: 6,
                    duration: 0,
                    enemies: [
                        { pool: 5, weight: 5 }
                    ],
                },
                waves: [
                    {
                        enemies: ["toasterBoss"],
                        amount: 2,
                        duration: 0,
                        bonus: {
                            multiplier: {
                                health: 0.8,
                                damage: 0.8,
                                enemySize: 0.9,
                                movementSpeed: 0.8,
                                xp: 1,
                            }
                        }
                    }
                ],
                waveAmount: 3,
                bonus: {
                    multiplier: {
                        health: 2,
                        damage: 3,
                        enemySize: 1.1,
                        movementSpeed: 2,
                        xp: 1,
                    }
                }
            },
        ]
    }
}