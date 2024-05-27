/// <reference path="../Types.ts" />
namespace Script {
    export const cards: Cards = {
        // ---COMMON---COMMON---COMMON---COMMON---COMMON---COMMON---COMMON---COMMON---COMMON---COMMON---COMMON---COMMON---
        "Hammer": {
            image: "Hammer.png",
            rarity: CardRarity.COMMON,
            name: "Hammer",
            levels: [
                { //Tier 1
                    activeEffects: [{
                        type: "projectile",
                        projectile: "hammerPlayer",
                        amount: 1,
                        cooldown: 2
                    }],
                    passiveEffects: {
                        absolute: {
                            damage: 0, //8 Base Damage
                            projectilePiercing: 2
                        }
                    }
                },
                { //Tier 2
                    activeEffects: [{
                        type: "projectile",
                        projectile: "hammerPlayer",
                        amount: 1,
                        cooldown: 2,
                    }],
                    passiveEffects: {
                        absolute: {
                            damage: 4, //8 Base Damage
                            projectilePiercing: 2
                        }
                    }
                },
                { //Tier 3
                    activeEffects: [{
                        type: "projectile",
                        projectile: "hammerPlayer",
                        amount: 2,
                        cooldown: 2,
                    }],
                    passiveEffects: {
                        absolute: {
                            damage: 4, //8 Base Damage
                            projectilePiercing: 2
                        }
                    }
                },
                { //Tier 4
                    activeEffects: [{
                        type: "projectile",
                        projectile: "hammerPlayer",
                        amount: 2,
                        cooldown: 2,
                    }],
                    passiveEffects: {
                        absolute: {
                            damage: 7, //8 Base Damage
                            projectilePiercing: 3
                        }
                    }
                },
                { //Tier 5
                    activeEffects: [{
                        type: "projectile",
                        projectile: "hammerPlayer",
                        amount: 2,
                        cooldown: 1.5,
                    }],
                    passiveEffects: {
                        absolute: {
                            damage: 7, //8 Base Damage
                            projectilePiercing: 4
                        }
                    }
                },
            ]
        },
        "Anvil": {
            image: "Anvil.png",
            rarity: CardRarity.COMMON,
            name: "Anvil",
            levels: [
                { //Tier 1
                    activeEffects: [{
                        type: "projectile",
                        projectile: "anvilPlayer",
                        amount: 1,
                        cooldown: 3,
                    }],
                    passiveEffects: {
                        absolute: {
                            damage: 0 //10 Base Damage
                        }
                    }
                },
                { //Tier 2
                    activeEffects: [{
                        type: "projectile",
                        projectile: "anvilPlayer",
                        amount: 1,
                        cooldown: 3,
                    }],
                    passiveEffects: {
                        absolute: {
                            damage: 4 //10 Base Damage
                        }
                    }
                },
                { //Tier 3
                    activeEffects: [{
                        type: "projectile",
                        projectile: "anvilPlayer",
                        amount: 2,
                        cooldown: 3,
                    }],
                    passiveEffects: {
                        absolute: {
                            damage: 4 //10 Base Damage
                        }
                    }
                },
                { //Tier 4
                    activeEffects: [{
                        type: "projectile",
                        projectile: "anvilPlayer",
                        amount: 2,
                        cooldown: 3,
                    }],
                    passiveEffects: {
                        absolute: {
                            damage: 10 //10 Base Damage
                        }
                    }
                },
                { //Tier 5
                    activeEffects: [{
                        type: "projectile",
                        projectile: "anvilPlayer",
                        amount: 3,
                        cooldown: 2,
                    }],
                    passiveEffects: {
                        absolute: {
                            damage: 10 //10 Base Damage
                        }
                    }
                },
            ]
        },
        "Pen": {
            image: "Pen.png",
            rarity: CardRarity.COMMON,
            name: "Pen",
            levels: [
                { //Tier 1
                    activeEffects: [{
                        type: "projectile",
                        projectile: "penPlayer",
                        amount: 1,
                        cooldown: 0.5,
                    }],
                    passiveEffects: {
                        absolute: {
                            damage: 0 //2 Base Damage
                        }
                    }
                },
                { //Tier 2
                    activeEffects: [{
                        type: "projectile",
                        projectile: "penPlayer",
                        amount: 1,
                        cooldown: 0.5,
                    }],
                    passiveEffects: {
                        absolute: {
                            damage: 2 //2 Base Damage
                        }
                    }
                },
                { //Tier 3
                    activeEffects: [{
                        type: "projectile",
                        projectile: "penPlayer",
                        amount: 2,
                        cooldown: 0.5,
                    }],
                    passiveEffects: {
                        absolute: {
                            damage: 2 //2 Base Damage
                        }
                    }
                },
                { //Tier 4
                    activeEffects: [{
                        type: "projectile",
                        projectile: "penPlayer",
                        amount: 2,
                        cooldown: 0.5,
                    }],
                    passiveEffects: {
                        absolute: {
                            damage: 4 //2 Base Damage
                        }
                    }
                },
                { //Tier 5
                    activeEffects: [{
                        type: "projectile",
                        projectile: "penPlayer",
                        amount: 3,
                        cooldown: 0.4,
                    }],
                    passiveEffects: {
                        absolute: {
                            damage: 4 //2 Base Damage
                        }
                    }
                },
            ]
        },
        "Lightbulb": {
            image: "Bulb.png",
            rarity: CardRarity.COMMON,
            name: "Lightbulb",
            levels: [
                { //Tier 1
                    activeEffects: [{
                        type: "aoe",
                        aoe: "lightbulbPlayer",
                        cooldown: 5,
                    }],
                    passiveEffects: {
                        absolute: {
                            damage: 0, //5 Base Damage
                            effectDuration: 0 //1 Base Duration
                        }
                    }
                },
                { //Tier 2
                    activeEffects: [{
                        type: "aoe",
                        aoe: "lightbulbPlayer",
                        cooldown: 5,
                    }],
                    passiveEffects: {
                        absolute: {
                            damage: 1, //5 Base Damage
                            effectDuration: 0 //1 Base Duration
                        }
                    }
                },
                { //Tier 3
                    activeEffects: [{
                        type: "aoe",
                        aoe: "lightbulbPlayer",
                        cooldown: 5,
                    }],
                    passiveEffects: {
                        absolute: {
                            damage: 1, //5 Base Damage
                            effectDuration: 0.5 //1 Base Duration
                        }
                    }
                },
                { //Tier 4
                    activeEffects: [{
                        type: "aoe",
                        aoe: "lightbulbPlayer",
                        cooldown: 4,
                    }],
                    passiveEffects: {
                        absolute: {
                            damage: 1, //5 Base Damage
                            effectDuration: 0.5 //1 Base Duration
                        }
                    }
                },
                { //Tier 5
                    activeEffects: [{
                        type: "aoe",
                        aoe: "lightbulbPlayer",
                        cooldown: 4,
                    }],
                    passiveEffects: {
                        absolute: {
                            damage: 3, //5 Base Damage
                            effectDuration: 1 //1 Base Duration
                        }
                    }
                },
            ]
        },
        "Smoke Mask": {
            image: "SmokeMask.png",
            rarity: CardRarity.COMMON,
            name: "Smoke Mask",
            levels: [
                { //Tier 1
                    activeEffects: [{
                        type: "aoe",
                        aoe: "smokeMaskPlayer",
                        cooldown: 2,
                    }],
                    passiveEffects: {
                        absolute: {
                            damage: 0 //2 Base Damage
                        }
                    }
                },
                { //Tier 2
                    activeEffects: [{
                        type: "aoe",
                        aoe: "smokeMaskPlayer",
                        cooldown: 2,
                    }],
                    passiveEffects: {
                        absolute: {
                            damage: 1 //2 Base Damage
                        }
                    }
                },
                { //Tier 3
                    activeEffects: [{
                        type: "aoe",
                        aoe: "smokeMaskPlayer",
                        cooldown: 1.5,
                    }],
                    passiveEffects: {
                        absolute: {
                            damage: 1 //2 Base Damage
                        }
                    }
                },
                { //Tier 4
                    activeEffects: [{
                        type: "aoe",
                        aoe: "smokeMaskPlayer",
                        cooldown: 1,
                    }],
                    passiveEffects: {
                        absolute: {
                            damage: 2 //2 Base Damage
                        }
                    }
                },
                { //Tier 5
                    activeEffects: [{
                        type: "aoe",
                        aoe: "smokeMaskPlayer",
                        cooldown: 1,
                    }],
                    passiveEffects: {
                        absolute: {
                            damage: 3, //2 Base Damage
                        },
                        multiplier: {
                            projectileSize: 1.5
                        }
                    }
                },
            ]
        },
        "Discus": {
            image: "Discus.png",
            rarity: CardRarity.COMMON,
            name: "Discus",
            levels: [
                { //Tier 1
                    activeEffects: [{
                        type: "projectile",
                        projectile: "discusPlayer",
                        amount: 1,
                        cooldown: 3,
                    }],
                    passiveEffects: {
                        absolute: {
                            damage: 0 //5 Base Damage
                            //TODO: Add bounces - 2
                        }
                    }
                },
                { //Tier 2
                    activeEffects: [{
                        type: "projectile",
                        projectile: "discusPlayer",
                        amount: 1,
                        cooldown: 3,
                    }],
                    passiveEffects: {
                        absolute: {
                            damage: 3 //5 Base Damage
                            //TODO: Add bounces - 2
                        }
                    }
                },
                { //Tier 3
                    activeEffects: [{
                        type: "projectile",
                        projectile: "discusPlayer",
                        amount: 1,
                        cooldown: 2,
                    }],
                    passiveEffects: {
                        absolute: {
                            damage: 3 //5 Base Damage
                            //TODO: Add bounces - 2
                        }
                    }
                },
                { //Tier 4
                    activeEffects: [{
                        type: "projectile",
                        projectile: "discusPlayer",
                        amount: 1,
                        cooldown: 2,
                    }],
                    passiveEffects: {
                        absolute: {
                            damage: 5 //5 Base Damage
                            //TODO: Add bounces - 3
                        }
                    }
                },
                { //Tier 5
                    activeEffects: [{
                        type: "projectile",
                        projectile: "discusPlayer",
                        amount: 2,
                        cooldown: 2,
                    }],
                    passiveEffects: {
                        absolute: {
                            damage: 5 //5 Base Damage
                            //TODO: Add bounces - 4
                        }
                    }
                },
            ]
        },
        "Civil Code": {
            image: "CivilCode.png",
            rarity: CardRarity.COMMON,
            name: "Civil Code",
            levels: [
                { //Tier 1
                    activeEffects: [{
                        type: "projectile",
                        projectile: "civilCodePlayer",
                        amount: 1,
                        cooldown: 3,
                    }],
                    passiveEffects: {
                        absolute: {
                            damage: 0 //3-30 Base Damage
                            //TODO: More damage depending on distance
                        }
                    }
                },
                { //Tier 2
                    activeEffects: [{
                        type: "projectile",
                        projectile: "civilCodePlayer",
                        amount: 1,
                        cooldown: 3,
                    }],
                    passiveEffects: {
                        absolute: {
                            damage: 0 //4-40 Base Damage
                            //TODO: More damage depending on distance
                        }
                    }
                },
                { //Tier 3
                    activeEffects: [{
                        type: "projectile",
                        projectile: "civilCodePlayer",
                        amount: 1,
                        cooldown: 2.5,
                    }],
                    passiveEffects: {
                        absolute: {
                            damage: 0 //5-50 Base Damage
                            //TODO: More damage depending on distance
                        }
                    }
                },
                { //Tier 4
                    activeEffects: [{
                        type: "projectile",
                        projectile: "civilCodePlayer",
                        amount: 1,
                        cooldown: 2,
                    }],
                    passiveEffects: {
                        absolute: {
                            damage: 0 //6-60 Base Damage
                            //TODO: More damage depending on distance
                        }
                    }
                },
                { //Tier 5
                    activeEffects: [{
                        type: "projectile",
                        projectile: "civilCodePlayer",
                        amount: 2,
                        cooldown: 2,
                    }],
                    passiveEffects: {
                        absolute: {
                            damage: 0 //8-80 Base Damage
                            //TODO: More damage depending on distance
                        }
                    }
                },
            ]
        },
        "Divider": {
            image: "Divider.png",
            rarity: CardRarity.COMMON,
            name: "Divider",
            levels: [
                { //Tier 1
                    activeEffects: [{
                        type: "projectile",
                        projectile: "dividerPlayer",
                        amount: 1,
                        cooldown: 2,
                    }],
                    passiveEffects: {
                        absolute: {
                            damage: 0, //5 Base Damage
                            projectilePiercing: 3
                        }
                    }
                },
                { //Tier 2
                    activeEffects: [{
                        type: "projectile",
                        projectile: "dividerPlayer",
                        amount: 1,
                        cooldown: 2,
                    }],
                    passiveEffects: {
                        absolute: {
                            damage: 2, //5 Base Damage
                            projectilePiercing: 3
                        }
                    }
                },
                { //Tier 3
                    activeEffects: [{
                        type: "projectile",
                        projectile: "dividerPlayer",
                        amount: 2,
                        cooldown: 2,
                    }],
                    passiveEffects: {
                        absolute: {
                            damage: 2, //5 Base Damage
                            projectilePiercing: 3
                        }
                    }
                },
                { //Tier 4
                    activeEffects: [{
                        type: "projectile",
                        projectile: "dividerPlayer",
                        amount: 2,
                        cooldown: 2,
                    }],
                    passiveEffects: {
                        absolute: {
                            damage: 3, //5 Base Damage
                            projectilePiercing: 4
                        }
                    }
                },
                { //Tier 5
                    activeEffects: [{
                        type: "projectile",
                        projectile: "dividerPlayer",
                        amount: 2,
                        cooldown: 2,
                    }],
                    passiveEffects: {
                        absolute: {
                            damage: 5, //5 Base Damage
                            projectilePiercing: 6
                        }
                    }
                },
            ]
        },
        "Needles": {
            image: "Needles.png",
            rarity: CardRarity.COMMON,
            name: "Needles",
            levels: [
                { //Tier 1
                    activeEffects: [{
                        type: "projectile",
                        projectile: "needlePlayer",
                        amount: 1,
                        cooldown: 5, //TODO: Leave a projectile every 5 units moved
                    }],
                    passiveEffects: {
                        absolute: {
                            damage: 0, //5 Base Damage
                        }
                    }
                },
                { //Tier 2
                    activeEffects: [{
                        type: "projectile",
                        projectile: "needlePlayer",
                        amount: 1,
                        cooldown: 4, //TODO: Leave a projectile every 4 units moved
                    }],
                    passiveEffects: {
                        absolute: {
                            damage: 1, //5 Base Damage
                        }
                    }
                },
                { //Tier 3
                    activeEffects: [{
                        type: "projectile",
                        projectile: "needlePlayer",
                        amount: 1,
                        cooldown: 4, //TODO: Leave a projectile every 4 units moved
                    }],
                    passiveEffects: {
                        absolute: {
                            damage: 3, //5 Base Damage
                        }
                    }
                },
                { //Tier 4
                    activeEffects: [{
                        type: "projectile",
                        projectile: "needlePlayer",
                        amount: 1,
                        cooldown: 3, //TODO: Leave a projectile every 3 units moved
                    }],
                    passiveEffects: {
                        absolute: {
                            damage: 3, //5 Base Damage
                        }
                    }
                },
                { //Tier 5
                    activeEffects: [{
                        type: "projectile",
                        projectile: "needlePlayer",
                        amount: 1,
                        cooldown: 2, //TODO: Leave a projectile every 2 units moved
                    }],
                    passiveEffects: {
                        absolute: {
                            damage: 5, //5 Base Damage
                        }
                    }
                },
            ]
        },
        "Chisel": {
            image: "Chisel.png",
            rarity: CardRarity.COMMON,
            name: "Chisel",
            levels: [
                { //Tier 1
                    activeEffects: [{
                        type: "projectile",
                        projectile: "chiselPlayer",
                        amount: 1,
                        cooldown: 2
                    }],
                    passiveEffects: {
                        absolute: {
                            damage: 0, //15 Base Damage
                        }
                    }
                },
                { //Tier 2
                    activeEffects: [{
                        type: "projectile",
                        projectile: "chiselPlayer",
                        amount: 1,
                        cooldown: 2
                    }],
                    passiveEffects: {
                        absolute: {
                            damage: 10, //15 Base Damage
                        }
                    }
                },
                { //Tier 3
                    activeEffects: [{
                        type: "projectile",
                        projectile: "chiselPlayer",
                        amount: 2,
                        cooldown: 2
                    }],
                    passiveEffects: {
                        absolute: {
                            damage: 10, //15 Base Damage
                        }
                    }
                },
                { //Tier 4
                    activeEffects: [{
                        type: "projectile",
                        projectile: "chiselPlayer",
                        amount: 2,
                        cooldown: 2
                    }],
                    passiveEffects: {
                        absolute: {
                            damage: 20, //15 Base Damage
                        }
                    }
                },
                { //Tier 5
                    activeEffects: [{
                        type: "projectile",
                        projectile: "chiselPlayer",
                        amount: 2,
                        cooldown: 1.5
                    }],
                    passiveEffects: {
                        absolute: {
                            damage: 25, //15 Base Damage
                        }
                    }
                },
            ]
        },
        "Helmet": {
            image: "Helmet.png",
            rarity: CardRarity.COMMON,
            name: "Helmet",
            levels: [
                { //Tier 1
                    passiveEffects: {
                        multiplier: {
                            damageReduction: 0.9 //TODO: Less Damage from projectiles
                        }
                    }
                },
                { //Tier 2
                    passiveEffects: {
                        multiplier: {
                            damageReduction: 0.8 //TODO: Less Damage from projectiles
                        }
                    }
                },
                { //Tier 3
                    passiveEffects: {
                        multiplier: {
                            damageReduction: 0.7 //TODO: Less Damage from projectiles
                        }
                    }
                },
                { //Tier 4
                    passiveEffects: {
                        multiplier: {
                            damageReduction: 0.6 //TODO: Less Damage from projectiles
                        }
                    }
                },
                { //Tier 5
                    passiveEffects: {
                        multiplier: {
                            damageReduction: 0.4 //TODO: Less Damage from projectiles
                        }
                    }
                },
            ]
        },
        "Safety Boots": {
            image: "SafetyBoots.png",
            rarity: CardRarity.COMMON,
            name: "Safety Boots",
            levels: [
                { //Tier 1
                    passiveEffects: {
                        multiplier: {
                            damageReduction: 0.9 //TODO: More resistant against ground effects
                        }
                    }
                },
                { //Tier 2
                    passiveEffects: {
                        multiplier: {
                            damageReduction: 0.8 //TODO: More resistant against ground effects
                        }
                    }
                },
                { //Tier 3
                    passiveEffects: {
                        multiplier: {
                            damageReduction: 0.7 //TODO: More resistant against ground effects
                        }
                    }
                },
                { //Tier 4
                    passiveEffects: {
                        multiplier: {
                            damageReduction: 0.6 //TODO: More resistant against ground effects
                        }
                    }
                },
                { //Tier 5
                    passiveEffects: {
                        multiplier: {
                            damageReduction: 0.4 //TODO: More resistant against ground effects
                        }
                    }
                },
            ]
        },
        "Microphone": {
            image: "Microphone.png",
            rarity: CardRarity.COMMON,
            name: "Microphone",
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
            levels: [
                { //Tier 1
                    passiveEffects: {
                        multiplier: {
                            movementSpeed: 1.05,
                        }
                    }
                },
                { //Tier 2
                    passiveEffects: {
                        multiplier: {
                            movementSpeed: 1.15,
                        }
                    }
                },
                { //Tier 3
                    passiveEffects: {
                        multiplier: {
                            movementSpeed: 1.3,
                        }
                    }
                },
                { //Tier 4
                    passiveEffects: {
                        multiplier: {
                            movementSpeed: 1.5,
                        }
                    }
                },
                { //Tier 5
                    passiveEffects: {
                        multiplier: {
                            movementSpeed: 1.75,
                        }
                    }
                },
            ]
        },
        "Disposable Gloves": {
            image: "",
            rarity: CardRarity.COMMON,
            name: "Disposable Gloves",
            levels: [
                { //Tier 1
                    passiveEffects: {
                        absolute: {
                            damageReduction: 1
                        }
                    }
                },
                { //Tier 2
                    passiveEffects: {
                        absolute: {
                            damageReduction: 2
                        }
                    }
                },
                { //Tier 3
                    passiveEffects: {
                        absolute: {
                            damageReduction: 4
                        }
                    }
                },
                { //Tier 4
                    passiveEffects: {
                        absolute: {
                            damageReduction: 6
                        }
                    }
                },
                { //Tier 5
                    passiveEffects: {
                        absolute: {
                            damageReduction: 10
                        }
                    }
                },
            ]
        },
        "Printer": {
            image: "Printer.png",
            rarity: CardRarity.COMMON,
            name: "Printer",
            levels: [
                { //Tier 1
                    passiveEffects: {
                        multiplier: {
                            //TODO: +5% increased XP
                        }
                    }
                },
                { //Tier 2
                    passiveEffects: {
                        multiplier: {
                            //TODO: +10% increased XP
                        }
                    }
                },
                { //Tier 3
                    passiveEffects: {
                        multiplier: {
                            //TODO: +25% increased XP
                        }
                    }
                },
                { //Tier 4
                    passiveEffects: {
                        multiplier: {
                            //TODO: +40% increased XP
                        }
                    }
                },
                { //Tier 5
                    passiveEffects: {
                        multiplier: {
                            //TODO: +60% increased XP
                        }
                    }
                },
            ]
        }, "Solar Panel": {
            image: "SolarPanel.png",
            rarity: CardRarity.COMMON,
            name: "Solar Panel",
            levels: [
                { //Tier 1
                    passiveEffects: {
                        absolute: {
                            regeneration: 0.5,
                        }
                    }
                },
                { //Tier 2
                    passiveEffects: {
                        absolute: {
                            regeneration: 1,
                        }
                    }
                },
                { //Tier 3
                    passiveEffects: {
                        absolute: {
                            regeneration: 2,
                        }
                    }
                },
                { //Tier 4
                    passiveEffects: {
                        absolute: {
                            regeneration: 4,
                        }
                    }
                },
                { //Tier 5
                    passiveEffects: {
                        absolute: {
                            regeneration: 7,
                        }
                    }
                },
            ]
        },
        "Drone": {
            image: "Drone.png",
            rarity: CardRarity.COMMON,
            name: "Drone",
            levels: [
                { //Tier 1
                    passiveEffects: {
                        multiplier: {
                            //TODO: +5% increased field of view (camera zoom)
                        }
                    }
                },
                { //Tier 2
                    passiveEffects: {
                        multiplier: {
                            //TODO: +10% increased field of view (camera zoom)
                        }
                    }
                },
                { //Tier 3
                    passiveEffects: {
                        multiplier: {
                            //TODO: +20% increased field of view (camera zoom)
                        }
                    }
                },
                { //Tier 4
                    passiveEffects: {
                        multiplier: {
                            //TODO: +35% increased field of view (camera zoom)
                        }
                    }
                },
                { //Tier 5
                    passiveEffects: {
                        multiplier: {
                            //TODO: +50% increased field of view (camera zoom)
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
            levels: []
        },
        "Fire Hose": {
            image: "FireHose.png",
            rarity: CardRarity.UNCOMMON,
            name: "Fire Hose",
            levels: []
        },
        "Syrringe": {
            image: "Syrringe.png",
            rarity: CardRarity.UNCOMMON,
            name: "Syrringe",
            levels: []
        },
        "Sketchbook": {
            image: "Sketchbook.png",
            rarity: CardRarity.UNCOMMON,
            name: "Sketchbook",
            levels: []
        },
        "...": {
            image: "",
            rarity: CardRarity.UNCOMMON,
            name: "noo name lol",
            levels: []
        },
        "Jump Rope": {
            image: "JumpRope.png",
            rarity: CardRarity.UNCOMMON,
            name: "Jump Rope",
            levels: []
        },
        "Tape Measure": {
            image: "TapeMeasure.png",
            rarity: CardRarity.UNCOMMON,
            name: "Tape Measure",
            levels: []
        },
        "LegalWig": {
            image: "LegalWig.png",
            rarity: CardRarity.UNCOMMON,
            name: "Legal Wig",
            levels: []
        },
        "Toolbelt": {
            image: "Toolbelt.png",
            rarity: CardRarity.UNCOMMON,
            name: "Toolbelt",
            levels: []
        },
        ".....": {
            image: "",
            rarity: CardRarity.UNCOMMON,
            name: "no name looooool",
            levels: []
        },
        "......": {
            image: "",
            rarity: CardRarity.UNCOMMON,
            name: "no name loooooooool",
            levels: []
        },
        "Binder": {
            image: "Binder.png",
            rarity: CardRarity.UNCOMMON,
            name: "Binder",
            levels: []
        },
        ".......": {
            image: "",
            rarity: CardRarity.UNCOMMON,
            name: "no name loooooooooool",
            levels: []
        },
        "Hard Drive": {
            image: "HardDrive.png",
            rarity: CardRarity.UNCOMMON,
            name: "Hard Drive",
            levels: []
        },
        "........": {
            image: "",
            rarity: CardRarity.UNCOMMON,
            name: "no name looooooooooooooooooooooool",
            levels: []
        },
        "Apple": {
            image: "Apple.png",
            rarity: CardRarity.UNCOMMON,
            name: "Apple",
            levels: []
        },
        // ---RARE---RARE---RARE---RARE---RARE---RARE---RARE---RARE---RARE---RARE---RARE---RARE---
        "Magnifying Glas": {
            image: "MagnifyingGlas.png",
            rarity: CardRarity.RARE,
            name: "Magnifying Glas",
            levels: []
        },
        "Tattoo Ink": {
            image: "TatooInk.png",
            rarity: CardRarity.RARE,
            name: "Tattoo Ink",
            levels: []
        },
        "Calculator": {
            image: "Calculator.png",
            rarity: CardRarity.RARE,
            name: "Calculator",
            levels: []
        },
        "Bandages": {
            image: "Bandages.png",
            rarity: CardRarity.RARE,
            name: "Bandages",
            levels: []
        },
        "Face Shield": {
            image: "FaceShield.png",
            rarity: CardRarity.RARE,
            name: "Face Shield",
            levels: []
        },
        "3D Printer": {
            image: "3DPrinter.png",
            rarity: CardRarity.RARE,
            name: "3D Printer",
            levels: []
        },
        "Ear Protection": {
            image: "EarProtection.png",
            rarity: CardRarity.RARE,
            name: "Ear Protection",
            levels: []
        },
        "Athletic": {
            image: "Athletic.png",
            rarity: CardRarity.RARE,
            name: "Athletic",
            levels: []
        },
        "Newspaper": {
            image: "Newspaper.png",
            rarity: CardRarity.RARE,
            name: "Newspaper",
            levels: []
        },
        "Screwdriver": {
            image: "Screwdriver.png",
            rarity: CardRarity.RARE,
            name: "Screwdriver",
            levels: []
        },
        "Bucket": {
            image: "Bucket.png",
            rarity: CardRarity.RARE,
            name: "Bucket",
            levels: []
        },
        "Riot Shields": {
            image: "RiotShields.png",
            rarity: CardRarity.RARE,
            name: "Riot Shields",
            levels: []
        },
        // ---EPIC---EPIC---EPIC---EPIC---EPIC---EPIC---EPIC---EPIC---EPIC---EPIC---EPIC---EPIC---
        "Piercing Gun": {
            image: "PiercingGun.png",
            rarity: CardRarity.EPIC,
            name: "Piercing Gun",
            levels: []
        },
        "Stopwatch": {
            image: "Stopwatch.png",
            rarity: CardRarity.EPIC,
            name: "Stopwatch",
            levels: []
        },
        "Rake": {
            image: "Rake.png",
            rarity: CardRarity.EPIC,
            name: "Rake",
            levels: []
        },
        "Jumper Cable": {
            image: "Jumper Cable.png",
            rarity: CardRarity.EPIC,
            name: "Jumper Cable",
            levels: []
        },
        "Shredder": {
            image: "Shredder.png",
            rarity: CardRarity.EPIC,
            name: "Shredder",
            levels: []
        },
        "Whiteboard": {
            image: "Whiteboard.png",
            rarity: CardRarity.EPIC,
            name: "Whiteboard",
            levels: []
        },
        "Drawing Table": {
            image: "Drawingtable.png",
            rarity: CardRarity.EPIC,
            name: "DrawingTable",
            levels: []
        },
        "Press Vest": {
            image: "PressVest.png",
            rarity: CardRarity.EPIC,
            name: "Press Vest",
            levels: []
        },
        "Tong": {
            image: "Tong.png",
            rarity: CardRarity.EPIC,
            name: "Tong",
            levels: []
        },
        "High-Vis West": {
            image: "HighVisWest.png",
            rarity: CardRarity.EPIC,
            name: "High-Vis West",
            levels: []
        },
        // ---LEGENDARY---LEGENDARY---LEGENDARY---LEGENDARY---LEGENDARY---LEGENDARY---LEGENDARY---LEGENDARY---LEGENDARY---LEGENDARY---LEGENDARY---LEGENDARY---
        "Apprenticeship": {
            image: "Apprenticeship.png",
            rarity: CardRarity.LEGENDARY,
            name: "Apprenticeship",
            levels: []
        },
        "Diploma": {
            image: "Diploma.png",
            rarity: CardRarity.LEGENDARY,
            name: "Diploma",
            levels: []
        },
        "Internship": {
            image: "Internship.png",
            rarity: CardRarity.LEGENDARY,
            name: "Internship",
            levels: []
        },
        "Certification": {
            image: "Certification.png",
            rarity: CardRarity.LEGENDARY,
            name: "Certification",
            levels: []
        },
        "Training": {
            image: "Training.gif",
            rarity: CardRarity.LEGENDARY,
            name: "Training",
            levels: []
        },

    }
}