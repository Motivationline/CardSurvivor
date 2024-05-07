namespace Script {
    export class ProjectileComponent extends ƒ.Component implements Projectile {
        direction: ƒ.Vector3;
        target: ƒ.Node;
        track: number;
        size: number;
        speed: number;
        range: number;
        piercing: number;

        protected static defaults: Projectile = {
            target: undefined,
            direction: new ƒ.Vector3(),
            piercing: 0,
            range: Infinity,
            size: 0.1,
            speed: 2,
            track: 0,
        }

        setup(_options: Partial<Projectile>, manager: CardManager): void {
            _options = { ...ProjectileComponent.defaults, ..._options };
            this.direction = _options.direction;
            this.target = _options.target;
            this.track = _options.track;
            this.size = (_options.size + manager.getEffectAbsolute(PassiveCardEffect.PROJECTILE_SIZE)) * manager.getEffectMultiplier(PassiveCardEffect.PROJECTILE_SIZE);
            this.speed = (_options.speed + manager.getEffectAbsolute(PassiveCardEffect.PROJECTILE_SPEED)) * manager.getEffectMultiplier(PassiveCardEffect.PROJECTILE_SPEED);
            this.range = (_options.range + manager.getEffectAbsolute(PassiveCardEffect.PROJECTILE_RANGE)) * manager.getEffectMultiplier(PassiveCardEffect.PROJECTILE_RANGE);
            this.piercing = (_options.piercing + manager.getEffectAbsolute(PassiveCardEffect.PROJECTILE_PIERCING)) * manager.getEffectMultiplier(PassiveCardEffect.PROJECTILE_PIERCING)
        }

        update() {
            this.move();
        }

        private move() {

        }

    }

    export interface Projectile {
        direction: ƒ.Vector3;
        target: ƒ.Node;
        track: number;
        size: number;
        speed: number;
        range: number;
        piercing: number;
    }
}