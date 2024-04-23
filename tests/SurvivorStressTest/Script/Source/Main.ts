namespace Script {
  import ƒ = FudgeCore;
  import ƒui = FudgeUserInterface;
  ƒ.Debug.info("Main Program Template running!");

  export let viewport: ƒ.Viewport;
  export let freeCam: ƒ.ComponentCamera;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
    viewport = _event.detail.vp;
    freeCam = _event.detail.cam;

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a

  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  /** Helper function to set up a (deep) proxy object that calls the onChange function __before__ the element is modified*/
  export function onChange(object: any, onChange: Function) {
    const handler = {
      get(target: any, property: any, receiver: any): any {
        try {
          return new Proxy(target[property], handler);
        } catch (err) {
          return Reflect.get(target, property, receiver);
        }
      },
      defineProperty(target: any, property: any, descriptor: any): boolean {
        onChange();
        return Reflect.defineProperty(target, property, descriptor);
      },
      deleteProperty(target: any, property: any): boolean {
        onChange();
        return Reflect.deleteProperty(target, property);
      }
    };

    return new Proxy(object, handler);
  }
}