declare namespace Script {
    import ƒ = FudgeCore;
    class CharacterScript extends ƒ.ComponentScript {
        #private;
        static readonly iSubclass: number;
        speed: number;
        maxDistance: number;
        constructor();
        init(): void;
        loop(): void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class Enemy extends ƒ.Component implements ƒ.Recycable {
        #private;
        constructor();
        recycle(): void;
        init: () => Promise<void>;
        loop: () => void;
        setCentralAnimator(): void;
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
    import ƒ = FudgeCore;
    class EnemyManager extends ƒ.Component {
        #private;
        static Instance: EnemyManager;
        static Character: ƒ.Node;
        spawnRadius: number;
        maxEnemies: number;
        enemySpeed: number;
        currentEnemies: number;
        animate: boolean;
        disableVisuals: boolean;
        lockCamera: boolean;
        noEnemyMovement: boolean;
        constructor();
        private loaded;
        private init;
        private loop;
        static setCharacter(_node: ƒ.Node): void;
        removeEnemy(_node: ƒ.Node): void;
        getAnimMtx(_frames: number, _fps: number): ƒ.Matrix3x3;
        private updateAnimationMtxs;
    }
    type TextureSize = "s" | "m" | "l";
}
declare namespace Script {
    import ƒ = FudgeCore;
    let viewport: ƒ.Viewport;
    let freeCam: ƒ.ComponentCamera;
    /** Helper function to set up a (deep) proxy object that calls the onChange function __before__ the element is modified*/
    function onChange(object: any, onChange: Function): any;
}
declare namespace Script {
    import ƒ = FudgeCore;
    class SpriteAnimator {
        private mtx;
        private startTime;
        private frames;
        private fps;
        private totalTime;
        private frameTime;
        private frameWidth;
        constructor(_frames: number, _fps: number, _startTime: number, _mtx?: ƒ.Matrix3x3);
        get matrix(): ƒ.Matrix3x3;
        setTime(_time: number): void;
    }
}
