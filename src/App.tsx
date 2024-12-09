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
import { MdKeyboardDoubleArrowDown, MdKeyboardDoubleArrowUp } from "react-icons/md";

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

  return (
    <div className={`rounded-[2rem] py-4 px-6 bg-white flex flex-col gap-2`}>
      <div className="flex items-center gap-3">
        <label className="w-1/3">Modulator Level</label>
        <input
          className="w-1/3"
          type="range"
          min={0}
          max={1}
          step={0.0001}
          value={modLevel}
          onChange={(e) => setModLevel(parseFloat(e.target.value))}
        />
        <div className="w-1/3 flex gap-1 items-center pl-5">
          <span className="invisible">x</span>
          <input
            type="number"
            min={0}
            max={1}
            value={modLevel}
            onChange={(e) => setModLevel(parseFloat(e.target.value))}
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <label className="w-1/3">Modulator Waveform</label>
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
      </div>
      <div className="flex items-center gap-3">
        <label className="w-1/3">Modulator Wave Phase</label>
        <input
          className="w-1/3"
          type="range"
          min={0}
          max={6.28}
          step={0.0001}
          value={modWavePhase}
          onChange={(e) => setModWavePhase(parseFloat(e.target.value))}
        />
        <div className="w-1/3 flex gap-1 items-center pl-5">
          <span className="invisible">x</span>
          <input
            type="number"
            min={0}
            max={6.28}
            value={modWavePhase}
            onChange={(e) => setModWavePhase(parseFloat(e.target.value))}
          />
          <span>rad</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <label className="w-1/3">Modulator Partial Count</label>
        <input
          className="w-1/3"
          type="range"
          min={1}
          max={512}
          step={1}
          value={modWaveN}
          onChange={(e) => setModWaveN(parseInt(e.target.value))}
        />
        <div className="w-1/3 flex gap-1 items-center pl-5">
          <span className="invisible">x</span>
          <input
            type="number"
            min={1}
            max={512}
            value={modWaveN}
            onChange={(e) => setModWaveN(parseInt(e.target.value))}
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <label className="w-1/3">Modulator Ratio</label>
        <input
          className="w-1/3"
          type="range"
          min={0}
          max={64}
          step={0.0001}
          value={modRatio}
          onChange={(e) => setModRatio(parseFloat(e.target.value))}
        />
        <div className="w-1/3 flex gap-1 items-center pl-5">
          <span>x</span>
          <input
            type="number"
            min={0}
            max={64}
            value={modRatio}
            onChange={(e) => setModRatio(parseFloat(e.target.value))}
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <label className="w-1/3">Modulator Offset</label>
        <input
          className="w-1/3"
          type="range"
          min={-1000}
          max={1000}
          step={0.0001}
          value={modOffset}
          onChange={(e) => setModOffset(parseFloat(e.target.value))}
        />
        <div className="w-1/3 flex gap-1 items-center pl-5">
          <span className="invisible">x</span>
          <input
            type="number"
            min={-1000}
            max={1000}
            value={modOffset}
            onChange={(e) => setModOffset(parseFloat(e.target.value))}
          />
          <span>Hz</span>
        </div>
      </div>
      {mode === "FM" && (
        <>
          <div className="flex items-center gap-3">
            <label className="w-1/3">Modulator Index</label>
            <input
              className="w-1/3"
              type="range"
              min={0}
              max={50}
              step={1}
              value={modIdx}
              onChange={(e) => setModIdx(parseFloat(e.target.value))}
            />
            <div className="w-1/3 flex gap-1 items-center pl-5">
              <span>x</span>
              <input
                type="number"
                min={0}
                max={50}
                value={modIdx}
                onChange={(e) => setModIdx(parseFloat(e.target.value))}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="w-1/3">Modulator Depth</label>
            <input
              className="w-1/3"
              type="range"
              min={0}
              max={1000}
              step={0.0001}
              value={modDepth}
              onChange={(e) => setModDepth(parseFloat(e.target.value))}
            />
            <div className="w-1/3 flex gap-1 items-center pl-5">
              <span className="invisible">x</span>
              <input
                type="number"
                min={0}
                max={1000}
                value={modDepth}
                onChange={(e) => setModDepth(parseFloat(e.target.value))}
              />
              <span>Hz</span>
            </div>
          </div>
        </>
      )}
      <div className="my-4">
        <WaveLegend
          real={modComps.real}
          imag={modComps.imag}
          // className="w-full h-[4rem] bg-black text-[#00ff00]"
          className={`w-[32rem] h-[8rem] ${themes[selectedTheme].bg.primary} rounded-lg outline outline-2 outline-black`}
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

  return (
    <div className={`rounded-[2rem] py-4 px-6 bg-white flex flex-col gap-2`}>
      <div className="flex items-center gap-3">
        <label className="w-1/3">Carrier Level</label>
        <input
          className="w-1/3"
          type="range"
          min={0}
          max={1}
          step={0.0001}
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
        />
        <div className="w-1/3 flex gap-1 items-center pl-5">
          <span className="invisible">x</span>
          <input
            type="number"
            min={0}
            max={1}
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <label className="w-1/3">Carrier Waveform</label>
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
      </div>
      <div className="flex items-center gap-3">
        <label className="w-1/3">Carrier Wave Phase</label>
        <input
          className="w-1/3"
          type="range"
          min={0}
          max={6.28}
          step={0.0001}
          value={carWavePhase}
          onChange={(e) => setCarWavePhase(parseFloat(e.target.value))}
        />
        <div className="w-1/3 flex gap-1 items-center pl-5">
          <span className="invisible">x</span>
          <input
            type="number"
            min={0}
            max={6.28}
            value={carWavePhase}
            onChange={(e) => setCarWavePhase(parseFloat(e.target.value))}
          />
          <span>rad</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <label className="w-1/3">Carrier Partial Count</label>
        <input
          className="w-1/3"
          type="range"
          min={1}
          max={512}
          step={1}
          value={carWaveN}
          onChange={(e) => setCarWaveN(parseInt(e.target.value))}
        />
        <div className="w-1/3 flex gap-1 items-center pl-5">
          <span className="invisible">x</span>
          <input
            type="number"
            min={1}
            max={512}
            value={carWaveN}
            onChange={(e) => setCarWaveN(parseInt(e.target.value))}
          />
        </div>
      </div>
      <div className="my-4">
        <WaveLegend
          real={carComps.real}
          imag={carComps.imag}
          // className="w-full h-[4rem] bg-black text-[#00ff00]"
          className={`w-[32rem] h-[8rem] ${themes[selectedTheme].bg.primary} rounded-lg outline outline-2 outline-black`}
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

  const lastNoteHz = useSynthStore((state) => state.lastNoteHz);
  const analyzer = useSynthStore((state) => state.analyzer);
  const initSynth = useSynthStore((state) => state.init);
  const [masterVolume, setMasterVolume] = [
    useSynthStore((state) => state.masterVolume),
    useSynthStore((state) => state.setMasterVolume),
  ];
  const [mode, setMode] = [
    useSynthStore((state) => state.mode),
    useSynthStore((state) => state.setMode),
  ];

  return (
    <div className="p-8 border-2 border-red-500 min-h-[1000px] flex flex-col gap-4">
      {/* PRESETS, MASTER VOLUME, & MODE */}
      <div
        className={`flex justify-between ${
          isMobile || isTabletScreens ? "flex-col" : ""
        }`}
      >
        <PresetsManager />
        <div className="flex items-center gap-3">
          <label>Master Volume</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.0001}
            value={masterVolume}
            onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
          />
          <input
            type="number"
            min={0}
            max={1}
            value={masterVolume}
            onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
            className="!bg-white"
          />
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

      {/* MAX VOICES & OCTAVE */}
      <div className="flex justify-between items-center">
        <div
          onClick={initSynth}
          className={`rounded-lg cursor-pointer w-max py-3 px-6 hover:opacity-80 mt-2 order-2 ${themes[selectedTheme].bg.primary}`}
        >
          Kill Synth
        </div>
      </div>

      <div className="flex justify-between">
        <div className="flex flex-col gap-2 items-center">
          <Oscilloscope
            analyzer={analyzer}
            alignHz={lastNoteHz}
            // className="w-[32rem]  bg-black text-[#00ff00]"
            className={`w-[32rem] h-[8rem] ${themes[selectedTheme].bg.primary} rounded-lg outline outline-2 outline-black`}
          />
          <p>Oscilloscope</p>
        </div>
        <div className="flex flex-col gap-2 items-center">
          <Spectrum
            analyzer={analyzer}
            // className="w-[32rem]  bg-black text-[#00ff00]"
            className={`w-[32rem] h-[8rem] ${themes[selectedTheme].bg.primary} rounded-lg outline outline-2 outline-black`}
          />
          <p>Spectrum</p>
        </div>
      </div>
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
    <div data-expanded={isExpanded} className="bg-white absolute data-[expanded=true]:top-0 bottom-0 left-0 right-0 flex flex-col w-full justify-center items-center data-[expanded=false]:h-[10rem] data-[expanded=true]:h-full">
      <button
        className="bg-gray-300 w-full flex justify-center"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded && <MdKeyboardDoubleArrowDown size='2rem' /> || <MdKeyboardDoubleArrowUp size='2rem' />}
      </button>
      <div className="flex w-full h-full">
        <div className="flex flex-col w-[4rem] h-full">
          <button
            className={`outline outline-2 flex-grow flex items-center justify-center ${themes[selectedTheme].pressed.primary} cursor-pointer`}
            onClick={() => setOctave(Math.min(10, octave + 1))}
          >
            <MdKeyboardDoubleArrowUp size='4rem' />
          </button>
          <button
            className={`outline outline-2 flex-grow flex items-center justify-center ${themes[selectedTheme].pressed.primary} cursor-pointer`}
            onClick={() => setOctave(Math.max(0, octave - 1))}
          >
            <MdKeyboardDoubleArrowDown size='4rem' />
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
  );
}

function App() {
  const initSynth = useSynthStore((state) => state.init);
  const audioCtxState = useSynthStore((state) => state.audioCtx?.state || "");
  const isMobile = useIsMobile();

  const [selectedTheme, setSelectedTheme] = useState<ThemeKeys>("pink");

  return (
    <>
      <div className="fixed flex flex-col w-full h-full font-poppins">
        <nav
          className={`border-2 border-blue-500 p-8 flex items-center justify-center ${themes[selectedTheme].bg.primary}`}
        >
          <div className="border-2 border-red-500 flex items-center gap-2">
            {/* <div className="flex items-center">
              <PiWaveSineBold size={40} className="-ml-[7.5px]" />
            <PiWaveSineBold size={40} className="-ml-[7.5px]" />
            <PiWaveSineBold size={40} className="-ml-[7.5px]" />
            </div> */}
            <h1 className="text-[2rem] font-[500]">Web Audio Synth</h1>
          </div>
        </nav>
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
