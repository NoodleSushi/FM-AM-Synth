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
    shadow: {
      primary: "shadow-[rgb(255,173,187)]",
      secondary: "shadow-[rgb(255,238,240)]",
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
};

export type ThemeKeys = keyof typeof themes;
