namespace Script {
    import ƒ = FudgeCore;

    export enum TouchMode {
        FREE,
        LOCKED,
    }

    export class InputManager {
        private touchEventDispatcher: ƒ.TouchEventDispatcher;
        private touchCircle: HTMLElement;
        private touchCircleInner: HTMLElement;
        private curentlyActiveTouchId: number = 0;
        private readonly touchRadiusVW = 15;
        private readonly touchRadiusPx = (screen.width / 100) * this.touchRadiusVW;
        private readonly touchRadiusScale = 1 / this.touchRadiusPx;
        private readonly characterManager: CharacterManager;

        #touchMode: TouchMode;
        #touchStart: ƒ.Vector2;

        constructor(private readonly provider: Provider) {
            this.characterManager = provider.get(CharacterManager);
        }

        get touchMode() {
            return this.#touchMode;
        }
        set touchMode(_touchMode: TouchMode) {
            this.#touchMode = _touchMode;
            if (_touchMode === TouchMode.LOCKED) {
                this.touchCircle.classList.remove("hidden");
                this.touchCircle.classList.add("locked");
                this.touchCircle.style.top = this.touchCircle.style.left = "";
            } else if (_touchMode === TouchMode.FREE) {
                this.touchCircle.classList.add("hidden");
                this.touchCircle.classList.remove("locked");
            }
        }

        public setup(_touchMode: TouchMode = TouchMode.FREE) {
            let touchOverlay = document.getElementById("swipe-game-overlay");
            this.touchEventDispatcher = new ƒ.TouchEventDispatcher(touchOverlay);
            // touchOverlay.addEventListener(ƒ.EVENT_TOUCH.TAP, <EventListener>hndTouchEvent);
            touchOverlay.addEventListener(ƒ.EVENT_TOUCH.MOVE, <EventListener>this.hndTouchEvent);
            touchOverlay.addEventListener("touchstart", <EventListener>this.hndTouchEvent);
            // touchOverlay.addEventListener("touchmove", <EventListener>hndTouchEvent);
            touchOverlay.addEventListener("touchend", <EventListener>this.hndTouchEvent);

            this.touchCircle = document.getElementById("touch-circle");
            this.touchCircleInner = document.getElementById("touch-circle-inner");

            this.touchMode = _touchMode;

            document.addEventListener("keydown", this.hndKeyboardInput);
            document.addEventListener("keyup", this.hndKeyboardInput);
            document.addEventListener("keypress", this.hndKeyboardInput);
        }

        private hndTouchEvent = (_event: CustomEvent | TouchEvent) => {
            let touches: TouchList = (<TouchEvent>_event).changedTouches ?? _event.detail.touches;
            if (!touches) return;
            if (_event.type === "touchstart" && !this.curentlyActiveTouchId) {
                if (this.#touchMode === TouchMode.LOCKED) {
                    if (_event.target !== this.touchCircle) return;
                    let bcr = this.touchCircle.getBoundingClientRect();
                    this.#touchStart = new ƒ.Vector2(bcr.left + bcr.width / 2, bcr.top + bcr.height / 2);
                } else {
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
        }
        
        private hndKeyboardInput = () => {
            let direction: ƒ.Vector2 = new ƒ.Vector2();
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT]))
                direction.add(new ƒ.Vector2(-1, 0))
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]))
                direction.add(new ƒ.Vector2(1, 0))
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]))
                direction.add(new ƒ.Vector2(0, -1))
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP]))
                direction.add(new ƒ.Vector2(0, 1))
            
            let mgtSqrt = direction.magnitudeSquared;
            if (mgtSqrt === 0) {
                this.characterManager.setMovement(direction);
                return;
            }
            if (mgtSqrt > 1) {
                direction.normalize(1);
            }
            
            this.characterManager.setMovement(direction);
        }
    }
}