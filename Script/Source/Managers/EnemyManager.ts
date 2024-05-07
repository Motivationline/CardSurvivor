namespace Script {
    export class EnemyManager {
        private characterManager: CharacterManager;
        private config: Config;
        private enemyScripts: Enemy[] = [];
        private enemies: EnemyGraphInstance[] = [];
        private enemyGraph: ƒ.Graph;
        private enemyNode: ƒ.Node;

        constructor(private readonly provider: Provider) {
            if (ƒ.Project.mode === ƒ.MODE.EDITOR) return;
            document.addEventListener("interactiveViewportStarted", <EventListener>this.start);
            ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
            ƒ.Project.addEventListener(ƒ.EVENT.RESOURCES_LOADED, this.loaded);
            this.characterManager = provider.get(CharacterManager);
            this.config = provider.get(Config);
        }

        public setup() {
            ƒ.Debug.log("EnemyManager setup");
        }

        private start = (_event: CustomEvent) => {
            let viewport: ƒ.Viewport = _event.detail;
            this.enemyNode = viewport.getBranch().getChildrenByName("enemies")[0];
        }
        private loaded = async () => {
            this.enemyGraph = <ƒ.Graph>await ƒ.Project.getResourcesByName("enemy")[0];
        }
        private update = () => {
            if (gameState !== GAMESTATE.PLAYING) return;
            let character = this.characterManager.character;
            if (!character) return;

            // create new enemies if needed
            this.spawnEnemies();

            // update enemies
            let time = ƒ.Loop.timeFrameGame / 1000;
            for (let enemy of this.enemyScripts) {
                enemy.update(character.node.mtxWorld.translation, time);
            }
        }

        private async spawnEnemies() {
            if (this.enemies.length >= 2) {
                return;
            }

            // debug: spawn two different enemies
            let newEnemyGraphInstance = ƒ.Recycler.get(EnemyGraphInstance);
            if (!newEnemyGraphInstance.initialized) {
                await newEnemyGraphInstance.set(this.enemyGraph);
            }
            newEnemyGraphInstance.mtxLocal.translation = this.characterManager.character.node.mtxWorld.translation;
            newEnemyGraphInstance.mtxLocal.translate(ƒ.Vector3.NORMALIZATION(new ƒ.Vector3(Math.cos(Math.random() * 2 * Math.PI), Math.sin(Math.random() * 2 * Math.PI)), 5));
            this.enemyNode.addChild(newEnemyGraphInstance);
            this.enemies.push(newEnemyGraphInstance);
            let enemyScript = newEnemyGraphInstance.getComponent(Enemy);
            let animAttackSprite = this.config.getAnimation("toaster", "attack");
            enemyScript.setup({
                moveSprite: this.config.getAnimation("toaster", "move"),
                attacks: [{
                    cooldown: 2,
                    requiredDistance: [2, 3],
                    attackSprite: animAttackSprite,
                    cooldownSprite: this.config.getAnimation("toaster", "idle"),
                    windUp: animAttackSprite.frames / animAttackSprite.fps,
                    attack: function () { console.log("time for an attack!") },
                    movement: function () { },
                    events: {
                        "fire": function () {
                            provider.get(ProjectileManager).createProjectile({
                                direction: ƒ.Vector3.DIFFERENCE(provider.get(CharacterManager).character.node.mtxWorld.translation, this.node.mtxWorld.translation),
                                target: ProjectileTarget.PLAYER,
                                speed: 3,
                            },
                                ƒ.Vector3.SUM(
                                    this.node.mtxWorld.translation,
                                    ƒ.Vector3.Y(0.3)
                                )
                            );
                        },
                    }
                }],
                speed: 0.5,
                desiredDistance: [3, 4],
            });
            this.enemyScripts.push(enemyScript);

            newEnemyGraphInstance = ƒ.Recycler.get(EnemyGraphInstance);
            if (!newEnemyGraphInstance.initialized) {
                await newEnemyGraphInstance.set(this.enemyGraph);
            }
            newEnemyGraphInstance.mtxLocal.translation = this.characterManager.character.node.mtxWorld.translation;
            newEnemyGraphInstance.mtxLocal.translate(ƒ.Vector3.NORMALIZATION(new ƒ.Vector3(Math.cos(Math.random() * 2 * Math.PI), Math.sin(Math.random() * 2 * Math.PI)), 5));
            this.enemyNode.addChild(newEnemyGraphInstance);
            this.enemies.push(newEnemyGraphInstance);
            enemyScript = newEnemyGraphInstance.getComponent(Enemy);
            enemyScript.setup({
                moveSprite: this.config.getAnimation("chair", "move"),
                speed: 0.5,
                desiredDistance: [0, 0.2],
            });
            this.enemyScripts.push(enemyScript);


            newEnemyGraphInstance = ƒ.Recycler.get(EnemyGraphInstance);
            if (!newEnemyGraphInstance.initialized) {
                await newEnemyGraphInstance.set(this.enemyGraph);
            }
            newEnemyGraphInstance.mtxLocal.translation = this.characterManager.character.node.mtxWorld.translation.clone;
            newEnemyGraphInstance.mtxLocal.translate(new ƒ.Vector3(0, 10));
            this.enemyNode.addChild(newEnemyGraphInstance);
            this.enemies.push(newEnemyGraphInstance);
            enemyScript = newEnemyGraphInstance.getComponent(Enemy);
            enemyScript.setup({
                moveSprite: this.config.getAnimation("motor", "move"),
                speed: 3,
                directionOverride: ƒ.Vector3.Y(-1),
            });
            this.enemyScripts.push(enemyScript);
        }

        public removeEnemy(_enemy: Enemy) {
            let index = this.enemyScripts.findIndex((n) => n === _enemy);
            if (index >= 0) {
                this.enemyScripts.splice(index, 1);
                ƒ.Recycler.storeMultiple(this.enemies.splice(index, 1));
            }
        }
    }
}