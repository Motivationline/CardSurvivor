namespace Script {
    export enum MenuType {
        NONE,
        MAIN,
        COLLECTION,
        SETTINGS,
        PAUSE,
        CARD_UPGRADE,
        END_CONFIRM,
    }
    export class MenuManager {
        private menus: Map<MenuType, HTMLElement> = new Map();
        private prevGameState: GAMESTATE = GAMESTATE.PLAYING;

        public setup() {
            let main: HTMLElement = document.getElementById("main-menu-overlay");
            this.menus.set(MenuType.MAIN, main);
            this.menus.set(MenuType.COLLECTION, document.getElementById("collection-overlay"));
            this.menus.set(MenuType.SETTINGS, document.getElementById("settings-overlay"));
            this.menus.set(MenuType.PAUSE, document.getElementById("pause-overlay"));
            this.menus.set(MenuType.CARD_UPGRADE, document.getElementById("card-upgrade-popup"));
            this.menus.set(MenuType.END_CONFIRM, document.getElementById("end-confirm"));

            main.querySelector("#main-menu-deck").addEventListener("click", () => { this.openMenu(MenuType.COLLECTION) });
            main.querySelector("#main-menu-game").addEventListener("click", () => {
                this.startGame();
            });

            document.getElementById("game-overlay-pause").addEventListener("click", () => {
                this.openPauseMenu();
                if (gameState !== GAMESTATE.PAUSED)
                    this.prevGameState = gameState;
                gameState = GAMESTATE.PAUSED;
            });
            document.getElementById("pause-resume").addEventListener("click", () => {
                this.openMenu(MenuType.NONE);
                gameState = this.prevGameState;
            });
            document.getElementById("pause-quit").addEventListener("click", () => { this.openMenu(MenuType.END_CONFIRM) });
            document.getElementById("end-abort").addEventListener("click", () => { this.openPauseMenu() });
            document.getElementById("end-quit").addEventListener("click", () => {
                this.openMenu(MenuType.MAIN);
                //TODO handle game abort.
            });
        }

        public openMenu(_menu: MenuType) {
            for (let menu of this.menus.entries()) {
                if (menu[0] === _menu) {
                    menu[1].classList.remove("hidden");
                } else {
                    menu[1].classList.add("hidden");
                }
            }
        }

        private startGame() {
            this.openMenu(MenuType.NONE);
            gameState = GAMESTATE.PLAYING;

            let dataManager = provider.get(DataManager);
            let cardManager = provider.get(CardManager);
            cardManager.setCards(dataManager.savedSelectionRaw, dataManager.savedDeckRaw);
        }

        private openPauseMenu() {
            this.openMenu(MenuType.PAUSE);

            let cardsForPauseMenu: HTMLElement[] = [];
            let cm = provider.get(CardManager);
            let element = document.getElementById("pause-overlay-cards");
            for (let card of cm.activeCards) {
                let cv = new CardVisual(card, element, card.id, card.level);
                cardsForPauseMenu.push(cv.htmlElement);
                cv.htmlElement.addEventListener("click", this.openPauseCardPopup);
            }
            element.replaceChildren(...cardsForPauseMenu);
        }

        private openPauseCardPopup = (_event: MouseEvent) => { 

        }
    }
}