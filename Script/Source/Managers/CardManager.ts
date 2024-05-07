namespace Script {
    export class CardManager {
        private currentlyActiveCards: Card[];
        private cumulativeEffects: PassiveCardEffectObject = {};

        public getEffectAbsolute(_effect: PassiveCardEffect): number {
            return this.cumulativeEffects.absolute?.[_effect] ?? 0;
        }
        public getEffectMultiplier(_effect: PassiveCardEffect): number {
            return this.cumulativeEffects.multiplier?.[_effect] ?? 1;
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