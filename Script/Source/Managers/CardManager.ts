namespace Script {
    export class CardManager {
        private currentlyActiveCards: Card[] = [];
        private deckCards: Card[] = [];
        private cumulativeEffects: PassiveCardEffectObject = { absolute: {}, multiplier: {} };
        private defaultMaxActiveCardAmount: number = 10;
        private currentMaxActiveCardAmount: number = 10;

        constructor() {
            this.updateEffects();
            ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
        }

        get activeCards() {
            return this.currentlyActiveCards;
        }

        private update = () => {
            if (gameState !== GAMESTATE.PLAYING) return;
            let time: number = ƒ.Loop.timeFrameGame / 1000;
            for (let card of this.currentlyActiveCards) {
                card.update(time, this.cumulativeEffects);
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

            this.currentMaxActiveCardAmount = this.modifyValuePlayer(this.defaultMaxActiveCardAmount, PassiveCardEffect.CARD_SLOTS);
            provider.get(CharacterManager).character?.updateMaxHealth();
        }

        public combineEffects(..._effects: PassiveCardEffectObject[]): PassiveCardEffectObject {
            let combined: PassiveCardEffectObject = { absolute: {}, multiplier: {} };
            for (let effectObj of _effects) {
                if (!effectObj) continue;
                let effect: PassiveCardEffect;
                for (effect in effectObj.absolute) {
                    combined.absolute[effect] = (combined.absolute[effect] ?? 0) + effectObj.absolute[effect];
                }
                for (effect in effectObj.multiplier) {
                    combined.multiplier[effect] = (combined.multiplier[effect] ?? 1) * effectObj.multiplier[effect];
                }
            }
            return combined;
        }

        private prevChosenCards: Card[] = [];
        public setCards(_selection: string[], _deck: string[]) {
            this.currentlyActiveCards = [];
            this.deckCards = [];
            this.prevChosenCards = [];
            for (let cardId of _selection) {
                this.currentlyActiveCards.push(new Card(cards[cardId], cardId, 0));
            }
            for (let cardId of _deck) {
                this.deckCards.push(new Card(cards[cardId], cardId, 0));
            }

            this.updateEffects();
        }

        public getCardsToChooseFrom(_maxAmt: number, _newCards: boolean = false): Card[] {
            let possibleCards = [...this.currentlyActiveCards];

            if (this.currentlyActiveCards.length < this.currentMaxActiveCardAmount) {
                possibleCards.push(...this.deckCards);
            }

            for (let i: number = 0; i < possibleCards.length; i++) {
                let card = possibleCards[i];
                if ((_newCards && this.prevChosenCards.includes(card)) ||
                    (card.level >= card.levels.length - 1 && this.activeCards.includes(card))) {
                    possibleCards.splice(i, 1);
                    i--;
                }
            }

            // shuffle options
            possibleCards = possibleCards
                .map(value => ({ value, sort: Math.random() }))
                .sort((a, b) => a.sort - b.sort)
                .map(({ value }) => value);

            possibleCards.length = Math.min(Math.floor(_maxAmt), possibleCards.length);

            this.prevChosenCards = possibleCards;
            return possibleCards;
        }

        public updateCardOrAdd(_cardId: string) {
            let card = this.currentlyActiveCards.find((card) => card.id === _cardId);
            if (card) {
                // update
                card.level = Math.min(card.level + 1, card.levels.length - 1);
                return this.updateEffects();
            };
            // add
            for (let i: number = 0; i < this.deckCards.length; i++) {
                let deckCard = this.deckCards[i];
                if (deckCard.id === _cardId) {
                    this.currentlyActiveCards.push(deckCard);
                    this.deckCards.splice(i, 1);
                    return this.updateEffects();
                }
            }
        }
    }
}