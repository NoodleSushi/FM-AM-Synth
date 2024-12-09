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

export type ThemeKeys = keyof typeof themes;
