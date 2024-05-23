"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    class Animateable extends ƒ.Component {
        material;
        currentlyActiveSprite;
        currentlyActiveEventListener;
        uniqueAnimationId;
        constructor() {
            super();
            if (ƒ.Project.mode === ƒ.MODE.EDITOR)
                return;
            this.addEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, this.deserialized);
        }
        deserialized = () => {
            this.removeEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, this.deserialized);
            this.material = this.node.getComponent(ƒ.ComponentMaterial);
        };
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
        setCentralAnimator(_as, _unique = false, _eventListener) {
            if (!_as)
                return;
            let am = Script.provider.get(Script.AnimationManager);
            this.removeAnimationEventListeners();
            if (this.uniqueAnimationId) {
                am.removeUniqueAnimationMtx(this.uniqueAnimationId);
                this.uniqueAnimationId = undefined;
            }
            if (_unique) {
                [this.material.mtxPivot, this.uniqueAnimationId] = am.getUniqueAnimationMtx(_as);
            }
            else {
                this.material.mtxPivot = am.getAnimationMtx(_as);
            }
            if (_as.material)
                this.material.material = _as.material;
            this.currentlyActiveSprite = _as;
            if (this.currentlyActiveSprite && this.currentlyActiveSprite.events && _eventListener) {
                for (let event of this.currentlyActiveSprite.events) {
                    this.material.mtxPivot.addEventListener(event.event, _eventListener);
                }
                this.currentlyActiveEventListener = _eventListener;
            }
        }
        removeAnimationEventListeners() {
            if (this.currentlyActiveSprite && this.currentlyActiveSprite.events && this.currentlyActiveEventListener) {
                for (let event of this.currentlyActiveSprite.events) {
                    this.material.mtxPivot.removeEventListener(event.event, this.currentlyActiveEventListener);
                }
            }
        }
        update(_charPosition, _frameTimeInSeconds) { }
        ;
    }
    Script.Animateable = Animateable;
})(Script || (Script = {}));
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
    var ƒ = FudgeCore;
    class InitializableGraphInstance extends ƒ.GraphInstance {
        initialized = false;
        constructor() {
            super();
            // Don't start when running in editor
            // if (ƒ.Project.mode == ƒ.MODE.EDITOR)
            //     return;
        }
        recycle() {
            // this.getComponent(ProjectileComponent).recycle();
        }
        async set(_graph) {
            await super.set(_graph);
            this.initialized = true;
        }
    }
    Script.InitializableGraphInstance = InitializableGraphInstance;
    class ProjectileGraphInstance extends InitializableGraphInstance {
    }
    Script.ProjectileGraphInstance = ProjectileGraphInstance;
    class HitZoneGraphInstance extends InitializableGraphInstance {
    }
    Script.HitZoneGraphInstance = HitZoneGraphInstance;
    class EnemyGraphInstance extends InitializableGraphInstance {
    }
    Script.EnemyGraphInstance = EnemyGraphInstance;
    class AOEGraphInstance extends InitializableGraphInstance {
    }
    Script.AOEGraphInstance = AOEGraphInstance;
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
            if (Script.gameState === Script.GAMESTATE.PAUSED)
                return;
            if (Script.gameState === Script.GAMESTATE.IDLE)
                return;
            this.#character.update(this.movementVector);
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
                let offsetX = _event.detail.offset.x;
                let offsetY = _event.detail.offset.y;
                if (this.#touchMode === TouchMode.LOCKED) {
                    offsetX = _event.detail.position.x - this.#touchStart.x;
                    offsetY = _event.detail.position.y - this.#touchStart.y;
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
        GAMESTATE[GAMESTATE["ROOM_CLEAR"] = 3] = "ROOM_CLEAR";
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
            .add(Script.CardManager)
            .add(Script.DataManager)
            .add(Script.CardCollection);
        const dataManager = Script.provider.get(Script.DataManager);
        await dataManager.load();
        const config = Script.provider.get(Script.Config);
        await config.loadFiles();
        const inputManager = Script.provider.get(Script.InputManager);
        inputManager.setup(Script.TouchMode.FREE);
        const enemyManager = Script.provider.get(Script.EnemyManager);
        enemyManager.setup();
        const projectileManager = Script.provider.get(Script.ProjectileManager);
        projectileManager.setup();
        const cardManager = Script.provider.get(Script.CardManager);
        cardManager.updateEffects();
        const cardCollector = Script.provider.get(Script.CardCollection);
        cardCollector.setup();
    }
    function start(_event) {
        viewport = _event.detail;
        viewport.physicsDebugMode = Script.ƒ.PHYSICS_DEBUGMODE.COLLIDERS;
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
        PassiveCardEffect["HEALTH"] = "health";
        PassiveCardEffect["REGENERATION"] = "regeneration";
        PassiveCardEffect["COLLECTION_RADIUS"] = "collectionRadius";
        PassiveCardEffect["DAMAGE_REDUCTION"] = "damageReduction";
        PassiveCardEffect["CARD_SLOTS"] = "cardSlots";
        PassiveCardEffect["MOVEMENT_SPEED"] = "movementSpeed";
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
        ProjectileTargetMode[ProjectileTargetMode["RANDOM"] = 3] = "RANDOM";
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
    class AOE extends Script.Animateable {
        duration;
        events;
        targetMode;
        size;
        damage;
        sprite;
        variant;
        target;
        rigidbody;
        defaults = {
            size: 1,
            damage: 0,
            sprite: ["aoe", "explosion"],
            duration: 1,
            variant: "explosion",
            target: Script.ProjectileTarget.ENEMY,
        };
        setup(_options, _modifier) {
            let cm = Script.provider.get(Script.CardManager);
            _options = { ...this.defaults, ..._options };
            this.size = cm.modifyValue(_options.size, Script.PassiveCardEffect.PROJECTILE_SIZE, _modifier);
            this.damage = cm.modifyValue(_options.damage, Script.PassiveCardEffect.DAMAGE, _modifier);
            this.variant = _options.variant;
            this.duration = cm.modifyValue(_options.duration, Script.PassiveCardEffect.EFFECT_DURATION, _modifier);
            this.targetMode = _options.targetMode;
            this.target = _options.target;
            this.events = _options.events;
            this.sprite = this.getSprite(_options.sprite);
            this.setCentralAnimator(this.sprite, true, this.eventListener);
            this.node.mtxLocal.scaling = ƒ.Vector3.ONE(this.size);
            this.rigidbody = this.node.getComponent(ƒ.ComponentRigidbody);
            setTimeout(() => {
                this.removeAnimationEventListeners();
                Script.provider.get(Script.ProjectileManager).removeAOE(this);
            }, this.duration * 1000);
        }
        // should be called through a timing listener
        explode() {
            if (this.variant !== "explosion")
                return;
            for (let collision of this.rigidbody.collisions) {
                if (this.target === Script.ProjectileTarget.ENEMY && collision.node.name === "enemy") {
                    collision.node.getComponent(Script.Enemy).hit({ damage: this.damage });
                }
                else if (this.target === Script.ProjectileTarget.PLAYER && collision.node.name === "character") {
                    let char = Script.provider.get(Script.CharacterManager).character;
                    char.hit({ damage: this.damage });
                }
            }
        }
        update(_charPosition, _frameTimeInSeconds) {
            if (this.variant !== "aoe")
                return;
        }
        eventListener = (_event) => {
            if (!this.events)
                return;
            if (!this.events[_event.type])
                return;
            this.events[_event.type].call(this, _event);
        };
    }
    Script.AOE = AOE;
})(Script || (Script = {}));
/// <reference path="../Types.ts" />
/// <reference path="../Animateable.ts" />
var Script;
/// <reference path="../Types.ts" />
/// <reference path="../Animateable.ts" />
(function (Script) {
    class ProjectileComponent extends Script.Animateable {
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
        sprite;
        hazardZone;
        prevDistance;
        static defaults = {
            targetPosition: undefined,
            direction: new Script.ƒ.Vector3(),
            piercing: 0,
            range: Infinity,
            size: 0.5,
            speed: 2,
            damage: 1,
            target: Script.ProjectileTarget.ENEMY,
            tracking: undefined,
            diminishing: false,
            targetMode: Script.ProjectileTargetMode.NONE,
            lockedToEntity: false,
            impact: undefined,
            artillery: false,
            sprite: ["projectile", "toast"],
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
            this.node.getComponent(Script.ƒ.ComponentRigidbody).addEventListener("TriggerEnteredCollision" /* ƒ.EVENT_PHYSICS.TRIGGER_ENTER */, this.onTriggerEnter);
            this.node.getComponent(Script.ƒ.ComponentRigidbody).addEventListener("TriggerLeftCollision" /* ƒ.EVENT_PHYSICS.TRIGGER_EXIT */, this.onTriggerExit);
        };
        async setup(_options, _modifier) {
            let cm = Script.provider.get(Script.CardManager);
            _options = { ...ProjectileComponent.defaults, ..._options };
            this.direction = _options.direction;
            this.targetPosition = _options.targetPosition;
            this.tracking = _options.tracking;
            this.damage = cm.modifyValue(_options.damage, Script.PassiveCardEffect.DAMAGE, _modifier);
            this.size = cm.modifyValue(_options.size, Script.PassiveCardEffect.PROJECTILE_SIZE, _modifier);
            this.speed = cm.modifyValue(_options.speed, Script.PassiveCardEffect.PROJECTILE_SPEED, _modifier);
            this.range = cm.modifyValue(_options.range, Script.PassiveCardEffect.PROJECTILE_RANGE, _modifier);
            this.piercing = cm.modifyValue(_options.piercing, Script.PassiveCardEffect.PROJECTILE_PIERCING, _modifier);
            this.target = _options.target;
            this.artillery = _options.artillery;
            this.diminishing = _options.diminishing;
            this.impact = _options.impact;
            this.targetMode = _options.targetMode;
            this.lockedToEntity = _options.lockedToEntity;
            this.sprite = this.getSprite(_options.sprite);
            this.setCentralAnimator(this.sprite);
            this.node.mtxLocal.scaling = Script.ƒ.Vector3.ONE(this.size);
            this.hazardZone = undefined;
            this.prevDistance = Infinity;
            //TODO rotate projectile towards flight direction
            if (this.artillery) {
                let pos = new Script.ƒ.Vector3();
                if (this.target === Script.ProjectileTarget.PLAYER) {
                    pos = await Script.provider.get(Script.CharacterManager).character.node.mtxWorld.translation.clone;
                }
                else if (this.target === Script.ProjectileTarget.ENEMY) {
                    pos = Script.provider.get(Script.EnemyManager).getEnemy(this.targetMode).mtxWorld.translation.clone;
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
            if (this.targetMode !== Script.ProjectileTargetMode.NONE) {
                this.targetPosition = Script.provider.get(Script.EnemyManager).getEnemy(this.targetMode).mtxWorld.translation.clone;
                this.direction = Script.ƒ.Vector3.DIFFERENCE(this.targetPosition, this.node.mtxLocal.translation);
            }
            if (this.tracking) {
                this.tracking = { ...{ stopTrackingAfter: Infinity, stopTrackingInRadius: 0, strength: 1, startTrackingAfter: 0 }, ...this.tracking };
            }
            if (_options.afterSetup) {
                _options.afterSetup.call(this);
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
            //TODO check if flew past target position (due to lag?) and still explode
            let distanceToTarget = Script.ƒ.Vector3.DIFFERENCE(this.targetPosition, this.node.mtxWorld.translation).magnitudeSquared;
            if (this.targetPosition && (this.node.mtxWorld.translation.equals(this.targetPosition, 0.5) || distanceToTarget > this.prevDistance)) {
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
                        switch (impact.type) {
                            case "projectile":
                                Script.provider.get(Script.ProjectileManager).createProjectile(Script.projectiles[impact.projectile], this.targetPosition, impact.modifiers);
                                break;
                            case "aoe":
                                Script.provider.get(Script.ProjectileManager).createAOE(Script.areasOfEffect[impact.aoe], this.targetPosition, impact.modifiers);
                                break;
                        }
                    }
                }
                Script.provider.get(Script.ProjectileManager).removeProjectile(this);
            }
            this.prevDistance = distanceToTarget;
            //TODO remove projectile if too far off screen, don't forget hitzone
        }
        onTriggerEnter = (_event) => {
            if (_event.cmpRigidbody.node.name === "enemy" && this.target === Script.ProjectileTarget.ENEMY) {
                this.hit(_event.cmpRigidbody.node.getComponent(Script.Enemy));
            }
            else if (_event.cmpRigidbody.node.name === "character" && this.target === Script.ProjectileTarget.PLAYER) {
                if (this.artillery)
                    return;
                this.hit(_event.cmpRigidbody.node.getComponent(Script.Character));
            }
        };
        onTriggerExit = (_event) => {
            // console.log("onTriggerExit", _event);
        };
        hit(_hittable) {
            // _hittable.hit({damage: this.damage});
        }
    }
    Script.ProjectileComponent = ProjectileComponent;
})(Script || (Script = {}));
/// <reference path="../Types.ts" />
var Script;
/// <reference path="../Types.ts" />
(function (Script) {
    Script.projectiles = {
        "toast": {
            damage: 1,
            speed: 20,
            artillery: true,
            impact: [{
                    type: "aoe",
                    aoe: "toastImpact"
                }],
            sprite: ["projectile", "toast"],
            target: Script.ProjectileTarget.PLAYER,
        },
        "anvil": {
            damage: 20,
            speed: 20,
            impact: [{
                    type: "aoe",
                    aoe: "anvilImpact"
                }],
            sprite: ["projectile", "toast"],
            target: Script.ProjectileTarget.ENEMY,
            targetMode: Script.ProjectileTargetMode.RANDOM,
            afterSetup: function () {
                if (this.targetPosition) {
                    let target = this.targetPosition.clone;
                    this.node.mtxLocal.translation = target;
                    this.node.mtxLocal.translate(Script.ƒ.Vector3.Y(10));
                    this.direction = Script.ƒ.Vector3.Y(-1);
                }
            }
        }
    };
    Script.areasOfEffect = {
        "toastImpact": {
            variant: "explosion",
            damage: 10,
            size: 1,
            sprite: ["aoe", "explosion"],
            duration: 1,
            target: Script.ProjectileTarget.PLAYER,
            events: {
                "explode": function (_event) {
                    this.explode();
                }
            },
        },
        "anvilImpact": {
            variant: "explosion",
            damage: 20,
            size: 1,
            sprite: ["aoe", "explosion"],
            duration: 1,
            target: Script.ProjectileTarget.ENEMY,
            events: {
                "explode": function (_event) {
                    this.explode();
                }
            },
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
                    effect.currentCooldown = this.#cm.modifyValuePlayer(effect.cooldown, Script.PassiveCardEffect.COOLDOWN_REDUCTION, effect.modifiers);
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
                                    this.#pm.createProjectile(projectile, pos, _cumulatedEffects, projectile.lockedToEntity ? this.#charm.character.node : undefined);
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
var Script;
(function (Script) {
    class CardCollection {
        collection;
        deck;
        selection;
        deckElement;
        selectionElement;
        collectionElement;
        cardVisuals = new Map();
        constructor(provider) {
            let dm = provider.get(Script.DataManager);
            this.collection = dm.savedCollectionRaw;
            this.deck = dm.savedDeckRaw;
            this.selection = dm.savedSelectionRaw;
        }
        setup() {
            this.selectionElement = document.getElementById("selection");
            this.deckElement = document.getElementById("deck");
            this.collectionElement = document.getElementById("collection-wrapper");
            for (let cardID in Script.cards) {
                let card = Script.cards[cardID];
                let visual = new Script.CardVisual(card, this.collectionElement);
                this.cardVisuals.set(cardID, visual);
            }
            this.updateVisuals(true);
        }
        addCardToCollection(_name, _amount) {
            if (!this.collection[_name]) {
                this.collection[_name] = { amount: 0, lvl: 0 };
            }
            this.collection[_name].amount += _amount;
        }
        getCardLevel(_name) {
            return this.collection[_name]?.lvl ?? 0;
        }
        addCardToDeck(_name) {
            this.addToArray(_name, this.deck);
            this.removeCardFromSelection(_name, false);
            this.updateVisuals();
        }
        removeCardFromDeck(_name, _updateVisuals = true) {
            this.removeFromArray(_name, this.deck);
            if (_updateVisuals)
                this.updateVisuals();
        }
        addCardToSelection(_name) {
            this.addToArray(_name, this.selection);
            this.removeCardFromDeck(_name, false);
            this.updateVisuals();
        }
        removeCardFromSelection(_name, _updateVisuals = true) {
            this.removeFromArray(_name, this.selection);
            if (_updateVisuals)
                this.updateVisuals();
        }
        removeFromArray(_element, _array) {
            let index = _array.indexOf(_element);
            if (index >= 0) {
                _array.splice(index, 1);
            }
        }
        addToArray(_element, _array) {
            if (_array.includes(_element))
                return;
            _array.push(_element);
        }
        updateVisuals(_updateCollection = false) {
            // collection
            if (!_updateCollection)
                return;
            let allCardsForCollection = [];
            for (let cardID in this.collection) {
                let visual = this.cardVisuals.get(cardID);
                if (!visual)
                    continue;
                allCardsForCollection.push(visual.htmlElement);
            }
            for (let cardID in Script.cards) {
                if (this.collection[cardID])
                    continue;
                let visual = this.cardVisuals.get(cardID);
                if (!visual)
                    continue;
                allCardsForCollection.push(visual.htmlElement);
                visual.htmlElement.classList.add("locked");
            }
            // for debugging we're adding a bunch of empty stuff to fill up to 100.
            this.fillWithPlaceholders(allCardsForCollection, 100);
            this.collectionElement.replaceChildren(...allCardsForCollection);
            // selection
            let cardsInSelection = [];
            for (let card of this.selection) {
                let visual = this.cardVisuals.get(card);
                if (!visual)
                    continue;
                cardsInSelection.push(visual.htmlElement);
            }
            this.fillWithPlaceholders(cardsInSelection, 5);
            this.selectionElement.replaceChildren(...cardsInSelection);
            // deck
            let cardsInDeck = [];
            for (let card of this.deck) {
                let visual = this.cardVisuals.get(card);
                if (!visual)
                    continue;
                cardsInDeck.push(visual.htmlElement);
            }
            this.fillWithPlaceholders(cardsInDeck, 15);
            this.deckElement.replaceChildren(...cardsInDeck);
        }
        fillWithPlaceholders(_array, _maxAmount) {
            for (let i = _array.length; i < _maxAmount; i++) {
                _array.push(this.getCardPlaceholder());
            }
        }
        getCardPlaceholder() {
            let elem = document.createElement("div");
            elem.classList.add("card", "placeholder");
            return elem;
        }
    }
    Script.CardCollection = CardCollection;
})(Script || (Script = {}));
var Script;
(function (Script) {
    class CardVisual {
        static template;
        static canvas;
        #name;
        #image;
        #text;
        #htmlElement;
        constructor(_card, _parent) {
            this.#name = _card.name ?? "no name";
            this.#text = _card.description ?? "no description";
            this.#image = _card.image;
            this.#htmlElement = CardVisual.template.content.cloneNode(true).childNodes[1];
            // figure out how large the title text should be
            let fontSize = 10;
            let heightRaw = getComputedStyle(_parent).getPropertyValue("--card-size");
            let tmpDiv = document.createElement("div");
            tmpDiv.style.width = heightRaw;
            document.documentElement.appendChild(tmpDiv);
            let height = tmpDiv.offsetWidth;
            document.documentElement.removeChild(tmpDiv);
            let cardWidth = height * (15 / 21) - 0.15 * height;
            let currentTextWidth = this.getTextWidth(this.#name, `normal  ${height / 100 * fontSize}px 'Luckiest Guy'`);
            let factor = cardWidth / currentTextWidth;
            fontSize *= factor;
            let nameElement = this.#htmlElement.querySelector(".card-name");
            nameElement.style.fontSize = `calc(var(--card-size) / 100 * ${fontSize})`;
            // fill card with data
            nameElement.innerHTML = this.#name.toLocaleUpperCase();
            requestAnimationFrame(() => {
                // turn into circle
                new CircleType(nameElement).radius(cardWidth * 2);
            });
            this.#htmlElement.querySelector(".card-text").innerText = this.#text;
            this.#htmlElement.querySelector(".card-image img").src = "Assets/Cards/Items/" + this.#image;
            this.#htmlElement.classList.add(_card.rarity);
        }
        get htmlElement() {
            return this.#htmlElement;
        }
        getTextWidth(_text, _font) {
            const canvas = CardVisual.canvas || (CardVisual.canvas = document.createElement("canvas"));
            const context = canvas.getContext("2d");
            context.font = _font;
            const metrics = context.measureText(_text);
            return metrics.width;
        }
        getCanvasFont(el = document.body) {
            const fontWeight = this.getCssStyle(el, 'font-weight') || 'normal';
            const fontSize = this.getCssStyle(el, 'font-size') || '10vh';
            const fontFamily = this.getCssStyle(el, 'font-family') || 'Luckiest Guy';
            return `${fontWeight} ${fontSize} ${fontFamily}`;
        }
        getCssStyle(element, prop) {
            return window.getComputedStyle(element, null).getPropertyValue(prop);
        }
    }
    Script.CardVisual = CardVisual;
    document.addEventListener("DOMContentLoaded", initCardTemplate);
    function initCardTemplate() {
        CardVisual.template = document.getElementById("card");
    }
})(Script || (Script = {}));
/// <reference path="../Types.ts" />
var Script;
/// <reference path="../Types.ts" />
(function (Script) {
    Script.cards = {
        "test": {
            image: "Pen.png",
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
            image: "Pen.png",
            rarity: Script.CardRarity.RARE,
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
        "anvil": {
            image: "Anvil.png",
            rarity: Script.CardRarity.COMMON,
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
        #healthElement;
        prevDirection = 0;
        health = 100;
        maxHealth = 100;
        rigidbody;
        cardManager;
        speed = 1;
        constructor() {
            super();
            if (ƒ.Project.mode === ƒ.MODE.EDITOR)
                return;
            this.addEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, () => {
                this.node.addEventListener("graphInstantiated" /* ƒ.EVENT.GRAPH_INSTANTIATED */, () => {
                    Script.provider.get(Script.CharacterManager).character = this;
                    this.init();
                }, true);
                this.setupAnimator();
            });
        }
        init() {
            this.#healthElement = document.getElementById("healthbar");
            this.rigidbody = this.node.getComponent(ƒ.ComponentRigidbody);
            this.cardManager = Script.provider.get(Script.CardManager);
        }
        move(_direction, _time) {
            //TODO: update this to use physics
            this.rigidbody.setVelocity(ƒ.Vector3.SCALE(new ƒ.Vector3(_direction.x, _direction.y), this.cardManager.modifyValuePlayer(this.speed, Script.PassiveCardEffect.MOVEMENT_SPEED)));
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
                    this.changeVisualDirection();
                }
                else if (this.prevDirection < 0) {
                    this.changeVisualDirection(180);
                }
            }
            // for (let collision of this.rigidbody.collisions) {
            //     if (collision.node.name === "enemy") {
            //         this.hit({ damage: collision.node.getComponent(Enemy).damage * _time });
            //     }
            // }
        }
        update(_direction) {
            let time = Math.min(1, ƒ.Loop.timeFrameGame / 1000);
            this.move(_direction, time);
            // regenerate health
            if (Script.gameState === Script.GAMESTATE.PLAYING) {
                let regeneration = this.cardManager.modifyValuePlayer(0, Script.PassiveCardEffect.REGENERATION);
                if (regeneration > 0) {
                    this.health = Math.min(this.maxHealth, this.health + regeneration);
                    this.updateHealthVisually();
                }
            }
        }
        hit(_hit) {
            this.health -= _hit.damage;
            //TODO display damage numbers
            //update display
            this.updateHealthVisually();
            if (this.health > 0)
                return _hit.damage;
            // TODO: Game Over
            return 0;
        }
        changeVisualDirection(_rot = 0) {
            for (let child of this.node.getChildren()) {
                let mesh = child.getComponent(ƒ.ComponentMesh);
                if (mesh)
                    mesh.mtxPivot.rotation = new ƒ.Vector3(0, _rot, 0);
            }
        }
        updateHealthVisually() {
            this.#healthElement.max = this.maxHealth;
            this.#healthElement.value = this.health;
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
            speed: 0.8,
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
                            Script.provider.get(Script.ProjectileManager).createProjectile(Script.projectiles["toast"], Script.ƒ.Vector3.SUM(this.node.mtxWorld.translation, Script.ƒ.Vector3.Y(0.3)), undefined);
                        }
                    }
                }
            ]
        },
        motor: {
            moveSprite: ["motor", "move"],
            speed: 3,
        },
        ventilator: {
            moveSprite: ["ventilator", "move"],
            speed: 0.5,
            desiredDistance: [0, 0],
        },
        chair: {
            moveSprite: ["chair", "move"],
            speed: 0.5,
            desiredDistance: [0, 0],
        },
        closet: {}
    };
})(Script || (Script = {}));
/// <reference path="../Animateable.ts" />
var Script;
/// <reference path="../Animateable.ts" />
(function (Script) {
    class Enemy extends Script.Animateable {
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
        enemyManager;
        prevDirection;
        currentlyActiveAttack;
        rigidbody;
        touchingPlayer;
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
            this.addEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, this.deserializedListener);
        }
        deserializedListener = () => {
            this.removeEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, this.deserializedListener);
            this.enemyManager = Script.provider.get(Script.EnemyManager);
            this.rigidbody = this.node.getComponent(Script.ƒ.ComponentRigidbody);
            this.rigidbody.effectGravity = 0;
            this.rigidbody.effectRotation = new Script.ƒ.Vector3(0, 0, 0);
            this.rigidbody.addEventListener("ColliderEnteredCollision" /* ƒ.EVENT_PHYSICS.COLLISION_ENTER */, this.onCollisionEnter);
            this.rigidbody.addEventListener("ColliderLeftCollision" /* ƒ.EVENT_PHYSICS.COLLISION_EXIT */, this.onCollisionExit);
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
            // are we touching the player?
            if (this.touchingPlayer) {
                let character = Script.provider.get(Script.CharacterManager).character;
                // let mag = ƒ.Vector3.DIFFERENCE(character.node.mtxWorld.translation, this.node.mtxWorld.translation).magnitudeSquared;
                // if (mag < 0.64 /* 0.8² (player hitbox size) TODO: update this if player or enemy size changes */)
                character.hit({ damage: this.damage * _frameTimeInSeconds });
                // console.log(this.rigidbody.collisions);
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
                    this.setCentralAnimator(this.getSprite(this.currentlyActiveAttack.attackSprite), true, this.eventListener);
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
                    this.setCentralAnimator(this.getSprite(this.currentlyActiveAttack.cooldownSprite), true, this.eventListener);
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
        onCollisionEnter = (_event) => {
            if (_event.cmpRigidbody.node.name !== "character")
                return;
            this.touchingPlayer = true;
        };
        onCollisionExit = (_event) => {
            if (_event.cmpRigidbody.node.name !== "character")
                return;
            this.touchingPlayer = false;
        };
        hit(_hit) {
            this.health -= _hit.damage;
            //TODO display damage numbers
            //TODO apply knockback
            if (this.health > 0)
                return _hit.damage;
            this.enemyManager.removeEnemy(this);
            this.removeAnimationEventListeners();
            //TODO: drop XP
            return _hit.damage + this.health;
        }
    }
    Script.Enemy = Enemy;
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
        currentlyActiveCards = [];
        cumulativeEffects = { absolute: {}, multiplier: {} };
        constructor() {
            this.currentlyActiveCards.push(new Script.Card(Script.cards["anvil"], 0), new Script.Card(Script.cards["testSize"], 1));
            this.updateEffects();
            Script.ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, this.update);
        }
        update = () => {
            if (Script.gameState !== Script.GAMESTATE.PLAYING)
                return;
            let time = Script.ƒ.Loop.timeFrameGame / 1000;
            for (let card of this.currentlyActiveCards) {
                card.update(time, this.combineEffects(this.cumulativeEffects, card.effects));
            }
        };
        getEffectAbsolute(_effect, _modifier = this.cumulativeEffects) {
            return _modifier.absolute?.[_effect] ?? 0;
        }
        getEffectMultiplier(_effect, _modifier = this.cumulativeEffects) {
            return _modifier.multiplier?.[_effect] ?? 1;
        }
        modifyValuePlayer(_value, _effect, _localModifiers) {
            if (_localModifiers) {
                _value = (_value + this.getEffectAbsolute(_effect, _localModifiers)) * this.getEffectMultiplier(_effect, _localModifiers);
            }
            return (_value + this.getEffectAbsolute(_effect)) * this.getEffectMultiplier(_effect);
        }
        modifyValue(_value, _effect, _modifier) {
            if (!_modifier)
                return _value;
            return (_value + this.getEffectAbsolute(_effect, _modifier)) * this.getEffectMultiplier(_effect, _modifier);
        }
        updateEffects() {
            let cardEffects = [];
            for (let card of this.currentlyActiveCards) {
                let effects = card.effects;
                if (!effects)
                    continue;
                cardEffects.push(effects);
            }
            this.cumulativeEffects = this.combineEffects(...cardEffects);
        }
        combineEffects(..._effects) {
            let combined = { absolute: {}, multiplier: {} };
            for (let effectObj of _effects) {
                if (!effectObj)
                    continue;
                let effect;
                for (effect in effectObj.absolute) {
                    combined.absolute[effect] = (combined.absolute[effect] ?? 0) + effectObj.absolute[effect];
                }
                for (effect in effectObj.multiplier) {
                    combined.multiplier[effect] = (combined.multiplier[effect] ?? 1) * effectObj.multiplier[effect];
                }
            }
            return combined;
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
    class DataManager {
        savedCollectionRaw = {};
        savedDeckRaw = [];
        savedSelectionRaw = [];
        async load() {
            this.savedCollectionRaw = this.catchObjChange(JSON.parse(localStorage.getItem("collection") ?? "{}"), () => { localStorage.setItem("collection", JSON.stringify(this.savedCollectionRaw)); });
            this.savedDeckRaw = this.catchArrayChange(JSON.parse(localStorage.getItem("deck") ?? "[]"), () => { localStorage.setItem("deck", JSON.stringify(this.savedDeckRaw)); });
            this.savedSelectionRaw = this.catchArrayChange(JSON.parse(localStorage.getItem("selection") ?? "[]"), () => { localStorage.setItem("selection", JSON.stringify(this.savedSelectionRaw)); });
        }
        catchObjChange(object, onChange) {
            const handler = {
                get(target, property, receiver) {
                    try {
                        return new Proxy(target[property], handler);
                    }
                    catch (err) {
                        return Reflect.get(target, property, receiver);
                    }
                },
                set(target, prop, value, receiver) {
                    let result = Reflect.set(target, prop, value, receiver);
                    if (result)
                        onChange();
                    return result;
                }
            };
            const handlerForArray = {};
            return new Proxy(object, handler);
        }
        catchArrayChange(object, onChange) {
            const handler = {
                set(target, prop, value, receiver) {
                    let result = Reflect.set(target, prop, value, receiver);
                    if (result)
                        onChange();
                    return result;
                }
            };
            return new Proxy(object, handler);
        }
    }
    Script.DataManager = DataManager;
})(Script || (Script = {}));
var Script;
(function (Script) {
    const pools = {
        "electronics": [
            ["microwave"],
            ["toaster", "chair"],
            ["ventilator"],
            ["motor"],
            ["chair"],
        ]
    };
    const rooms = {
        "electronics": [
            // room 1
            {
                duration: 60,
                defaultWave: {
                    enemies: [{ pool: 0 }],
                    amount: 15,
                    duration: 10,
                    minEnemiesOverride: 5,
                },
                waveAmount: 6,
            },
            // room 2
            {
                duration: 60,
                defaultWave: {
                    enemies: [
                        { pool: 0, weight: 6 },
                        { pool: 1, weight: 4 },
                    ],
                    amount: 15,
                    duration: 10,
                    minEnemiesOverride: 5,
                },
                waveAmount: 6,
                waves: [
                    {
                        enemies: [
                            { pool: 1 }
                        ],
                        amount: 8,
                        duration: 10,
                    }
                ]
            },
            // room 3
            {
                duration: 60,
                defaultWave: {
                    enemies: [
                        { pool: 0, weight: 6 },
                        { pool: 1, weight: 4 },
                    ],
                    amount: 15,
                    duration: 10,
                    minEnemiesOverride: 5,
                },
                waveAmount: 6,
                waves: [
                    {
                        enemies: [
                            { pool: 0, weight: 6 },
                            { pool: 1, weight: 4 },
                            { pool: 0, elite: true },
                        ],
                        amount: 15,
                        duration: 10,
                    }
                ],
            },
            // room bonus
            {
                duration: Infinity,
                reward: true,
            },
            // room 4
            {
                duration: 60,
                defaultWave: {
                    enemies: [
                        { pool: 0, weight: 55 },
                        { pool: 1, weight: 25 },
                        { pool: 2, weight: 20 },
                    ],
                    amount: 15,
                    duration: 10,
                    minEnemiesOverride: 5,
                },
                waveAmount: 6,
                waves: [
                    {
                        enemies: [
                            { pool: 2 },
                        ],
                        amount: 8,
                        duration: 10,
                    }
                ],
            },
            // room 5
            {
                duration: 60,
                boss: true,
                canStopAfter: true,
                defaultWave: {
                    amount: 1,
                    duration: 60,
                    enemies: ["microwave-boss"],
                },
                waveAmount: 1
            },
            //room 6
            {
                duration: 60,
                bonus: {
                    multiplier: {
                        health: 1.5
                    }
                }
            }
        ]
    };
    class EnemyManager {
        provider;
        characterManager;
        config;
        enemyScripts = [];
        enemies = [];
        enemyGraph;
        enemyNode;
        currentWave = -1;
        currentRoom = -1;
        currentArea = "electronics";
        currentWaveEnd = 0;
        currentRoomEnd = 0;
        timeElement = document.getElementById("timer");
        constructor(provider) {
            this.provider = provider;
            if (Script.ƒ.Project.mode === Script.ƒ.MODE.EDITOR)
                return;
            document.addEventListener("interactiveViewportStarted", this.start);
            Script.ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, this.update);
            Script.ƒ.Project.addEventListener("resourcesLoaded" /* ƒ.EVENT.RESOURCES_LOADED */, this.loaded);
            this.characterManager = provider.get(Script.CharacterManager);
            this.config = provider.get(Script.Config);
            document.addEventListener("keypress", this.debugEvents);
            document.getElementById("debug-next-wave").addEventListener("touchstart", this.debugButtons);
            document.getElementById("debug-end-room").addEventListener("touchstart", this.debugButtons);
            document.getElementById("debug-next-room").addEventListener("touchstart", this.debugButtons);
            document.getElementById("debug-kill-enemies").addEventListener("touchstart", this.debugButtons);
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
            if (Script.gameState === Script.GAMESTATE.PAUSED)
                return;
            if (Script.gameState === Script.GAMESTATE.IDLE)
                return;
            let character = this.characterManager.character;
            if (!character)
                return;
            this.roomManagement();
            // update enemies
            let time = Script.ƒ.Loop.timeFrameGame / 1000;
            for (let enemy of this.enemyScripts) {
                enemy.update(character.node.mtxWorld.translation, time);
            }
        };
        nextWaveOverride = false;
        async roomManagement() {
            if (Script.gameState === Script.GAMESTATE.ROOM_CLEAR)
                return;
            let currentTime = Script.ƒ.Time.game.get();
            let nextWave = this.getWave(this.currentArea, this.currentRoom, this.currentWave + 1);
            // should we start a new wave?
            if (nextWave && (this.nextWaveOverride ||
                this.currentWave < 0 || // no wave yet
                this.currentWaveEnd < currentTime || // wave timer is up
                this.enemies.length <= (nextWave?.minEnemiesOverride ?? 0) // wave min enemies are reached
            )) {
                this.nextWaveOverride = false;
                if (await this.spawnWave(nextWave)) {
                    this.currentWave++;
                }
            }
            // no more enenmies left, everything was killed
            // @ts-expect-error
            if (this.enemies.length === 0 && Script.gameState !== Script.GAMESTATE.ROOM_CLEAR) {
                this.endRoom();
            }
            // is the rooms timer up?
            // TODO special cases for boss rooms and no-damage runs
            // @ts-expect-error
            if (this.currentRoomEnd < currentTime && Script.gameState !== Script.GAMESTATE.ROOM_CLEAR) {
                this.endRoom();
            }
            // update timer
            this.timeElement.innerText = `room ${this.currentRoom} ends in: ${this.currentRoomEnd - currentTime}ms - wave ${this.currentWave} ends in: ${this.currentWaveEnd - currentTime}ms`;
        }
        endRoom() {
            while (this.enemyScripts.length > 0) {
                this.enemyScripts[0].hit({ damage: Infinity });
            }
            //TODO collect XP
            console.log(`Room ${this.currentRoom} done. Press N to continue.`);
            Script.gameState = Script.GAMESTATE.ROOM_CLEAR;
        }
        nextRoom() {
            this.currentRoom++;
            this.currentWave = -1;
            this.currentWaveEnd = 0;
            if (rooms[this.currentArea].length <= this.currentRoom) {
                console.log("LAST ROOM CLEARED");
                Script.gameState = Script.GAMESTATE.IDLE;
                return;
            }
            let room = rooms[this.currentArea][this.currentRoom];
            this.currentRoomEnd = Script.ƒ.Time.game.get() + room.duration * 1000;
            Script.gameState = Script.GAMESTATE.PLAYING;
            if (room.reward) {
                //TODO spawn reward stuff
            }
        }
        async spawnWave(wave) {
            if (!wave) {
                this.currentWaveEnd = Infinity;
                return false;
            }
            console.log(`spawning wave ${this.currentWave + 1} in room ${this.currentRoom}`);
            this.currentWaveEnd = Script.ƒ.Time.game.get() + wave.duration * 1000;
            let { totalWeight, enemies, elites } = this.getEnemyList(wave);
            for (let elite of elites) {
                this.spawnEnemy(elite);
            }
            for (let i = 0; i < wave.amount; i++) {
                let x = Math.random() * totalWeight;
                for (let enemy of enemies) {
                    x -= enemy.weight;
                    if (x <= 0) {
                        await this.spawnEnemy(enemy.name);
                        break;
                    }
                }
            }
            return true;
        }
        getWave(_area, _room, _wave) {
            if (!rooms[_area])
                return undefined;
            if (!rooms[_area][_room])
                return undefined;
            if (rooms[_area][_room].waveAmount !== undefined && rooms[_area][_room].waveAmount <= _wave)
                return undefined;
            return rooms[_area][_room].waves?.[_wave] ?? rooms[_area][_room].defaultWave;
        }
        poolSelections = [];
        getEnemyList(_wave) {
            let totalWeight = 0;
            let enemies = [];
            let elites = [];
            for (let enemy of _wave.enemies) {
                if (typeof enemy === "string") {
                    enemies.push({ name: enemy, weight: 1 });
                    totalWeight++;
                }
                else {
                    if (!this.poolSelections[enemy.pool]) {
                        this.poolSelections[enemy.pool] = pools[this.currentArea][enemy.pool][Math.floor(Math.random() * pools[this.currentArea][enemy.pool].length)];
                    }
                    let name = this.poolSelections[enemy.pool];
                    if (enemy.elite) {
                        elites.push(name);
                    }
                    else {
                        enemy.weight = enemy.weight ?? 1;
                        enemies.push({ name, weight: enemy.weight });
                        totalWeight += enemy.weight;
                    }
                }
            }
            return { totalWeight, enemies, elites };
        }
        async spawnEnemy(_enemy, _relativePosition = Script.ƒ.Vector3.NORMALIZATION(new Script.ƒ.Vector3(Math.cos(Math.random() * 2 * Math.PI), Math.sin(Math.random() * 2 * Math.PI)), 5)) {
            let newEnemyGraphInstance = Script.ƒ.Recycler.get(Script.EnemyGraphInstance);
            if (!newEnemyGraphInstance.initialized) {
                await newEnemyGraphInstance.set(this.enemyGraph);
            }
            newEnemyGraphInstance.mtxLocal.translation = this.characterManager.character.node.mtxWorld.translation;
            newEnemyGraphInstance.mtxLocal.translate(_relativePosition);
            this.enemyNode.addChild(newEnemyGraphInstance);
            this.enemies.push(newEnemyGraphInstance);
            let enemyScript = newEnemyGraphInstance.getComponent(Script.Enemy);
            enemyScript.setup(Script.enemies[_enemy]);
            this.enemyScripts.push(enemyScript);
        }
        debugEvents = (_event) => {
            switch (_event.key) {
                case "v":
                    this.nextWaveOverride = true;
                    break;
                case "b":
                    this.endRoom();
                    break;
                case "n":
                    this.nextRoom();
                    break;
                case "k":
                    this.debugRemoveEnemies();
                    break;
            }
        };
        debugButtons = (_event) => {
            switch (_event.target.id) {
                case "debug-next-wave":
                    this.nextWaveOverride = true;
                    break;
                case "debug-end-room":
                    this.endRoom();
                    break;
                case "debug-next-room":
                    this.nextRoom();
                    break;
                case "debug-kill-enemies":
                    this.debugRemoveEnemies();
                    break;
            }
        };
        debugRemoveEnemies(_amt = 5) {
            for (let i = 0; i < 5; i++) {
                if (this.enemyScripts.length > 0) {
                    this.enemyScripts[0].hit({ damage: Infinity });
                }
            }
        }
        async spawnEnemies() {
            if (this.enemies.length >= 2) {
                return;
            }
            // debug: spawn two different enemies
            /*
            let newEnemyGraphInstance = ƒ.Recycler.get(EnemyGraphInstance);
            if (!newEnemyGraphInstance.initialized) {
                await newEnemyGraphInstance.set(this.enemyGraph);
            }
            newEnemyGraphInstance.mtxLocal.translation = this.characterManager.character.node.mtxWorld.translation;
            newEnemyGraphInstance.mtxLocal.translate(ƒ.Vector3.NORMALIZATION(new ƒ.Vector3(Math.cos(Math.random() * 2 * Math.PI), Math.sin(Math.random() * 2 * Math.PI)), 5));
            this.enemyNode.addChild(newEnemyGraphInstance);
            this.enemies.push(newEnemyGraphInstance);
            let enemyScript = newEnemyGraphInstance.getComponent(Enemy);
            enemyScript.setup(enemies["toaster"]);
            this.enemyScripts.push(enemyScript);

            newEnemyGraphInstance = ƒ.Recycler.get(EnemyGraphInstance);
            if (!newEnemyGraphInstance.initialized) {
                await newEnemyGraphInstance.set(this.enemyGraph);
            }
            newEnemyGraphInstance.mtxLocal.translation = this.characterManager.character.node.mtxWorld.translation;
            newEnemyGraphInstance.mtxLocal.translate(ƒ.Vector3.NORMALIZATION(new ƒ.Vector3(Math.cos(Math.random() * 2 * Math.PI), Math.sin(Math.random() * 2 * Math.PI)), 5));
            this.enemyNode.addChild(newEnemyGraphInstance);
            this.enemies.push(newEnemyGraphInstance);
            enemyScript = newEnemyGraphInstance.getComponent(Enemy);
            enemyScript.setup(enemies["chair"]);
            this.enemyScripts.push(enemyScript);


            newEnemyGraphInstance = ƒ.Recycler.get(EnemyGraphInstance);
            if (!newEnemyGraphInstance.initialized) {
                await newEnemyGraphInstance.set(this.enemyGraph);
            }
            newEnemyGraphInstance.mtxLocal.translation = this.characterManager.character.node.mtxWorld.translation.clone;
            newEnemyGraphInstance.mtxLocal.translate(new ƒ.Vector3(0, 10));
            this.enemyNode.addChild(newEnemyGraphInstance);
            this.enemies.push(newEnemyGraphInstance);
            enemyScript = newEnemyGraphInstance.getComponent(Enemy);
            enemyScript.setup({
                moveSprite: this.config.getAnimation("motor", "move"),
                speed: 3,
                directionOverride: ƒ.Vector3.Y(-1),
            });
            this.enemyScripts.push(enemyScript);
            */
        }
        removeEnemy(_enemy) {
            let index = this.enemyScripts.findIndex((n) => n === _enemy);
            if (index >= 0) {
                this.enemyScripts.splice(index, 1);
                Script.ƒ.Recycler.storeMultiple(...this.enemies.splice(index, 1));
            }
            _enemy.node.getParent()?.removeChild(_enemy.node);
        }
        getEnemy(_mode, _maxDistance = 20) {
            if (!this.enemies || this.enemies.length === 0)
                return undefined;
            _maxDistance *= _maxDistance;
            let characterPos = Script.provider.get(Script.CharacterManager).character.node.mtxWorld.translation;
            let enemies = [...this.enemies];
            if (_mode === Script.ProjectileTargetMode.RANDOM) {
                //TODO: make sure chosen enemy is visible on screen
                while (enemies.length > 0) {
                    let index = Math.floor(Math.random() * this.enemies.length);
                    let enemy = this.enemies.splice(index, 1)[0];
                    if (Script.ƒ.Vector3.DIFFERENCE(enemy.mtxWorld.translation, characterPos).magnitudeSquared <= _maxDistance) {
                        return enemy;
                    }
                }
            }
            return undefined;
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
        static aoeGraph;
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
            ProjectileManager.aoeGraph = await Script.ƒ.Project.getResourcesByName("aoe")[0];
        };
        update = () => {
            if (Script.gameState === Script.GAMESTATE.PAUSED)
                return;
            if (Script.gameState === Script.GAMESTATE.IDLE)
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
        removeAOE(_aoe) {
            let index = this.projectileScripts.findIndex((n) => n === _aoe);
            if (index >= 0) {
                this.projectileScripts.splice(index, 1);
                Script.ƒ.Recycler.storeMultiple(...this.projectiles.splice(index, 1));
            }
            _aoe.node.getParent().removeChild(_aoe.node);
        }
        async createProjectile(_options, _position, _modifiers, _parent = this.projectilesNode) {
            let pgi = Script.ƒ.Recycler.get(Script.ProjectileGraphInstance);
            if (!pgi.initialized) {
                await pgi.set(ProjectileManager.projectileGraph);
            }
            pgi.mtxLocal.translation = Script.ƒ.Vector3.SUM(_position);
            let p = pgi.getComponent(Script.ProjectileComponent);
            p.setup(_options, _modifiers);
            _parent.addChild(pgi);
            this.projectileScripts.push(p);
            this.projectiles.push(pgi);
        }
        async createAOE(_options, _position, _modifiers, _parent = this.projectilesNode) {
            let aoeGi = Script.ƒ.Recycler.get(Script.AOEGraphInstance);
            if (!aoeGi.initialized) {
                await aoeGi.set(ProjectileManager.aoeGraph);
            }
            let a = aoeGi.getComponent(Script.AOE);
            a.setup(_options, _modifiers);
            aoeGi.mtxLocal.translation = Script.ƒ.Vector3.SUM(_position);
            _parent.addChild(aoeGi);
            this.projectileScripts.push(a);
            this.projectiles.push(aoeGi);
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