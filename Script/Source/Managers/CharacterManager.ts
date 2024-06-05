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

        private update = () => {
            if (!this.#character) return;
            if (gameState === GAMESTATE.PAUSED) return;
            if (gameState === GAMESTATE.IDLE) return;

            this.#character.update(this.movementVector);
        }

        public upgradeCards() {
            let defaultCardsToChooseFromAmount: number = 3;
            let cm = provider.get(CardManager);
            let cards = cm.getCardsToChooseFrom(cm.modifyValuePlayer(defaultCardsToChooseFromAmount, PassiveCardEffect.CARD_UPGRADE_SLOTS));
            let elementsToShow: HTMLElement[] = [];
            let parent: HTMLElement = document.getElementById("card-upgrade-popup");
            if (!cards || cards.length === 0) {
                //TODO add other bonus, like health or something
                let element = document.createElement("div");
                element.classList.add("card");
                elementsToShow.push(element);
                element.addEventListener("click", () => {
                    provider.get(MenuManager).openMenu(MenuType.NONE);
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
                    }
                }
            }
            parent.replaceChildren(...elementsToShow);
            provider.get(MenuManager).openMenu(MenuType.CARD_UPGRADE);

        }
    }


}