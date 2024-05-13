/// <reference path="../Types.ts" />
namespace Script {
    export const cards: Cards = {
        "test": {
            image: "./Assets/Cards/test.png",
            rarity: CardRarity.COMMON,
            levels: [
                {
                    activeEffects: [{
                        type: "projectile",
                        projectile: "toastPlayer",
                        amount: 1,
                        cooldown: 5,
                    }]
                },
                {
                    activeEffects: [{
                        type: "projectile",
                        projectile: "toastPlayer",
                        amount: 2,
                        cooldown: 5,
                    }]
                }
            ]
        },
        "testSize": {
            image: "./Assets/Cards/test.png",
            rarity: CardRarity.COMMON,
            levels: [
                {
                    passiveEffects: {
                        multiplier: {
                            projectileSize: 1.5
                        }
                    }
                },
                {
                    passiveEffects: {
                        multiplier: {
                            projectileSize: 2,
                        },
                        absolute: {
                            cooldownReduction: 2
                        }
                    }
                }
            ]
        }
    }
}