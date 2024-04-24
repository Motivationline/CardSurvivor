namespace Script {
    import ƒ = FudgeCore;
    export class Enemy extends ƒ.Component implements ƒ.Recycable {
        // #animator: ƒ.ComponentAnimator;
        #direction: number = 0;
        #visualDeactivated: boolean = true;
        // #centralAnimatorProvider: boolean = false;

        constructor() {
            super();

            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;

            // Listen to this component being added to or removed from a node

            // ƒ.Project.addEventListener(ƒ.EVENT.RESOURCES_LOADED, this.loaded.bind(this));
            this.addEventListener(ƒ.EVENT.NODE_DESERIALIZED, this.init);
            // this.addEventListener(ƒ.EVENT.NODE_DESERIALIZED, () => {
            //     this.node.addEventListener(ƒ.EVENT.GRAPH_INSTANTIATED, this.init.bind(this), true)
            // });

            // ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.loop);
            // ƒ.Loop.removeEventListener(ƒ.EVENT.LOOP_FRAME, this.loop);
        }
        recycle(): void {
            //
            // if(this.#centralAnimatorProvider) {
            //     this.#animator.activate(true);
            // }
        }

        init = async () => {
            this.removeEventListener(ƒ.EVENT.NODE_DESERIALIZED, this.init);
            // this.#animator = this.node.getComponent(ƒ.ComponentAnimator);
            // this.#texture = <ƒ.CoatTextured>this.node.getComponent(ƒ.ComponentMaterial).material.coat;

            this.setCentralAnimator();
            // this.#textures = {
            //     "s": <ƒ.TextureImage><unknown>await ƒ.Project.getResourcesByName("enemyTexture64"),
            //     "m": <ƒ.TextureImage><unknown>await ƒ.Project.getResourcesByName("enemyTexture256"),
            //     "l": <ƒ.TextureImage><unknown>await ƒ.Project.getResourcesByName("enemyTexture1024"),
            // }
        }

        loop = () => {
            if (this.#visualDeactivated !== EnemyManager.Instance.disableVisuals) {
                this.#visualDeactivated = EnemyManager.Instance.disableVisuals;
                this.node.getComponent(ƒ.ComponentMesh).activate(!this.#visualDeactivated)
            }

            if (EnemyManager.Instance.noEnemyMovement) return;
            let diff = ƒ.Vector3.DIFFERENCE(EnemyManager.Character.mtxWorld.translation, this.node.mtxLocal.translation);
            if (diff.magnitudeSquared < 1) {
                EnemyManager.Instance.removeEnemy(this.node);
            } else {
                diff.normalize(EnemyManager.Instance.enemySpeed * Math.min(ƒ.Loop.timeFrameGame / 1000, 1));
                this.node.mtxLocal.translate(diff, false);
                let dir = Math.sign(diff.x);
                if (dir !== this.#direction) {
                    this.#direction = dir;
                    if (this.#direction > 0) {
                        this.node.mtxLocal.rotation = new ƒ.Vector3();
                    } else if (this.#direction < 0) {
                        this.node.mtxLocal.rotation = new ƒ.Vector3(0, 180, 0);
                    }
                }

            }
        }

        setCentralAnimator() {
            // this.#animator.activate(false);
            let mat = this.node.getComponent(ƒ.ComponentMaterial);
            // console.log(EnemyManager.Instance.centralAnimationMtx);
            // if (!EnemyManager.Instance.centralAnimationMtx) {
            //     EnemyManager.Instance.centralAnimationMtx = mat.mtxPivot;
            //     this.#animator.activate(true);
            //     this.#centralAnimatorProvider = true;
            // }
            mat.mtxPivot = EnemyManager.Instance.getAnimMtx(24, 24);
            // this.#centralAnimator = true;
        }
    }
}