namespace Script {
    import ƒ = FudgeCore;
    export class AOE extends Animateable implements AreaOfEffect {
        duration: number;
        events?: { [name: string]: (_event?: CustomEvent<any>) => void; };
        targetMode?: ProjectileTargetMode;
        size: number;
        damage: number;
        sprite: AnimationSprite | [string, string];
        variant: "aoe" | "explosion";
        target: ProjectileTarget;
        private rigidbody: ƒ.ComponentRigidbody;

        private defaults: AreaOfEffect = {
            size: 1,
            damage: 0,
            sprite: ["aoe", "explosion"],
            duration: 1,
            variant: "explosion",
            target: ProjectileTarget.ENEMY,
        }

        setup(_options: Partial<AreaOfEffect>, _modifier: PassiveCardEffectObject) {
            let cm = provider.get(CardManager);
            _options = { ...this.defaults, ..._options };
            this.size = cm.modifyValue(_options.size, PassiveCardEffect.PROJECTILE_SIZE, _modifier);
            this.damage = cm.modifyValue(_options.damage, PassiveCardEffect.DAMAGE, _modifier);
            this.variant = _options.variant;
            this.duration = cm.modifyValue(_options.duration, PassiveCardEffect.EFFECT_DURATION, _modifier);
            this.targetMode = _options.targetMode;
            this.target = _options.target;

            this.events = _options.events;
            this.sprite = this.getSprite(_options.sprite);
            this.setCentralAnimator(this.sprite, true, this.eventListener);
            this.node.mtxLocal.scaling = ƒ.Vector3.ONE(this.size);

            this.rigidbody = this.node.getComponent(ƒ.ComponentRigidbody);

            setTimeout(() => {
                this.removeAnimationEventListeners();
                provider.get(ProjectileManager).removeAOE(this);
            }, this.duration * 1000);
        }

        // should be called through a timing listener
        private explode() {
            if (this.variant !== "explosion") return;
            for (let collision of this.rigidbody.collisions) {
                if (this.target === ProjectileTarget.ENEMY && collision.node.name === "enemy") {
                    collision.node.getComponent(Enemy).hit({damage: this.damage});
                } else if (this.target === ProjectileTarget.PLAYER && collision.node.name === "character") {
                    let char = provider.get(CharacterManager).character;
                    char.hit({damage: this.damage});
                }

            }
        }

        public update(_charPosition: ƒ.Vector3, _frameTimeInSeconds: number) {
            if (this.variant !== "aoe") return;

        }


        private eventListener = (_event: CustomEvent) => {
            if (!this.events) return;
            if (!this.events[_event.type]) return;
            this.events[_event.type].call(this, _event);
        }
    }
}