declare namespace Script {
    import ƒ = FudgeCore;
    class CustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace Script {
    function initI18n(..._languages: string[]): Promise<void>;
}
declare namespace Script {
    export class Provider {
        private readonly items;
        constructor();
        add<T>(type: ItemConstructor<T>): this;
        addInstance<T>(type: ItemType<T>, instance: T): this;
        addFactory<T>(type: ItemType<T>, factory: ItemFactory<T>): this;
        addSuper<T>(type: ItemType<T>, constructor: ItemConstructor<T>): this;
        private getRaw;
        get<T extends {}>(type: ItemType<T>): T;
        private instantiateItem;
        private getNewItemInformationOrThrow;
        private getItemInformation;
    }
    type ItemType<TItem> = abstract new (...otherArgs: any[]) => TItem;
    type ItemConstructor<TItem> = new (provider: Provider, ...otherArgs: undefined[]) => TItem;
    type ItemFactory<TItem> = (provider: Provider) => TItem;
    export {};
}
declare namespace Script {
    import ƒ = FudgeCore;
    class CharacterManager {
        #private;
        private readonly provider;
        private movementVector;
        constructor(provider: Provider);
        get character(): Character;
        set character(_char: Character);
        setMovement(_direction: ƒ.Vector2): void;
        private update;
    }
}
declare namespace Script {
    enum TouchMode {
        FREE = 0,
        LOCKED = 1
    }
    class InputManager {
        #private;
        private readonly provider;
        private touchEventDispatcher;
        private touchCircle;
        private touchCircleInner;
        private curentlyActiveTouchId;
        private readonly touchRadiusVW;
        private readonly touchRadiusPx;
        private readonly touchRadiusScale;
        private readonly characterManager;
        constructor(provider: Provider);
        get touchMode(): TouchMode;
        set touchMode(_touchMode: TouchMode);
        setup(_touchMode?: TouchMode): void;
        private hndTouchEvent;
        private hndKeyboardInput;
    }
}
declare namespace Script {
    export import ƒ = FudgeCore;
    enum GAMESTATE {
        IDLE = 0,
        PLAYING = 1,
        PAUSED = 2
    }
    const provider: Provider;
    let gameState: GAMESTATE;
}
declare namespace Script {
    import ƒ = FudgeCore;
    class SpriteAnimator {
        private mtx;
        private sprite;
        private startTime;
        private totalTime;
        private frameTime;
        private frameWidth;
        private frameHeight;
        private prevFrame;
        constructor(_as: AnimationSprite, _startTime?: number, _mtx?: ƒ.Matrix3x3);
        get matrix(): ƒ.Matrix3x3;
        setTime(_time?: number): void;
        reset(_as: AnimationSprite, _time?: number): void;
        private fireEvents;
    }
}
declare namespace Script {
    export interface Cards {
        [id: string]: iCard;
    }
    export interface iCard {
        name?: string;
        description?: string;
        image: string;
        rarity: CardRarity;
        levels: CardLevel[];
    }
    export interface CardLevel {
        passiveEffects?: PassiveCardEffectObject;
        activeEffects?: ActiveEffect[];
    }
    export type ActiveEffect = CardEffectProjectile | CardEffectAOE;
    interface ActiveCardEffectBase {
        cooldown: number;
        currentCooldown?: number;
        modifiers?: PassiveCardEffectObject;
    }
    interface CardEffectProjectile extends ActiveCardEffectBase {
        type: "projectile";
        projectile: string;
        amount: number;
        delay?: number;
        offset?: ƒ.Vector3 | string;
    }
    interface CardEffectAOE extends ActiveCardEffectBase {
        type: "aoe";
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
        DAMAGE_REDUCTION = "damageReduction"
    }
    export enum CardRarity {
        COMMON = "common",
        UNCOMMON = "uncommon",
        RARE = "rare",
        EPIC = "epic",
        LEGENDARY = "legendary"
    }
    export type PassiveCardEffectObject = {
        absolute?: {
            [key in PassiveCardEffect]?: number;
        };
        multiplier?: {
            [key in PassiveCardEffect]?: number;
        };
    };
    export interface Projectiles {
        [id: string]: ProjectileData;
    }
    interface ProjectileData {
        damage: number;
        size?: number;
        speed: number;
        range?: number;
        piercing?: number;
        diminishing?: boolean;
        targetMode?: ProjectileTargetMode;
        lockedToEntity?: boolean;
        impact?: ActiveEffect[];
        artillery?: boolean;
    }
    export enum ProjectileTargetMode {
        NONE = 0,
        CLOSEST = 1,
        STRONGEST = 2
    }
    export enum ProjectileTarget {
        PLAYER = 0,
        ENEMY = 1
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
        targetMode: ProjectileTargetMode;
        lockedToEntity: boolean;
        impact: ActiveEffect[];
        artillery: boolean;
    }
    export interface ProjectileTracking {
        strength?: number;
        startTrackingAfter?: number;
        stopTrackingAfter?: number;
        stopTrackingInRadius?: number;
        target: ƒ.Node;
    }
    export {};
}
declare namespace Script {
    import ƒ = FudgeCore;
    class HitZoneGraphInstance extends ƒ.GraphInstance implements ƒ.Recycable {
        initialized: boolean;
        constructor();
        recycle(): void;
        set(_graph: ƒ.Graph): Promise<void>;
    }
}
declare namespace Script {
    class ProjectileComponent extends ƒ.Component implements Projectile {
        tracking: ProjectileTracking;
        direction: ƒ.Vector3;
        targetPosition: ƒ.Vector3;
        damage: number;
        size: number;
        speed: number;
        range: number;
        piercing: number;
        target: ProjectileTarget;
        diminishing: boolean;
        artillery: boolean;
        impact: ActiveEffect[];
        targetMode: ProjectileTargetMode;
        lockedToEntity: boolean;
        private hazardZone;
        protected static defaults: Projectile;
        constructor();
        protected init: () => void;
        setup(_options: Partial<Projectile>, _manager: CardManager): Promise<void>;
        update(_charPosition: ƒ.Vector3, _frameTimeInSeconds: number): void;
        protected move(_frameTimeInSeconds: number): void;
        protected onTriggerEnter: (_event: CustomEvent) => void;
        protected onTriggerExit: (_event: CustomEvent) => void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class ProjectileGraphInstance extends ƒ.GraphInstance implements ƒ.Recycable {
        initialized: boolean;
        constructor();
        recycle(): void;
        set(_graph: ƒ.Graph): Promise<void>;
    }
}
declare namespace Script {
    const projectiles: Projectiles;
}
declare namespace Script {
    class Card implements iCard {
        #private;
        name: string;
        description: string;
        image: string;
        rarity: CardRarity;
        levels: CardLevel[];
        constructor(_init: iCard, _level?: number, _nameFallback?: string);
        get level(): number;
        set level(_level: number);
        get effects(): PassiveCardEffectObject;
        update(_time: number, _cumulatedEffects: PassiveCardEffectObject): void;
    }
}
declare namespace Script {
    const cards: Cards;
}
declare namespace Script {
    import ƒ = FudgeCore;
    class Character extends ƒ.Component {
        #private;
        prevAnimation: AnimationState;
        private prevDirection;
        constructor();
        move(_direction: ƒ.Vector2): void;
        private setAnimation;
        private setupAnimator;
    }
    enum AnimationState {
        IDLE = "idle",
        WALKING = "walking"
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class CharacterLayer extends ƒ.Component {
        #private;
        constructor();
        setTexture(_state: AnimationState): void;
    }
}
declare namespace Script {
    const enemies: {
        [id: string]: Partial<EnemyOptions>;
    };
}
declare namespace Script {
    class Enemy extends ƒ.Component implements EnemyOptions {
        #private;
        speed: number;
        damage: number;
        knockbackMultiplier: number;
        health: number;
        attacks: EnemyAttack[];
        moveSprite: AnimationSprite;
        desiredDistance: [number, number];
        directionOverride: ƒ.Vector3;
        private currentlyDesiredDistance;
        private currentlyDesiredDistanceSquared;
        dropXP: number;
        private material;
        private enemyManager;
        private prevDirection;
        private currentlyActiveAttack;
        private currentlyActiveSprite;
        private rigidbody;
        private static defaults;
        constructor();
        private deserialized;
        setup(_options: Partial<EnemyOptions>): void;
        private updateDesiredDistance;
        private getSprite;
        private setCentralAnimator;
        update(_charPosition: ƒ.Vector3, _frameTimeInSeconds: number): void;
        private move;
        private chooseAttack;
        private executeAttack;
        private eventListener;
        getDamaged(_dmg: number): void;
    }
    interface EnemyOptions {
        speed: number;
        damage: number;
        knockbackMultiplier: number;
        health: number;
        attacks: EnemyAttack[];
        moveSprite: AnimationSprite | [string, string];
        desiredDistance: [number, number];
        dropXP: number;
        directionOverride?: ƒ.Vector3;
    }
    interface EnemyAttack {
        requiredDistance: [number, number];
        windUp: number;
        cooldown: number;
        attackSprite?: AnimationSprite | [string, string];
        cooldownSprite?: AnimationSprite | [string, string];
        attack?: () => void;
        movement?: (_diff: ƒ.Vector3, _mgtSqrd: number, _charPosition: ƒ.Vector3, _frameTimeInSeconds: number) => void;
        events?: {
            [name: string]: (_event?: CustomEvent) => void;
        };
    }
    interface AnimationSprite {
        width: number;
        height: number;
        totalWidth: number;
        totalHeight: number;
        frames: number;
        fps: number;
        wrapAfter: number;
        material?: ƒ.Material;
        events?: AnimationEvent[];
    }
    interface AnimationEvent {
        frame: number;
        event: string;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class EnemyGraphInstance extends ƒ.GraphInstance implements ƒ.Recycable {
        initialized: boolean;
        constructor();
        recycle(): void;
        set(_graph: ƒ.Graph): Promise<void>;
    }
}
declare namespace Script {
    class AnimationManager {
        private readonly provider;
        private shared;
        private unique;
        private currentUniqueId;
        constructor(provider: Provider);
        private update;
        getUniqueAnimationMtx(_sprite: AnimationSprite): [ƒ.Matrix3x3, number];
        getAnimationMtx(_sprite: AnimationSprite): ƒ.Matrix3x3;
        removeUniqueAnimationMtx(_id: number): void;
    }
}
declare namespace Script {
    class CardManager {
        private currentlyActiveCards;
        private cumulativeEffects;
        getEffectAbsolute(_effect: PassiveCardEffect, _modifier?: PassiveCardEffectObject): number;
        getEffectMultiplier(_effect: PassiveCardEffect, _modifier?: PassiveCardEffectObject): number;
        modifyValue(_value: number, _effect: PassiveCardEffect, _localModifiers?: PassiveCardEffectObject): number;
        updateEffects(): void;
    }
}
declare namespace Script {
    class Config {
        private animations;
        constructor();
        loadFiles(): Promise<void>;
        getAnimation(_enemyID: string, _animationID: string): AnimationSprite;
    }
}
declare namespace Script {
    class EnemyManager {
        private readonly provider;
        private characterManager;
        private config;
        private enemyScripts;
        private enemies;
        private enemyGraph;
        private enemyNode;
        constructor(provider: Provider);
        setup(): void;
        private start;
        private loaded;
        private update;
        private spawnEnemies;
        removeEnemy(_enemy: Enemy): void;
    }
}
declare namespace Script {
    class ProjectileManager {
        private readonly provider;
        private characterManager;
        private config;
        private projectileScripts;
        private projectiles;
        static projectileGraph: ƒ.Graph;
        static hitZoneGraph: ƒ.Graph;
        private projectilesNode;
        constructor(provider: Provider);
        setup(): void;
        private start;
        private loaded;
        private update;
        removeProjectile(_projectile: ProjectileComponent): void;
        createProjectile(_options: Partial<Projectile>, _position: ƒ.Vector3, _parent?: ƒ.Node): Promise<void>;
        createHitZone(_position: ƒ.Vector3, _size?: number, _parent?: ƒ.Node): Promise<ƒ.GraphInstance>;
    }
}
