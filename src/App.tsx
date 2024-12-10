import Piano from "./Components/Piano";
import useSynthStore, { SynthMode } from "./Hooks/useSynthStore";
import useKeyboardMapping from "./Hooks/useKeyboardMapping";
import useMidi from "./Hooks/useMidi";
import Oscilloscope from "./Components/Oscilloscope";
import Spectrum from "./Components/Spectrum";
import useIsMobile from "./Hooks/useIsMobile";
import { create } from "zustand";
import WaveLegend from "./Components/WaveLegend";
import Presets from "./presets.json";
import { Waveform, waveforms } from "./utils";
import { ThemeKeys, themes } from "./themes";
import { useState } from "react";
import useMediaQuery from "./Hooks/useMediaQuery";
import Select from "./Components/Select";
import {
  MdKeyboardDoubleArrowDown,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { PiWaveSineBold } from "react-icons/pi";

type Props = {
  selectedTheme: ThemeKeys;
};

type AppState = {
  octave: number;
  setOctave: (octave: number) => void;
};

const useAppStore = create<AppState>((set) => ({
  octave: 4,
  setOctave: (octave) => set({ octave }),
}));

function ModulatorControls({ selectedTheme }: Props) {
  const mode = useSynthStore((state) => state.mode);
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
  const [modIdx, setModIdx] = [
    useSynthStore((state) => state.modIdx),
    useSynthStore((state) => state.setModIdx),
  ];
  const [modDepth, setModDepth] = [
    useSynthStore((state) => state.modDepth),
    useSynthStore((state) => state.setModDepth),
  ];
  const [modWaveform, setModWaveform] = [
    useSynthStore((state) => state.modWaveform),
    useSynthStore((state) => state.setModWaveform),
  ];
  const [modWavePhase, setModWavePhase] = [
    useSynthStore((state) => state.modWavePhase),
    useSynthStore((state) => state.setModWavePhase),
  ];
  const [modWaveN, setModWaveN] = [
    useSynthStore((state) => state.modWaveN),
    useSynthStore((state) => state.setModWaveN),
  ];
  const modComps = useSynthStore((state) => state.modComps);
  const isPhoneScreens = useMediaQuery("(max-width: 680px)");

  return (
    <div className={`rounded-[2rem] py-4 px-6 bg-white flex flex-col gap-2`}>
      <div
        className={`flex ${
          isPhoneScreens ? "flex-col gap-1" : "gap-3 items-center"
        }`}
      >
        <label>Modulator Level</label>
        <div className="flex-grow flex gap-2">
          <input
            className="flex-grow"
            type="range"
            min={0}
            max={1}
            step={0.0001}
            value={modLevel}
            onChange={(e) => setModLevel(parseFloat(e.target.value))}
          />
          <div className="flex gap-1 items-center">
            <span className="invisible">x</span>
            <input
              type="number"
              className={`${themes[selectedTheme].bg.secondary}`}
              min={0}
              max={1}
              value={modLevel}
              onChange={(e) => setModLevel(parseFloat(e.target.value))}
            />
            <span className="invisible">rad</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 justify-between">
        <label>Modulator Waveform</label>
        {/* <select
          value={modWaveform}
          onChange={(e) => setModWaveform(e.target.value as any)}
        >
          {waveforms.map((waveform) => (
            <option key={waveform.waveform} value={waveform.waveform}>
              {waveform.name}
            </option>
          ))}
        </select> */}
        <div className="flex gap-1 items-center">
          <Select
            options={waveforms.map(({ waveform, name }) => ({
              value: waveform,
              label: name,
            }))}
            selectedOption={modWaveform}
            onChange={(value) => {
              setModWaveform(value as Waveform);
            }}
            bgColor="bg-[rgb(255,238,240)]"
            // bgColor="bg-white"
          />
          <span className="invisible">rad</span>
        </div>
      </div>
      <div
        className={`flex ${
          isPhoneScreens ? "flex-col gap-1" : "gap-3 items-center"
        }`}
      >
        <label>Modulator Wave Phase</label>
        <div className="flex-grow flex gap-2">
          <input
            className="flex-grow"
            type="range"
            min={0}
            max={6.28}
            step={0.0001}
            value={modWavePhase}
            onChange={(e) => setModWavePhase(parseFloat(e.target.value))}
          />
          <div className="flex gap-1 items-center">
            <span className="invisible">x</span>
            <input
              type="number"
              className={`${themes[selectedTheme].bg.secondary}`}
              min={0}
              max={6.28}
              value={modWavePhase}
              onChange={(e) => setModWavePhase(parseFloat(e.target.value))}
            />
            <span>rad</span>
          </div>
        </div>
      </div>
      <div
        className={`flex ${
          isPhoneScreens ? "flex-col gap-1" : "gap-3 items-center"
        }`}
      >
        <label>Modulator Partial Count</label>
        <div className="flex-grow flex gap-2">
          <input
            className="flex-grow"
            type="range"
            min={1}
            max={512}
            step={1}
            value={modWaveN}
            onChange={(e) => setModWaveN(parseInt(e.target.value))}
          />
          <div className="flex gap-1 items-center">
            <span className="invisible">x</span>
            <input
              type="number"
              className={`${themes[selectedTheme].bg.secondary}`}
              min={1}
              max={512}
              value={modWaveN}
              onChange={(e) => setModWaveN(parseInt(e.target.value))}
            />
            <span className="invisible">rad</span>
          </div>
        </div>
      </div>
      <div
        className={`flex ${
          isPhoneScreens ? "flex-col gap-1" : "gap-3 items-center"
        }`}
      >
        <label>Modulator Ratio</label>
        <div className="flex-grow flex gap-2">
          <input
            className="flex-grow"
            type="range"
            min={0}
            max={64}
            step={0.0001}
            value={modRatio}
            onChange={(e) => setModRatio(parseFloat(e.target.value))}
          />
          <div className="flex gap-1 items-center">
            <span>x</span>
            <input
              type="number"
              className={`${themes[selectedTheme].bg.secondary}`}
              min={0}
              max={64}
              value={modRatio}
              onChange={(e) => setModRatio(parseFloat(e.target.value))}
            />
            <span className="invisible">rad</span>
          </div>
        </div>
      </div>
      <div
        className={`flex ${
          isPhoneScreens ? "flex-col gap-1" : "gap-3 items-center"
        }`}
      >
        <label>Modulator Offset</label>
        <div className="flex-grow flex gap-2">
          <input
            className="flex-grow"
            type="range"
            min={-1000}
            max={1000}
            step={0.0001}
            value={modOffset}
            onChange={(e) => setModOffset(parseFloat(e.target.value))}
          />
          <div className="flex gap-1 items-center mr-2">
            <span className="invisible">x</span>
            <input
              type="number"
              className={`${themes[selectedTheme].bg.secondary}`}
              min={-1000}
              max={1000}
              value={modOffset}
              onChange={(e) => setModOffset(parseFloat(e.target.value))}
            />
            <span>Hz</span>
          </div>
        </div>
      </div>
      {mode === "FM" && (
        <>
          <div
            className={`flex ${
              isPhoneScreens ? "flex-col gap-1" : "gap-3 items-center"
            }`}
          >
            <label>Modulator Index</label>
            <div className="flex-grow flex gap-2">
              <input
                className="flex-grow"
                type="range"
                min={0}
                max={50}
                step={1}
                value={modIdx}
                onChange={(e) => setModIdx(parseFloat(e.target.value))}
              />
              <div className="flex gap-1 items-center">
                <span>x</span>
                <input
                  type="number"
                  className={`${themes[selectedTheme].bg.secondary}`}
                  min={0}
                  max={50}
                  value={modIdx}
                  onChange={(e) => setModIdx(parseFloat(e.target.value))}
                />
                <span className="invisible">rad</span>
              </div>
            </div>
          </div>
          <div
            className={`flex ${
              isPhoneScreens ? "flex-col gap-1" : "gap-3 items-center"
            }`}
          >
            <label>Modulator Depth</label>
            <div className="flex-grow flex gap-2">
              <input
                className="flex-grow"
                type="range"
                min={0}
                max={1000}
                step={0.0001}
                value={modDepth}
                onChange={(e) => setModDepth(parseFloat(e.target.value))}
              />
              <div className="flex gap-1 items-center mr-2">
                <span className="invisible">x</span>
                <input
                  type="number"
                  className={`${themes[selectedTheme].bg.secondary}`}
                  min={0}
                  max={1000}
                  value={modDepth}
                  onChange={(e) => setModDepth(parseFloat(e.target.value))}
                />
                <span>Hz</span>
              </div>
            </div>
          </div>
        </>
      )}
      <div className="my-4 flex justify-center">
        <WaveLegend
          real={modComps.real}
          imag={modComps.imag}
          // className="w-full h-[4rem] bg-black text-[#00ff00]"
          className={`${isPhoneScreens ? "w-[22rem]" : "w-[32rem] h-[12rem]"} ${
            themes[selectedTheme].bg.secondary
          } rounded-lg outline outline-2 outline-black`}
        />
      </div>
    </div>
  );
}

function CarrierControls({ selectedTheme }: Props) {
  const [volume, setVolume] = [
    useSynthStore((state) => state.volume),
    useSynthStore((state) => state.setVolume),
  ];
  const [carWaveform, setCarWaveform] = [
    useSynthStore((state) => state.carWaveform),
    useSynthStore((state) => state.setCarWaveform),
  ];
  const [carWavePhase, setCarWavePhase] = [
    useSynthStore((state) => state.carWavePhase),
    useSynthStore((state) => state.setCarWavePhase),
  ];
  const [carWaveN, setCarWaveN] = [
    useSynthStore((state) => state.carWaveN),
    useSynthStore((state) => state.setCarWaveN),
  ];
  const carComps = useSynthStore((state) => state.carComps);
  const isPhoneScreens = useMediaQuery("(max-width: 680px)");

  return (
    <div className={`rounded-[2rem] py-4 px-6 bg-white flex flex-col gap-2`}>
      <div
        className={`flex ${
          isPhoneScreens ? "flex-col gap-1" : "gap-3 items-center"
        }`}
      >
        <label>Carrier Level</label>
        <div className="flex-grow flex gap-2">
          <input
            className="flex-grow"
            type="range"
            min={0}
            max={1}
            step={0.0001}
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
          />
          <div className="flex gap-1 items-center">
            <span className="invisible">x</span>
            <input
              type="number"
              className={`${themes[selectedTheme].bg.secondary}`}
              min={0}
              max={1}
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
            />
            <span className="invisible">rad</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 justify-between">
        <label>Carrier Waveform</label>
        {/* <select
          value={carWaveform}
          onChange={(e) => setCarWaveform(e.target.value as any)}
        >
          {waveforms.map((waveform) => (
            <option key={waveform.waveform} value={waveform.waveform}>
              {waveform.name}
            </option>
          ))}
        </select> */}
        <div className="flex gap-1 items-center">
          <Select
            options={waveforms.map(({ waveform, name }) => ({
              value: waveform,
              label: name,
            }))}
            selectedOption={carWaveform}
            onChange={(value) => {
              setCarWaveform(value as Waveform);
            }}
            bgColor="bg-[rgb(255,238,240)]"
            // bgColor="bg-white"
          />
          <span className="invisible">rad</span>
        </div>
      </div>
      <div
        className={`flex ${
          isPhoneScreens ? "flex-col gap-1" : "gap-3 items-center"
        }`}
      >
        <label>Carrier Wave Phase</label>
        <div className="flex-grow flex gap-2">
          <input
            className="flex-grow"
            type="range"
            min={0}
            max={6.28}
            step={0.0001}
            value={carWavePhase}
            onChange={(e) => setCarWavePhase(parseFloat(e.target.value))}
          />
          <div className="flex gap-1 items-center">
            <span className="invisible">x</span>
            <input
              type="number"
              className={`${themes[selectedTheme].bg.secondary}`}
              min={0}
              max={6.28}
              value={carWavePhase}
              onChange={(e) => setCarWavePhase(parseFloat(e.target.value))}
            />
            <span>rad</span>
          </div>
        </div>
      </div>
      <div
        className={`flex ${
          isPhoneScreens ? "flex-col gap-1" : "gap-3 items-center"
        }`}
      >
        <label>Carrier Partial Count</label>
        <div className="flex-grow flex gap-2">
          <input
            className="flex-grow"
            type="range"
            min={1}
            max={512}
            step={1}
            value={carWaveN}
            onChange={(e) => setCarWaveN(parseInt(e.target.value))}
          />
          <div className="flex gap-1 items-center">
            <span className="invisible">x</span>
            <input
              type="number"
              className={`${themes[selectedTheme].bg.secondary}`}
              min={1}
              max={512}
              value={carWaveN}
              onChange={(e) => setCarWaveN(parseInt(e.target.value))}
            />
            <span className="invisible">rad</span>
          </div>
        </div>
      </div>
      <div className="my-4 flex justify-center">
        <WaveLegend
          real={carComps.real}
          imag={carComps.imag}
          // className="w-full h-[4rem] bg-black text-[#00ff00]"
          className={`${isPhoneScreens ? "w-[22rem]" : "w-[32rem] h-[12rem]"} ${
            themes[selectedTheme].bg.secondary
          } rounded-lg outline outline-2 outline-black`}
        />
      </div>
    </div>
  );
}

function PresetsManager() {
  const setVolume = useSynthStore((state) => state.setVolume);
  const setMode = useSynthStore((state) => state.setMode);
  const setModLevel = useSynthStore((state) => state.setModLevel);
  const setModRatio = useSynthStore((state) => state.setModRatio);
  const setModOffset = useSynthStore((state) => state.setModOffset);
  const setModIdx = useSynthStore((state) => state.setModIdx);
  const setModDepth = useSynthStore((state) => state.setModDepth);
  const setModWaveform = useSynthStore((state) => state.setModWaveform);
  const setModWavePhase = useSynthStore((state) => state.setModWavePhase);
  const setModWaveN = useSynthStore((state) => state.setModWaveN);
  const setCarWaveform = useSynthStore((state) => state.setCarWaveform);
  const setCarWavePhase = useSynthStore((state) => state.setCarWavePhase);
  const setCarWaveN = useSynthStore((state) => state.setCarWaveN);

  return (
    <div className="flex items-center gap-3">
      <label>Presets</label>
      {/* <select
        onChange={(e) => {
          const preset = Presets["presets"][parseInt(e.target.value)];
          setVolume(preset.state.volume);
          setMode(preset.state.mode as SynthMode);
          setModLevel(preset.state.modLevel);
          setModRatio(preset.state.modRatio);
          setModOffset(preset.state.modOffset);
          setModIdx(preset.state.modIdx);
          setModDepth(preset.state.modDepth);
          setModWaveform(preset.state.modWaveform as Waveform);
          setModWavePhase(preset.state.modWavePhase);
          setModWaveN(preset.state.modWaveN);
          setCarWaveform(preset.state.carWaveform as Waveform);
          setCarWavePhase(preset.state.carWavePhase);
          setCarWaveN(preset.state.carWaveN);
        }}
      >
        {Presets["presets"].map((preset, i) => (
          <option key={i} value={i}>
            {preset.name}
          </option>
        ))}
      </select> */}
      <Select
        options={Presets["presets"].map((preset, i) => ({
          value: String(i),
          label: preset.name,
        }))}
        selectedOption="0"
        onChange={(value) => {
          const preset = Presets["presets"][parseInt(value)];
          setVolume(preset.state.volume);
          setMode(preset.state.mode as SynthMode);
          setModLevel(preset.state.modLevel);
          setModRatio(preset.state.modRatio);
          setModOffset(preset.state.modOffset);
          setModIdx(preset.state.modIdx);
          setModDepth(preset.state.modDepth);
          setModWaveform(preset.state.modWaveform as Waveform);
          setModWavePhase(preset.state.modWavePhase);
          setModWaveN(preset.state.modWaveN);
          setCarWaveform(preset.state.carWaveform as Waveform);
          setCarWavePhase(preset.state.carWavePhase);
          setCarWaveN(preset.state.carWaveN);
        }}
        //  className="bg-[rgb(255,238,240)]"
        bgColor="bg-white"
      />
    </div>
  );
}

function Controls({ selectedTheme }: Props) {
  const isMobile = useIsMobile();
  const isTabletScreens = useMediaQuery("(max-width: 1248px)");

  const initSynth = useSynthStore((state) => state.init);
  const [masterVolume, setMasterVolume] = [
    useSynthStore((state) => state.masterVolume),
    useSynthStore((state) => state.setMasterVolume),
  ];
  const [mode, setMode] = [
    useSynthStore((state) => state.mode),
    useSynthStore((state) => state.setMode),
  ];
  const isPhoneScreens = useMediaQuery("(max-width: 680px)");
  const getHeight = () => {
    let height = "h-[49rem]";
    if (isTabletScreens) height = "h-[86rem]";
    if (isPhoneScreens) height = "h-[96rem]";

    return height;
  };

  return (
    <div
      className={`p-8 flex flex-col gap-4 overflow-hidden relative ${getHeight()} ${
        isTabletScreens ? `pt-16` : ``
      }`}
    >
      {/* PRESETS, MASTER VOLUME, MODE, & KILL SYNTH */}
      <div
        className={`flex justify-between ${
          isMobile || isTabletScreens ? "flex-col gap-2" : ""
        }`}
      >
        <PresetsManager />
        <div
          className={`flex ${
            isPhoneScreens ? "flex-col gap-1" : "gap-3 items-center"
          }`}
        >
          <label>Master Volume</label>
          <div className="flex-grow flex gap-2">
            <input
              type="range"
              className="w-1/2"
              min={0}
              max={1}
              step={0.0001}
              value={masterVolume}
              onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
            />
            <input
              type="number"
              className={`bg-white`}
              min={0}
              max={1}
              value={masterVolume}
              onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <label>Mode</label>
          {/* <select value={mode} onChange={(e) => setMode(e.target.value as any)}>
            <option value="FM">FM</option>
            <option value="AM">AM</option>
          </select> */}
          <Select
            options={[
              {
                value: "FM",
                label: "FM",
              },
              { value: "AM", label: "AM" },
            ]}
            selectedOption={mode}
            onChange={(value) => {
              setMode(value as SynthMode);
            }}
            //  className="bg-[rgb(255,238,240)]"
            bgColor="bg-white"
          />
        </div>
        <div className="flex justify-between items-center">
          <div
            onClick={initSynth}
            className={`rounded-lg cursor-pointer w-max py-3 px-6 hover:opacity-80 ${themes[selectedTheme].bg.primary}`}
          >
            Kill Synth
          </div>
        </div>
      </div>

      {/* MODULATOR & CARRIER */}
      <div
        className={`flex gap-8 ${
          isMobile || isTabletScreens ? "flex-col" : ""
        }`}
      >
        <ModulatorControls selectedTheme={selectedTheme} />
        <CarrierControls selectedTheme={selectedTheme} />
      </div>

      <footer className="absolute left-0 right-0 bottom-2 text-center">
        <p>&copy; 2024 Group 3 in SIGNALS AND SYSTEMS.</p>
        <p>Chiang, Chiu, Curativo, Jakosalem, Sagun, Sia</p>
        <p>All Rights Reserved.</p>
      </footer>
    </div>
  );
}

function PianoSection({ selectedTheme }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [octave, setOctave] = [
    useAppStore((state) => state.octave),
    useAppStore((state) => state.setOctave),
  ];
  const pressedNotes = useSynthStore((state) => state.pressedNotes);
  const noteOn = useSynthStore((state) => state.noteOn);
  const noteOff = useSynthStore((state) => state.noteOff);

  useKeyboardMapping(
    (note) => noteOn(octave * 12 + note),
    (note) => noteOff(octave * 12 + note)
  );

  useMidi(
    (note) => noteOn(note),
    (note) => noteOff(note)
  );

  return (
    <>
      <div
        data-expanded={isExpanded}
        className="transition-all ease-in-out duration-300 bg-white absolute bottom-0 left-0 right-0 flex flex-col w-full justify-center items-center data-[expanded=false]:h-[10rem] data-[expanded=true]:h-[80vh]"
      >
        <button
          className={`${themes[selectedTheme].bg.primary} w-full flex justify-center`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {(isExpanded && <MdKeyboardDoubleArrowDown size="2rem" />) || (
            <MdKeyboardDoubleArrowUp size="2rem" />
          )}
        </button>
        <div className="flex w-full h-full">
          <div className="flex flex-col w-[4rem] h-full">
            <button
              className={`outline outline-2 flex-grow flex items-center justify-center ${themes[selectedTheme].pressed.primary} cursor-pointer`}
              onClick={() => setOctave(Math.min(10, octave + 1))}
            >
              <MdKeyboardDoubleArrowUp size="4rem" />
            </button>
            <button
              className={`outline outline-2 flex-grow flex items-center justify-center ${themes[selectedTheme].pressed.primary} cursor-pointer`}
              onClick={() => setOctave(Math.max(0, octave - 1))}
            >
              <MdKeyboardDoubleArrowDown size="4rem" />
            </button>
          </div>
          <Piano
            octave={octave}
            blackKeyRatio={0.6}
            className="w-full h-full"
            whiteKeyClassName={`bg-white outline outline-2 ${themes[selectedTheme].keyPressed.primary} cursor-pointer`}
            blackKeyClassName={`bg-black outline outline-2 ${themes[selectedTheme].keyPressed.primary} cursor-pointer`}
            onNoteDown={(note) => noteOn(note)}
            onNoteUp={(note) => noteOff(note)}
            pressedNotes={pressedNotes}
          />
        </div>
      </div>
      {/* div to fill up relative space */}
      <div className="h-[10rem] w-full">
        <div className="h-[10rem] w-full"></div>
      </div>
    </>
  );
}

function Header() {
  const lastNoteHz = useSynthStore((state) => state.lastNoteHz);
  const analyzer = useSynthStore((state) => state.analyzer);
  const [selectedTheme] = useState<ThemeKeys>("pink");
  const isTabletScreens = useMediaQuery("(max-width: 1248px)");
  const [showOscAndSpec, setShowOscAndSpec] = useState(false);
  const isPhoneScreens = useMediaQuery("(max-width: 680px)");

  return (
    <nav>
      <div
        className={`flex items-center justify-between p-4 relative z-20 ${themes[selectedTheme].bg.primary}`}
      >
        <div className="flex items-center gap-2 z-50">
          <PiWaveSineBold size={40} className="-ml-[7.5px]" />
          <h1 className="text-[1.2rem] font-[500]">FM-AM Synth</h1>
        </div>

        {!isTabletScreens && (
          <div className="flex gap-4">
            <Oscilloscope
              analyzer={analyzer}
              alignHz={lastNoteHz}
              className={`w-[32rem] h-[6rem] ${themes[selectedTheme].bg.secondary} rounded-lg outline outline-2 outline-black`}
            />
            <Spectrum
              analyzer={analyzer}
              className={`w-[32rem] h-[6rem] ${themes[selectedTheme].bg.secondary} rounded-lg outline outline-2 outline-black`}
            />
          </div>
        )}
        {isTabletScreens && (
          <div
            onClick={() => setShowOscAndSpec(!showOscAndSpec)}
            className={`flex flex-col gap-2 pt-6 items-center cursor-pointer absolute left-0 right-0 transition-all duration-300 ${
              showOscAndSpec ? "top-16" : "-top-44"
            } ${themes[selectedTheme].bg.primary}`}
          >
            {/* {showOscAndSpec && ( */}
            <div
              className={`flex flex-col gap-4 ${
                showOscAndSpec ? "" : "invisible"
              }`}
            >
              <Oscilloscope
                analyzer={analyzer}
                alignHz={lastNoteHz}
                className={`${
                  isPhoneScreens ? "w-[22rem]" : "w-[32rem]"
                } h-[6rem] ${
                  themes[selectedTheme].bg.secondary
                } rounded-lg outline outline-2 outline-black`}
              />
              <Spectrum
                analyzer={analyzer}
                className={`${
                  isPhoneScreens ? "w-[22rem]" : "w-[32rem]"
                } h-[6rem] ${
                  themes[selectedTheme].bg.secondary
                } rounded-lg outline outline-2 outline-black`}
              />
            </div>
            {/* )} */}
            {showOscAndSpec ? (
              <MdKeyboardDoubleArrowUp size="2rem" />
            ) : (
              <MdKeyboardDoubleArrowDown size="2rem" />
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

function App() {
  const initSynth = useSynthStore((state) => state.init);
  const audioCtxState = useSynthStore((state) => state.audioCtx?.state || "");
  const isMobile = useIsMobile();

  const [selectedTheme] = useState<ThemeKeys>("pink");
  const isPhoneScreens = useMediaQuery("(max-width: 680px)");

  return (
    <>
      <div className="fixed flex flex-col w-full h-full font-poppins">
        <Header />
        <div
          className={`grow overflow-y-auto flex justify-center ${themes[selectedTheme].bg.secondary}`}
        >
          <Controls selectedTheme={selectedTheme} />
        </div>
        <PianoSection selectedTheme={selectedTheme} />
      </div>

      {audioCtxState !== "running" && (
        <div
          className={`fixed inset-0 ${themes[selectedTheme].bg.secondary} bg-opacity-80 flex justify-center items-center z-50 select-none text-8xl w-full h-full cursor-pointer`}
          onClick={initSynth}
        >
          <div
            className={`border-8 border-black rounded-[4rem] ${
              isPhoneScreens
                ? "px-8 py-5 text-[2.5rem]"
                : "px-16 py-8 text-[4rem]"
            } text-center ${themes[selectedTheme].bg.primary}`}
          >
            {(isMobile && "Touch") || "Click"} to Start
          </div>
        </div>
      )}
    </>
  );
}

export default App;
