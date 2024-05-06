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
    }
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
    class Enemy extends ƒ.Component implements EnemyOptions {
        #private;
        speed: number;
        damage: number;
        knockbackMultiplier: number;
        health: number;
        attacks: EnemyAttack[];
        moveSprite: AnimationSprite;
        desiredDistance: [number, number];
        private currentlyDesiredDistance;
        private currentlyDesiredDistanceSquared;
        dropXP: number;
        private material;
        private enemyManager;
        private prevDirection;
        private currentlyActiveAttack;
        constructor();
        private deserialized;
        setup(_options: Partial<EnemyOptions>): void;
        private updateDesiredDistance;
        private setCentralAnimator;
        update(_charPosition: ƒ.Vector3, _frameTimeInSeconds: number): void;
        private move;
        private chooseAttack;
        private executeAttack;
        getDamaged(_dmg: number): void;
    }
    interface EnemyOptions {
        speed: number;
        damage: number;
        knockbackMultiplier: number;
        health: number;
        attacks: EnemyAttack[];
        moveSprite: AnimationSprite;
        desiredDistance: [number, number];
        dropXP: number;
    }
    interface EnemyAttack {
        requiredDistance: [number, number];
        windUp: number;
        cooldown: number;
        sprite: AnimationSprite;
        attack: () => void;
        movement?: (_diff: ƒ.Vector3, _mgtSqrd: number, _charPosition: ƒ.Vector3, _frameTimeInSeconds: number) => void;
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
    class EnemyManager {
        private readonly provider;
        private characterManager;
        private enemyScripts;
        private enemies;
        private enemy;
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
