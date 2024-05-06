namespace Script {
    import ƒ = FudgeCore;
    export class SpriteAnimator {
        private mtx: ƒ.Matrix3x3;
        private sprite: AnimationSprite;
        private startTime;
        private totalTime: number;
        private frameTime: number;
        private frameWidth: number;
        private frameHeight: number;
        private prevFrame: number = -1;

        constructor(_as: AnimationSprite, _startTime: number = ƒ.Time.game.get(), _mtx: ƒ.Matrix3x3 = new ƒ.Matrix3x3()){
            this.mtx = _mtx;
            this.sprite = _as;
            this.startTime = _startTime;
            this.totalTime = Math.floor((_as.frames / _as.fps) * 1000);
            this.frameTime = Math.floor((1 / _as.fps) * 1000);

            this.frameWidth = _as.width / _as.totalWidth;
            this.frameHeight = _as.height / _as.totalHeight;
            this.mtx.scaling = new ƒ.Vector2(this.frameWidth, this.frameHeight);
        }

        get matrix(): ƒ.Matrix3x3 {
            return this.mtx;
        }
        
        public setTime(_time: number = ƒ.Time.game.get()): void {
            _time = (_time - this.startTime) % this.totalTime;
            let frame = Math.floor(_time / this.frameTime);
            if(frame === this.prevFrame) return;
            this.prevFrame = frame;
            let column = frame % this.sprite.wrapAfter;
            let row = Math.floor(frame / this.sprite.wrapAfter);
            // console.log(frame, column, row);
            this.mtx.translation = new ƒ.Vector2(column * this.frameWidth, row * this.frameHeight);
        }

        public reset(_as: AnimationSprite, _time: number = ƒ.Time.game.get()){
            this.sprite = _as;
            this.startTime = _time;
            this.totalTime = Math.floor((_as.frames / _as.fps) * 1000);
            this.frameTime = Math.floor((1 / _as.fps) * 1000);

            this.frameWidth = _as.width / _as.totalWidth;
            this.frameHeight = _as.height / _as.totalHeight;
            this.mtx.scaling = new ƒ.Vector2(this.frameWidth, this.frameHeight);
        }
    }
}