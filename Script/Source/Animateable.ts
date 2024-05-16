namespace Script {
    import ƒ = FudgeCore;
    export class Animateable extends ƒ.Component {
        private material: ƒ.ComponentMaterial;
        private currentlyActiveSprite: AnimationSprite;
        private currentlyActiveEventListener: (_event: CustomEvent) => void;
        private uniqueAnimationId: number;

        constructor() {
            super();
            if (ƒ.Project.mode === ƒ.MODE.EDITOR) return;
            this.addEventListener(ƒ.EVENT.NODE_DESERIALIZED, this.deserialized);
        }

        protected deserialized = () => {
            this.removeEventListener(ƒ.EVENT.NODE_DESERIALIZED, this.deserialized);
            this.material = this.node.getComponent(ƒ.ComponentMaterial);
        }

        protected getSprite(_sp: AnimationSprite | [string, string]): AnimationSprite {
            if (!_sp) return undefined;
            if (("frames" in _sp)) {
                return _sp;
            } else {
                return provider.get(Config).getAnimation(_sp[0], _sp[1]);
            }
        }

        protected setCentralAnimator(_as: AnimationSprite, _unique: boolean = false, _eventListener?: (_event: CustomEvent) => void) {
            if (!_as) return;
            let am: AnimationManager = provider.get(AnimationManager);

            this.removeAnimationEventListeners();

            if (this.uniqueAnimationId) {
                am.removeUniqueAnimationMtx(this.uniqueAnimationId);
                this.uniqueAnimationId = undefined;
            }
            if (_unique) {
                [this.material.mtxPivot, this.uniqueAnimationId] = am.getUniqueAnimationMtx(_as);
            } else {
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

        protected removeAnimationEventListeners() {
            if (this.currentlyActiveSprite && this.currentlyActiveSprite.events && this.currentlyActiveEventListener) {
                for (let event of this.currentlyActiveSprite.events) {
                    this.material.mtxPivot.removeEventListener(event.event, this.currentlyActiveEventListener);
                }
            }
        }

        public update(_charPosition: ƒ.Vector3, _frameTimeInSeconds: number) { };
    }
}