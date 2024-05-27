/// <reference path="../Types.ts" />
namespace Script {
    export const cards: Cards = {
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
            levels: []
        },
        "Safety Boots": {
            image: "SafetyBoots.png",
            rarity: CardRarity.COMMON,
            name: "Safety Boots",
            levels: []
        },
        "Microphone": {
            image: "Microphone.png",
            rarity: CardRarity.COMMON,
            name: "Microphone",
            levels: []
        },
        "Gavel": {
            image: "Gavel.png",
            rarity: CardRarity.COMMON,
            name: "Gavel",
            levels: []
        },
        
        "First Aid Kit": {
            image: "FirstAidKit.png",
            rarity: CardRarity.COMMON,
            name: "First Aid Kit",
            levels: []
        },
        "Running Shoes": {
            image: "RunningShoes.png",
            rarity: CardRarity.COMMON,
            name: "Running Shoes",
            levels: []
        },
        "Disposable Gloves": {
            image: "",
            rarity: CardRarity.COMMON,
            name: "Disposable Gloves",
            levels: []
        },
        "Printer": {
            image: "Printer.png",
            rarity: CardRarity.COMMON,
            name: "Printer",
            levels: []
        }, "Solar Panel": {
            image: "SolarPanel.png",
            rarity: CardRarity.COMMON,
            name: "Solar Panel",
            levels: []
        },
        "Drone": {
            image: "Drone.png",
            rarity: CardRarity.COMMON,
            name: "Drone",
            levels: []
        },
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