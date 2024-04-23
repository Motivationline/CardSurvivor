namespace Script {
    import ƒ = FudgeCore;
    export class EnemyGraphInstance extends ƒ.GraphInstance implements ƒ.Recycable {
        initialized = false;
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;


        }
        recycle(): void {
            // console.log("recycle me");
        }

        async set(_graph: ƒ.Graph){
            await super.set(_graph);
            this.initialized = true;
        }
    }
}