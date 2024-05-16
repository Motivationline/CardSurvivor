namespace Script {
    export class CardManager {
        private currentlyActiveCards: Card[];
        private cumulativeEffects: PassiveCardEffectObject = {};

        public getEffectAbsolute(_effect: PassiveCardEffect, _modifier: PassiveCardEffectObject = this.cumulativeEffects): number {
            return _modifier.absolute?.[_effect] ?? 0;
        }
        public getEffectMultiplier(_effect: PassiveCardEffect, _modifier: PassiveCardEffectObject = this.cumulativeEffects): number {
            return _modifier.multiplier?.[_effect] ?? 1;
        }
        public modifyValuePlayer(_value: number, _effect: PassiveCardEffect, _localModifiers?: PassiveCardEffectObject){
            if(_localModifiers){
                _value = (_value + this.getEffectAbsolute(_effect, _localModifiers)) * this.getEffectMultiplier(_effect, _localModifiers);
            }
            return (_value + this.getEffectAbsolute(_effect)) * this.getEffectMultiplier(_effect);
        }
        public modifyValue(_value: number, _effect: PassiveCardEffect, _modifier: PassiveCardEffectObject): number {
            return (_value + this.getEffectAbsolute(_effect, _modifier)) * this.getEffectMultiplier(_effect, _modifier)
        }

        public updateEffects(){
            this.cumulativeEffects = {};
            for(let card of this.currentlyActiveCards){
                let effects = card.effects;
                let effect: PassiveCardEffect;
                for(effect in effects.absolute){
                    this.cumulativeEffects.absolute[effect] = (this.cumulativeEffects.absolute[effect] ?? 0) + effects.absolute[effect];
                }
                for(effect in effects.multiplier){
                    this.cumulativeEffects.multiplier[effect] = (this.cumulativeEffects.multiplier[effect] ?? 1) * effects.multiplier[effect];
                }
            }
        }
    }
}