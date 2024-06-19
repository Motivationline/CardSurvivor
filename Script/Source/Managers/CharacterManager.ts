namespace Script {
    import ƒ = FudgeCore;
    export class CharacterManager {
        private movementVector: ƒ.Vector2 = new ƒ.Vector2();
        #character: Character;

        constructor(private readonly provider: Provider) {
            if (ƒ.Project.mode === ƒ.MODE.EDITOR) return;

            ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
        }

        get character() {
            return this.#character;
        }
        set character(_char: Character) {
            this.#character = _char;
        }

        public setMovement(_direction: ƒ.Vector2) {
            this.movementVector = _direction;
        }

        public getMovement() {
            return this.movementVector;
        }

        public isMoving(): boolean {
            return this.movementVector.magnitudeSquared === 0;
        }

        private update = () => {
            if (!this.#character) return;
            if (gameState === GAMESTATE.PAUSED) return;
            if (gameState === GAMESTATE.IDLE) return;

            this.#character.update(this.movementVector);
        }

        public async upgradeCards(_amountOverride?: number, _newCards: boolean = false, _rerolls: number = 0): Promise<void> {
            return new Promise((resolve) => {
                let rerollButton = <HTMLButtonElement>document.getElementById("card-upgrade-popup-reroll");
                const reroll = async () => {
                    rerollButton.removeEventListener("click", reroll);
                    if (_rerolls > 0) {
                        await this.upgradeCards(_amountOverride, _newCards, _rerolls - 1);
                    }
                    resolve();
                }
                rerollButton.innerText = `Reroll (${_rerolls})`;
                if (_rerolls > 0) {
                    rerollButton.addEventListener("click", reroll);
                    rerollButton.classList.remove("hidden");
                } else {
                    rerollButton.classList.add("hidden");
                }

                let defaultCardsToChooseFromAmount: number = 3;
                let cm = provider.get(CardManager);

                let cardAmount = cm.modifyValuePlayer(defaultCardsToChooseFromAmount, PassiveCardEffect.CARD_UPGRADE_SLOTS);
                if (_amountOverride) cardAmount = _amountOverride;
                let cards = cm.getCardsToChooseFrom(cardAmount, _newCards);
                let elementsToShow: HTMLElement[] = [];
                let parent: HTMLElement = document.getElementById("card-upgrade-popup-wrapper");
                if (!cards || cards.length === 0) {
                    //TODO add other bonus, like health or something
                    let element = document.createElement("div");
                    element.classList.add("card");
                    elementsToShow.push(element);
                    element.addEventListener("click", () => {
                        provider.get(MenuManager).openMenu(MenuType.NONE);
                        rerollButton.removeEventListener("click", reroll);
                        resolve();
                    });

                } else {
                    // we have cards we can upgrade / add
                    for (let card of cards) {
                        let cv = new CardVisual(card, parent, card.id, card.level);
                        elementsToShow.push(cv.htmlElement);
                        cv.htmlElement.addEventListener("click", selectCard);
                        if (cm.activeCards.includes(card))
                            cv.htmlElement.classList.add("upgrade");
                        else
                            cv.htmlElement.classList.add("unlock");
                        function selectCard() {
                            cm.updateCardOrAdd(card.id);
                            provider.get(MenuManager).openMenu(MenuType.NONE);
                            rerollButton.removeEventListener("click", reroll);
                            resolve();
                        }
                    }
                }
                parent.replaceChildren(...elementsToShow);
                provider.get(MenuManager).openMenu(MenuType.CARD_UPGRADE);
            });

        }
    }


}