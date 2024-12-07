import { useState } from "react";

import Piano from "./Components/Piano";
import useSynthStore from "./Hooks/useSynthStore";
import useKeyboardMapping from "./Hooks/useKeyboardMapping";
import useMidi from "./Hooks/useMidi";
import Oscilloscope from "./Components/Oscilloscope";
import useIsMobile from "./Hooks/useIsMobile";
import { PiWaveSineBold } from "react-icons/pi";
import { FaVolumeUp } from "react-icons/fa";
import { RiNumbersLine } from "react-icons/ri";
import { FaBalanceScale } from "react-icons/fa";
import { FaArrowsAltH } from "react-icons/fa";
import { RiUserVoiceFill } from "react-icons/ri";
import { GiMusicalScore } from "react-icons/gi";

const themes = {
  pink: {
    bg: {
      primary: "bg-[rgb(255,173,187)]",
      secondary: "bg-[rgb(255,238,240)]",
    },
    accent: {
      primary: "accent-[rgb(255,173,187)]",
      secondary: "accent-[rgb(255,238,240)]",
    },
    border: {
      primary: "border-[rgb(255,173,187)]",
      secondary: "border-[rgb(255,238,240)]",
    },
    pressed: {
      primary: "data-[pressed=true]:bg-[rgb(255,173,187)]",
      secondary: "data-[pressed=true]:bg-[rgb(255,238,240)]",
    },
  },
};

type ThemeKeys = keyof typeof themes;

function App() {
  const initSynth = useSynthStore((state) => state.init);
  const audioCtxState = useSynthStore((state) => state.audioCtx?.state || "");
  const noteOn = useSynthStore((state) => state.noteOn);
  const noteOff = useSynthStore((state) => state.noteOff);
  const [masterVolume, setMasterVolume] = [
    useSynthStore((state) => state.masterVolume),
    useSynthStore((state) => state.setMasterVolume),
  ];
  const [mode, setMode] = [
    useSynthStore((state) => state.mode),
    useSynthStore((state) => state.setMode),
  ];
  const [modLevel, setModLevel] = [
    useSynthStore((state) => state.modLevel),
    useSynthStore((state) => state.setModLevel),
  ];
  const [modRatio, setModRatio] = [
    useSynthStore((state) => state.modRatio),
    useSynthStore((state) => state.setModRatio),
  ];
  const [modOffset, setModOffset] = [
    useSynthStore((state) => state.modOffset),
    useSynthStore((state) => state.setModOffset),
  ];
  const [maxVoices, setMaxVoices] = [
    useSynthStore((state) => state.maxVoices),
    useSynthStore((state) => state.setMaxVoices),
  ];
  const analyzer = useSynthStore((state) => state.analyzer);
  const pressedNotes = useSynthStore((state) => state.pressedNotes);
  const isMobile = useIsMobile();

  const [octave, setOctave] = useState(4);

  useKeyboardMapping(
    (note) => noteOn(octave * 12 + note),
    (note) => noteOff(octave * 12 + note)
  );

  useMidi(
    (note) => noteOn(note),
    (note) => noteOff(note)
  );

  const [selectedTheme, setSelectedTheme] = useState<ThemeKeys>("pink");

  return (
    <>
      <div
        className={`border-2 border-red-500 min-w-[1248px] min-h-[3000px] font-poppins text-black flex flex-col gap-8 ${themes[selectedTheme].bg.secondary}`}
      >
        <div>
          <nav
            className={`border-2 border-blue-500 p-8 flex items-center justify-center ${themes[selectedTheme].bg.primary}`}
          >
            <div className="border-2 border-red-500 flex items-center gap-2">
              <div className="flex items-center">
                {/* <PiWaveSineBold size={40} className="-ml-[7.5px]" />
            <PiWaveSineBold size={40} className="-ml-[7.5px]" />
            <PiWaveSineBold size={40} className="-ml-[7.5px]" /> */}
              </div>
              <h1 className="text-[2rem] font-[500]">Web Audio Synth</h1>
            </div>
          </nav>
          <div className="border-2 border-blue-500 w-max m-auto p-8 flex flex-col gap-8">
            <div className="flex justify-between gap-8 items-center">
              <div className="flex flex-col gap-4 w-[600px] border-2 border-red-500 text-lg">
                {/* MODE */}
                <div className="flex">
                  <label className="flex gap-2 items-center w-1/3">
                    <PiWaveSineBold />
                    Mode
                  </label>
                  <div className="w-1/3 pl-4">
                    <select
                      value={mode}
                      onChange={(e) => setMode(e.target.value as any)}
                    >
                      <option value="FM">FM</option>
                      <option value="AM">AM</option>
                    </select>
                  </div>
                </div>

                {/* VOLUME */}
                <div className="flex">
                  <label className="flex gap-2 items-center w-1/3">
                    <FaVolumeUp />
                    Volume
                  </label>
                  <div className="w-1/3 pl-4">
                    <input
                      type="number"
                      min={0}
                      max={1}
                      value={masterVolume}
                      onChange={(e) =>
                        setMasterVolume(parseFloat(e.target.value))
                      }
                    />
                  </div>
                  <input
                    type="range"
                    className={`${themes[selectedTheme].accent.primary} ${themes[selectedTheme].bg.secondary} w-1/3`}
                    min={0}
                    max={1}
                    step={0.0001}
                    value={masterVolume}
                    onChange={(e) =>
                      setMasterVolume(parseFloat(e.target.value))
                    }
                  />
                </div>

                {/* MODULATOR LEVEL */}
                <div className="flex">
                  <label className="flex gap-2 items-center w-1/3">
                    <RiNumbersLine />
                    Modulator Level
                  </label>
                  <div className="w-1/3 pl-4">
                    <input
                      type="number"
                      min={0}
                      max={1}
                      value={modLevel}
                      onChange={(e) => setModLevel(parseFloat(e.target.value))}
                    />
                  </div>
                  <input
                    type="range"
                    className={`${themes[selectedTheme].accent.primary} ${themes[selectedTheme].bg.secondary} w-1/3`}
                    min={0}
                    max={1}
                    step={0.0001}
                    value={modLevel}
                    onChange={(e) => setModLevel(parseFloat(e.target.value))}
                  />
                </div>
                <div className="flex">
                  <label className="flex gap-2 items-center w-1/3">
                    <FaBalanceScale />
                    Modulator Ratio
                  </label>
                  <div className="w-1/3 pl-4">
                    <input
                      type="number"
                      min={0}
                      max={64}
                      value={modRatio}
                      onChange={(e) => setModRatio(parseFloat(e.target.value))}
                    />
                  </div>
                  <input
                    type="range"
                    className={`${themes[selectedTheme].accent.primary} ${themes[selectedTheme].bg.secondary} w-1/3`}
                    min={0}
                    max={64}
                    step={0.0001}
                    value={modRatio}
                    onChange={(e) => setModRatio(parseFloat(e.target.value))}
                  />
                </div>
                <div className="flex">
                  <label className="flex gap-2 items-center w-1/3">
                    <FaArrowsAltH />
                    Modulator Offset
                  </label>
                  <div className="w-1/3 pl-4">
                    <input
                      type="number"
                      min={-1000}
                      max={1000}
                      value={modOffset}
                      onChange={(e) => setModOffset(parseFloat(e.target.value))}
                    />
                    <span className="ml-2">Hz</span>
                  </div>
                  <input
                    type="range"
                    className={`${themes[selectedTheme].accent.primary} ${themes[selectedTheme].bg.secondary} w-1/3`}
                    min={-1000}
                    max={1000}
                    step={0.0001}
                    value={modOffset}
                    onChange={(e) => setModOffset(parseFloat(e.target.value))}
                  />
                </div>
                <div className="flex">
                  <label className="flex gap-2 items-center w-1/3">
                    <RiUserVoiceFill />
                    Max Voices
                  </label>
                  <div className="w-1/3 pl-4">
                    <input
                      type="number"
                      min={1}
                      max={8}
                      value={maxVoices}
                      onChange={(e) => setMaxVoices(parseInt(e.target.value))}
                    />
                  </div>
                  <input
                    type="range"
                    className={`${themes[selectedTheme].accent.primary} ${themes[selectedTheme].bg.secondary} w-1/3`}
                    min={1}
                    max={8}
                    step={1}
                    value={maxVoices}
                    onChange={(e) => setMaxVoices(parseInt(e.target.value))}
                  />
                </div>
                <div className="flex">
                  <label className="flex gap-2 items-center w-1/3">
                    <GiMusicalScore />
                    Octave
                  </label>
                  <div className="w-1/3 pl-4">
                    <input
                      type="number"
                      min={0}
                      max={8}
                      value={octave}
                      onChange={(e) => setOctave(parseInt(e.target.value))}
                    />
                  </div>
                  <input
                    type="range"
                    className={`${themes[selectedTheme].accent.primary} ${themes[selectedTheme].bg.secondary} w-1/3`}
                    min={0}
                    max={8}
                    step={1}
                    value={octave}
                    onChange={(e) => setOctave(parseInt(e.target.value))}
                  />
                </div>
                <div onClick={initSynth} className={`rounded-lg cursor-pointer w-max py-3 px-6 hover:opacity-80 mt-2 ${themes[selectedTheme].bg.primary}`}>
                    Kill Synth
                </div>
              </div>
              <Oscilloscope
                analyzer={analyzer}
                className={`w-[32rem] h-[8rem] ${themes[selectedTheme].bg.primary} rounded-lg outline outline-2 outline-black`}
              />
            </div>
            <div className="flex justify-center">
              <Piano
                octave={octave}
                octaves={4}
                blackKeyRatio={0.6}
                className="w-[64rem] h-[8rem]"
                whiteKeyClassName={`bg-white outline outline-2 ${themes[selectedTheme].pressed.primary} cursor-pointer`}
                blackKeyClassName={`bg-black outline outline-2 ${themes[selectedTheme].pressed.primary} cursor-pointer`}
                onNoteDown={(note) => noteOn(note)}
                onNoteUp={(note) => noteOff(note)}
                pressedNotes={pressedNotes}
              />
            </div>
          </div>
        </div>

        {/* <footer
          className={`border-2 border-blue-500 p-8 flex-grow flex justify-center ${themes[selectedTheme].bg.primary}`}
        >
            <h1 className="text-[2rem] font-[500]">Web Audio Synth</h1>
        </footer> */}
      </div>
      {audioCtxState !== "running" && (
        <div
          className={`fixed inset-0 ${themes[selectedTheme].bg.secondary} bg-opacity-80 flex justify-center items-center z-50 select-none text-8xl w-full h-full cursor-pointer`}
          onClick={initSynth}
        >
          <div
            className={`border-8 border-black px-16 py-8 rounded-[4rem] ${themes[selectedTheme].bg.primary}`}
          >
            {(isMobile && "Touch") || "Click"} to Start
          </div>
        </div>
      )}
    </>
  );
}

export default App;
