declare namespace Script {
    import ƒ = FudgeCore;
    class Animateable extends ƒ.Component {
        protected material: ƒ.ComponentMaterial;
        private currentlyActiveSprite;
        private currentlyActiveEventListener;
        protected uniqueAnimationId: number;
        constructor();
        protected deserialized: () => void;
        protected getSprite(_sp: AnimationSprite | [string, string]): AnimationSprite;
        protected setCentralAnimator(_as: AnimationSprite, _unique?: boolean, _eventListener?: (_event: CustomEvent) => void): void;
        protected removeAnimationEventListeners(): void;
        update(_charPosition: ƒ.Vector3, _frameTimeInSeconds: number): void;
        removeAttachments(): void;
    }
}
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
    function updateI18nInDOM(): void;
}
declare namespace Script {
    import ƒ = FudgeCore;
    abstract class InitializableGraphInstance extends ƒ.GraphInstance implements ƒ.Recycable {
        initialized: boolean;
        constructor();
        recycle(): void;
        set(_graph: ƒ.Graph): Promise<void>;
    }
    class ProjectileGraphInstance extends InitializableGraphInstance {
    }
    class HitZoneGraphInstance extends InitializableGraphInstance {
    }
    class EnemyGraphInstance extends InitializableGraphInstance {
        distanceToCharacter: number;
        isSpawning: boolean;
    }
    class AOEGraphInstance extends InitializableGraphInstance {
    }
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
        getMovement(): ƒ.Vector2;
        isMoving(): boolean;
        private update;
        upgradeCards(_amountOverride?: number, _newCards?: boolean, _rerolls?: number, _weaponsOnly?: boolean): Promise<void>;
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
        PAUSED = 2,
        ROOM_CLEAR = 3
    }
    let viewport: ƒ.Viewport;
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
        unlock?: {
            firstRun?: boolean;
            afterFirstRun?: boolean;
            possible?: boolean;
        };
        isWeapon?: boolean;
    }
    export interface CardLevel {
        passiveEffects?: PassiveCardEffectObject;
        activeEffects?: ActiveEffect[];
        detailDescription?: string;
    }
    export type ActiveEffect = CardEffectProjectile | CardEffectAOE;
    interface ActiveCardEffectBase {
        cooldown?: number;
        currentCooldown?: number;
        cooldownBasedOnDistance?: boolean;
        modifiers?: PassiveCardEffectObject;
    }
    export interface CardEffectProjectile extends ActiveCardEffectBase {
        type: "projectile";
        projectile: string;
        amount: number;
        delay?: number;
        offset?: ƒ.Vector3 | string;
    }
    export interface CardEffectAOE extends ActiveCardEffectBase {
        type: "aoe";
        aoe: string;
    }
    export enum PassiveCardEffect {
        COOLDOWN_REDUCTION = "cooldownReduction",
        PROJECTILE_SIZE = "projectileSize",
        PROJECTILE_SPEED = "projectileSpeed",
        PROJECTILE_AMOUNT = "projectileAmount",
        PROJECTILE_RANGE = "projectileRange",
        EFFECT_SIZE = "effectSize",
        PROJECTILE_PIERCING = "projectilePiercing",
        DAMAGE = "damage",
        EFFECT_DURATION = "effectDuration",
        WEAPON_DURATION = "weaponDuration",
        KNOCKBACK = "knockback",
        CRIT_CHANCE = "criticalHitChance",
        CRIT_DAMAGE = "critialHitDamage",
        HEALTH = "health",
        REGENERATION = "regeneration",
        REGENERATION_RELATIVE = "regenerationRelativeToMaxHealth",
        COLLECTION_RADIUS = "collectionRadius",
        DAMAGE_REDUCTION = "damageReduction",
        CARD_SLOTS = "cardSlots",
        CARD_UPGRADE_SLOTS = "cardUpgradeSlots",
        MOVEMENT_SPEED = "movementSpeed",
        XP = "xp",
        ENEMY_SIZE = "enemySize",
        ENEMY_AMOUNT = "enemyAmount",
        CAMERA_FOV = "cameraFOV",
        DODGE = "dodge"
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
            [key in PassiveCardEffect]?: number | PassiveCardEffectModifier | Array<number | PassiveCardEffectModifier>;
        };
        multiplier?: {
            [key in PassiveCardEffect]?: number | PassiveCardEffectModifier | Array<number | PassiveCardEffectModifier>;
        };
    };
    export type PassiveCardEffectModifier = {
        value: number;
        limitation?: string;
    };
    export interface Projectiles {
        [id: string]: ProjectileData;
    }
    export interface ProjectileData {
        damage: number;
        size?: number;
        speed: number;
        range?: number;
        piercing?: number;
        target?: ProjectileTarget;
        dontNormalizeMovement?: boolean;
        diminishing?: boolean;
        targetMode?: ProjectileTargetMode;
        lockedToEntity?: boolean;
        impact?: ActiveEffect[];
        artillery?: boolean;
        sprite: AnimationSprite | [string, string];
        methods?: ProjectileFunctions;
        rotateInDirection?: boolean;
        stunDuration?: number;
        hitboxSize?: number;
    }
    export interface ProjectileFunctions {
        afterSetup?: () => void;
        beforeSetup?: (_options: Partial<Projectile>, _modifier: PassiveCardEffectObject) => void;
        preUpdate?: (_charPosition: ƒ.Vector3, _frameTimeInSeconds: number) => void;
        postUpdate?: (_charPosition: ƒ.Vector3, _frameTimeInSeconds: number) => void;
        preMove?: (_frameTimeInSeconds: number) => void;
        postMove?: (_frameTimeInSeconds: number) => void;
        preHit?: (_hitable: Hitable) => void;
        postHit?: (_hitable: Hitable) => void;
    }
    export enum ProjectileTargetMode {
        NONE = 0,
        CLOSEST = 1,
        FURTHEST = 2,
        STRONGEST = 3,
        RANDOM = 4
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
        rotateInDirection: boolean;
        stunDuration: number;
    }
    export interface ProjectileTracking {
        strength?: number;
        startTrackingAfter?: number;
        stopTrackingAfter?: number;
        stopTrackingInRadius?: number;
        target: ƒ.Node;
    }
    export interface AreasOfEffect {
        [key: string]: AreaOfEffect;
    }
    export interface AreaOfEffect {
        variant: "aoe" | "explosion";
        size: number;
        target: ProjectileTarget;
        damage: number;
        sprite: AnimationSprite | [string, string];
        duration: number;
        damageDelay?: number;
        events?: {
            [name: string]: (_event?: CustomEvent) => void;
        };
        targetMode?: ProjectileTargetMode;
        stunDuration?: number;
    }
    export interface Hitable {
        health: number;
        hit: (_hit: Hit) => number;
    }
    export enum HitType {
        PROJECTILE = "projectile",
        AOE = "aoe",
        MELEE = "melee"
    }
    export interface Hit {
        damage: number;
        knockbackDirection?: ƒ.Vector3;
        stun?: number;
        type?: HitType;
    }
    export interface Pools {
        [key: string]: string[][];
    }
    export interface Rooms {
        [key: string]: Room[];
    }
    export interface Room {
        duration: number;
        defaultWave?: Wave;
        waveAmount?: number;
        waves?: Wave[];
        reward?: boolean;
        canStopAfter?: boolean;
        boss?: boolean;
        bonus?: PassiveCardEffectObject;
    }
    export interface Wave {
        enemies: ({
            pool: number;
            weight?: number;
            elite?: boolean;
        } | string)[];
        amount: number;
        duration: number;
        minEnemiesOverride?: number;
        bonus?: PassiveCardEffectObject;
    }
    export {};
}
declare namespace Script {
    import ƒ = FudgeCore;
    class AOE extends Animateable implements AreaOfEffect {
        duration: number;
        events?: {
            [name: string]: (_event?: CustomEvent<any>) => void;
        };
        targetMode?: ProjectileTargetMode;
        size: number;
        damage: number;
        sprite: AnimationSprite | [string, string];
        stunDuration: number;
        variant: "aoe" | "explosion";
        target: ProjectileTarget;
        private rigidbody;
        private defaults;
        setup(_options: Partial<AreaOfEffect>, _modifier: PassiveCardEffectObject): void;
        private explode;
        update(_charPosition: ƒ.Vector3, _frameTimeInSeconds: number): void;
        private eventListener;
    }
}
declare namespace Script {
    class ProjectileComponent extends Animateable implements Projectile {
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
        rotateInDirection: boolean;
        impact: ActiveEffect[];
        targetMode: ProjectileTargetMode;
        lockedToEntity: boolean;
        sprite: AnimationSprite;
        stunDuration: number;
        dontNormalizeMovement: boolean;
        private hazardZone;
        private prevDistance;
        private modifiers;
        private functions;
        protected static defaults: Projectile;
        constructor();
        protected init: () => void;
        setup(_options: Partial<Projectile>, _modifier: PassiveCardEffectObject): Promise<void>;
        update(_charPosition: ƒ.Vector3, _frameTimeInSeconds: number): void;
        removeAttachments(): void;
        private removeHazardZone;
        protected move(_frameTimeInSeconds: number): void;
        protected rotate(): void;
        protected onTriggerEnter: (_event: ƒ.EventPhysics) => void;
        protected onTriggerExit: (_event: ƒ.EventPhysics) => void;
        protected hit(_hitable: Hitable): void;
        private remove;
    }
}
declare namespace Script {
    const projectiles: Projectiles;
    const areasOfEffect: AreasOfEffect;
}
declare namespace Script {
    class Card implements iCard {
        #private;
        name: string;
        description: string;
        image: string;
        rarity: CardRarity;
        levels: CardLevel[];
        id: string;
        isWeapon?: boolean;
        constructor(_init: iCard, _id: string, _level?: number);
        get level(): number;
        set level(_level: number);
        get effects(): PassiveCardEffectObject;
        update(_time: number, _cumulatedEffects: PassiveCardEffectObject): void;
    }
}
declare namespace Script {
    interface iCardCollection {
        [id: string]: {
            lvl: number;
            amount: number;
        };
    }
    class CardCollection {
        private collection;
        private deck;
        private maxDeckSize;
        private maxSelectedSize;
        private deckElement;
        private collectionElement;
        private popupElement;
        private popupButtons;
        private deckSelectionSizeElement;
        private selectedCard;
        private cardVisuals;
        constructor(provider: Provider);
        setup(): void;
        private openPopup;
        addCardToCollection(_name: string, _amount: number): void;
        getCardLevel(_name: string): number;
        addCardToDeck(_name: string, _updateVisuals?: boolean): void;
        removeCardFromDeck(_name: string, _updateVisuals?: boolean): void;
        unlockCards(_amount: number): string[];
        private hidePopup;
        private removeFromArray;
        private addToArray;
        private installListeners;
        private popupClickListener;
        updateVisuals(_fullReset?: boolean): void;
        private putCardsInDeck;
        fillWithPlaceholders(_array: HTMLElement[], _maxAmount: number): void;
        private getCardPlaceholder;
        private compareRarity;
        private getRarityNumber;
    }
}
declare namespace Script {
    class CardVisual {
        #private;
        static template: HTMLTemplateElement;
        private static canvas;
        constructor(_card: iCard, _parent: HTMLElement, _nameFallback?: string, _level?: number, _disableCircleType?: boolean);
        updateTexts(): void;
        get htmlElement(): HTMLElement;
        private getTextWidth;
        private getCanvasFont;
        private getFirstTranslatableText;
        private getCssStyle;
    }
}
declare namespace Script {
    const cards: Cards;
}
declare namespace Script {
    import ƒ = FudgeCore;
    class Character extends ƒ.Component implements Hitable {
        #private;
        prevAnimation: AnimationState;
        private prevDirection;
        private defaultMaxHealth;
        health: number;
        maxHealth: number;
        private rigidbody;
        private cardManager;
        speed: number;
        private visualChildren;
        private regenTimer;
        private defaultCameraDistance;
        constructor();
        private init;
        move(_direction: ƒ.Vector2, _time: number): void;
        update(_direction: ƒ.Vector2): void;
        hit(_hit: Hit): number;
        private updateMaxHealth;
        private updateCameraFOV;
        updatePassiveEffects(): void;
        heal(_amt: number, _percentage?: boolean): void;
        reset(): void;
        private regenerate;
        private changeVisualDirection;
        private updateHealthVisually;
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
    class Enemy extends Animateable implements EnemyOptions, Hitable {
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
        size: number;
        events?: {
            [name: string]: (_event?: CustomEvent<any>) => void;
        };
        hitboxSize: number;
        shadow?: {
            size?: number;
            position?: ƒ.Vector2;
        };
        boss?: boolean;
        private enemyManager;
        private prevDirection;
        private currentlyActiveAttack;
        private rigidbody;
        private touchingPlayer;
        private meleeCooldown;
        private modifier;
        private invulnerable;
        isSpawning: boolean;
        private stunned;
        private static defaults;
        constructor();
        protected deserializedListener: () => void;
        setup(_options: Partial<EnemyOptions>, _modifier: PassiveCardEffectObject): void;
        private updateDesiredDistance;
        update(_charPosition: ƒ.Vector3, _frameTimeInSeconds: number): void;
        stun(_time: number): void;
        private move;
        private meleeAttack;
        private chooseAttack;
        private executeAttack;
        protected setCentralAnimator(_as: AnimationSprite, _unique?: boolean): void;
        private eventListener;
        private onCollisionEnter;
        private onCollisionExit;
        hit(_hit: Hit): number;
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
        boss?: boolean;
        size?: number;
        events?: {
            [name: string]: (_event?: CustomEvent) => void;
        };
        hitboxSize?: number;
        afterSetup?: () => void;
        shadow?: {
            size?: number;
            position?: ƒ.Vector2;
        };
    }
    interface EnemyAttack {
        requiredDistance: [number, number];
        windUp: number;
        cooldown: number;
        attackSprite?: AnimationSprite | [string, string];
        cooldownSprite?: AnimationSprite | [string, string];
        attack?: () => void;
        movement?: (_diff: ƒ.Vector3, _mgtSqrd: number, _charPosition: ƒ.Vector3, _frameTimeInSeconds: number) => void;
        attackStart?: () => void;
        attackEnd?: () => void;
        events?: {
            [name: string]: (_event?: CustomEvent) => void;
        };
        weight?: number;
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
    const eliteModifier: PassiveCardEffectObject;
    const pools: Pools;
    const rooms: Rooms;
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
        private deckCards;
        private cumulativeEffects;
        private defaultMaxActiveCardAmount;
        private currentMaxActiveCardAmount;
        constructor();
        get activeCards(): Card[];
        get maxActiveCardAmount(): number;
        private update;
        getEffectAbsolute(_effect: PassiveCardEffect, _modifier?: PassiveCardEffectObject, _limitation?: string): number;
        getEffectMultiplier(_effect: PassiveCardEffect, _modifier?: PassiveCardEffectObject, _limitation?: string): number;
        private getValue;
        modifyValuePlayer(_value: number, _effect: PassiveCardEffect, _localModifiers?: PassiveCardEffectObject, _limitation?: string): number;
        modifyValue(_value: number, _effect: PassiveCardEffect, _modifier: PassiveCardEffectObject, _limitation?: string): number;
        updateEffects(): void;
        combineEffects(..._effects: PassiveCardEffectObject[]): PassiveCardEffectObject;
        private prevChosenCards;
        setCards(_selection: string[], _deck: string[]): void;
        getCardsToChooseFrom(_maxAmt: number, _newCards?: boolean, _weaponsOnly?: boolean): Card[];
        updateCardOrAdd(_cardId: string): void;
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
    class DataManager {
        savedCollectionRaw: iCardCollection;
        savedDeckRaw: string[];
        savedSelectionRaw: string[];
        private _firstPlaythroughDone;
        private selectedLanguage;
        load(): Promise<void>;
        get lang(): string;
        set lang(_language: string);
        get firstPlaythroughDone(): boolean;
        set firstPlaythroughDone(_value: boolean);
        private catchObjChange;
        private catchArrayChange;
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
        private currentWave;
        private currentRoom;
        private currentArea;
        private currentWaveEnd;
        private currentRoomEnd;
        private currentXP;
        private xpElement;
        private lvlupMarker;
        private damageWasDealt;
        private timeElement;
        private roomProgressElement;
        unlockedCards: number;
        constructor(provider: Provider);
        setup(): void;
        private start;
        private loaded;
        private update;
        nextWaveOverride: boolean;
        private roomManagement;
        private endRoom;
        nextRoom(): void;
        waitMs(_ms: number): Promise<void>;
        private spawnWave;
        private getWave;
        private getWaveModifier;
        private poolSelections;
        private getEnemyList;
        private spawnEnemy;
        private debugEvents;
        private debugButtons;
        private debugRemoveEnemies;
        private spawnEnemies;
        removeEnemy(_enemy: Enemy): void;
        getEnemy(_mode: ProjectileTargetMode, _pos?: ƒ.Vector3, _exclude?: EnemyGraphInstance[], _maxDistance?: number): EnemyGraphInstance | undefined;
        private dmgDisplayElements;
        displayDamage(_amt: number, _pos: ƒ.Vector3, _onPlayer?: boolean): void;
        displayText(_text: string, _pos: ƒ.Vector3, ...cssClasses: string[]): void;
        reset(): void;
        enemyTookDamage(): void;
        addXP(_xp: number): void;
    }
}
declare namespace Script {
    enum MenuType {
        NONE = 0,
        MAIN = 1,
        COLLECTION = 2,
        SETTINGS = 3,
        PAUSE = 4,
        CARD_UPGRADE = 5,
        END_CONFIRM = 6,
        GAME_OVER = 7,
        WINNER = 8,
        BETWEEN_ROOMS = 9
    }
    class MenuManager {
        private menus;
        private prevGameState;
        private gameIsReady;
        constructor();
        updateLangIcons(): void;
        setup(): void;
        openMenu(_menu: MenuType): HTMLElement;
        endGameMenu(_won: boolean, _cardAmt?: number): void;
        private startGame;
        openPauseMenu(): void;
        private openPauseCardPopup;
        private ready;
        private waitForReady;
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
        static aoeGraph: ƒ.Graph;
        static hitZoneGraph: ƒ.Graph;
        private projectilesNode;
        private hitzoneNode;
        constructor(provider: Provider);
        setup(): void;
        private start;
        private loaded;
        private update;
        removeProjectile(_projectile: ProjectileComponent): void;
        removeAOE(_aoe: AOE): void;
        createProjectile(_options: Partial<Projectile>, _position: ƒ.Vector3, _modifiers: PassiveCardEffectObject, _parent?: ƒ.Node): Promise<void>;
        createAOE(_options: Partial<AreaOfEffect>, _position: ƒ.Vector3, _modifiers: PassiveCardEffectObject, _parent?: ƒ.Node): Promise<void>;
        createHitZone(_position: ƒ.Vector3, _size?: number, _parent?: ƒ.Node): Promise<HitZoneGraphInstance>;
        cleanup(): void;
    }
}
