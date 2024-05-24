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
        "hammer": {
            image: "Hammer.png",
            rarity: CardRarity.COMMON,
            name: "hammer",
            levels: []
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
        },
        "Pen": {
            image: "Pen.png",
            rarity: CardRarity.COMMON,
            name: "pen",
            levels: []
        },
        "Helmet": {
            image: "Helmet.png",
            rarity: CardRarity.COMMON,
            name: "helmet",
            levels: []
        },
        "Safety Boots": {
            image: "SafetyBoots.png",
            rarity: CardRarity.COMMON,
            name: "safety boots",
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
        "Lightbulb": {
            image: "Bulb.png",
            rarity: CardRarity.COMMON,
            name: "Lightbulb",
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
        "Smoke Mask": {
            image: "SmokeMask.png",
            rarity: CardRarity.COMMON,
            name: "Smoke Mask",
            levels: []
        },
        "Discus": {
            image: "Discus.png",
            rarity: CardRarity.COMMON,
            name: "Solar Panel",
            levels: []
        },
        "Civil Code": {
            image: "CivilCode.png",
            rarity: CardRarity.COMMON,
            name: "Civil Code",
            levels: []
        },
        "Divider": {
            image: "Divider.png",
            rarity: CardRarity.COMMON,
            name: "Divider",
            levels: []
        },
        "Needles": {
            image: "Needles.png",
            rarity: CardRarity.COMMON,
            name: "Needles",
            levels: []
        },
        "Basic": {
            image: "Basic.png",
            rarity: CardRarity.COMMON,
            name: "Basic",
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
            image: "Training.png",
            rarity: CardRarity.LEGENDARY,
            name: "Training",
            levels: []
        },

    }
}