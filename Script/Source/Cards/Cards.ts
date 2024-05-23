/// <reference path="../Types.ts" />
namespace Script {
    export const cards: Cards = {
        "test": {
            image: "Pen.png",
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
            image: "Pen.png",
            rarity: CardRarity.RARE,
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
        },
        "anvil": {
            image: "Anvil.png",
            rarity: CardRarity.COMMON,
            name: "anvil",
            levels: [{
                activeEffects: [{
                    type: "projectile",
                    amount: 1,
                    projectile: "anvil",
                    cooldown: 3,
                    currentCooldown: 3,
                }]
            }]
        }
    }
}