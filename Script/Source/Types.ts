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
        detailDescription?: string,
    }
    export type ActiveEffect = CardEffectProjectile | CardEffectAOE;

    interface ActiveCardEffectBase {
        cooldown?: number,
        currentCooldown?: number,
        cooldownBasedOnDistance?: boolean,
        modifiers?: PassiveCardEffectObject,
    }

    export interface CardEffectProjectile extends ActiveCardEffectBase {
        type: "projectile",
        projectile: string,
        amount: number,
        delay?: number,
        // spread?: number,
        offset?: ƒ.Vector3 | string;
    }

    export interface CardEffectAOE extends ActiveCardEffectBase {
        type: "aoe",
        aoe: string,
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
        HEALTH = "health",
        REGENERATION = "regeneration",
        COLLECTION_RADIUS = "collectionRadius",
        DAMAGE_REDUCTION = "damageReduction",
        CARD_SLOTS = "cardSlots",
        CARD_UPGRADE_SLOTS = "cardUpgradeSlots",
        MOVEMENT_SPEED = "movementSpeed",
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
        target?: ProjectileTarget;
        diminishing?: boolean,
        targetMode?: ProjectileTargetMode,
        lockedToEntity?: boolean,
        impact?: ActiveEffect[],
        artillery?: boolean,
        sprite: AnimationSprite | [string, string],
        methods?: ProjectileFunctions,
        rotateInDirection?: boolean,
        stunDuration?: number,
    }

    export interface ProjectileFunctions {
        afterSetup?: () => void,
        preUpdate?: (_charPosition: ƒ.Vector3, _frameTimeInSeconds: number) => void,
        postUpdate?: (_charPosition: ƒ.Vector3, _frameTimeInSeconds: number) => void;
        preMove?: (_frameTimeInSeconds: number) => void;
        postMove?: (_frameTimeInSeconds: number) => void;
        preHit?: (_hitable: Hitable) => void;
        postHit?: (_hitable: Hitable) => void;
    }
    export enum ProjectileTargetMode {
        NONE,
        CLOSEST,
        STRONGEST,
        RANDOM,
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
        rotateInDirection: boolean,
        stunDuration: number,
    }

    export interface ProjectileTracking {
        strength?: number,
        startTrackingAfter?: number,
        stopTrackingAfter?: number,
        stopTrackingInRadius?: number,
        target: ƒ.Node,
    }

    export interface AreasOfEffect {
        [key: string]: AreaOfEffect,
    }
    export interface AreaOfEffect {
        variant: "aoe" | "explosion",
        size: number,
        target: ProjectileTarget,
        damage: number,
        sprite: AnimationSprite | [string, string],
        duration: number,
        damageDelay?: number,
        events?: { [name: string]: (_event?: CustomEvent) => void; }
        targetMode?: ProjectileTargetMode,
        stunDuration?: number,
    }
    //#endregion

    //#region Hitable
    export interface Hitable {
        health: number,
        hit: (_hit: Hit) => number,
    }

    export interface Hit {
        damage: number,
        knockbackDirection?: ƒ.Vector3,
        stun?: number,
    }
    //#endregion

    //#region Enemy Management
    export interface Pools {
        [key: string]: string[][];
    }

    export interface Rooms {
        [key: string]: Room[];
    }

    export interface Room {
        duration: number,
        defaultWave?: Wave,
        waveAmount?: number,
        waves?: Wave[],
        reward?: boolean,
        canStopAfter?: boolean,
        boss?: boolean,
        bonus?: PassiveCardEffectObject,
    }
    export interface Wave {
        enemies: ({ pool: number, weight?: number, elite?: boolean } | string)[],
        amount: number,
        duration: number,
        minEnemiesOverride?: number,
    }
    //#endregion
}