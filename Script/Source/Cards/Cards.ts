/// <reference path="../Types.ts" />
namespace Script {
    export const cards: Cards = {
        // ---COMMON---COMMON---COMMON---COMMON---COMMON---COMMON---COMMON---COMMON---COMMON---COMMON---COMMON---COMMON---
        "Hammer": {
            image: "Hammer.png",
            rarity: CardRarity.COMMON,
            name: "Hammer",
            unlockByDefault: true,
            levels: [
                { //Tier 1
                    activeEffects: [{
                        type: "projectile",
                        projectile: "hammerPlayer",
                        amount: 1,
                        cooldown: 2,
                        currentCooldown: 1,
                        modifiers: {
                            absolute: {
                                damage: 0, //8 Base Damage
                                projectilePiercing: 2
                            }
                        }
                    }]
                },
                { //Tier 2
                    activeEffects: [{
                        type: "projectile",
                        projectile: "hammerPlayer",
                        amount: 1,
                        cooldown: 2,
                        currentCooldown: 1,
                        modifiers: {
                            absolute: {
                                damage: 4, //8 Base Damage
                                projectilePiercing: 2
                            }
                        }
                    }]
                },
                { //Tier 3
                    activeEffects: [{
                        type: "projectile",
                        projectile: "hammerPlayer",
                        amount: 2,
                        cooldown: 2,
                        currentCooldown: 1,
                        modifiers: {
                            absolute: {
                                damage: 4, //8 Base Damage
                                projectilePiercing: 2
                            }
                        }
                    }]
                },
                { //Tier 4
                    activeEffects: [{
                        type: "projectile",
                        projectile: "hammerPlayer",
                        amount: 2,
                        cooldown: 2,
                        currentCooldown: 1,
                        modifiers: {
                            absolute: {
                                damage: 7, //8 Base Damage
                                projectilePiercing: 3
                            }
                        }
                    }]
                },
                { //Tier 5
                    activeEffects: [{
                        type: "projectile",
                        projectile: "hammerPlayer",
                        amount: 2,
                        cooldown: 1.5,
                        currentCooldown: 0.75,
                        modifiers: {
                            absolute: {
                                damage: 7, //8 Base Damage
                                projectilePiercing: 4
                            }
                        }
                    }]
                },
            ]
        },
        "Anvil": {
            image: "Anvil.png",
            rarity: CardRarity.COMMON,
            name: "Anvil",
            unlockByDefault: true,
            levels: [
                { //Tier 1
                    activeEffects: [{
                        type: "projectile",
                        projectile: "anvilPlayer",
                        amount: 1,
                        cooldown: 3,
                        currentCooldown: 1.5,
                        modifiers: {
                            absolute: {
                                damage: 0 //10 Base Damage
                            }
                        }
                    }]
                },
                { //Tier 2
                    activeEffects: [{
                        type: "projectile",
                        projectile: "anvilPlayer",
                        amount: 1,
                        cooldown: 3,
                        currentCooldown: 1.5,
                        modifiers: {
                            absolute: {
                                damage: 4 //10 Base Damage
                            }
                        }
                    }],
                },
                { //Tier 3
                    activeEffects: [{
                        type: "projectile",
                        projectile: "anvilPlayer",
                        amount: 2,
                        cooldown: 3,
                        currentCooldown: 1.5,
                        modifiers: {
                            absolute: {
                                damage: 4 //10 Base Damage
                            }
                        }
                    }]
                },
                { //Tier 4
                    activeEffects: [{
                        type: "projectile",
                        projectile: "anvilPlayer",
                        amount: 2,
                        cooldown: 3,
                        currentCooldown: 1.5,
                        modifiers: {
                            absolute: {
                                damage: 10 //10 Base Damage
                            }
                        }
                    }]
                },
                { //Tier 5
                    activeEffects: [{
                        type: "projectile",
                        projectile: "anvilPlayer",
                        amount: 3,
                        cooldown: 2,
                        currentCooldown: 1,
                        modifiers: {
                            absolute: {
                                damage: 10 //10 Base Damage
                            }
                        }
                    }]
                },
            ]
        },
        "Pen": {
            image: "Pen.png",
            rarity: CardRarity.COMMON,
            name: "Pen",
            unlockByDefault: true,
            levels: [
                { //Tier 1
                    activeEffects: [{
                        type: "projectile",
                        projectile: "penPlayer",
                        amount: 1,
                        cooldown: 0.5,
                        modifiers: {
                            absolute: {
                                damage: 0 //2 Base Damage
                            }
                        }
                    }]
                },
                { //Tier 2
                    activeEffects: [{
                        type: "projectile",
                        projectile: "penPlayer",
                        amount: 1,
                        cooldown: 0.5,
                        modifiers: {
                            absolute: {
                                damage: 2 //2 Base Damage
                            }
                        }
                    }]
                },
                { //Tier 3
                    activeEffects: [{
                        type: "projectile",
                        projectile: "penPlayer",
                        amount: 2,
                        cooldown: 0.5,
                        modifiers: {
                            absolute: {
                                damage: 2 //2 Base Damage
                            }
                        }
                    }]
                },
                { //Tier 4
                    activeEffects: [{
                        type: "projectile",
                        projectile: "penPlayer",
                        amount: 2,
                        cooldown: 0.5,
                        modifiers: {
                            absolute: {
                                damage: 4 //2 Base Damage
                            }
                        }
                    }]
                },
                { //Tier 5
                    activeEffects: [{
                        type: "projectile",
                        projectile: "penPlayer",
                        amount: 3,
                        cooldown: 0.4,
                        modifiers: {
                            absolute: {
                                damage: 4 //2 Base Damage
                            }
                        }
                    }]
                },
            ]
        },
        "Lightbulb": {
            image: "Bulb.png",
            rarity: CardRarity.COMMON,
            name: "Lightbulb",
            unlockByDefault: true,
            levels: [
                { //Tier 1
                    activeEffects: [{
                        type: "aoe",
                        aoe: "lightbulbPlayer",
                        cooldown: 4,
                        currentCooldown: 2,
                        modifiers: {
                            absolute: {
                                damage: 0, //5 Base Damage
                                effectDuration: 0 //1 Base Duration
                            }
                        }
                    }]
                },
                { //Tier 2
                    activeEffects: [{
                        type: "aoe",
                        aoe: "lightbulbPlayer",
                        cooldown: 4,
                        currentCooldown: 2,
                        modifiers: {
                            absolute: {
                                damage: 1, //5 Base Damage
                                effectDuration: 0, //1 Base Duration
                                projectileSize: 1.1
                            }
                        }
                    }]
                },
                { //Tier 3
                    activeEffects: [{
                        type: "aoe",
                        aoe: "lightbulbPlayer",
                        cooldown: 4,
                        currentCooldown: 2,
                        modifiers: {
                            absolute: {
                                damage: 1, //5 Base Damage
                                effectDuration: 0.5, //1 Base Duration
                                projectileSize: 1.3
                            }
                        }
                    }]
                },
                { //Tier 4
                    activeEffects: [{
                        type: "aoe",
                        aoe: "lightbulbPlayer",
                        cooldown: 3,
                        currentCooldown: 2,
                        modifiers: {
                            absolute: {
                                damage: 1, //5 Base Damage
                                effectDuration: 0.5, //1 Base Duration
                                projectileSize: 1.5
                            }
                        }
                    }]
                },
                { //Tier 5
                    activeEffects: [{
                        type: "aoe",
                        aoe: "lightbulbPlayer",
                        cooldown: 3,
                        currentCooldown: 2,
                        modifiers: {
                            absolute: {
                                damage: 3, //5 Base Damage
                                effectDuration: 1, //1 Base Duration
                                projectileSize: 2
                            }
                        }
                    }]
                },
            ]
        },
        "Smoke Mask": {
            image: "SmokeMask.png",
            rarity: CardRarity.COMMON,
            name: "Smoke Mask",
            unlockByDefault: true,
            levels: [
                { //Tier 1
                    activeEffects: [{
                        type: "aoe",
                        aoe: "smokeMaskPlayer",
                        cooldown: 2,
                        currentCooldown: 1,
                        modifiers: {
                            absolute: {
                                damage: 0 //2 Base Damage
                            }
                        }
                    }]
                },
                { //Tier 2
                    activeEffects: [{
                        type: "aoe",
                        aoe: "smokeMaskPlayer",
                        cooldown: 2,
                        currentCooldown: 1,
                        modifiers: {
                            absolute: {
                                damage: 1 //2 Base Damage
                            }
                        }
                    }]
                },
                { //Tier 3
                    activeEffects: [{
                        type: "aoe",
                        aoe: "smokeMaskPlayer",
                        cooldown: 1.5,
                        currentCooldown: 0.75,
                        modifiers: {
                            absolute: {
                                damage: 1 //2 Base Damage
                            }
                        }
                    }]
                },
                { //Tier 4
                    activeEffects: [{
                        type: "aoe",
                        aoe: "smokeMaskPlayer",
                        cooldown: 1,
                        currentCooldown: 0.5,
                        modifiers: {
                            absolute: {
                                damage: 2 //2 Base Damage
                            },
                            multiplier: {
                                projectileSize: 1.1
                            }
                        }
                    }]
                },
                { //Tier 5
                    activeEffects: [{
                        type: "aoe",
                        aoe: "smokeMaskPlayer",
                        cooldown: 1,
                        currentCooldown: 0.5,
                        modifiers: {
                            absolute: {
                                damage: 3, //2 Base Damage
                            },
                            multiplier: {
                                projectileSize: 1.3
                            }
                        }
                    }]
                },
            ]
        },
        "Discus": {
            image: "Discus.png",
            rarity: CardRarity.COMMON,
            name: "Discus",
            unlockByDefault: true,
            levels: [
                { //Tier 1
                    activeEffects: [{
                        type: "projectile",
                        projectile: "discusPlayer",
                        amount: 1,
                        cooldown: 3,
                        currentCooldown: 1,
                        modifiers: {
                            absolute: {
                                damage: 0, //5 Base Damage
                                projectilePiercing: 1
                            }
                        }
                    }]
                },
                { //Tier 2
                    activeEffects: [{
                        type: "projectile",
                        projectile: "discusPlayer",
                        amount: 1,
                        cooldown: 3,
                        currentCooldown: 1,
                        modifiers: {
                            absolute: {
                                damage: 3, //5 Base Damage
                                projectilePiercing: 1
                            }
                        }
                    }]
                },
                { //Tier 3
                    activeEffects: [{
                        type: "projectile",
                        projectile: "discusPlayer",
                        amount: 1,
                        cooldown: 2,
                        currentCooldown: 0.5,
                        modifiers: {
                            absolute: {
                                damage: 3, //5 Base Damage
                                projectilePiercing: 1
                            }
                        }
                    }]
                },
                { //Tier 4
                    activeEffects: [{
                        type: "projectile",
                        projectile: "discusPlayer",
                        amount: 1,
                        cooldown: 2,
                        currentCooldown: 0.5,
                        modifiers: {
                            absolute: {
                                damage: 5, //5 Base Damage
                                projectilePiercing: 2
                            },
                            multiplier: {
                                projectileRange: 1.1,
                            }
                        }
                    }]
                },
                { //Tier 5
                    activeEffects: [{
                        type: "projectile",
                        projectile: "discusPlayer",
                        amount: 2,
                        cooldown: 2,
                        currentCooldown: 0.5,
                        modifiers: {
                            absolute: {
                                damage: 5, //5 Base Damage
                                projectilePiercing: 3,
                            },
                            multiplier: {
                                projectileRange: 1.2,
                            }
                        }
                    }]
                },
            ]
        },
        "Code Civil": {
            image: "CodeCivil.png",
            rarity: CardRarity.COMMON,
            name: "Code Civil",
            unlockByDefault: true,
            levels: [
                { //Tier 1
                    activeEffects: [{
                        type: "projectile",
                        projectile: "codeCivilPlayer",
                        amount: 1,
                        cooldown: 3,
                        currentCooldown: 1.5,
                        modifiers: {
                            absolute: {
                                damage: 0 //3 Base Damage (x10 for max distance)
                            }
                        }
                    }]
                },
                { //Tier 2
                    activeEffects: [{
                        type: "projectile",
                        projectile: "codeCivilPlayer",
                        amount: 1,
                        cooldown: 3,
                        currentCooldown: 1.5,
                        modifiers: {
                            absolute: {
                                damage: 1, //3 Base Damage (x10 for max distance)
                                projectileRange: 2,
                            }
                        }
                    }]
                },
                { //Tier 3
                    activeEffects: [{
                        type: "projectile",
                        projectile: "codeCivilPlayer",
                        amount: 1,
                        cooldown: 2.5,
                        currentCooldown: 1.25,
                        modifiers: {
                            absolute: {
                                damage: 2, //3 Base Damage (x10 for max distance)
                                projectileRange: 4,
                            }
                        }
                    }]
                },
                { //Tier 4
                    activeEffects: [{
                        type: "projectile",
                        projectile: "codeCivilPlayer",
                        amount: 1,
                        cooldown: 2,
                        currentCooldown: 1,
                        modifiers: {
                            absolute: {
                                damage: 3, //3 Base Damage (x10 for max distance)
                                projectileRange: 6,
                            }
                        }
                    }]
                },
                { //Tier 5
                    activeEffects: [{
                        type: "projectile",
                        projectile: "codeCivilPlayer",
                        amount: 2,
                        cooldown: 2,
                        currentCooldown: 1,
                        modifiers: {
                            absolute: {
                                damage: 5, //3 Base Damage (x10 for max distance)
                                projectileRange: 10,
                            }
                        }
                    }]
                },
            ]
        },
        "Divider": {
            image: "Divider.png",
            rarity: CardRarity.COMMON,
            name: "Divider",
            unlockByDefault: true,
            levels: [
                { //Tier 1
                    activeEffects: [{
                        type: "projectile",
                        projectile: "dividerPlayer",
                        amount: 1,
                        cooldown: 2,
                        currentCooldown: 1,
                        modifiers: {
                            absolute: {
                                damage: 0, //5 Base Damage
                                projectilePiercing: 2
                            }
                        }
                    }]
                },
                { //Tier 2
                    activeEffects: [{
                        type: "projectile",
                        projectile: "dividerPlayer",
                        amount: 1,
                        cooldown: 2,
                        currentCooldown: 1,
                        modifiers: {
                            absolute: {
                                damage: 2, //5 Base Damage
                                projectilePiercing: 2
                            }
                        }
                    }]
                },
                { //Tier 3
                    activeEffects: [{
                        type: "projectile",
                        projectile: "dividerPlayer",
                        amount: 2,
                        cooldown: 2,
                        currentCooldown: 1,
                        modifiers: {
                            absolute: {
                                damage: 2, //5 Base Damage
                                projectilePiercing: 2
                            }
                        }
                    }]
                },
                { //Tier 4
                    activeEffects: [{
                        type: "projectile",
                        projectile: "dividerPlayer",
                        amount: 2,
                        cooldown: 2,
                        currentCooldown: 1,
                        modifiers: {
                            absolute: {
                                damage: 3, //5 Base Damage
                                projectilePiercing: 3
                            },
                            multiplier: {
                                projectileRange: 1.1
                            }
                        }
                    }]
                },
                { //Tier 5
                    activeEffects: [{
                        type: "projectile",
                        projectile: "dividerPlayer",
                        amount: 2,
                        cooldown: 1.5,
                        currentCooldown: 0.75,
                        modifiers: {
                            absolute: {
                                damage: 5, //5 Base Damage
                                projectilePiercing: 5
                            },
                            multiplier: {
                                projectileRange: 1.2
                            }
                        }
                    }]
                },
            ]
        },
        "Needles": {
            image: "Needles.png",
            rarity: CardRarity.COMMON,
            name: "Needles",
            unlockByDefault: true,
            levels: [
                { //Tier 1
                    activeEffects: [{
                        type: "projectile",
                        projectile: "needlePlayer",
                        amount: 1,
                        cooldown: 4, //TODO: Leave a projectile every 5 units moved
                        currentCooldown: 2,
                        cooldownBasedOnDistance: true,
                        modifiers: {
                            absolute: {
                                damage: 0, //5 Base Damage
                            }
                        }
                    }]
                },
                { //Tier 2
                    activeEffects: [{
                        type: "projectile",
                        projectile: "needlePlayer",
                        amount: 1,
                        cooldown: 3.5, //TODO: Leave a projectile every 4 units moved
                        currentCooldown: 1.75,
                        cooldownBasedOnDistance: true,
                        modifiers: {
                            absolute: {
                                damage: 1, //5 Base Damage
                            }
                        }
                    }]
                },
                { //Tier 3
                    activeEffects: [{
                        type: "projectile",
                        projectile: "needlePlayer",
                        amount: 1,
                        cooldown: 3, //TODO: Leave a projectile every 4 units moved
                        currentCooldown: 1.5,
                        cooldownBasedOnDistance: true,
                        modifiers: {
                            absolute: {
                                damage: 3, //5 Base Damage
                            }
                        }
                    }]
                },
                { //Tier 4
                    activeEffects: [{
                        type: "projectile",
                        projectile: "needlePlayer",
                        amount: 1,
                        cooldown: 2, //TODO: Leave a projectile every 3 units moved
                        currentCooldown: 1,
                        cooldownBasedOnDistance: true,
                        modifiers: {
                            absolute: {
                                damage: 3, //5 Base Damage
                            }
                        }
                    }]
                },
                { //Tier 5
                    activeEffects: [{
                        type: "projectile",
                        projectile: "needlePlayer",
                        amount: 1,
                        cooldown: 1, //TODO: Leave a projectile every 2 units moved
                        currentCooldown: 0.5,
                        cooldownBasedOnDistance: true,
                        modifiers: {
                            absolute: {
                                damage: 5, //5 Base Damage
                            }
                        }
                    }]
                },
            ]
        },
        "Chisel": {
            image: "Chisel.png",
            rarity: CardRarity.COMMON,
            name: "Chisel",
            unlockByDefault: true,
            levels: [
                { //Tier 1
                    activeEffects: [{
                        type: "projectile",
                        projectile: "chiselPlayer",
                        amount: 1,
                        cooldown: 2,
                        currentCooldown: 1,
                        modifiers: {
                            absolute: {
                                damage: 0, //15 Base Damage
                            }
                        }
                    }]
                },
                { //Tier 2
                    activeEffects: [{
                        type: "projectile",
                        projectile: "chiselPlayer",
                        amount: 1,
                        cooldown: 2,
                        currentCooldown: 1,
                        modifiers: {
                            absolute: {
                                damage: 10, //15 Base Damage
                            }
                        }
                    }]
                },
                { //Tier 3
                    activeEffects: [{
                        type: "projectile",
                        projectile: "chiselPlayer",
                        amount: 2,
                        cooldown: 2,
                        currentCooldown: 1,
                        modifiers: {
                            absolute: {
                                damage: 10, //15 Base Damage
                            }
                        }
                    }]
                },
                { //Tier 4
                    activeEffects: [{
                        type: "projectile",
                        projectile: "chiselPlayer",
                        amount: 2,
                        cooldown: 2,
                        currentCooldown: 1,
                        modifiers: {
                            absolute: {
                                damage: 20, //15 Base Damage
                            }
                        }
                    }]
                },
                { //Tier 5
                    activeEffects: [{
                        type: "projectile",
                        projectile: "chiselPlayer",
                        amount: 2,
                        cooldown: 1.5,
                        currentCooldown: 0.75,
                        modifiers: {
                            absolute: {
                                damage: 25, //15 Base Damage
                            }
                        }
                    }]
                },
            ]
        },
        "Helmet": {
            image: "Helmet.png",
            rarity: CardRarity.COMMON,
            name: "Helmet",
            unlockByDefault: true,
            levels: [
                { //Tier 1
                    passiveEffects: {
                        multiplier: {
                            damageReduction: { value: 0.9, limitation: HitType.PROJECTILE } // Less Damage from projectiles
                        }
                    }
                },
                { //Tier 2
                    passiveEffects: {
                        multiplier: {
                            damageReduction: { value: 0.8, limitation: HitType.PROJECTILE } // Less Damage from projectiles
                        }
                    }
                },
                { //Tier 3
                    passiveEffects: {
                        multiplier: {
                            damageReduction: { value: 0.7, limitation: HitType.PROJECTILE } // Less Damage from projectiles
                        }
                    }
                },
                { //Tier 4
                    passiveEffects: {
                        multiplier: {
                            damageReduction: { value: 0.6, limitation: HitType.PROJECTILE } // Less Damage from projectiles
                        }
                    }
                },
                { //Tier 5
                    passiveEffects: {
                        multiplier: {
                            damageReduction: { value: 0.4, limitation: HitType.PROJECTILE } // Less Damage from projectiles
                        }
                    }
                },
            ]
        },
        "Safety Boots": {
            image: "SafetyBoots.png",
            rarity: CardRarity.COMMON,
            name: "Safety Boots",
            unlockByDefault: true,
            levels: [
                { //Tier 1
                    passiveEffects: {
                        multiplier: {
                            damageReduction: { value: 0.9, limitation: HitType.MELEE } // More resistant against melee
                        }
                    }
                },
                { //Tier 2
                    passiveEffects: {
                        multiplier: {
                            damageReduction: { value: 0.8, limitation: HitType.MELEE } // More resistant against melee
                        }
                    }
                },
                { //Tier 3
                    passiveEffects: {
                        multiplier: {
                            damageReduction: { value: 0.7, limitation: HitType.MELEE } // More resistant against melee
                        }
                    }
                },
                { //Tier 4
                    passiveEffects: {
                        multiplier: {
                            damageReduction: { value: 0.6, limitation: HitType.MELEE } // More resistant against melee
                        }
                    }
                },
                { //Tier 5
                    passiveEffects: {
                        multiplier: {
                            damageReduction: { value: 0.4, limitation: HitType.MELEE } // More resistant against melee
                        }
                    }
                },
            ]
        },
        "Microphone": {
            image: "Microphone.png",
            rarity: CardRarity.COMMON,
            name: "Microphone",
            unlockByDefault: true,
            levels: [
                { //Tier 1
                    passiveEffects: {
                        multiplier: {
                            projectileRange: 1.15
                        }
                    }
                },
                { //Tier 2
                    passiveEffects: {
                        multiplier: {
                            projectileRange: 1.3
                        }
                    }
                },
                { //Tier 3
                    passiveEffects: {
                        multiplier: {
                            projectileRange: 1.5
                        }
                    }
                },
                { //Tier 4
                    passiveEffects: {
                        multiplier: {
                            projectileRange: 1.7
                        }
                    }
                },
                { //Tier 5
                    passiveEffects: {
                        multiplier: {
                            projectileRange: 2
                        }
                    }
                },
            ]
        },
        "Gavel": {
            image: "Gavel.png",
            rarity: CardRarity.COMMON,
            name: "Gavel",
            unlockByDefault: true,
            levels: [
                { //Tier 1
                    passiveEffects: {
                        absolute: {
                            damage: 1,
                        }
                    }
                },
                { //Tier 2
                    passiveEffects: {
                        absolute: {
                            damage: 2,
                        }
                    }
                },
                { //Tier 3
                    passiveEffects: {
                        absolute: {
                            damage: 3,
                        }
                    }
                },
                { //Tier 4
                    passiveEffects: {
                        absolute: {
                            damage: 5,
                        }
                    }
                },
                { //Tier 5
                    passiveEffects: {
                        absolute: {
                            damage: 8,
                        }
                    }
                },
            ]
        },
        "First Aid Kit": {
            image: "FirstAidKit.png",
            rarity: CardRarity.COMMON,
            name: "First Aid Kit",
            unlockByDefault: true,
            levels: [
                { //Tier 1
                    passiveEffects: {
                        absolute: {
                            health: 10,
                        }
                    }
                },
                { //Tier 2
                    passiveEffects: {
                        absolute: {
                            health: 20,
                        }
                    }
                },
                { //Tier 3
                    passiveEffects: {
                        absolute: {
                            health: 35,
                        }
                    }
                },
                { //Tier 4
                    passiveEffects: {
                        absolute: {
                            health: 50,
                        }
                    }
                },
                { //Tier 5
                    passiveEffects: {
                        absolute: {
                            health: 75,
                        }
                    }
                },
            ]
        },
        "Running Shoes": {
            image: "RunningShoes.png",
            rarity: CardRarity.COMMON,
            name: "Running Shoes",
            unlockByDefault: true,
            levels: [
                { //Tier 1
                    passiveEffects: {
                        absolute: {
                            movementSpeed: 0.25,
                        }
                    }
                },
                { //Tier 2
                    passiveEffects: {
                        absolute: {
                            movementSpeed: 0.5,
                        }
                    }
                },
                { //Tier 3
                    passiveEffects: {
                        absolute: {
                            movementSpeed: 0.75,
                        }
                    }
                },
                { //Tier 4
                    passiveEffects: {
                        absolute: {
                            movementSpeed: 1.25,
                        }
                    }
                },
                { //Tier 5
                    passiveEffects: {
                        absolute: {
                            movementSpeed: 2,
                        }
                    }
                },
            ]
        },
        "Disposable Gloves": {
            image: "DisposableGloves.png",
            rarity: CardRarity.COMMON,
            name: "Disposable Gloves",
            unlockByDefault: true,
            levels: [
                { //Tier 1
                    passiveEffects: {
                        absolute: {
                            damageReduction: -1
                        }
                    }
                },
                { //Tier 2
                    passiveEffects: {
                        absolute: {
                            damageReduction: -2
                        }
                    }
                },
                { //Tier 3
                    passiveEffects: {
                        absolute: {
                            damageReduction: -4
                        }
                    }
                },
                { //Tier 4
                    passiveEffects: {
                        absolute: {
                            damageReduction: -6
                        }
                    }
                },
                { //Tier 5
                    passiveEffects: {
                        absolute: {
                            damageReduction: -10
                        }
                    }
                },
            ]
        },
        "Printer": {
            image: "Printer.png",
            rarity: CardRarity.COMMON,
            name: "Printer",
            unlockByDefault: true,
            levels: [
                { //Tier 1
                    passiveEffects: {
                        multiplier: {
                            xp: 1.05 // +5% increased XP
                        }
                    }
                },
                { //Tier 2
                    passiveEffects: {
                        multiplier: {
                            xp: 1.1 // +10% increased XP
                        }
                    }
                },
                { //Tier 3
                    passiveEffects: {
                        multiplier: {
                            xp: 1.25 // +25% increased XP
                        }
                    }
                },
                { //Tier 4
                    passiveEffects: {
                        multiplier: {
                            xp: 1.4 // +40% increased XP
                        }
                    }
                },
                { //Tier 5
                    passiveEffects: {
                        multiplier: {
                            xp: 1.6 // +60% increased XP
                        }
                    }
                },
            ]
        },
        "Solar Panel": {
            image: "SolarPanel.png",
            rarity: CardRarity.COMMON,
            name: "Solar Panel",
            unlockByDefault: true,
            levels: [
                { //Tier 1
                    passiveEffects: {
                        absolute: {
                            regeneration: 1,
                        }
                    }
                },
                { //Tier 2
                    passiveEffects: {
                        absolute: {
                            regeneration: 2,
                        }
                    }
                },
                { //Tier 3
                    passiveEffects: {
                        absolute: {
                            regeneration: 3,
                        }
                    }
                },
                { //Tier 4
                    passiveEffects: {
                        absolute: {
                            regeneration: 5,
                        }
                    }
                },
                { //Tier 5
                    passiveEffects: {
                        absolute: {
                            regeneration: 8,
                        }
                    }
                },
            ]
        },
        "Drone": {
            image: "Drone.png",
            rarity: CardRarity.COMMON,
            name: "Drone",
            unlockByDefault: true,
            levels: [
                { //Tier 1
                    passiveEffects: {
                        multiplier: {
                            cameraFOV:  1.05, // +5% increased field of view (camera zoom) // currently camera distance, not FOV
                        }
                    }
                },
                { //Tier 2
                    passiveEffects: {
                        multiplier: {
                            cameraFOV:  1.1, // +10% increased field of view (camera zoom) // currently camera distance, not FOV
                        }
                    }
                },
                { //Tier 3
                    passiveEffects: {
                        multiplier: {
                            cameraFOV:  1.2, // +20% increased field of view (camera zoom) // currently camera distance, not FOV
                        }
                    }
                },
                { //Tier 4
                    passiveEffects: {
                        multiplier: {
                            cameraFOV:  1.35, // +35% increased field of view (camera zoom) // currently camera distance, not FOV
                        }
                    }
                },
                { //Tier 5
                    passiveEffects: {
                        multiplier: {
                            cameraFOV:  1.5, // +50% increased field of view (camera zoom) // currently camera distance, not FOV
                        }
                    }
                },
            ]
        },
        // ---UNCOMMON---UNCOMMON---UNCOMMON---UNCOMMON---UNCOMMON---UNCOMMON---UNCOMMON---UNCOMMON---UNCOMMON---UNCOMMON---UNCOMMON---UNCOMMON---
        "Pills": {
            image: "Pills.png",
            rarity: CardRarity.UNCOMMON,
            name: "Pills",
            unlockByDefault: true,
            levels: [
                { //Tier 1
                    passiveEffects: {
                        multiplier: {
                            effectDuration: 1.2
                        }
                    }
                },
                { //Tier 2
                    passiveEffects: {
                        multiplier: {
                            effectDuration: 1.3
                        }
                    }
                },
                { //Tier 3
                    passiveEffects: {
                        multiplier: {
                            effectDuration: 1.5
                        }
                    }
                },
                { //Tier 4
                    passiveEffects: {
                        multiplier: {
                            effectDuration: 1.7
                        }
                    }
                },
                { //Tier 5
                    passiveEffects: {
                        multiplier: {
                            effectDuration: 2
                        }
                    }
                },
            ]
        },
        "Fire Hose": {
            image: "FireHose.png",
            rarity: CardRarity.UNCOMMON,
            name: "Fire Hose",
            levels: [
                { //Tier 1
                    passiveEffects: {
                        multiplier: {
                            knockback: 1.1
                        }
                    }
                },
                { //Tier 2
                    passiveEffects: {
                        multiplier: {
                            knockback: 1.15
                        }
                    }
                },
                { //Tier 3
                    passiveEffects: {
                        multiplier: {
                            knockback: 1.25
                        }
                    }
                },
                { //Tier 4
                    passiveEffects: {
                        multiplier: {
                            knockback: 1.4
                        }
                    }
                },
                { //Tier 5
                    passiveEffects: {
                        multiplier: {
                            knockback: 1.6
                        }
                    }
                },
            ]
        },
        "Syringe": {
            image: "Syrringe.png",
            rarity: CardRarity.UNCOMMON,
            name: "Syringe",
            levels: [
                { //Tier 1
                    passiveEffects: {
                        absolute: {
                            regenerationRelativeToMaxHealth: 0.005
                        }
                    }
                },
                { //Tier 2
                    passiveEffects: {
                        absolute: {
                            regenerationRelativeToMaxHealth: 0.01
                        }
                    }
                },
                { //Tier 3
                    passiveEffects: {
                        absolute: {
                            regenerationRelativeToMaxHealth: 0.015
                        }
                    }
                },
                { //Tier 4
                    passiveEffects: {
                        absolute: {
                            regenerationRelativeToMaxHealth: 0.025
                        }
                    }
                },
                { //Tier 5
                    passiveEffects: {
                        absolute: {
                            regenerationRelativeToMaxHealth: 0.05
                        }
                    }
                },
            ]
        },
        "Sketchbook": {
            image: "Sketchbook.png",
            rarity: CardRarity.UNCOMMON,
            name: "Sketchbook",
            levels: [
                { //Tier 1
                    passiveEffects: {
                        multiplier: {
                            effectSize: 1.05 //+5% increased effect radius
                        }
                    }
                },
                { //Tier 2
                    passiveEffects: {
                        multiplier: {
                            effectSize: 1.1 //+10% increased effect radius
                        }
                    }
                },
                { //Tier 3
                    passiveEffects: {
                        multiplier: {
                            effectSize: 1.2 //+20% increased effect radius
                        }
                    }
                },
                { //Tier 4
                    passiveEffects: {
                        multiplier: {
                            effectSize: 1.3 //+30% increased effect radius
                        }
                    }
                },
                { //Tier 5
                    passiveEffects: {
                        multiplier: {
                            effectSize: 1.5 //+50% increased effect radius
                        }
                    }
                },
            ]
        },
        "Plow": {
            image: "Plow.png",
            rarity: CardRarity.UNCOMMON,
            name: "Plow",
            levels: [
                { //Tier 1
                    passiveEffects: {
                        multiplier: {
                            //TODO: -2% enemy speed
                        }
                    }
                },
                { //Tier 2
                    passiveEffects: {
                        multiplier: {
                            //TODO: -5% enemy speed
                        }
                    }
                },
                { //Tier 3
                    passiveEffects: {
                        multiplier: {
                            //TODO: -10% enemy speed
                        }
                    }
                },
                { //Tier 4
                    passiveEffects: {
                        multiplier: {
                            //TODO: -15% enemy speed
                        }
                    }
                },
                { //Tier 5
                    passiveEffects: {
                        multiplier: {
                            //TODO: -25% enemy speed
                        }
                    }
                },
            ]
        },
        "Jump Rope": {
            image: "JumpRope.png",
            rarity: CardRarity.UNCOMMON,
            name: "Jump Rope",
            unlockByDefault: true,
            levels: [
                { //Tier 1
                    passiveEffects: {
                        absolute: {
                            dodge: 0.05 // 5% dodge chance
                        }
                    }
                },
                { //Tier 2
                    passiveEffects: {
                        absolute: {
                            dodge: 0.1 // 10% dodge chance
                        }
                    }
                },
                { //Tier 3
                    passiveEffects: {
                        absolute: {
                            dodge: 0.2 // 20% dodge chance
                        }
                    }
                },
                { //Tier 4
                    passiveEffects: {
                        absolute: {
                            dodge: 0.3 // 30% dodge chance
                        }
                    }
                },
                { //Tier 5
                    passiveEffects: {
                        absolute: {
                            dodge: 0.5 // 50% dodge chance
                        }
                    }
                },
            ]
        },
        "Tape Measure": {
            image: "TapeMeasure.png",
            rarity: CardRarity.UNCOMMON,
            name: "Tape Measure",
            levels: [
                { //Tier 1
                    passiveEffects: {
                        multiplier: {
                            //TODO: -5% enemy projectile speed
                        }
                    }
                },
                { //Tier 2
                    passiveEffects: {
                        multiplier: {
                            //TODO: -10% enemy projectile speed
                        }
                    }
                },
                { //Tier 3
                    passiveEffects: {
                        multiplier: {
                            //TODO: -20% enemy projectile speed
                        }
                    }
                },
                { //Tier 4
                    passiveEffects: {
                        multiplier: {
                            //TODO: -30% enemy projectile speed
                        }
                    }
                },
                { //Tier 5
                    passiveEffects: {
                        multiplier: {
                            //TODO: -50% enemy projectile speed
                        }
                    }
                },
            ]
        },
        "LegalWig": {
            image: "LegalWig.png",
            rarity: CardRarity.UNCOMMON,
            name: "Legal Wig",
            levels: [
                { //Tier 1
                    passiveEffects: {
                        multiplier: {
                            enemyAmount: 0.95, //-5% enemies
                            // TODO: +5% enemy stats
                        }
                    }
                },
                { //Tier 2
                    passiveEffects: {
                        multiplier: {
                            enemyAmount: 0.9, //-10% enemies
                            // TODO: +10% enemy stats
                        }
                    }
                },
                { //Tier 3
                    passiveEffects: {
                        multiplier: {
                            enemyAmount: 0.8, //-20% enemies
                            // TODO: +20% enemy stats
                        }
                    }
                },
                { //Tier 4
                    passiveEffects: {
                        multiplier: {
                            enemyAmount: 0.7, //-30% enemies
                            // TODO: +30% enemy stats
                        }
                    }
                },
                { //Tier 5
                    passiveEffects: {
                        multiplier: {
                            enemyAmount: 0.5, //-50% enemies
                            // TODO: +50% enemy stats
                        }
                    }
                },
            ]
        },
        "Toolbelt": {
            image: "Toolbelt.png",
            rarity: CardRarity.UNCOMMON,
            name: "Toolbelt",
            levels: [
                { //Tier 1
                    passiveEffects: {
                        multiplier: {
                            //TODO: +1% damage for every weapon equipped
                        }
                    }
                },
                { //Tier 2
                    passiveEffects: {
                        multiplier: {
                            //TODO: +2% damage for every weapon equipped
                        }
                    }
                },
                { //Tier 3
                    passiveEffects: {
                        multiplier: {
                            //TODO: +5% damage for every weapon equipped
                        }
                    }
                },
                { //Tier 4
                    passiveEffects: {
                        multiplier: {
                            //TODO: +10% damage for every weapon equipped
                        }
                    }
                },
                { //Tier 5
                    passiveEffects: {
                        multiplier: {
                            //TODO: +20% damage for every weapon equipped
                        }
                    }
                },
            ]
        },
        "Razor": {
            image: "Razor.png",
            rarity: CardRarity.UNCOMMON,
            name: "Razor",
            levels: [
                { //Tier 1
                    passiveEffects: {
                        multiplier: {
                            //TODO: +1% attack speed every time you take damage (resets each room).
                        }
                    }
                },
                { //Tier 2
                    passiveEffects: {
                        multiplier: {
                            //TODO: +2% attack speed every time you take damage (resets each room).
                        }
                    }
                },
                { //Tier 3
                    passiveEffects: {
                        multiplier: {
                            //TODO: +3% attack speed every time you take damage (resets each room).
                        }
                    }
                },
                { //Tier 4
                    passiveEffects: {
                        multiplier: {
                            //TODO: +5% attack speed every time you take damage (resets each room).
                        }
                    }
                },
                { //Tier 5
                    passiveEffects: {
                        multiplier: {
                            //TODO: +1% permanent attack speed every time you take damage.
                        }
                    }
                },
            ]
        },
        "Binder": {
            image: "Binder.png",
            rarity: CardRarity.UNCOMMON,
            name: "Binder",
            levels: [
                { //Tier 1
                    passiveEffects: {
                        multiplier: {
                            damage: 1.05
                            //TODO: only increased damage against bosses and elites
                        }
                    }
                },
                { //Tier 2
                    passiveEffects: {
                        multiplier: {
                            damage: 1.1
                            //TODO: only increased damage against bosses and elites
                        }
                    }
                },
                { //Tier 3
                    passiveEffects: {
                        multiplier: {
                            damage: 1.2
                            //TODO: only increased damage against bosses and elites
                        }
                    }
                },
                { //Tier 4
                    passiveEffects: {
                        multiplier: {
                            damage: 1.4
                            //TODO: only increased damage against bosses and elites
                        }
                    }
                },
                { //Tier 5
                    passiveEffects: {
                        multiplier: {
                            damage: 1.75
                            //TODO: only increased damage against bosses and elites
                        }
                    }
                },
            ]
        },
        "Flashlight": {
            image: "Flashlight.png",
            rarity: CardRarity.UNCOMMON,
            name: "Flashlight",
            levels: [
                { //Tier 1
                    passiveEffects: {
                        absolute: {
                            health: 20
                            //TODO: start the room with 90% health
                        }
                    }
                },
                { //Tier 2
                    passiveEffects: {
                        absolute: {
                            health: 40
                            //TODO: start the room with 75% health
                        }
                    }
                },
                { //Tier 3
                    passiveEffects: {
                        absolute: {
                            health: 75
                            //TODO: start the room with 50% health
                        }
                    }
                },
                { //Tier 4
                    passiveEffects: {
                        absolute: {
                            health: 100
                            //TODO: start the room with 25% health
                        }
                    }
                },
                { //Tier 5
                    passiveEffects: {
                        absolute: {
                            health: 150
                            //TODO: start the room with 25% health
                        }
                    }
                },
            ]
        },
        "Hard Drive": {
            image: "HardDrive.png",
            rarity: CardRarity.UNCOMMON,
            name: "Hard Drive",
            unlockByDefault: true,
            levels: [
                { //Tier 1
                    passiveEffects: {
                        multiplier: {
                            enemyAmount: 1.02 // 2% more enemies
                        }
                    }
                },
                { //Tier 2
                    passiveEffects: {
                        multiplier: {
                            enemyAmount: 1.05 // 5% more enemies
                        }
                    }
                },
                { //Tier 3
                    passiveEffects: {
                        multiplier: {
                            enemyAmount: 1.1 // 10% more enemies
                        }
                    }
                },
                { //Tier 4
                    passiveEffects: {
                        multiplier: {
                            enemyAmount: 1.15 // 15% more enemies
                        }
                    }
                },
                { //Tier 5
                    passiveEffects: {
                        multiplier: {
                            enemyAmount: 1.25 // 25% more enemies
                        }
                    }
                },
            ]
        },
        "Stethoscope": {
            image: "Stethoscope.png",
            rarity: CardRarity.UNCOMMON,
            name: "Stethoscope",
            levels: [
                { //Tier 1
                    passiveEffects: {
                        multiplier: {
                            //TODO: +1% damage every time you heal (resets each room).
                        }
                    }
                },
                { //Tier 2
                    passiveEffects: {
                        multiplier: {
                            //TODO: +2% damage every time you heal (resets each room).
                        }
                    }
                },
                { //Tier 3
                    passiveEffects: {
                        multiplier: {
                            //TODO: +3% damage every time you heal (resets each room).
                        }
                    }
                },
                { //Tier 4
                    passiveEffects: {
                        multiplier: {
                            //TODO: +5% damage every time you heal (resets each room).
                        }
                    }
                },
                { //Tier 5
                    passiveEffects: {
                        multiplier: {
                            //TODO: +1% permanent damage every time you heal.
                        }
                    }
                },
            ]
        },
        "Apple": {
            image: "Apple.png",
            rarity: CardRarity.UNCOMMON,
            name: "Apple",
            levels: [
                { //Tier 1
                    passiveEffects: {
                        absolute: {
                            //TODO: +0.5 health for every enemy that spawns.
                        }
                    }
                },
                { //Tier 2
                    passiveEffects: {
                        absolute: {
                            //TODO: +1 health for every enemy that spawns.
                        }
                    }
                },
                { //Tier 3
                    passiveEffects: {
                        absolute: {
                            //TODO: +2 health for every enemy that spawns.
                        }
                    }
                },
                { //Tier 4
                    passiveEffects: {
                        absolute: {
                            //TODO: +3 health for every enemy that spawns.
                        }
                    }
                },
                { //Tier 5
                    passiveEffects: {
                        absolute: {
                            //TODO: +5 health for every enemy that spawns.
                        }
                    }
                },
            ]
        },
        // ---RARE---RARE---RARE---RARE---RARE---RARE---RARE---RARE---RARE---RARE---RARE---RARE---
        "Magnifying Glass": {
            image: "MagnifyingGlas.png",
            rarity: CardRarity.RARE,
            name: "Magnifying Glass",
            levels: [
                { //Tier 1
                    passiveEffects: {
                        multiplier: {
                            criticalHitChance: 1.05
                        }
                    }
                },
                { //Tier 2
                    passiveEffects: {
                        multiplier: {
                            criticalHitChance: 1.1
                        }
                    }
                },
                { //Tier 3
                    passiveEffects: {
                        multiplier: {
                            criticalHitChance: 1.2
                        }
                    }
                },
                { //Tier 4
                    passiveEffects: {
                        multiplier: {
                            criticalHitChance: 1.35
                        }
                    }
                },
                { //Tier 5
                    passiveEffects: {
                        multiplier: {
                            criticalHitChance: 1.6
                        }
                    }
                },
            ]
        },
        "Tattoo Ink": {
            image: "TatooInk.png",
            rarity: CardRarity.RARE,
            name: "Tattoo Ink",
            unlockByDefault: true,
            levels: [
                { //Tier 1
                    passiveEffects: {
                        multiplier: {
                            projectileSpeed: 1.15
                        }
                    }
                },
                { //Tier 2
                    passiveEffects: {
                        multiplier: {
                            projectileSpeed: 1.3
                        }
                    }
                },
                { //Tier 3
                    passiveEffects: {
                        multiplier: {
                            projectileSpeed: 1.5
                        }
                    }
                },
                { //Tier 4
                    passiveEffects: {
                        multiplier: {
                            projectileSpeed: 1.7
                        }
                    }
                },
                { //Tier 5
                    passiveEffects: {
                        multiplier: {
                            projectileSpeed: 2
                        }
                    }
                },
            ]
        },
        "Calculator": {
            image: "Calculator.png",
            rarity: CardRarity.RARE,
            name: "Calculator",
            unlockByDefault: true,
            levels: [
                { //Tier 1
                    passiveEffects: {
                        multiplier: {
                            damage: 1.05
                        }
                    }
                },
                { //Tier 2
                    passiveEffects: {
                        multiplier: {
                            damage: 1.1
                        }
                    }
                },
                { //Tier 3
                    passiveEffects: {
                        multiplier: {
                            damage: 1.2
                        }
                    }
                },
                { //Tier 4
                    passiveEffects: {
                        multiplier: {
                            damage: 1.35
                        }
                    }
                },
                { //Tier 5
                    passiveEffects: {
                        multiplier: {
                            damage: 1.6
                        }
                    }
                },
            ]
        },
        "Bandages": {
            image: "Bandages.png",
            rarity: CardRarity.RARE,
            name: "Bandages",
            unlockByDefault: true,
            levels: [
                { //Tier 1
                    passiveEffects: {
                        multiplier: {
                            health: 1.05
                        }
                    }
                },
                { //Tier 2
                    passiveEffects: {
                        multiplier: {
                            health: 1.1
                        }
                    }
                },
                { //Tier 3
                    passiveEffects: {
                        multiplier: {
                            health: 1.2
                        }
                    }
                },
                { //Tier 4
                    passiveEffects: {
                        multiplier: {
                            health: 1.3
                        }
                    }
                },
                { //Tier 5
                    passiveEffects: {
                        multiplier: {
                            health: 1.5
                        }
                    }
                },
            ]
        },
        "Face Shield": {
            image: "FaceShield.png",
            rarity: CardRarity.RARE,
            name: "Face Shield",
            unlockByDefault: true,
            levels: [
                { //Tier 1
                    passiveEffects: {
                        multiplier: {
                            damageReduction: 0.95
                        }
                    }
                },
                { //Tier 2
                    passiveEffects: {
                        multiplier: {
                            damageReduction: 0.9
                        }
                    }
                },
                { //Tier 3
                    passiveEffects: {
                        multiplier: {
                            damageReduction: 0.8
                        }
                    }
                },
                { //Tier 4
                    passiveEffects: {
                        multiplier: {
                            damageReduction: 0.7
                        }
                    }
                },
                { //Tier 5
                    passiveEffects: {
                        multiplier: {
                            damageReduction: 0.5
                        }
                    }
                },
            ]
        },
        "3D Printer": {
            image: "3DPrinter.png",
            rarity: CardRarity.RARE,
            name: "3D Printer",
            levels: [
                { //Tier 1
                    passiveEffects: {
                        multiplier: {
                            //TODO: 10% chance to copy another random card effect (resets each room).
                        }
                    }
                },
                { //Tier 2
                    passiveEffects: {
                        multiplier: {
                            //TODO: 25% chance to copy another random card effect (resets each room).
                        }
                    }
                },
                { //Tier 3
                    passiveEffects: {
                        multiplier: {
                            //TODO: 40% chance to copy another random card effect (resets each room).
                        }
                    }
                },
                { //Tier 4
                    passiveEffects: {
                        multiplier: {
                            //TODO: 60% chance to copy another random card effect (resets each room).
                        }
                    }
                },
                { //Tier 5
                    passiveEffects: {
                        multiplier: {
                            //TODO: 100% chance to copy another random card effect (resets each room).
                        }
                    }
                },
            ]
        },
        "Ear Protection": {
            image: "EarProtection.png",
            rarity: CardRarity.RARE,
            name: "Ear Protection",
            levels: [
                { //Tier 1
                    passiveEffects: {
                        multiplier: {
                            //TODO: +25% duration of invincibility after taking damage.
                        }
                    }
                },
                { //Tier 2
                    passiveEffects: {
                        multiplier: {
                            //TODO: +50% duration of invincibility after taking damage.
                        }
                    }
                },
                { //Tier 3
                    passiveEffects: {
                        multiplier: {
                            //TODO: +75% duration of invincibility after taking damage.
                        }
                    }
                },
                { //Tier 4
                    passiveEffects: {
                        multiplier: {
                            //TODO: +100% duration of invincibility after taking damage.
                        }
                    }
                },
                { //Tier 5
                    passiveEffects: {
                        multiplier: {
                            //TODO: +150% duration of invincibility after taking damage.
                        }
                    }
                },
            ]
        },
        "Athletic Tape": {
            image: "AthleticTape.png",
            rarity: CardRarity.RARE,
            name: "Athletic Tape",
            unlockByDefault: true,
            levels: [
                { //Tier 1
                    passiveEffects: {
                        multiplier: {
                            regeneration: 1.05 // +5% healing effects.
                        }
                    }
                },
                { //Tier 2
                    passiveEffects: {
                        multiplier: {
                            regeneration: 1.1 // +10% healing effects.
                        }
                    }
                },
                { //Tier 3
                    passiveEffects: {
                        multiplier: {
                            regeneration: 1.15 // +15% healing effects.
                        }
                    }
                },
                { //Tier 4
                    passiveEffects: {
                        multiplier: {
                            regeneration: 1.3 // +30% healing effects.
                        }
                    }
                },
                { //Tier 5
                    passiveEffects: {
                        multiplier: {
                            regeneration: 1.5 // +50% healing effects.
                        }
                    }
                },
            ]
        },
        "Newspaper": {
            image: "Newspaper.png",
            rarity: CardRarity.RARE,
            name: "Newspaper",
            unlockByDefault: true,
            levels: [
                { //Tier 1
                    passiveEffects: {
                        multiplier: {
                            movementSpeed: 1.0,
                            damage: {value: 0.95, limitation: "stopped"}, // -5% damage while standing still.
                        }
                    }
                },
                { //Tier 2
                    passiveEffects: {
                        multiplier: {
                            movementSpeed: 1.1,
                            damage: {value: 0.9, limitation: "stopped"}, // -10% damage while standing still.
                        }
                    }
                },
                { //Tier 3
                    passiveEffects: {
                        multiplier: {
                            movementSpeed: 1.15,
                            damage: {value: 0.85, limitation: "stopped"}, // -15% damage while standing still.
                        }
                    }
                },
                { //Tier 4
                    passiveEffects: {
                        multiplier: {
                            movementSpeed: 1.25,
                            damage: {value: 0.75, limitation: "stopped"}, // -25% damage while standing still.
                        }
                    }
                },
                { //Tier 5
                    passiveEffects: {
                        multiplier: {
                            movementSpeed: 1.5,
                            damage: {value: 0.75, limitation: "stopped"}, // -25% damage while standing still.
                        }
                    }
                },
            ]
        },
        "Screwdriver": {
            image: "Screwdriver.png",
            rarity: CardRarity.RARE,
            name: "Screwdriver",
            levels: [
                { //Tier 1
                    passiveEffects: {
                        multiplier: {
                            //TODO: +1% attack speed every time you kill an enemy (resets each room).
                        }
                    }
                },
                { //Tier 2
                    passiveEffects: {
                        multiplier: {
                            //TODO: +2% attack speed every time you kill an enemy (resets each room).
                        }
                    }
                },
                { //Tier 3
                    passiveEffects: {
                        multiplier: {
                            //TODO: +3% attack speed every time you kill an enemy (resets each room).
                        }
                    }
                },
                { //Tier 4
                    passiveEffects: {
                        multiplier: {
                            //TODO: +5% attack speed every time you kill an enemy (resets each room).
                        }
                    }
                },
                { //Tier 5
                    passiveEffects: {
                        multiplier: {
                            //TODO: +1% permanent attack speed every time you kill an enemy.
                        }
                    }
                },
            ]
        },
        "Bucket": {
            image: "Bucket.png",
            rarity: CardRarity.RARE,
            name: "Bucket",
            levels: [
                { //Tier 1
                    passiveEffects: {
                        //TODO: Negates the first 1 instance of damage per room.
                    }
                },
                { //Tier 2
                    passiveEffects: {
                        //TODO: Negates the first 2 instances of damage per room.
                    }
                },
                { //Tier 3
                    passiveEffects: {
                        //TODO: Negates the first 3 instances of damage per room.
                    }
                },
                { //Tier 4
                    passiveEffects: {
                        //TODO: Negates the first 4 instances of damage per room.
                    }
                },
                { //Tier 5
                    passiveEffects: {
                        //TODO: Negates the next 4 instances of damage every new room (stays inbetween rooms).
                    }
                },
            ]
        },
        "Riot Shield": {
            image: "RiotShield.png",
            rarity: CardRarity.RARE,
            name: "Riot Shield",
            levels: [
                { //Tier 1
                    passiveEffects: {
                        multiplier: {
                            //TODO: +10% chance to reflect projectiles.
                        }
                    }
                },
                { //Tier 2
                    passiveEffects: {
                        multiplier: {
                            //TODO: +15% chance to reflect projectiles.
                        }
                    }
                },
                { //Tier 3
                    passiveEffects: {
                        multiplier: {
                            //TODO: +25% chance to reflect projectiles.
                        }
                    }
                },
                { //Tier 4
                    passiveEffects: {
                        multiplier: {
                            //TODO: +35% chance to reflect projectiles.
                        }
                    }
                },
                { //Tier 5
                    passiveEffects: {
                        multiplier: {
                            //TODO: +50% chance to reflect projectiles.
                        }
                    }
                },
            ]
        },
        // ---EPIC---EPIC---EPIC---EPIC---EPIC---EPIC---EPIC---EPIC---EPIC---EPIC---EPIC---EPIC---
        "Piercing Gun": {
            image: "PiercingGun.png",
            rarity: CardRarity.EPIC,
            name: "Piercing Gun",
            unlockByDefault: true,
            levels: [
                { //Tier 1
                    passiveEffects: {
                        absolute: {
                            projectilePiercing: 1
                        }
                    }
                },
                { //Tier 2
                    passiveEffects: {
                        absolute: {
                            projectilePiercing: 2
                        }
                    }
                },
                { //Tier 3
                    passiveEffects: {
                        absolute: {
                            projectilePiercing: 3
                        }
                    }
                },
                { //Tier 4
                    passiveEffects: {
                        absolute: {
                            projectilePiercing: 4
                        }
                    }
                },
                { //Tier 5
                    passiveEffects: {
                        absolute: {
                            projectilePiercing: 6
                        }
                    }
                },
            ]
        },
        "Stopwatch": {
            image: "Stopwatch.png",
            rarity: CardRarity.EPIC,
            name: "Stopwatch",
            levels: [
                { //Tier 1
                    passiveEffects: {
                        //TODO: Stuns 1 random enemy for 1 second everytime you take damage.
                    }
                },
                { //Tier 2
                    passiveEffects: {
                        //TODO: Stuns 2 random enemies for 1 second everytime you take damage.
                    }
                },
                { //Tier 3
                    passiveEffects: {
                        //TODO: Stuns 3 random enemies for 1.5 seconds everytime you take damage.
                    }
                },
                { //Tier 4
                    passiveEffects: {
                        //TODO: Stuns 4 random enemies for 1.5 seconds everytime you take damage.
                    }
                },
                { //Tier 5
                    passiveEffects: {
                        //TODO: Stuns 5 random enemies for 2 seconds everytime you take damage.
                    }
                },
            ]
        },
        "Rake": {
            image: "Rake.png",
            rarity: CardRarity.EPIC,
            name: "Rake",
            levels: [
                { //Tier 1
                    passiveEffects: {
                        multiplier: {
                            //TODO: +10% map size.
                        }
                    }
                },
                { //Tier 2
                    passiveEffects: {
                        multiplier: {
                            //TODO: +15% map size.
                        }
                    }
                },
                { //Tier 3
                    passiveEffects: {
                        multiplier: {
                            //TODO: +25% map size.
                        }
                    }
                },
                { //Tier 4
                    passiveEffects: {
                        multiplier: {
                            //TODO: +35% map size.
                        }
                    }
                },
                { //Tier 5
                    passiveEffects: {
                        multiplier: {
                            //TODO: +50% map size.
                        }
                    }
                },
            ]
        },
        "Jumper Cable": {
            image: "JumperCable.png",
            rarity: CardRarity.EPIC,
            name: "Jumper Cable",
            levels: [
                { //Tier 1
                    passiveEffects: {
                        multiplier: {
                            //TODO: Heal 1% of the damage you deal.
                        }
                    }
                },
                { //Tier 2
                    passiveEffects: {
                        multiplier: {
                            //TODO: Heal 2% of the damage you deal.
                        }
                    }
                },
                { //Tier 3
                    passiveEffects: {
                        multiplier: {
                            //TODO: Heal 5% of the damage you deal.
                        }
                    }
                },
                { //Tier 4
                    passiveEffects: {
                        multiplier: {
                            //TODO: Heal 15% of the damage you deal.
                        }
                    }
                },
                { //Tier 5
                    passiveEffects: {
                        multiplier: {
                            //TODO: Heal 30% of the damage you deal.
                        }
                    }
                },
            ]
        },
        "Shredder": {
            image: "Shredder.png",
            rarity: CardRarity.EPIC,
            name: "Shredder",
            unlockByDefault: true,
            levels: [
                { //Tier 1
                    passiveEffects: {
                        multiplier: {
                            damage: 1.1,
                            damageReduction: 1.1
                        }
                    }
                },
                { //Tier 2
                    passiveEffects: {
                        multiplier: {
                            damage: 1.25,
                            damageReduction: 1.25
                        }
                    }
                },
                { //Tier 3
                    passiveEffects: {
                        multiplier: {
                            damage: 1.4,
                            damageReduction: 1.4
                        }
                    }
                },
                { //Tier 4
                    passiveEffects: {
                        multiplier: {
                            damage: 1.6,
                            damageReduction: 1.6
                        }
                    }
                },
                { //Tier 5
                    passiveEffects: {
                        multiplier: {
                            damage: 2,
                            damageReduction: 2
                        }
                    }
                },
            ]
        },
        "Whiteboard": {
            image: "Whiteboard.png",
            rarity: CardRarity.EPIC,
            name: "Whiteboard",
            levels: [
                { //Tier 1
                    passiveEffects: {
                        multiplier: {
                            //TODO: -30% all stats, +1% all stats per level on your equipped cards.
                        }
                    }
                },
                { //Tier 2
                    passiveEffects: {
                        multiplier: {
                            //TODO: -20% all stats, +1% all stats per level on your equipped cards.
                        }
                    }
                },
                { //Tier 3
                    passiveEffects: {
                        multiplier: {
                            //TODO: -60% all stats, +2% all stats per level on your equipped cards.
                        }
                    }
                },
                { //Tier 4
                    passiveEffects: {
                        multiplier: {
                            //TODO: -40% all stats, +2% all stats per level on your equipped cards.
                        }
                    }
                },
                { //Tier 5
                    passiveEffects: {
                        multiplier: {
                            //TODO: -90% all stats, +3% all stats per level on your equipped cards.
                        }
                    }
                },
            ]
        },
        "Drawing Tablet": {
            image: "DrawingTablet.png",
            rarity: CardRarity.EPIC,
            name: "Drawing Tablet",
            unlockByDefault: true,
            levels: [
                { //Tier 1
                    passiveEffects: {
                        absolute: {
                            projectileAmount: 1
                        }
                    }
                },
                { //Tier 2
                    passiveEffects: {
                        absolute: {
                            projectileAmount: 1
                        }
                    }
                },
                { //Tier 3
                    passiveEffects: {
                        absolute: {
                            projectileAmount: 2
                        }
                    }
                },
                { //Tier 4
                    passiveEffects: {
                        absolute: {
                            projectileAmount: 3
                        }
                    }
                },
                { //Tier 5
                    passiveEffects: {
                        absolute: {
                            projectileAmount: 4
                        }
                    }
                },
            ]
        },
        "Press Vest": {
            image: "PressVest.png",
            rarity: CardRarity.EPIC,
            name: "Press Vest",
            levels: [
                { //Tier 1
                    passiveEffects: {
                        multiplier: {
                            //TODO: +1% Damage resistance per current movement speed (maximum 60%).
                        }
                    }
                },
                { //Tier 2
                    passiveEffects: {
                        multiplier: {
                            //TODO: +2% Damage resistance per current movement speed (maximum 65%).
                        }
                    }
                },
                { //Tier 3
                    passiveEffects: {
                        multiplier: {
                            //TODO: +3% Damage resistance per current movement speed (maximum 70%).
                        }
                    }
                },
                { //Tier 4
                    passiveEffects: {
                        multiplier: {
                            //TODO: +5% Damage resistance per current movement speed (maximum 75%).
                        }
                    }
                },
                { //Tier 5
                    passiveEffects: {
                        multiplier: {
                            //TODO: +8% Damage resistance per current movement speed (maximum 90%).
                        }
                    }
                },
            ]
        },
        "Tong": {
            image: "Tong.png",
            rarity: CardRarity.EPIC,
            name: "Tong",
            unlockByDefault: true,
            levels: [
                { //Tier 1
                    passiveEffects: {
                        multiplier: {
                            cooldownReduction: {value: 1 / 1.2, limitation: "stopped"} // +20% attack speed while standing still.
                        }
                    }
                },
                { //Tier 2
                    passiveEffects: {
                        multiplier: {
                            cooldownReduction: {value: 1 / 1.3, limitation: "stopped"} // +30% attack speed while standing still.
                        }
                    }
                },
                { //Tier 3
                    passiveEffects: {
                        multiplier: {
                            cooldownReduction: {value: 1 / 1.4, limitation: "stopped"} // +40% attack speed while standing still.
                        }
                    }
                },
                { //Tier 4
                    passiveEffects: {
                        multiplier: {
                            cooldownReduction: {value: 1 / 1.6, limitation: "stopped"} // +60% attack speed while standing still.
                        }
                    }
                },
                { //Tier 5
                    passiveEffects: {
                        multiplier: {
                            cooldownReduction: {value: 1 / 2, limitation: "stopped"} // +100% attack speed while standing still.
                        }
                    }
                },
            ]
        },
        "High-Vis West": {
            image: "HighVisWest.png",
            rarity: CardRarity.EPIC,
            name: "High-Vis West",
            levels: [
                { //Tier 1
                    passiveEffects: {
                        multiplier: {
                            //TODO: 20% chance to deal received damage back to enemies.
                        }
                    }
                },
                { //Tier 2
                    passiveEffects: {
                        multiplier: {
                            //TODO: 30% chance to deal received damage back to enemies.
                        }
                    }
                },
                { //Tier 3
                    passiveEffects: {
                        multiplier: {
                            //TODO: 40% chance to deal received damage back to enemies.
                        }
                    }
                },
                { //Tier 4
                    passiveEffects: {
                        multiplier: {
                            //TODO: 60% chance to deal received damage back to enemies.
                        }
                    }
                },
                { //Tier 5
                    passiveEffects: {
                        multiplier: {
                            //TODO: 100% chance to deal received damage back to enemies.
                        }
                    }
                },
            ]
        },
        // ---LEGENDARY---LEGENDARY---LEGENDARY---LEGENDARY---LEGENDARY---LEGENDARY---LEGENDARY---LEGENDARY---LEGENDARY---LEGENDARY---LEGENDARY---LEGENDARY---
        "Apprenticeship": {
            image: "Apprenticeship.gif",
            rarity: CardRarity.LEGENDARY,
            name: "Apprenticeship",
            levels: [
                { //Tier 5
                    passiveEffects: {
                        multiplier: {
                            //TODO: +25% all stats.
                        }
                    }
                },
            ]
        },
        "Diploma": {
            image: "Diploma.gif",
            rarity: CardRarity.LEGENDARY,
            name: "Diploma",
            levels: [
                { //Tier 5
                    passiveEffects: {
                        multiplier: {
                            //TODO: -50% on all stats, but every cleared room has a 10% chance to drop a booster pack (+10% per cleared room).
                        }
                    }
                },
            ]
        },
        "Internship": {
            image: "Internship.gif",
            rarity: CardRarity.LEGENDARY,
            name: "Internship",
            levels: [
                { //Tier 5
                    passiveEffects: {
                        multiplier: {
                            //TODO: Every job gets +1 for their set.
                        }
                    }
                },
            ]
        },
        "Certification": {
            image: "Certification.gif",
            rarity: CardRarity.LEGENDARY,
            name: "Certification",
            levels: [
                { //Tier 5
                    passiveEffects: {
                        multiplier: {
                            //TODO: Rerolls every outcome twice and takes the better option.
                        }
                    }
                },
            ]
        },
        "Training": {
            image: "Training.gif",
            rarity: CardRarity.LEGENDARY,
            name: "Training",
            unlockByDefault: true,
            levels: [
                { //Tier 5
                    passiveEffects: {
                        multiplier: {
                            health: 2
                        }
                    }
                },
            ]
        },

    }
}