namespace Script {
    import ƒ = FudgeCore;
    export class Character extends ƒ.Component {
        #speed: number = 1;
        constructor(){
            super();
            if(ƒ.Project.mode === ƒ.MODE.EDITOR) return;
            this.addEventListener(ƒ.EVENT.NODE_DESERIALIZED, ()=> {
                this.node.addEventListener(ƒ.EVENT.GRAPH_INSTANTIATED, ()=>{
                    provider.get(CharacterManager).character = this;
                }, true);
            })
        }
        move(_direction: ƒ.Vector2){
            this.node.mtxLocal.translate(ƒ.Vector3.SCALE(new ƒ.Vector3(_direction.x, _direction.y), ƒ.Loop.timeFrameGame / 1000));
        }
    }
}