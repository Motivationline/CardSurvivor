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

        constructor(_as: AnimationSprite, _startTime: number = ƒ.Time.game.get(), _mtx: ƒ.Matrix3x3 = new ƒ.Matrix3x3()) {
            this.mtx = _mtx;
            this.reset(_as, _startTime);
        }

        get matrix(): ƒ.Matrix3x3 {
            return this.mtx;
        }

        public setTime(_time: number = ƒ.Time.game.get()): void {
            _time = (_time - this.startTime) % this.totalTime;
            let frame = Math.floor(_time / this.frameTime);
            if (frame === this.prevFrame) return;
            this.fireEvents(this.prevFrame, frame);
            this.prevFrame = frame;
            let column = frame % this.sprite.wrapAfter;
            let row = Math.floor(frame / this.sprite.wrapAfter);
            // console.log(frame, column, row);
            this.mtx.translation = new ƒ.Vector2(column * this.frameWidth, row * this.frameHeight);
        }

        public reset(_as: AnimationSprite, _time: number = ƒ.Time.game.get()) {
            this.sprite = _as;
            this.startTime = _time;
            this.totalTime = (_as.frames / _as.fps) * 1000;
            this.frameTime = (1 / _as.fps) * 1000;

            this.frameWidth = _as.width / _as.totalWidth;
            this.frameHeight = _as.height / _as.totalHeight;
            this.mtx.scaling = new ƒ.Vector2(this.frameWidth, this.frameHeight);
        }

        private fireEvents(_prevFrame: number, _currentFrame: number) {
            if (!this.sprite.events || !this.sprite.events.length) return;
            if (_prevFrame < 0 || _currentFrame < 0 || _prevFrame > this.sprite.frames || _currentFrame > this.sprite.frames) return;
            if(_currentFrame < _prevFrame) _currentFrame += this.sprite.frames;

            for (let frame = _prevFrame + 1; frame <= _currentFrame; frame++) {
                for (let event of this.sprite.events) {
                    if (event.frame === frame % this.sprite.frames) {
                        this.matrix.dispatchEvent(new CustomEvent(event.event, { detail: { frame, sprite: this.sprite }, bubbles: true}));
                    }
                }
            }
        }
    }
}