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
        #touchMode;
        #touchStart;
        constructor(provider) {
            this.provider = provider;
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
            ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, this.hndKeyboardInput);
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
                return;
            }
            if (_event.type === ƒ.EVENT_TOUCH.MOVE && this.curentlyActiveTouchId === touches[0].identifier) {
                let offsetX = _event.detail.offset.data[0];
                let offsetY = _event.detail.offset.data[1];
                if (this.#touchMode === TouchMode.LOCKED) {
                    offsetX = _event.detail.position.data[0] - this.#touchStart.x;
                    offsetY = _event.detail.position.data[1] - this.#touchStart.y;
                }
                let direction = new ƒ.Vector2(offsetX, offsetY);
                direction.scale(this.touchRadiusScale);
                if (direction.magnitudeSquared > 1) {
                    direction.normalize(1);
                }
                //TODO: call movement function here
                // console.log("move", direction);
                this.touchCircleInner.style.top = `${direction.y * this.touchRadiusVW / 2 + 2.5}vw`;
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
            if (mgtSqrt === 0)
                return;
            if (mgtSqrt > 1) {
                direction.normalize(1);
            }
            //TODO: call movement function here
            console.log(direction.x, direction.y);
        };
    }
    Script.InputManager = InputManager;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    let viewport;
    document.addEventListener("interactiveViewportStarted", start);
    function start(_event) {
        viewport = _event.detail;
        ƒ.Loop.addEventListener("loopFrame" /* ƒ.EVENT.LOOP_FRAME */, update);
        ƒ.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
        const provider = new Script.Provider()
            .add(Script.InputManager);
        const inputManager = provider.get(Script.InputManager);
        inputManager.setup(Script.TouchMode.FREE);
    }
    function update(_event) {
        // ƒ.Physics.simulate();  // if physics is included and used
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
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
//# sourceMappingURL=Script.js.map