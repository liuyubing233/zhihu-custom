// declare const GM_setValue: (key: string, value: string) => void;

declare const GM: {
  setValue: (key: string, value: string) => Promise<void>;
  getValue: (key: string) => Promise<string>;
};

declare const unsafeWindow: Window;