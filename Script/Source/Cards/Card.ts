namespace Script {
    export class Card {
        #effects: PassiveCardEffectObject

        get effects(): PassiveCardEffectObject {
            return structuredClone(this.#effects);
        }
    }

    export enum PassiveCardEffect {
        COOLDOWN_REDUCTION = "cooldownReduction",
        PROJECTILE_SIZE = "projectileSize",
        PROJECTILE_SPEED = "projectileSpeed",
        PROJECTILE_AMOUNT = "projectileAmount",
        PROJECTILE_RANGE = "projectileRange",
        PROJECTILE_PIERCING = "projectilePiercing",
        DAMAGE = "damage",
        EFFECT_DURATION = "effectDuration",
        WEAPON_DURATION = "weaponDuration",
        KNOCKBACK = "knockback",
        CRIT_CHANCE = "criticalHitChance",
        CRIT_DAMAGE = "critialHitDamage",
        PLAYER_HEALTH = "playerHealth",
        PLAYER_REGENERATION = "playerRegeneration",
        COLLECTION_RADIUS = "collectionRadius",
        DAMAGE_REDUCTION = "damageReduction",
    }

    export type PassiveCardEffectObject = {
        absolute?: { [key in PassiveCardEffect]?: number },
        multiplier?: { [key in PassiveCardEffect]?: number },
    }
}
