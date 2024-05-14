"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CustomComponentScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(CustomComponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "CustomComponentScript added to ";
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* ƒ.EVENT.COMPONENT_ADD */:
                    ƒ.Debug.log(this.message, this.node);
                    break;
                case "componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */:
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
    }
    Script.CustomComponentScript = CustomComponentScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    async function initI18n(..._languages) {
        let resources = {};
        for (let lang of _languages) {
            try {
                let resource = await (await fetch(`Text/${lang}.json`)).json();
                resources[lang] = { translation: resource };
            }
            catch (error) {
                console.error(`failed to load language ${lang} due to error:`, error);
            }
        }
        i18next.init({
            lng: "en",
            fallbackLng: "de",
            resources,
            debug: true,
        });
    }
    Script.initI18n = initI18n;
})(Script || (Script = {}));
var Script;
(function (Script) {
    class Provider {
        items;
        constructor() {
            this.items = [];
        }
        add(type) {
            const information = this.getNewItemInformationOrThrow(type);
            information.itemConstructor = type;
            information.state = 1 /* ItemState.notInstantiated */;
            return this;
        }
        addInstance(type, instance) {
            const information = this.getNewItemInformationOrThrow(type);
            information.instance = instance;
            information.state = 3 /* ItemState.instantiated */;
            return this;
        }
        addFactory(type, factory) {
            const information = this.getNewItemInformationOrThrow(type);
            information.factory = factory;
            information.state = 1 /* ItemState.notInstantiated */;
            return this;
        }
        addSuper(type, constructor) {
            const information = this.getNewItemInformationOrThrow(type);
            information.itemConstructor = constructor;
            information.state = 1 /* ItemState.notInstantiated */;
            return this;
        }
        getRaw(type) {
            const information = this.getItemInformation(type);
            if (information.state === 0 /* ItemState.notAdded */) {
                throw new Error(`${information.type.name} hasn't been added and can't be provided.`);
            }
            if (information.state === 2 /* ItemState.instantiating */) {
                throw new Error(`${information.type.name} is in the middle of being instantiated. This propably means there is a dependency loop.`);
            }
            if (information.state === 1 /* ItemState.notInstantiated */) {
                this.instantiateItem(information);
            }
            if (!information.instance) {
                throw new Error(`Unable to get instance of ${information.type.name}.`);
            }
            return information.instance;
        }
        get(type) {
            const information = this.getItemInformation(type);
            if (information.proxy) {
                return information.proxy;
            }
            const provider = this;
            function getInstance() {
                if (information.instance) {
                    return information.instance;
                }
                return provider.getRaw(type);
            }
            const handler = {
                has(_, key) {
                    return key in getInstance();
                },
                get(_, key) {
                    return getInstance()[key];
                },
                set(_, key, value) {
                    getInstance()[key] = value;
                    return true;
                }
            };
            const proxy = new Proxy({}, handler);
            information.proxy = proxy;
            return proxy;
        }
        instantiateItem(information) {
            information.state = 2 /* ItemState.instantiating */;
            try {
                if (information.factory) {
                    const instance = information.factory(this);
                    information.instance = instance;
                }
                else if (information.itemConstructor) {
                    const instance = new information.itemConstructor(this);
                    information.instance = instance;
                }
                else {
                    throw new Error(`Unable to instatiate ${information.type.name}. Failed to find factory function or constructor.`);
                }
                information.state = 3 /* ItemState.instantiated */;
            }
            catch (error) {
                information.state = 1 /* ItemState.notInstantiated */;
                throw error;
            }
        }
        getNewItemInformationOrThrow(type) {
            const information = this.getItemInformation(type);
            if (information.state !== 0 /* ItemState.notAdded */) {
                throw new Error(`${type.name} has already been added to the provider.`);
            }
            return information;
        }
        getItemInformation(type) {
            const itemInformation = this.items.find(item => item.type === type);
            if (itemInformation) {
                return itemInformation;
            }
            const newInformation = {
                state: 0 /* ItemState.notAdded */,
                type: type,
            };
            this.items.push(newInformation);
            return newInformation;
        }
    }
    Script.Provider = Provider;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class CharacterManager {
        provider;
        movementVector = new ƒ.Vector2();
        #character;
        constructor(provider) {
            this.provider = provider;
            if (ƒ.Project.mode === ƒ.MODE.EDITOR)
                return;
            ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, this.update);
        }
        get character() {
            return this.#character;
        }
        set character(_char) {
            this.#character = _char;
        }
        setMovement(_direction) {
            this.movementVector = _direction;
        }
        update = () => {
            if (!this.#character)
                return;
            if (Script.gameState !== Script.GAMESTATE.PLAYING)
                return;
            this.#character.move(this.movementVector);
        };
    }
    Script.CharacterManager = CharacterManager;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    let TouchMode;
    (function (TouchMode) {
        TouchMode[TouchMode["FREE"] = 0] = "FREE";
        TouchMode[TouchMode["LOCKED"] = 1] = "LOCKED";
    })(TouchMode = Script.TouchMode || (Script.TouchMode = {}));
    class InputManager {
        provider;
        touchEventDispatcher;
        touchCircle;
        touchCircleInner;
        curentlyActiveTouchId = 0;
        touchRadiusVW = 15;
        touchRadiusPx = (screen.width / 100) * this.touchRadiusVW;
        touchRadiusScale = 1 / this.touchRadiusPx;
        characterManager;
        #touchMode;
        #touchStart;
        constructor(provider) {
            this.provider = provider;
            this.characterManager = provider.get(Script.CharacterManager);
        }
        get touchMode() {
            return this.#touchMode;
        }
        set touchMode(_touchMode) {
            this.#touchMode = _touchMode;
            if (_touchMode === TouchMode.LOCKED) {
                this.touchCircle.classList.remove("hidden");
                this.touchCircle.classList.add("locked");
                this.touchCircle.style.top = this.touchCircle.style.left = "";
            }
            else if (_touchMode === TouchMode.FREE) {
                this.touchCircle.classList.add("hidden");
                this.touchCircle.classList.remove("locked");
            }
        }
        setup(_touchMode = TouchMode.FREE) {
            let touchOverlay = document.getElementById("swipe-game-overlay");
            this.touchEventDispatcher = new ƒ.TouchEventDispatcher(touchOverlay);
            // touchOverlay.addEventListener(ƒ.EVENT_TOUCH.TAP, <EventListener>hndTouchEvent);
            touchOverlay.addEventListener(ƒ.EVENT_TOUCH.MOVE, this.hndTouchEvent);
            touchOverlay.addEventListener("touchstart", this.hndTouchEvent);
            // touchOverlay.addEventListener("touchmove", <EventListener>hndTouchEvent);
            touchOverlay.addEventListener("touchend", this.hndTouchEvent);
            this.touchCircle = document.getElementById("touch-circle");
            this.touchCircleInner = document.getElementById("touch-circle-inner");
            this.touchMode = _touchMode;
            document.addEventListener("keydown", this.hndKeyboardInput);
            document.addEventListener("keyup", this.hndKeyboardInput);
            document.addEventListener("keypress", this.hndKeyboardInput);
        }
        hndTouchEvent = (_event) => {
            let touches = _event.changedTouches ?? _event.detail.touches;
            if (!touches)
                return;
            if (_event.type === "touchstart" && !this.curentlyActiveTouchId) {
                if (this.#touchMode === TouchMode.LOCKED) {
                    if (_event.target !== this.touchCircle)
                        return;
                    let bcr = this.touchCircle.getBoundingClientRect();
                    this.#touchStart = new ƒ.Vector2(bcr.left + bcr.width / 2, bcr.top + bcr.height / 2);
                }
                else {
                    this.touchCircle.style.left = `calc(${touches[0].clientX}px - 7.5vw)`;
                    this.touchCircleInner.style.left = "";
                    this.touchCircle.style.top = `calc(${touches[0].clientY}px - 7.5vw)`;
                    this.touchCircleInner.style.top = "";
                    this.touchCircle.classList.remove("hidden");
                }
                this.curentlyActiveTouchId = touches[0].identifier;
                return;
            }
            if (_event.type === "touchend" && this.curentlyActiveTouchId === touches[0].identifier) {
                this.curentlyActiveTouchId = 0;
                this.touchCircleInner.style.top = "";
                this.touchCircleInner.style.left = "";
                if (this.#touchMode === TouchMode.FREE) {
                    this.touchCircle.classList.add("hidden");
                }
                this.characterManager.setMovement(ƒ.Vector2.ZERO());
                return;
            }
            if (_event.type === ƒ.EVENT_TOUCH.MOVE && this.curentlyActiveTouchId === touches[0].identifier) {
                let offsetX = _event.detail.offset.data[0];
                let offsetY = _event.detail.offset.data[1];
                if (this.#touchMode === TouchMode.LOCKED) {
                    offsetX = _event.detail.position.data[0] - this.#touchStart.x;
                    offsetY = _event.detail.position.data[1] - this.#touchStart.y;
                }
                let direction = new ƒ.Vector2(offsetX, -offsetY);
                direction.scale(this.touchRadiusScale);
                if (direction.magnitudeSquared > 1) {
                    direction.normalize(1);
                }
                this.characterManager.setMovement(direction);
                this.touchCircleInner.style.top = `${-direction.y * this.touchRadiusVW / 2 + 2.5}vw`;
                this.touchCircleInner.style.left = `${direction.x * this.touchRadiusVW / 2 + 2.5}vw`;
            }
        };
        hndKeyboardInput = () => {
            let direction = new ƒ.Vector2();
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT]))
                direction.add(new ƒ.Vector2(-1, 0));
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]))
                direction.add(new ƒ.Vector2(1, 0));
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]))
                direction.add(new ƒ.Vector2(0, -1));
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP]))
                direction.add(new ƒ.Vector2(0, 1));
            let mgtSqrt = direction.magnitudeSquared;
            if (mgtSqrt === 0) {
                this.characterManager.setMovement(direction);
                return;
            }
            if (mgtSqrt > 1) {
                direction.normalize(1);
            }
            this.characterManager.setMovement(direction);
        };
    }
    Script.InputManager = InputManager;
})(Script || (Script = {}));
/// <reference path="Provider.ts"/>
/// <reference path="Managers/CharacterManager.ts"/>
/// <reference path="Managers/InputManager.ts"/>
var Script;
/// <reference path="Provider.ts"/>
/// <reference path="Managers/CharacterManager.ts"/>
/// <reference path="Managers/InputManager.ts"/>
(function (Script) {
    Script.ƒ = FudgeCore;
    let GAMESTATE;
    (function (GAMESTATE) {
        GAMESTATE[GAMESTATE["IDLE"] = 0] = "IDLE";
        GAMESTATE[GAMESTATE["PLAYING"] = 1] = "PLAYING";
        GAMESTATE[GAMESTATE["PAUSED"] = 2] = "PAUSED";
    })(GAMESTATE = Script.GAMESTATE || (Script.GAMESTATE = {}));
    let viewport;
    document.addEventListener("interactiveViewportStarted", start);
    Script.provider = new Script.Provider();
    document.addEventListener("DOMContentLoaded", preStart);
    Script.gameState = GAMESTATE.IDLE;
    async function preStart() {
        if (Script.ƒ.Project.mode === Script.ƒ.MODE.EDITOR)
            return;
        Script.provider
            .add(Script.Config)
            .add(Script.InputManager)
            .add(Script.CharacterManager)
            .add(Script.ProjectileManager)
            .add(Script.EnemyManager)
            .add(Script.AnimationManager)
            .add(Script.CardManager);
        const config = Script.provider.get(Script.Config);
        await config.loadFiles();
        const inputManager = Script.provider.get(Script.InputManager);
        inputManager.setup(Script.TouchMode.FREE);
        const enemyManager = Script.provider.get(Script.EnemyManager);
        enemyManager.setup();
        const projectileManager = Script.provider.get(Script.ProjectileManager);
        projectileManager.setup();
    }
    function start(_event) {
        viewport = _event.detail;
        // viewport.physicsDebugMode = ƒ.PHYSICS_DEBUGMODE.COLLIDERS;
        Script.ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        Script.ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
        Script.gameState = GAMESTATE.PLAYING;
    }
    function update(_event) {
        Script.ƒ.Physics.simulate(); // if physics is included and used
        viewport.draw();
        // ƒ.AudioManager.default.update();
    }
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class SpriteAnimator {
        mtx;
        sprite;
        startTime;
        totalTime;
        frameTime;
        frameWidth;
        frameHeight;
        prevFrame = -1;
        constructor(_as, _startTime = ƒ.Time.game.get(), _mtx = new ƒ.Matrix3x3()) {
            this.mtx = _mtx;
            this.sprite = _as;
            this.startTime = _startTime;
            this.totalTime = Math.floor((_as.frames / _as.fps) * 1000);
            this.frameTime = Math.floor((1 / _as.fps) * 1000);
            this.frameWidth = _as.width / _as.totalWidth;
            this.frameHeight = _as.height / _as.totalHeight;
            this.mtx.scaling = new ƒ.Vector2(this.frameWidth, this.frameHeight);
        }
        get matrix() {
            return this.mtx;
        }
        setTime(_time = ƒ.Time.game.get()) {
            _time = (_time - this.startTime) % this.totalTime;
            let frame = Math.floor(_time / this.frameTime);
            if (frame === this.prevFrame)
                return;
            this.fireEvents(this.prevFrame, frame);
            this.prevFrame = frame;
            let column = frame % this.sprite.wrapAfter;
            let row = Math.floor(frame / this.sprite.wrapAfter);
            // console.log(frame, column, row);
            this.mtx.translation = new ƒ.Vector2(column * this.frameWidth, row * this.frameHeight);
        }
        reset(_as, _time = ƒ.Time.game.get()) {
            this.sprite = _as;
            this.startTime = _time;
            this.totalTime = Math.floor((_as.frames / _as.fps) * 1000);
            this.frameTime = Math.floor((1 / _as.fps) * 1000);
            this.frameWidth = _as.width / _as.totalWidth;
            this.frameHeight = _as.height / _as.totalHeight;
            this.mtx.scaling = new ƒ.Vector2(this.frameWidth, this.frameHeight);
        }
        fireEvents(_prevFrame, _currentFrame) {
            if (!this.sprite.events || !this.sprite.events.length)
                return;
            if (_prevFrame < 0 || _currentFrame < 0 || _prevFrame > this.sprite.frames || _currentFrame > this.sprite.frames)
                return;
            if (_currentFrame < _prevFrame)
                _currentFrame += this.sprite.frames;
            for (let frame = _prevFrame + 1; frame <= _currentFrame; frame++) {
                for (let event of this.sprite.events) {
                    if (event.frame === frame % this.sprite.frames) {
                        this.matrix.dispatchEvent(new CustomEvent(event.event, { detail: { frame, sprite: this.sprite }, bubbles: true }));
                    }
                }
            }
        }
    }
    Script.SpriteAnimator = SpriteAnimator;
})(Script || (Script = {}));
var Script;
(function (Script) {
    let PassiveCardEffect;
    (function (PassiveCardEffect) {
        PassiveCardEffect["COOLDOWN_REDUCTION"] = "cooldownReduction";
        PassiveCardEffect["PROJECTILE_SIZE"] = "projectileSize";
        PassiveCardEffect["PROJECTILE_SPEED"] = "projectileSpeed";
        PassiveCardEffect["PROJECTILE_AMOUNT"] = "projectileAmount";
        PassiveCardEffect["PROJECTILE_RANGE"] = "projectileRange";
        PassiveCardEffect["PROJECTILE_PIERCING"] = "projectilePiercing";
        PassiveCardEffect["DAMAGE"] = "damage";
        PassiveCardEffect["EFFECT_DURATION"] = "effectDuration";
        PassiveCardEffect["WEAPON_DURATION"] = "weaponDuration";
        PassiveCardEffect["KNOCKBACK"] = "knockback";
        PassiveCardEffect["CRIT_CHANCE"] = "criticalHitChance";
        PassiveCardEffect["CRIT_DAMAGE"] = "critialHitDamage";
        PassiveCardEffect["PLAYER_HEALTH"] = "playerHealth";
        PassiveCardEffect["PLAYER_REGENERATION"] = "playerRegeneration";
        PassiveCardEffect["COLLECTION_RADIUS"] = "collectionRadius";
        PassiveCardEffect["DAMAGE_REDUCTION"] = "damageReduction";
    })(PassiveCardEffect = Script.PassiveCardEffect || (Script.PassiveCardEffect = {}));
    let CardRarity;
    (function (CardRarity) {
        CardRarity["COMMON"] = "common";
        CardRarity["UNCOMMON"] = "uncommon";
        CardRarity["RARE"] = "rare";
        CardRarity["EPIC"] = "epic";
        CardRarity["LEGENDARY"] = "legendary";
    })(CardRarity = Script.CardRarity || (Script.CardRarity = {}));
    let ProjectileTargetMode;
    (function (ProjectileTargetMode) {
        ProjectileTargetMode[ProjectileTargetMode["NONE"] = 0] = "NONE";
        ProjectileTargetMode[ProjectileTargetMode["CLOSEST"] = 1] = "CLOSEST";
        ProjectileTargetMode[ProjectileTargetMode["STRONGEST"] = 2] = "STRONGEST";
    })(ProjectileTargetMode = Script.ProjectileTargetMode || (Script.ProjectileTargetMode = {}));
    let ProjectileTarget;
    (function (ProjectileTarget) {
        ProjectileTarget[ProjectileTarget["PLAYER"] = 0] = "PLAYER";
        ProjectileTarget[ProjectileTarget["ENEMY"] = 1] = "ENEMY";
    })(ProjectileTarget = Script.ProjectileTarget || (Script.ProjectileTarget = {}));
    //#endregion
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class HitZoneGraphInstance extends ƒ.GraphInstance {
        initialized = false;
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
        }
        recycle() {
            // this.getComponent(ProjectileComponent).recycle();
        }
        async set(_graph) {
            await super.set(_graph);
            this.initialized = true;
        }
    }
    Script.HitZoneGraphInstance = HitZoneGraphInstance;
})(Script || (Script = {}));
/// <reference path="../Types.ts" />
var Script;
/// <reference path="../Types.ts" />
(function (Script) {
    class ProjectileComponent extends Script.ƒ.Component {
        tracking;
        direction;
        targetPosition;
        damage;
        size;
        speed;
        range;
        piercing;
        target;
        diminishing;
        artillery;
        impact;
        targetMode;
        lockedToEntity;
        hazardZone;
        static defaults = {
            targetPosition: undefined,
            direction: new Script.ƒ.Vector3(),
            piercing: 0,
            range: Infinity,
            size: 0.5,
            speed: 2,
            damage: 1,
            target: Script.ProjectileTarget.PLAYER,
            tracking: undefined,
            diminishing: false,
            targetMode: Script.ProjectileTargetMode.NONE,
            lockedToEntity: false,
            impact: undefined,
            artillery: false
        };
        constructor() {
            super();
            if (Script.ƒ.Project.mode == Script.ƒ.MODE.EDITOR)
                return;
            this.addEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, this.init);
        }
        init = () => {
            this.removeEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, this.init);
            // setup physics
            this.node.getComponent(Script.ƒ.ComponentRigidbody).removeEventListener("TriggerEnteredCollision" /* ƒ.EVENT_PHYSICS.TRIGGER_ENTER */, this.onTriggerEnter);
            this.node.getComponent(Script.ƒ.ComponentRigidbody).removeEventListener("TriggerLeftCollision" /* ƒ.EVENT_PHYSICS.TRIGGER_EXIT */, this.onTriggerExit);
        };
        async setup(_options, _manager) {
            _options = { ...ProjectileComponent.defaults, ..._options };
            this.direction = _options.direction;
            this.targetPosition = _options.targetPosition;
            this.tracking = _options.tracking;
            this.damage = _options.target === Script.ProjectileTarget.PLAYER ? _options.damage : (_options.damage + _manager.getEffectAbsolute(Script.PassiveCardEffect.DAMAGE)) * _manager.getEffectMultiplier(Script.PassiveCardEffect.DAMAGE);
            this.size = _options.target === Script.ProjectileTarget.PLAYER ? _options.size : (_options.size + _manager.getEffectAbsolute(Script.PassiveCardEffect.PROJECTILE_SIZE)) * _manager.getEffectMultiplier(Script.PassiveCardEffect.PROJECTILE_SIZE);
            this.speed = _options.target === Script.ProjectileTarget.PLAYER ? _options.speed : (_options.speed + _manager.getEffectAbsolute(Script.PassiveCardEffect.PROJECTILE_SPEED)) * _manager.getEffectMultiplier(Script.PassiveCardEffect.PROJECTILE_SPEED);
            this.range = _options.target === Script.ProjectileTarget.PLAYER ? _options.range : (_options.range + _manager.getEffectAbsolute(Script.PassiveCardEffect.PROJECTILE_RANGE)) * _manager.getEffectMultiplier(Script.PassiveCardEffect.PROJECTILE_RANGE);
            this.piercing = (_options.piercing + _manager.getEffectAbsolute(Script.PassiveCardEffect.PROJECTILE_PIERCING)) * _manager.getEffectMultiplier(Script.PassiveCardEffect.PROJECTILE_PIERCING);
            this.target = _options.target;
            this.artillery = _options.artillery;
            this.diminishing = _options.diminishing;
            this.impact = _options.impact;
            this.targetMode = _options.targetMode;
            this.lockedToEntity = _options.lockedToEntity;
            this.node.mtxLocal.scaling = Script.ƒ.Vector3.ONE(this.size);
            this.hazardZone = undefined;
            //TODO rotate projectile towards flight direction
            if (this.artillery) {
                let pos = new Script.ƒ.Vector3();
                if (this.target === Script.ProjectileTarget.PLAYER) {
                    pos = await Script.provider.get(Script.CharacterManager).character.node.mtxWorld.translation.clone;
                }
                let hz = await Script.provider.get(Script.ProjectileManager).createHitZone(pos);
                this.tracking = {
                    strength: 200,
                    target: hz,
                    startTrackingAfter: 1
                };
                this.hazardZone = hz;
                this.direction = Script.ƒ.Vector3.Y(this.speed);
                this.targetPosition = pos;
            }
            if (this.tracking) {
                this.tracking = { ...{ stopTrackingAfter: Infinity, stopTrackingInRadius: 0, strength: 1, startTrackingAfter: 0 }, ...this.tracking };
            }
        }
        update(_charPosition, _frameTimeInSeconds) {
            this.move(_frameTimeInSeconds);
        }
        move(_frameTimeInSeconds) {
            if (this.tracking) {
                this.tracking.startTrackingAfter -= _frameTimeInSeconds;
                if (this.tracking.startTrackingAfter <= 0) {
                    this.tracking.stopTrackingAfter -= _frameTimeInSeconds;
                    let diff = Script.ƒ.Vector3.DIFFERENCE(this.tracking.target.mtxWorld.translation, this.node.mtxWorld.translation);
                    // we need to track a certain node, so modify direction accordingly
                    this.direction.add(Script.ƒ.Vector3.SCALE(diff, (this.tracking.strength ?? 1) * Math.min(_frameTimeInSeconds, 1)));
                    let mgtSqrd = diff.magnitudeSquared;
                    if (this.tracking.stopTrackingAfter <= 0 || (mgtSqrd <= Math.pow(this.tracking.stopTrackingInRadius, 2) && mgtSqrd !== 0)) {
                        console.log("stop tracking", this.tracking.stopTrackingAfter);
                        // end of tracking
                        this.tracking = undefined;
                    }
                }
            }
            let dir = this.direction.clone;
            dir.normalize(Math.min(1, _frameTimeInSeconds) * this.speed);
            this.node.mtxLocal.translate(dir);
            if (this.targetPosition && this.node.mtxWorld.translation.equals(this.targetPosition, 0.5)) {
                if (this.artillery && this.tracking.startTrackingAfter > 0)
                    return;
                // target position reached
                if (this.hazardZone) {
                    Script.ƒ.Recycler.store(this.hazardZone);
                    this.hazardZone.getParent().removeChild(this.hazardZone);
                    this.hazardZone = undefined;
                }
                if (this.impact && this.impact.length) {
                    for (let impact of this.impact) {
                        //TODO implement impacts
                    }
                }
                Script.provider.get(Script.ProjectileManager).removeProjectile(this);
            }
        }
        onTriggerEnter = (_event) => {
            console.log("onTriggerEnter", _event);
        };
        onTriggerExit = (_event) => {
            console.log("onTriggerExit", _event);
        };
    }
    Script.ProjectileComponent = ProjectileComponent;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class ProjectileGraphInstance extends ƒ.GraphInstance {
        initialized = false;
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
        }
        recycle() {
            // this.getComponent(ProjectileComponent).recycle();
        }
        async set(_graph) {
            await super.set(_graph);
            this.initialized = true;
        }
    }
    Script.ProjectileGraphInstance = ProjectileGraphInstance;
})(Script || (Script = {}));
/// <reference path="../Types.ts" />
var Script;
/// <reference path="../Types.ts" />
(function (Script) {
    Script.projectiles = {
        "toastPlayer": {
            damage: 1,
            speed: 3,
        },
        "toast": {
            damage: 1,
            speed: 3,
            targetMode: Script.ProjectileTargetMode.CLOSEST,
            artillery: true,
        }
    };
})(Script || (Script = {}));
var Script;
(function (Script) {
    class Card {
        name;
        description;
        image;
        rarity;
        levels;
        #level;
        #cm;
        #pm;
        #charm;
        constructor(_init, _level = 0, _nameFallback = "unknown") {
            this.name = _init.name ?? `cards.${_nameFallback}.name`;
            this.description = _init.description ?? i18next.t(`cards.${_nameFallback}.text`);
            this.image = _init.image;
            this.rarity = _init.rarity;
            this.levels = _init.levels;
            this.level = _level;
            this.#cm = Script.provider.get(Script.CardManager);
            this.#pm = Script.provider.get(Script.ProjectileManager);
            this.#charm = Script.provider.get(Script.CharacterManager);
        }
        get level() {
            return this.#level;
        }
        set level(_level) {
            this.#level = Math.max(0, Math.min(this.levels.length, _level));
        }
        get effects() {
            return structuredClone(this.levels[this.level].passiveEffects);
        }
        update(_time, _cumulatedEffects) {
            if (!this.levels[this.level].activeEffects || !this.levels[this.level].activeEffects.length)
                return;
            for (let effect of this.levels[this.level].activeEffects) {
                if (isNaN(effect.currentCooldown))
                    effect.currentCooldown = 0;
                effect.currentCooldown -= _time;
                if (effect.currentCooldown <= 0) {
                    effect.currentCooldown = this.#cm.modifyValue(effect.cooldown, Script.PassiveCardEffect.COOLDOWN_REDUCTION, effect.modifiers);
                    switch (effect.type) {
                        case "projectile":
                            for (let i = 0; i < (effect.amount ?? 1); i++) {
                                setTimeout(() => {
                                    let pos = this.#charm.character.node.mtxWorld.translation.clone;
                                    if (effect.offset) {
                                        if (typeof effect.offset === "string") {
                                            pos.add(eval(effect.offset));
                                        }
                                        else {
                                            pos.add(effect.offset);
                                        }
                                    }
                                    let projectile = Script.projectiles[effect.projectile];
                                    Script.provider.get(Script.ProjectileManager).createProjectile(projectile, pos, projectile.lockedToEntity ? this.#charm.character.node : undefined);
                                }, i * (effect.delay ?? 0));
                            }
                            break;
                    }
                }
            }
        }
    }
    Script.Card = Card;
})(Script || (Script = {}));
/// <reference path="../Types.ts" />
var Script;
/// <reference path="../Types.ts" />
(function (Script) {
    Script.cards = {
        "test": {
            image: "./Assets/Cards/test.png",
            rarity: Script.CardRarity.COMMON,
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
            image: "./Assets/Cards/test.png",
            rarity: Script.CardRarity.COMMON,
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
        }
    };
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class Character extends ƒ.Component {
        #animator;
        #walkingSprite = {
            fps: 24,
            frames: 24,
            height: 256,
            width: 256,
            totalHeight: 1280,
            totalWidth: 1280,
            wrapAfter: 5,
        };
        #idleSprite = {
            fps: 24,
            frames: 24,
            height: 256,
            width: 256,
            totalHeight: 1280,
            totalWidth: 1280,
            wrapAfter: 5,
        };
        prevAnimation = AnimationState.IDLE;
        #layers = [];
        prevDirection = 0;
        constructor() {
            super();
            if (ƒ.Project.mode === ƒ.MODE.EDITOR)
                return;
            this.addEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, () => {
                this.node.addEventListener("graphInstantiated" /* ƒ.EVENT.GRAPH_INSTANTIATED */, () => {
                    Script.provider.get(Script.CharacterManager).character = this;
                }, true);
                this.setupAnimator();
            });
        }
        move(_direction) {
            //TODO: update this to use physics
            this.node.mtxLocal.translate(ƒ.Vector3.SCALE(new ƒ.Vector3(_direction.x, _direction.y), Math.min(1, ƒ.Loop.timeFrameGame / 1000)), false);
            this.#animator.setTime();
            if (_direction.magnitudeSquared === 0) {
                this.setAnimation(AnimationState.IDLE);
            }
            else {
                this.setAnimation(AnimationState.WALKING);
            }
            let dir = Math.sign(_direction.x);
            if (dir !== this.prevDirection && dir !== 0) {
                this.prevDirection = dir;
                if (this.prevDirection > 0) {
                    this.node.mtxLocal.rotation = new ƒ.Vector3();
                }
                else if (this.prevDirection < 0) {
                    this.node.mtxLocal.rotation = new ƒ.Vector3(0, 180, 0);
                }
            }
        }
        setAnimation(_state) {
            if (_state === this.prevAnimation)
                return;
            this.prevAnimation = _state;
            switch (this.prevAnimation) {
                case AnimationState.IDLE:
                    this.#animator.reset(this.#idleSprite);
                    break;
                case AnimationState.WALKING:
                    this.#animator.reset(this.#walkingSprite);
                    break;
            }
            for (let layer of this.#layers) {
                layer.setTexture(_state);
            }
        }
        setupAnimator = () => {
            this.#animator = new Script.SpriteAnimator(this.#idleSprite);
            for (let child of this.node.getChildren()) {
                child.getComponent(ƒ.ComponentMaterial).mtxPivot = this.#animator.matrix;
                this.#layers.push(child.getComponent(Script.CharacterLayer));
            }
            this.setAnimation(AnimationState.IDLE);
        };
    }
    Script.Character = Character;
    let AnimationState;
    (function (AnimationState) {
        AnimationState["IDLE"] = "idle";
        AnimationState["WALKING"] = "walking";
    })(AnimationState = Script.AnimationState || (Script.AnimationState = {}));
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class CharacterLayer extends ƒ.Component {
        #layerId = 0;
        #material;
        #textures;
        constructor() {
            super();
            if (ƒ.Project.mode === ƒ.MODE.EDITOR)
                return;
            this.addEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, () => {
                this.#layerId = Number(this.node.name.slice(9));
                this.#material = this.node.getComponent(ƒ.ComponentMaterial).material.coat;
            });
            ƒ.Project.addEventListener("resourcesLoaded" /* ƒ.EVENT.RESOURCES_LOADED */, async () => {
                let allTextures = await ƒ.Project.getResourcesByType(ƒ.TextureImage);
                this.#textures = {
                    idle: allTextures.find(t => t.name.includes("Robot_base_idle_Layer" + this.#layerId)),
                    walking: allTextures.find(t => t.name.includes("Robot_base_walk_Layer" + this.#layerId)),
                };
            });
        }
        setTexture(_state) {
            if (!this.#textures[_state])
                return;
            this.#material.texture = this.#textures[_state];
        }
    }
    Script.CharacterLayer = CharacterLayer;
})(Script || (Script = {}));
var Script;
(function (Script) {
    Script.enemies = {
        microwave: {
            moveSprite: ["microwave", "move"],
            damage: 5,
            desiredDistance: [0, 0],
            health: 10,
            speed: 1,
            knockbackMultiplier: 1,
            dropXP: 1,
        },
        toaster: {
            moveSprite: ["toaster", "move"],
            speed: 0.5,
            desiredDistance: [3, 4],
            attacks: [
                {
                    cooldown: 2,
                    requiredDistance: [2, 3],
                    attackSprite: ["toaster", "attack"],
                    cooldownSprite: ["toaster", "idle"],
                    windUp: 1,
                    movement: () => { },
                    events: {
                        fire: function () {
                            Script.provider.get(Script.ProjectileManager).createProjectile({
                                direction: Script.ƒ.Vector3.DIFFERENCE(Script.provider.get(Script.CharacterManager).character.node.mtxWorld.translation, this.node.mtxWorld.translation),
                                target: Script.ProjectileTarget.PLAYER,
                                speed: 20,
                                artillery: true
                            }, Script.ƒ.Vector3.SUM(this.node.mtxWorld.translation, Script.ƒ.Vector3.Y(0.3)));
                        }
                    }
                }
            ]
        },
        motor: {
            moveSprite: ["motor", "move"],
            speed: 3,
        },
        chair: {
            moveSprite: ["chair", "move"],
            speed: 0.5,
            desiredDistance: [0, 0],
        }
    };
})(Script || (Script = {}));
var Script;
(function (Script) {
    class Enemy extends Script.ƒ.Component {
        speed = 1;
        damage = 1;
        knockbackMultiplier = 1;
        health = 1;
        attacks = [];
        moveSprite;
        desiredDistance = [0, 0];
        directionOverride;
        currentlyDesiredDistance = [0, 0];
        currentlyDesiredDistanceSquared = [0, 0];
        dropXP = 0;
        material;
        enemyManager;
        prevDirection;
        currentlyActiveAttack;
        currentlyActiveSprite;
        rigidbody;
        static defaults = {
            attacks: [],
            damage: 1,
            speed: 1,
            desiredDistance: [0, 0],
            dropXP: 1,
            health: 1,
            knockbackMultiplier: 1,
            moveSprite: {
                fps: 1,
                frames: 1,
                height: 256,
                width: 256,
                totalHeight: 256,
                totalWidth: 256,
                wrapAfter: 1,
            },
            directionOverride: undefined,
        };
        constructor() {
            super();
            if (Script.ƒ.Project.mode === Script.ƒ.MODE.EDITOR)
                return;
            this.addEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, this.deserialized);
        }
        deserialized = () => {
            this.removeEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, this.deserialized);
            this.material = this.node.getComponent(Script.ƒ.ComponentMaterial);
            this.enemyManager = Script.provider.get(Script.EnemyManager);
            this.rigidbody = this.node.getComponent(Script.ƒ.ComponentRigidbody);
            this.rigidbody.effectGravity = 0;
            this.rigidbody.effectRotation = new Script.ƒ.Vector3(0, 0, 0);
        };
        setup(_options) {
            _options = { ...Enemy.defaults, ..._options };
            this.speed = _options.speed;
            this.damage = _options.damage;
            this.knockbackMultiplier = _options.knockbackMultiplier;
            this.health = _options.health;
            this.attacks = _options.attacks;
            this.desiredDistance = _options.desiredDistance;
            this.dropXP = _options.dropXP;
            this.directionOverride = _options.directionOverride;
            this.updateDesiredDistance(this.desiredDistance);
            this.moveSprite = this.getSprite(_options.moveSprite);
            this.setCentralAnimator(this.moveSprite);
        }
        updateDesiredDistance(_distance) {
            this.currentlyDesiredDistance = _distance;
            this.currentlyDesiredDistanceSquared = [this.currentlyDesiredDistance[0] * this.currentlyDesiredDistance[0], this.currentlyDesiredDistance[1] * this.currentlyDesiredDistance[1]];
        }
        getSprite(_sp) {
            if (!_sp)
                return undefined;
            if (("frames" in _sp)) {
                return _sp;
            }
            else {
                return Script.provider.get(Script.Config).getAnimation(_sp[0], _sp[1]);
            }
        }
        #uniqueAnimationId;
        setCentralAnimator(_as, _unique = false) {
            if (!_as)
                return;
            let am = Script.provider.get(Script.AnimationManager);
            if (this.currentlyActiveSprite && this.currentlyActiveSprite.events) {
                for (let event of this.currentlyActiveSprite.events) {
                    this.material.mtxPivot.removeEventListener(event.event, this.eventListener);
                }
            }
            if (this.#uniqueAnimationId) {
                am.removeUniqueAnimationMtx(this.#uniqueAnimationId);
                this.#uniqueAnimationId = undefined;
            }
            if (_unique) {
                [this.material.mtxPivot, this.#uniqueAnimationId] = am.getUniqueAnimationMtx(_as);
            }
            else {
                this.material.mtxPivot = am.getAnimationMtx(_as);
            }
            if (_as.material)
                this.material.material = _as.material;
            this.currentlyActiveSprite = _as;
            if (this.currentlyActiveSprite && this.currentlyActiveSprite.events) {
                for (let event of this.currentlyActiveSprite.events) {
                    this.material.mtxPivot.addEventListener(event.event, this.eventListener);
                }
            }
        }
        update(_charPosition, _frameTimeInSeconds) {
            // check distance to player
            let diff = Script.ƒ.Vector3.DIFFERENCE(_charPosition, this.node.mtxLocal.translation);
            let mgtSqrd = diff.magnitudeSquared;
            if (this.currentlyActiveAttack && this.currentlyActiveAttack.movement && this.currentlyActiveAttack.started) {
                this.currentlyActiveAttack.movement.call(this, diff, mgtSqrd, _charPosition, _frameTimeInSeconds);
            }
            else {
                this.move(diff, mgtSqrd, _frameTimeInSeconds);
            }
            // if the enemy has special attacks and none are active, choose one
            this.chooseAttack();
            // if there is a currently active attack, execute it
            this.executeAttack(mgtSqrd, _frameTimeInSeconds);
        }
        move(_diff, _mgtSqrd, _frameTimeInSeconds) {
            if (this.directionOverride) {
                // do we have a movement override?
                let direction = this.directionOverride.clone;
                direction.normalize(this.speed);
                //TODO: change to physics based movement
                // this.node.mtxLocal.translate(direction, false);
                this.rigidbody.setVelocity(direction);
            }
            else {
                // normal movement
                _diff.normalize(this.speed);
                //move towards or away from player?
                if (_mgtSqrd < this.currentlyDesiredDistanceSquared[0]) {
                    // we're too close to the player, gotta move away
                    _diff.scale(-1);
                }
                else if (_mgtSqrd > this.currentlyDesiredDistanceSquared[0] && _mgtSqrd < this.currentlyDesiredDistanceSquared[1]) {
                    // we're in a good distance to the player, no need to move further
                    _diff = Script.ƒ.Vector3.ZERO();
                    //TODO: set idle animation
                }
                //TODO: change to physics based movement
                // this.node.mtxLocal.translate(_diff, false);
                this.rigidbody.setVelocity(_diff);
            }
            // rotate visually to face correct direction
            let dir = Math.sign(_diff.x);
            if (dir !== this.prevDirection && dir !== 0) {
                this.prevDirection = dir;
                if (this.prevDirection > 0) {
                    this.node.getComponent(Script.ƒ.ComponentMesh).mtxPivot.rotation = new Script.ƒ.Vector3();
                }
                else if (this.prevDirection < 0) {
                    this.node.getComponent(Script.ƒ.ComponentMesh).mtxPivot.rotation = new Script.ƒ.Vector3(0, 180, 0);
                }
            }
        }
        chooseAttack() {
            if (this.currentlyActiveAttack || this.attacks.length === 0)
                return;
            this.currentlyActiveAttack = { ...this.attacks[Math.floor(Math.random() * this.attacks.length)] };
            this.currentlyActiveAttack.started = false;
            this.currentlyActiveAttack.done = false;
            this.updateDesiredDistance(this.currentlyActiveAttack.requiredDistance);
        }
        executeAttack(_mgtSqrd, _frameTimeInSeconds) {
            if (!this.currentlyActiveAttack)
                return;
            if (!this.currentlyActiveAttack.started) {
                // attack hasn't started yet. should we start it?
                if (_mgtSqrd > this.currentlyDesiredDistanceSquared[0] && _mgtSqrd < this.currentlyDesiredDistanceSquared[1]) {
                    // start the attack
                    this.currentlyActiveAttack.started = true;
                    this.setCentralAnimator(this.getSprite(this.currentlyActiveAttack.attackSprite), true);
                }
            }
            if (this.currentlyActiveAttack.started) {
                // attack is ongoingw
                if (this.currentlyActiveAttack.windUp > 0) {
                    // still preparing
                    this.currentlyActiveAttack.windUp -= _frameTimeInSeconds;
                }
                else if (!this.currentlyActiveAttack.done) {
                    // time to execute attack
                    this.currentlyActiveAttack.done = true;
                    this.currentlyActiveAttack.attack?.call(this);
                    this.setCentralAnimator(this.getSprite(this.currentlyActiveAttack.cooldownSprite), true);
                }
                else {
                    //we're on cooldown now
                    this.currentlyActiveAttack.cooldown -= _frameTimeInSeconds;
                    if (this.currentlyActiveAttack.cooldown < 0) {
                        // cooldown is up, we're ready to do something else
                        this.currentlyActiveAttack = undefined;
                        this.updateDesiredDistance(this.desiredDistance);
                        this.setCentralAnimator(this.moveSprite);
                    }
                }
            }
        }
        eventListener = (_event) => {
            if (!this.currentlyActiveAttack.events)
                return;
            if (!this.currentlyActiveAttack.events[_event.type])
                return;
            this.currentlyActiveAttack.events[_event.type].call(this, _event);
        };
        getDamaged(_dmg) {
            this.health -= _dmg;
            if (this.health > 0)
                return;
            this.enemyManager.removeEnemy(this);
            //TODO: drop XP
        }
    }
    Script.Enemy = Enemy;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class EnemyGraphInstance extends ƒ.GraphInstance {
        initialized = false;
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
        }
        recycle() {
            // this.getComponent(Enemy).recycle();
        }
        async set(_graph) {
            await super.set(_graph);
            this.initialized = true;
        }
    }
    Script.EnemyGraphInstance = EnemyGraphInstance;
})(Script || (Script = {}));
var Script;
(function (Script) {
    class AnimationManager {
        provider;
        shared = {};
        unique = new Map();
        currentUniqueId = 0;
        constructor(provider) {
            this.provider = provider;
            if (Script.ƒ.Project.mode === Script.ƒ.MODE.EDITOR)
                return;
            Script.ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, this.update);
        }
        update = () => {
            if (Script.gameState !== Script.GAMESTATE.PLAYING)
                return;
            let time = Script.ƒ.Time.game.get();
            for (let type in this.shared) {
                for (let sa of this.shared[type]) {
                    sa.setTime(time);
                }
            }
            for (let sa of this.unique.values()) {
                sa.setTime(time);
            }
        };
        getUniqueAnimationMtx(_sprite) {
            this.currentUniqueId++;
            this.unique.set(this.currentUniqueId, new Script.SpriteAnimator(_sprite));
            return [this.unique.get(this.currentUniqueId).matrix, this.currentUniqueId];
        }
        getAnimationMtx(_sprite) {
            let type = `${_sprite.width}x${_sprite.height}in${_sprite.totalWidth}x${_sprite.totalHeight}with${_sprite.frames}at${_sprite.fps}and${_sprite.wrapAfter}`;
            if (!this.shared[type]) {
                let gameTime = Script.ƒ.Time.game.get();
                let animTime = Math.floor((_sprite.frames / _sprite.fps) * 1000);
                this.shared[type] = [
                    new Script.SpriteAnimator(_sprite, gameTime),
                    new Script.SpriteAnimator(_sprite, gameTime + Math.floor((Math.random() * animTime))),
                    new Script.SpriteAnimator(_sprite, gameTime + Math.floor((Math.random() * animTime))),
                    new Script.SpriteAnimator(_sprite, gameTime + Math.floor((Math.random() * animTime))),
                ];
            }
            return this.shared[type][Math.floor(Math.random() * this.shared[type].length)].matrix;
        }
        removeUniqueAnimationMtx(_id) {
            this.unique.delete(_id);
        }
    }
    Script.AnimationManager = AnimationManager;
})(Script || (Script = {}));
var Script;
(function (Script) {
    class CardManager {
        currentlyActiveCards;
        cumulativeEffects = {};
        getEffectAbsolute(_effect, _modifier = this.cumulativeEffects) {
            return _modifier.absolute?.[_effect] ?? 0;
        }
        getEffectMultiplier(_effect, _modifier = this.cumulativeEffects) {
            return _modifier.multiplier?.[_effect] ?? 1;
        }
        modifyValue(_value, _effect, _localModifiers) {
            if (_localModifiers) {
                _value = (_value + this.getEffectAbsolute(_effect, _localModifiers)) * this.getEffectMultiplier(_effect, _localModifiers);
            }
            return (_value + this.getEffectAbsolute(_effect)) * this.getEffectMultiplier(_effect);
        }
        updateEffects() {
            this.cumulativeEffects = {};
            for (let card of this.currentlyActiveCards) {
                let effects = card.effects;
                let effect;
                for (effect in effects.absolute) {
                    this.cumulativeEffects.absolute[effect] = (this.cumulativeEffects.absolute[effect] ?? 0) + effects.absolute[effect];
                }
                for (effect in effects.multiplier) {
                    this.cumulativeEffects.multiplier[effect] = (this.cumulativeEffects.multiplier[effect] ?? 1) * effects.multiplier[effect];
                }
            }
        }
    }
    Script.CardManager = CardManager;
})(Script || (Script = {}));
var Script;
(function (Script) {
    class Config {
        animations;
        constructor() {
        }
        async loadFiles() {
            const animationFilePath = "./Assets/Enemies/animations.json";
            this.animations = await (await fetch(animationFilePath)).json();
        }
        getAnimation(_enemyID, _animationID) {
            if (!this.animations[_enemyID])
                return undefined;
            if (!this.animations[_enemyID].animations[_animationID])
                return undefined;
            let anim = this.animations[_enemyID].animations[_animationID];
            if (!anim.material) {
                let materials = Script.ƒ.Project.getResourcesByType(Script.ƒ.Material);
                anim.material = materials.find(mat => mat.idResource === anim.materialString);
            }
            return anim;
        }
    }
    Script.Config = Config;
})(Script || (Script = {}));
var Script;
(function (Script) {
    class EnemyManager {
        provider;
        characterManager;
        config;
        enemyScripts = [];
        enemies = [];
        enemyGraph;
        enemyNode;
        constructor(provider) {
            this.provider = provider;
            if (Script.ƒ.Project.mode === Script.ƒ.MODE.EDITOR)
                return;
            document.addEventListener("interactiveViewportStarted", this.start);
            Script.ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, this.update);
            Script.ƒ.Project.addEventListener("resourcesLoaded" /* ƒ.EVENT.RESOURCES_LOADED */, this.loaded);
            this.characterManager = provider.get(Script.CharacterManager);
            this.config = provider.get(Script.Config);
        }
        setup() {
            Script.ƒ.Debug.log("EnemyManager setup");
        }
        start = (_event) => {
            let viewport = _event.detail;
            this.enemyNode = viewport.getBranch().getChildrenByName("enemies")[0];
        };
        loaded = async () => {
            this.enemyGraph = await Script.ƒ.Project.getResourcesByName("enemy")[0];
        };
        update = () => {
            if (Script.gameState !== Script.GAMESTATE.PLAYING)
                return;
            let character = this.characterManager.character;
            if (!character)
                return;
            // create new enemies if needed
            this.spawnEnemies();
            // update enemies
            let time = Script.ƒ.Loop.timeFrameGame / 1000;
            for (let enemy of this.enemyScripts) {
                enemy.update(character.node.mtxWorld.translation, time);
            }
        };
        async spawnEnemies() {
            if (this.enemies.length >= 2) {
                return;
            }
            // debug: spawn two different enemies
            let newEnemyGraphInstance = Script.ƒ.Recycler.get(Script.EnemyGraphInstance);
            if (!newEnemyGraphInstance.initialized) {
                await newEnemyGraphInstance.set(this.enemyGraph);
            }
            newEnemyGraphInstance.mtxLocal.translation = this.characterManager.character.node.mtxWorld.translation;
            newEnemyGraphInstance.mtxLocal.translate(Script.ƒ.Vector3.NORMALIZATION(new Script.ƒ.Vector3(Math.cos(Math.random() * 2 * Math.PI), Math.sin(Math.random() * 2 * Math.PI)), 5));
            this.enemyNode.addChild(newEnemyGraphInstance);
            this.enemies.push(newEnemyGraphInstance);
            let enemyScript = newEnemyGraphInstance.getComponent(Script.Enemy);
            enemyScript.setup(Script.enemies["toaster"]);
            this.enemyScripts.push(enemyScript);
            newEnemyGraphInstance = Script.ƒ.Recycler.get(Script.EnemyGraphInstance);
            if (!newEnemyGraphInstance.initialized) {
                await newEnemyGraphInstance.set(this.enemyGraph);
            }
            newEnemyGraphInstance.mtxLocal.translation = this.characterManager.character.node.mtxWorld.translation;
            newEnemyGraphInstance.mtxLocal.translate(Script.ƒ.Vector3.NORMALIZATION(new Script.ƒ.Vector3(Math.cos(Math.random() * 2 * Math.PI), Math.sin(Math.random() * 2 * Math.PI)), 5));
            this.enemyNode.addChild(newEnemyGraphInstance);
            this.enemies.push(newEnemyGraphInstance);
            enemyScript = newEnemyGraphInstance.getComponent(Script.Enemy);
            enemyScript.setup(Script.enemies["chair"]);
            this.enemyScripts.push(enemyScript);
            newEnemyGraphInstance = Script.ƒ.Recycler.get(Script.EnemyGraphInstance);
            if (!newEnemyGraphInstance.initialized) {
                await newEnemyGraphInstance.set(this.enemyGraph);
            }
            newEnemyGraphInstance.mtxLocal.translation = this.characterManager.character.node.mtxWorld.translation.clone;
            newEnemyGraphInstance.mtxLocal.translate(new Script.ƒ.Vector3(0, 10));
            this.enemyNode.addChild(newEnemyGraphInstance);
            this.enemies.push(newEnemyGraphInstance);
            enemyScript = newEnemyGraphInstance.getComponent(Script.Enemy);
            enemyScript.setup({
                moveSprite: this.config.getAnimation("motor", "move"),
                speed: 3,
                directionOverride: Script.ƒ.Vector3.Y(-1),
            });
            this.enemyScripts.push(enemyScript);
        }
        removeEnemy(_enemy) {
            let index = this.enemyScripts.findIndex((n) => n === _enemy);
            if (index >= 0) {
                this.enemyScripts.splice(index, 1);
                Script.ƒ.Recycler.storeMultiple(this.enemies.splice(index, 1));
            }
        }
    }
    Script.EnemyManager = EnemyManager;
})(Script || (Script = {}));
var Script;
(function (Script) {
    class ProjectileManager {
        provider;
        characterManager;
        config;
        projectileScripts = [];
        projectiles = [];
        static projectileGraph;
        static hitZoneGraph;
        projectilesNode;
        constructor(provider) {
            this.provider = provider;
            if (Script.ƒ.Project.mode === Script.ƒ.MODE.EDITOR)
                return;
            document.addEventListener("interactiveViewportStarted", this.start);
            Script.ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, this.update);
            Script.ƒ.Project.addEventListener("resourcesLoaded" /* ƒ.EVENT.RESOURCES_LOADED */, this.loaded);
            this.characterManager = provider.get(Script.CharacterManager);
            this.config = provider.get(Script.Config);
        }
        setup() {
            Script.ƒ.Debug.log("EnemyManager setup");
        }
        start = (_event) => {
            let viewport = _event.detail;
            this.projectilesNode = viewport.getBranch().getChildrenByName("projectiles")[0];
        };
        loaded = async () => {
            ProjectileManager.projectileGraph = await Script.ƒ.Project.getResourcesByName("projectile")[0];
            ProjectileManager.hitZoneGraph = await Script.ƒ.Project.getResourcesByName("hitzone")[0];
        };
        update = () => {
            if (Script.gameState !== Script.GAMESTATE.PLAYING)
                return;
            let character = this.characterManager.character;
            if (!character)
                return;
            // update projectiles
            let time = Script.ƒ.Loop.timeFrameGame / 1000;
            for (let projectile of this.projectileScripts) {
                projectile.update(character.node.mtxWorld.translation, time);
            }
        };
        removeProjectile(_projectile) {
            let index = this.projectileScripts.findIndex((n) => n === _projectile);
            if (index >= 0) {
                this.projectileScripts.splice(index, 1);
                Script.ƒ.Recycler.storeMultiple(...this.projectiles.splice(index, 1));
            }
            _projectile.node.getParent().removeChild(_projectile.node);
        }
        async createProjectile(_options, _position, _parent = this.projectilesNode) {
            let pgi = Script.ƒ.Recycler.get(Script.ProjectileGraphInstance);
            if (!pgi.initialized) {
                await pgi.set(ProjectileManager.projectileGraph);
            }
            let p = pgi.getComponent(Script.ProjectileComponent);
            p.setup(_options, Script.provider.get(Script.CardManager));
            pgi.mtxLocal.translation = Script.ƒ.Vector3.SUM(_position);
            _parent.addChild(pgi);
            this.projectileScripts.push(p);
            this.projectiles.push(pgi);
        }
        async createHitZone(_position, _size = 1, _parent = this.projectilesNode) {
            let hz = Script.ƒ.Recycler.get(Script.HitZoneGraphInstance);
            if (!hz.initialized) {
                await hz.set(ProjectileManager.hitZoneGraph);
            }
            hz.getComponent(Script.ƒ.ComponentMesh).mtxPivot.scaling = Script.ƒ.Vector3.ONE(_size);
            hz.mtxLocal.translation = _position;
            _parent.addChild(hz);
            return hz;
        }
    }
    Script.ProjectileManager = ProjectileManager;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map