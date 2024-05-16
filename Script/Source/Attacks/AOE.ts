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

        private defaults: AreaOfEffect = {
            size: 1,
            damage: 0,
            sprite: ["aoe", "explosion"],
            duration: 1,
            variant: "explosion",
        }

        setup(_options: Partial<AreaOfEffect>) {
            _options = { ...this.defaults, ..._options };
            this.size = _options.size;
            this.damage = _options.damage;
            this.variant = _options.variant;
            this.duration = _options.duration;
            this.targetMode = _options.targetMode;

            this.events = _options.events;
            this.sprite = this.getSprite(_options.sprite);
            this.setCentralAnimator(this.sprite, true, this.eventListener);

            setTimeout(() => {
                provider.get(ProjectileManager).removeAOE(this);
            }, this.duration * 1000);
        }

        // should be called through a timing listener
        private explode() {
            if(this.variant !== "explosion") return;
            
        }
        
        public update(_charPosition: ƒ.Vector3, _frameTimeInSeconds: number){
            if(this.variant !== "aoe") return;
            
        }


        private eventListener = (_event: CustomEvent) => {
            if (!this.events) return;
            if (!this.events[_event.type]) return;
            this.events[_event.type].call(this, _event);
        }
    }
}