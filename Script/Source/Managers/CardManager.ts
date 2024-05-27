namespace Script {
    export class CardManager {
        private currentlyActiveCards: Card[] = [];
        private cumulativeEffects: PassiveCardEffectObject = { absolute: {}, multiplier: {} };

        constructor() {
            this.currentlyActiveCards.push(
                // new Card(cards["anvil"], 0),
                // new Card(cards["testSize"], 1),
            );
            this.updateEffects();
            ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
        }

        private update = () => {
            if (gameState !== GAMESTATE.PLAYING) return;
            let time: number = ƒ.Loop.timeFrameGame / 1000;
            for (let card of this.currentlyActiveCards) {
                card.update(time, this.combineEffects(this.cumulativeEffects, card.effects));
            }
        }

        public getEffectAbsolute(_effect: PassiveCardEffect, _modifier: PassiveCardEffectObject = this.cumulativeEffects): number {
            return _modifier.absolute?.[_effect] ?? 0;
        }
        public getEffectMultiplier(_effect: PassiveCardEffect, _modifier: PassiveCardEffectObject = this.cumulativeEffects): number {
            return _modifier.multiplier?.[_effect] ?? 1;
        }
        public modifyValuePlayer(_value: number, _effect: PassiveCardEffect, _localModifiers?: PassiveCardEffectObject) {
            if (_localModifiers) {
                _value = (_value + this.getEffectAbsolute(_effect, _localModifiers)) * this.getEffectMultiplier(_effect, _localModifiers);
            }
            return (_value + this.getEffectAbsolute(_effect)) * this.getEffectMultiplier(_effect);
        }
        public modifyValue(_value: number, _effect: PassiveCardEffect, _modifier: PassiveCardEffectObject): number {
            if (!_modifier) return _value;
            return (_value + this.getEffectAbsolute(_effect, _modifier)) * this.getEffectMultiplier(_effect, _modifier)
        }

        public updateEffects() {
            let cardEffects: PassiveCardEffectObject[] = [];
            for (let card of this.currentlyActiveCards) {
                let effects = card.effects;
                if (!effects) continue;
                cardEffects.push(effects);
            }
            this.cumulativeEffects = this.combineEffects(...cardEffects);
        }

        public combineEffects(..._effects: PassiveCardEffectObject[]): PassiveCardEffectObject{
            let combined: PassiveCardEffectObject = {absolute: {}, multiplier: {}};
            for(let effectObj of _effects){
                if(!effectObj) continue;
                let effect: PassiveCardEffect;
                for(effect in effectObj.absolute){
                    combined.absolute[effect] = (combined.absolute[effect] ?? 0) + effectObj.absolute[effect];
                }
                for(effect in effectObj.multiplier){
                    combined.multiplier[effect] = (combined.multiplier[effect] ?? 1) * effectObj.multiplier[effect];
                }
            }
            return combined;
        }
    }
}