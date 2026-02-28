export const themes = {
  pink: {
    text: "text-black",
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
    outline: {
      primary: "outline-[rgb(255,173,187)]",
      secondary: "outline-[rgb(255,238,240)]",
    },
    focusOutline: {
      primary: "focus:outline-[rgb(255,173,187)]",
      secondary: "focus:outline-[rgb(255,238,240)]",
    },
    shadow: {
      primary: "shadow-[rgb(255,173,187)]",
      secondary: "shadow-[rgb(255,238,240)]",
    },
    pressed: {
      primary: "active:bg-[rgb(255,173,187)]",
      secondary: "active:bg-[rgb(255,238,240)]",
    },
    keyPressed: {
      primary: "data-[pressed=true]:bg-[rgb(255,173,187)]",
      secondary: "data-[pressed=true]:bg-[rgb(255,238,240)]",
    },
    scrollbarThumb: {
      bg: "rgb(255,173,187)",
      bgHover: "rgb(255, 111, 135)",
      primary: "data-[pressed=true]:bg-[rgb(255,173,187)]",
      secondary: "data-[pressed=true]:bg-[rgb(255,238,240)]",
    },
    scrollbarTrack: {
      bg: "white",
      primary: "data-[pressed=true]:bg-[rgb(255,173,187)]",
      secondary: "data-[pressed=true]:bg-[rgb(255,238,240)]",
    },
    visualizer: "outline-black",
    visualizerColor: "black",
    rangeAccent: "rgb(255,173,187)",
  },
  violet: {
    text: "text-white",
    bg: {
      primary: "bg-[rgb(16,0,43)]",
      secondary: "bg-[rgb(60,9,108)]",
    },
    accent: {
      primary: "accent-[rgb(16,0,43)]",
      secondary: "accent-[rgb(60,9,108)]",
    },
    border: {
      primary: "border-[rgb(16,0,43)]",
      secondary: "border-[rgb(60,9,108)]",
    },
    outline: {
      primary: "outline-[rgb(16,0,43)]",
      secondary: "outline-[rgb(60,9,108)]",
    },
    focusOutline: {
      primary: "focus:outline-[rgb(16,0,43)]",
      secondary: "focus:outline-[rgb(60,9,108)]",
    },
    shadow: {
      primary: "shadow-[rgb(16,0,43)]",
      secondary: "shadow-[rgb(60,9,108)]",
    },
    pressed: {
      primary: "active:bg-[rgb(16,0,43)]",
      secondary: "active:bg-[rgb(60,9,108)]",
    },
    keyPressed: {
      primary: "data-[pressed=true]:bg-[rgb(16,0,43)]",
      secondary: "data-[pressed=true]:bg-[rgb(60,9,108)]",
    },
    scrollbarThumb: {
      bg: "rgb(16,0,43)",
      bgHover: "rgb(37, 0, 100)",
      primary: "data-[pressed=true]:bg-[rgb(16,0,43)]",
      secondary: "data-[pressed=true]:bg-[rgb(60,9,108)]",
    },
    scrollbarTrack: {
      bg: "white",
      primary: "data-[pressed=true]:bg-[rgb(16,0,43)]",
      secondary: "data-[pressed=true]:bg-[rgb(60,9,108)]",
    },
    visualizer: "outline-white",
    visualizerColor: "white",
    rangeAccent: "rgb(60,9,108)",
  },
  terminal: {
    text: "text-[#00ff00]",
    bg: {
      primary: "bg-[rgb(0,0,0)]",
      secondary: "bg-[rgb(0,0,0)]",
    },
    accent: {
      primary: "accent-[rgb(0,0,0)]",
      secondary: "accent-[rgb(0,128,0)]",
    },
    border: {
      primary: "border-[rgb(0,0,0)]",
      secondary: "border-[rgb(0,128,0)]",
    },
    outline: {
      primary: "outline-[rgb(0,0,0)]",
      secondary: "outline-[rgb(0,128,0)]",
    },
    focusOutline: {
      primary: "focus:outline-[rgb(0,0,0)]",
      secondary: "focus:outline-[rgb(0,128,0)]",
    },
    shadow: {
      primary: "shadow-[rgb(0,0,0)]",
      secondary: "shadow-[rgb(0,128,0)]",
    },
    pressed: {
      primary: "active:bg-[rgb(0,0,0)]",
      secondary: "active:bg-[rgb(0,128,0)]",
    },
    keyPressed: {
      primary: "data-[pressed=true]:bg-[rgb(0,0,0)]",
      secondary: "data-[pressed=true]:bg-[rgb(0,128,0)]",
    },
    scrollbarThumb: {
      bg: "rgb(0,0,0)",
      bgHover: "rgb(0, 255, 0)",
      primary: "data-[pressed=true]:bg-[rgb(0,0,0)]",
      secondary: "data-[pressed=true]:bg-[rgb(0,128,0)]",
    },
    scrollbarTrack: {
      bg: "black",
      primary: "data-[pressed=true]:bg-[rgb(0,0,0)]",
      secondary: "data-[pressed=true]:bg-[rgb(0,128,0)]",
    },
    visualizer: "outline-[#00ff00]",
    visualizerColor: "#00ff00",
    rangeAccent: "rgb(0,255,0)",
  },
};

export type ThemeKeys = keyof typeof themes;
