/*namespace Script {
  import ƒ = FudgeCore;
  import ƒui = FudgeUserInterface;
  ƒ.Project.registerScriptNamespace(Script);  // Register the namespace to FUDGE for serialization

  export class FPSMonitor {
    public static instance = new FPSMonitor();
    private htmlElement: HTMLElement;
    private frames: number[] = [];

    constructor() {
      if (FPSMonitor.instance) return FPSMonitor.instance;

      FPSMonitor.instance = this;

      document.addEventListener("DOMContentLoaded", () => {
        this.htmlElement = document.createElement("p");
        this.htmlElement.innerText = "FPS";
        let ui: HTMLElement = document.getElementById("ui");
        ui.appendChild(this.htmlElement);
        ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.frame);
      })

    }

    private frame = () => {
      let time = ƒ.Loop.timeFrameReal;
      this.frames.unshift(time);
      if (this.frames.length <= 100) return;
      this.frames.pop();
      let totalTimeFor100Frames = this.frames.reduce((prev, curr) => curr + prev, 0);
      let avgFrameTime = totalTimeFor100Frames / 100;
      let fps = 1000 / avgFrameTime;
      this.htmlElement.innerText = `FPS: ${fps.toPrecision(2)}`;
    }
  }
}*/