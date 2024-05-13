namespace Script {
    //#region Cards
    export interface Cards {
        [id: string]: iCard,
    }
    export interface iCard {
        name?: string,
        description?: string,
        image: string,
        rarity: CardRarity,
        levels: CardLevel[],
    }
    export interface CardLevel {
        passiveEffects?: PassiveCardEffectObject,
        activeEffects?: ActiveEffect[],
    }
    export type ActiveEffect = CardEffectProjectile | CardEffectAOE;

    interface ActiveCardEffectBase {
        cooldown: number,
        currentCooldown?: number,
        modifiers?: PassiveCardEffectObject,
    }
    
    interface CardEffectProjectile extends ActiveCardEffectBase {
        type: "projectile",
        projectile: string,
        amount: number,
        delay?: number,
        // spread?: number,
        offset?: ƒ.Vector3 | string;
    }

    interface CardEffectAOE extends ActiveCardEffectBase {
        type: "aoe",
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

    export enum CardRarity {
        COMMON = "common",
        UNCOMMON = "uncommon",
        RARE = "rare",
        EPIC = "epic",
        LEGENDARY = "legendary",
    }

    export type PassiveCardEffectObject = {
        absolute?: { [key in PassiveCardEffect]?: number },
        multiplier?: { [key in PassiveCardEffect]?: number },
    }
    //#endregion


    //#region Projectiles
    export interface Projectiles {
        [id: string]: ProjectileData,
    }

    interface ProjectileData {
        damage: number,
        size?: number,
        speed: number,
        range?: number,
        piercing?: number,
        diminishing?: boolean,
        targetMode?: ProjectileTargetMode,
        lockedToEntity?: boolean,
        impact?: ActiveEffect[],
        artillery?: boolean,
    }
    export enum ProjectileTargetMode {
        NONE,
        CLOSEST,
        STRONGEST,
    }
    export enum ProjectileTarget {
        PLAYER,
        ENEMY,
    }
    export interface Projectile extends ProjectileData {
        direction: ƒ.Vector3;
        damage: number;
        targetPosition: ƒ.Vector3;
        tracking: ProjectileTracking;
        size: number;
        speed: number;
        range: number;
        piercing: number;
        diminishing: boolean;
        target: ProjectileTarget;
        targetMode: ProjectileTargetMode,
        lockedToEntity: boolean,
        impact: ActiveEffect[],
        artillery: boolean,
    }

    export interface ProjectileTracking {
        strength?: number,
        startTrackingAfter?: number,
        stopTrackingAfter?: number,
        stopTrackingInRadius?: number,
        target: ƒ.Node,
    }
    //#endregion
}