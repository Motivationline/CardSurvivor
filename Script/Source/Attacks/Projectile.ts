namespace Script {
    export enum ProjectileTarget {
        PLAYER,
        ENEMY,
    }

    export class ProjectileComponent extends ƒ.Component implements Projectile {
        tracking: ProjectileTracking;
        direction: ƒ.Vector3;
        targetPosition: ƒ.Vector3;
        damage: number;
        size: number;
        speed: number;
        range: number;
        piercing: number;
        target: ProjectileTarget;

        protected static defaults: Projectile = {
            targetPosition: undefined,
            direction: new ƒ.Vector3(),
            piercing: 0,
            range: Infinity,
            size: 0.5,
            speed: 2,
            damage: 1,
            target: ProjectileTarget.PLAYER,
            tracking: undefined
        }

        constructor(){
            super();
            
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            this.addEventListener(ƒ.EVENT.NODE_DESERIALIZED, this.init)
        }
        
        protected init = ()=>{
            this.removeEventListener(ƒ.EVENT.NODE_DESERIALIZED, this.init)
            
            // setup physics
            this.node.getComponent(ƒ.ComponentRigidbody).removeEventListener(ƒ.EVENT_PHYSICS.TRIGGER_ENTER, this.onTriggerEnter);
            this.node.getComponent(ƒ.ComponentRigidbody).removeEventListener(ƒ.EVENT_PHYSICS.TRIGGER_EXIT, this.onTriggerExit);
        }

        setup(_options: Partial<Projectile>, _manager: CardManager): void {
            _options = { ...ProjectileComponent.defaults, ..._options };
            this.direction = _options.direction;
            this.targetPosition = _options.targetPosition;
            this.tracking = _options.tracking;
            this.damage = (_options.damage + _manager.getEffectAbsolute(PassiveCardEffect.DAMAGE)) * _manager.getEffectMultiplier(PassiveCardEffect.DAMAGE);
            this.size = (_options.size + _manager.getEffectAbsolute(PassiveCardEffect.PROJECTILE_SIZE)) * _manager.getEffectMultiplier(PassiveCardEffect.PROJECTILE_SIZE);
            this.speed = (_options.speed + _manager.getEffectAbsolute(PassiveCardEffect.PROJECTILE_SPEED)) * _manager.getEffectMultiplier(PassiveCardEffect.PROJECTILE_SPEED);
            this.range = (_options.range + _manager.getEffectAbsolute(PassiveCardEffect.PROJECTILE_RANGE)) * _manager.getEffectMultiplier(PassiveCardEffect.PROJECTILE_RANGE);
            this.piercing = (_options.piercing + _manager.getEffectAbsolute(PassiveCardEffect.PROJECTILE_PIERCING)) * _manager.getEffectMultiplier(PassiveCardEffect.PROJECTILE_PIERCING)
            this.target = _options.target;

            this.node.mtxLocal.scaling = ƒ.Vector3.ONE(this.size);
            
            //TODO rotate projectile towards flight direction
        }

        update(_charPosition: ƒ.Vector3, _frameTimeInSeconds: number) {
            this.move();
        }

        protected move() {
            if (this.tracking) {
                // we need to track a certain node, so modify direction accordingly
                this.direction = ƒ.Vector3.DIFFERENCE(this.tracking.target.mtxWorld.translation, this.node.mtxWorld.translation);
            }
            let dir = this.direction.clone;
            dir.normalize(Math.min(1, ƒ.Loop.timeFrameGame / 1000));
            this.node.mtxLocal.translate(dir);
        }

        protected onTriggerEnter = (_event: CustomEvent) => {
            console.log("onTriggerEnter", _event);
        } 
        protected onTriggerExit = (_event: CustomEvent) => {
            console.log("onTriggerExit", _event);
        } 
    }

    export interface Projectile {
        direction: ƒ.Vector3;
        damage: number;
        targetPosition: ƒ.Vector3;
        tracking: ProjectileTracking;
        size: number;
        speed: number;
        range: number;
        piercing: number;
        target: ProjectileTarget;
    }

    interface ProjectileTracking {
        strength?: number,
        stopTrackingAfter?: number,
        stopTrackingInRadius?: number,
        target: ƒ.Node,
    }
}