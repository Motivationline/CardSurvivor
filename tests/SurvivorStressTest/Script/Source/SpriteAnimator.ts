namespace Script {
    import ƒ = FudgeCore;
    export class SpriteAnimator {
        private mtx: ƒ.Matrix3x3;
        private startTime: number;
        private frames: number;
        private fps: number;
        private totalTime: number;
        private frameTime: number;
        private frameWidth: number;

        constructor(_frames: number, _fps: number, _startTime: number, _mtx: ƒ.Matrix3x3 = new ƒ.Matrix3x3()){
            this.mtx = _mtx;
            this.startTime = _startTime;
            this.frames = _frames;
            this.fps = _fps;
            this.totalTime = Math.floor((this.frames / this.fps) * 1000);
            this.frameTime = Math.floor((1 / this.fps) * 1000);

            this.frameWidth = 1 / this.frames;
            this.mtx.scaling = new ƒ.Vector2(this.frameWidth, 1);
        }

        get matrix(): ƒ.Matrix3x3 {
            return this.mtx;
        }
        
        public setTime(_time: number): void {
            _time = (_time - this.startTime) % this.totalTime;
            let frame = Math.floor(_time / this.frameTime);
            this.mtx.translation = new ƒ.Vector2(frame * this.frameWidth);
        }
    }
}