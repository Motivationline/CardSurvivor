namespace Script {
    export class EnemyManager {
        private characterManager: CharacterManager;
        private enemyScripts: Enemy[] = [];
        private enemies: EnemyGraphInstance[] = [];
        private enemy: ƒ.Graph;
        private enemyNode: ƒ.Node;

        constructor(private readonly provider: Provider) {
            if (ƒ.Project.mode === ƒ.MODE.EDITOR) return;
            document.addEventListener("interactiveViewportStarted", <EventListener>this.start);
            ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
            ƒ.Project.addEventListener(ƒ.EVENT.RESOURCES_LOADED, this.loaded.bind(this));
            this.characterManager = provider.get(CharacterManager);
        }

        public setup(){
            ƒ.Debug.log("EnemyManager setup");
        }

        private start = (_event: CustomEvent) => {
            let viewport: ƒ.Viewport = _event.detail;
            this.enemyNode = viewport.getBranch().getChildrenByName("enemies")[0];
        }
        private loaded = async () => {
            this.enemy = <ƒ.Graph>await ƒ.Project.getResourcesByName("enemy")[0];
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
                await newEnemyGraphInstance.set(this.enemy);
            }
            newEnemyGraphInstance.mtxLocal.translation = this.characterManager.character.node.mtxWorld.translation;
            newEnemyGraphInstance.mtxLocal.translate(ƒ.Vector3.NORMALIZATION(new ƒ.Vector3(Math.cos(Math.random() * 2 * Math.PI), Math.sin(Math.random() * 2 * Math.PI)), 10));
            this.enemyNode.addChild(newEnemyGraphInstance);
            this.enemies.push(newEnemyGraphInstance);
            let enemyScript = newEnemyGraphInstance.getComponent(Enemy);
            enemyScript.setup({
                moveSprite: {
                    fps: 24,
                    frames: 21,
                    height: 256,
                    width: 256,
                    totalHeight: 1280,
                    totalWidth: 1280,
                    wrapAfter: 5,
                    material: <ƒ.Material>await ƒ.Project.getResource("Material|2024-05-06T13:30:03.916Z|15502"),
                },
                attacks: [{
                    cooldown: 3,
                    requiredDistance: [2, 3],
                    sprite: {
                        fps: 24,
                        frames: 24,
                        height: 256,
                        width: 256,
                        totalHeight: 1280,
                        totalWidth: 1280,
                        wrapAfter: 5,
                        material: <ƒ.Material>await ƒ.Project.getResource("Material|2024-05-06T13:30:28.224Z|93961"),
                    },
                    windUp: 2,
                    attack: () => {console.log("time for an attack!")},
                    movement: () => {}
                }],
                speed: 0.5,
                desiredDistance: [3, 4],
            });
            this.enemyScripts.push(enemyScript);
            
            newEnemyGraphInstance = ƒ.Recycler.get(EnemyGraphInstance);
            if (!newEnemyGraphInstance.initialized) {
                await newEnemyGraphInstance.set(this.enemy);
            }
            newEnemyGraphInstance.mtxLocal.translation = this.characterManager.character.node.mtxWorld.translation;
            newEnemyGraphInstance.mtxLocal.translate(ƒ.Vector3.NORMALIZATION(new ƒ.Vector3(Math.cos(Math.random() * 2 * Math.PI), Math.sin(Math.random() * 2 * Math.PI)), 10));
            this.enemyNode.addChild(newEnemyGraphInstance);
            this.enemies.push(newEnemyGraphInstance);
            enemyScript = newEnemyGraphInstance.getComponent(Enemy);
            enemyScript.setup({
                moveSprite: {
                    fps: 24,
                    frames: 21,
                    height: 256,
                    width: 256,
                    totalHeight: 1280,
                    totalWidth: 1280,
                    wrapAfter: 5,
                    material: <ƒ.Material>await ƒ.Project.getResource("Material|2024-05-06T13:29:21.308Z|14942"),
                },
                speed: 0.5,
                desiredDistance: [0, 0.2],
            });
            this.enemyScripts.push(enemyScript);


            newEnemyGraphInstance = ƒ.Recycler.get(EnemyGraphInstance);
            if (!newEnemyGraphInstance.initialized) {
                await newEnemyGraphInstance.set(this.enemy);
            }
            newEnemyGraphInstance.mtxLocal.translation = this.characterManager.character.node.mtxWorld.translation.clone;
            newEnemyGraphInstance.mtxLocal.translate(new ƒ.Vector3(0, 10));
            this.enemyNode.addChild(newEnemyGraphInstance);
            this.enemies.push(newEnemyGraphInstance);
            enemyScript = newEnemyGraphInstance.getComponent(Enemy);
            enemyScript.setup({
                moveSprite: {
                    fps: 24,
                    frames: 24,
                    height: 256,
                    width: 256,
                    totalHeight: 1280,
                    totalWidth: 1280,
                    wrapAfter: 5,
                    material: <ƒ.Material>await ƒ.Project.getResource("Material|2024-05-06T13:29:52.414Z|09807"),
                },
                speed: 3,
                directionOverride: ƒ.Vector3.Y(-1),
            });
            this.enemyScripts.push(enemyScript);
        }

        public removeEnemy(_enemy: Enemy) {
            let index = this.enemyScripts.findIndex((n) => n === _enemy);
            if (index >= 0) {
                this.enemyScripts.splice(index, 1);
            }
        }
    }
}