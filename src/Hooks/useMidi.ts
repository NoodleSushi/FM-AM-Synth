import { useEffect, useRef } from "react";

function useMidi(
  onNoteOn?: (note: number, velocity: number) => void,
  onNoteOff?: (note: number) => void,
) {
  const onNoteOnRef = useRef(onNoteOn);
  const onNoteOffRef = useRef(onNoteOff);

  useEffect(() => {
    onNoteOnRef.current = onNoteOn;
    onNoteOffRef.current = onNoteOff;
  }, [onNoteOn, onNoteOff]);

  useEffect(() => {
    const inputs: MIDIInput[] = [];
    let isMounted = true;

    const handleMessage = (e: MIDIMessageEvent) => {
      if (!e.data) return;
      const [status, note, velocity] = e.data;
      const command = status & 0xf0;

      if (command === 0x90 && velocity > 0) {
        onNoteOnRef.current?.(note, velocity);
      } else if (command === 0x80 || (command === 0x90 && velocity === 0)) {
        onNoteOffRef.current?.(note);
      }
      console.log(e.data);
    };

    if (!navigator.requestMIDIAccess) {
      console.error("Web MIDI not supported");
      return;
    }

    navigator
      .requestMIDIAccess()
      .then((access) => {
        if (!isMounted) return;
        for (const input of access.inputs.values()) {
          input.addEventListener("midimessage", handleMessage);
          inputs.push(input);
        }
      })
      .catch((err) => {
        console.error("Failed to get MIDI access", err);
      });

    return () => {
      isMounted = false;
      for (const input of inputs) {
        console.log(input);
        input.removeEventListener("midimessage", handleMessage);
      }
    };
  }, []);
}

export default useMidi;
