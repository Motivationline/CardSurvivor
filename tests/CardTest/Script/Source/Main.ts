namespace Script {
  import ƒ = FudgeCore;

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener><unknown>start);

  async function start(_event: CustomEvent): Promise<void> {
    console.log("start");
    viewport = _event.detail;
    await initI18n("en", "de");

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    // ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    let card = new Card(i18next.t("card.example.name"), i18next.t("card.example.text"), "example.gif", document.getElementById("card-wrapper"));
    document.getElementById("card-wrapper").appendChild(card.htmlElement);
  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
  }
}