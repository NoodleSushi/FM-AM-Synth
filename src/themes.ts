export const themes = {
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
      primary: "data-[pressed=true]:bg-[rgb(255,173,187)]",
      secondary: "data-[pressed=true]:bg-[rgb(255,238,240)]",
    },
    scrollbarTrack: {
      primary: "data-[pressed=true]:bg-[rgb(255,173,187)]",
      secondary: "data-[pressed=true]:bg-[rgb(255,238,240)]",
    },
  },
  violet: {
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
      primary: "data-[pressed=true]:bg-[rgb(16,0,43)]",
      secondary: "data-[pressed=true]:bg-[rgb(60,9,108)]",
    },
    scrollbarTrack: {
      primary: "data-[pressed=true]:bg-[rgb(16,0,43)]",
      secondary: "data-[pressed=true]:bg-[rgb(60,9,108)]",
    },
  },
};

export type ThemeKeys = keyof typeof themes;
