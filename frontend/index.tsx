
import { onMount, Show } from "solid-js"
import "js-dos"
import type {CommandInterface, } from "emulators"
import { getRoot } from "~/lib/url"
import { createMutable } from "solid-js/store"
import A from "@arksouthern/jsx/ax"
import { App } from "~/Types"
import { XpWindow } from "~/components/luna/window"
import { XpTitleButtonsNormal, XpTitleButtonsClose } from "~/components/luna/title-buttons"
import { XpBarMenu, XpBarMenuItem, XpBarMenuLineItem, XpBarMenuDivider, XpBarMenuMasterItem } from "~/components/luna/bar-menu"
import { XpBarSegmentDivider, XpStatusBar } from "~/components/luna/status-bar"
import { createDialog } from "~/components/luna/dialog"
import { createAbout } from "~/components/luna/about"
import { closeAppWindow } from "~/lib/luna"

declare const Dos: (parent: HTMLElement, options: any) => Promise<CommandInterface>;

export default function DosApp(props: App) {
  let canvasRef!: HTMLCanvasElement
  let parentCanvasRef!: HTMLDivElement

  const self = createMutable({
    viewSettings: {
      isAltBar: true,
      isStatusBar: false
    }
  });
  props.app.sizeX = 36
  props.app.sizeY = 23
  onMount(async () => {
    if (!parentCanvasRef) {
      return;
    }
    parentCanvasRef.focus(); // Add this line to focus the div
    const bundleUrl = `${getRoot()}/api/v1/arksouthern.luna.dos/`;
    const jsdosBundlePath = `${bundleUrl}${props.app.params.openPath ? `fileDosDirectRead/${props.app.params.openPath}` : `bundle/dos-shell.jsdos`}`;
    const dos = await Dos(parentCanvasRef, {
      backend: "dosboxX",
      workerThread: true,
      autoStart: true,
      pathPrefix: bundleUrl + "modules/" + "js-dos/dist/emulators/",
      url: jsdosBundlePath,
      kiosk: true
    })
    // dos.networkConnect()
  });

  const [PropertiesDlg, setPropertiesDlg] = createDialog({ app: props.app, offsetX: 2, offsetY: 2, sizeX: 30, sizeY: 30 });
  const [About, setAbout] = createAbout({ app: props.app, offsetX: 4, offsetY: 2, sizeX: 30, sizeY: 18 });

  return (
    <>
      <PropertiesDlg
        title={
          <>
            <A.TitleText class="flex-1 pointer-events-none pr-1 tracking-[.032rem] overflow-hidden whitespace-nowrap text-ellipsis">
              Properties
            </A.TitleText>
          </>
        }
      >
        <div class="bg-[#ece9d8] w-full h-full px-3 flex flex-col text-xs">
          <p>DOSBox settings would go here.</p>
          <div class="justify-end flex gap-2 py-2 text-xs">
            <button class="xp-button" onClick={() => setPropertiesDlg.dialogHide()}>OK</button>
            <button class="xp-button" onClick={() => setPropertiesDlg.dialogHide()}>Cancel</button>
          </div>
        </div>
      </PropertiesDlg>
      <About icon={"/src/assets/shell32/7.ico"} title={
        <>
          <A.TitleText class="flex-1 pointer-events-none pr-1 tracking-[.032rem] overflow-hidden whitespace-nowrap text-ellipsis">
            About DOS Compatibility Layer
          </A.TitleText>
          <XpTitleButtonsClose {...props} onClick={() => setAbout.dialogHide()} />
        </>
      }>
        DOSBox emulation for Luna OS <br />
        Version 0.1.0 <br />
        Arkansas Soft Construction <br />
        <br />
        This product is licensed under the terms of the MIT <br />
        License Agreement.
      </About>
      <A.TerminalExe onKeyDown={(e) => {
        if (!e.altKey) return;
        self.viewSettings.isAltBar = !self.viewSettings.isAltBar;
      }}>
        <XpWindow {...props} buttons={<XpTitleButtonsNormal {...props} />} title={
          <>
            <img class="ml-[.062rem] mr-1 w-3.5 h-3.5" src="/src/assets/shell32/7.ico" draggable="false" />
            <A.TitleText class="flex-1 pointer-events-none pr-1 tracking-[.032rem] overflow-hidden whitespace-nowrap text-ellipsis">
              DOS Compatibility Layer
            </A.TitleText>
          </>
        }>
          <Show when={self.viewSettings.isAltBar}>
            <A.AltBar class="h-5 relative border-b border-white bg-[#ece9d8] text-xs">
              <XpBarMenu>
                <XpBarMenuItem name="File">
                  <XpBarMenuLineItem onClick={() => closeAppWindow({ ...props })}>Exit</XpBarMenuLineItem>
                </XpBarMenuItem>
                <XpBarMenuItem name="View">
                  <XpBarMenuMasterItem title="Menu Bar" indicator={self.viewSettings.isAltBar ? "checked" : undefined} onClick={() => self.viewSettings.isAltBar = !self.viewSettings.isAltBar} />
                  <XpBarMenuMasterItem title="Status Bar" indicator={self.viewSettings.isStatusBar ? "checked" : undefined} onClick={() => self.viewSettings.isStatusBar = !self.viewSettings.isStatusBar} />
                  <XpBarMenuDivider />
                  <XpBarMenuMasterItem title="Window" indicator={props.app.view.as == "restore" ? "radio" : undefined} onClick={() => props.app.view.as = "restore"} />
                  <XpBarMenuMasterItem title="Maximize" indicator={props.app.view.as == "maximized" ? "radio" : undefined} onClick={() => props.app.view.as = "maximized"} />
                  <XpBarMenuMasterItem title="Fullscreen" onClick={async () => {
                    parentCanvasRef!.requestFullscreen()
                    await Promise.resolve()
                  }} />
                  
                </XpBarMenuItem>
                <XpBarMenuItem name="Help">
                  <XpBarMenuLineItem onClick={() => setAbout.dialogShow()}>About DOS</XpBarMenuLineItem>
                </XpBarMenuItem>
              </XpBarMenu>
            </A.AltBar>
          </Show>
          <div class="flex-1 flex flex-col bg-black pr-0 pb-0">
            <div ref={parentCanvasRef} class="
                h-full flex-1 focus:outline-none basis-0 overflow-auto border border-[#97aec4]
                
              " 
              tabIndex="0"
            />
            {/* <canvas ref={canvasRef} class="w-full h-full" /> */}
            {/* </div> */}
          </div>
          {self.viewSettings.isStatusBar ?
            <XpStatusBar>
              <A.BarSegment class="flex-1 overflow-hidden text-nowrap text-ellipsis">
                Ready
              </A.BarSegment>
              <XpBarSegmentDivider />
              <A.BarSegment class="w-40 flex justify-between overflow-hidden text-nowrap text-ellipsis">
                DOSBox
                <img class="h-4 w-4 mr-1" src="/src/assets/shell32/7.ico" />
              </A.BarSegment>
            </XpStatusBar>
            : <div />}
        </XpWindow>
      </A.TerminalExe>
    </>
  );
}
