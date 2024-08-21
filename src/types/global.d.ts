declare const GM: {
  setValue: (key: string, value: string) => Promise<void>;
  getValue: (key: string) => Promise<string>;
};

// declare const window: Window & {
//   [key: string]: any;
// };
declare const GM_info: ScriptGetInfo;
declare const GM_registerMenuCommand: (menuName: string, callback?: () => void, options?: Record<string, any>) => void;

type ScriptGetInfo = {
  downloadMode: string;
  isFirstPartyIsolation?: boolean;
  isIncognito: boolean;
  sandboxMode: SandboxMode;
  scriptHandler: string;
  scriptMetaStr: string | null;
  scriptUpdateURL: string | null;
  scriptWillUpdate: boolean;
  version?: string;
  script: {
    antifeatures: { [antifeature: string]: { [locale: string]: string } };
    author: string | null;
    blockers: string[];
    connects: string[];
    copyright: string | null;
    deleted?: number | undefined;
    description_i18n: { [locale: string]: string } | null;
    description: string;
    downloadURL: string | null;
    excludes: string[];
    fileURL: string | null;
    grant: string[];
    header: string | null;
    homepage: string | null;
    icon: string | null;
    icon64: string | null;
    includes: string[];
    lastModified: number;
    matches: string[];
    name_i18n: { [locale: string]: string } | null;
    name: string;
    namespace: string | null;
    position: number;
    resources: Resource[];
    supportURL: string | null;
    system?: boolean | undefined;
    'run-at': string | null;
    unwrap: boolean | null;
    updateURL: string | null;
    version: string;
    webRequest: WebRequestRule[] | null;
    options: {
      check_for_updates: boolean;
      comment: string | null;
      compatopts_for_requires: boolean;
      compat_wrappedjsobject: boolean;
      compat_metadata: boolean;
      compat_foreach: boolean;
      compat_powerful_this: boolean | null;
      sandbox: string | null;
      noframes: boolean | null;
      unwrap: boolean | null;
      run_at: string | null;
      tab_types: string | null;
      override: {
        use_includes: string[];
        orig_includes: string[];
        merge_includes: boolean;
        use_matches: string[];
        orig_matches: string[];
        merge_matches: boolean;
        use_excludes: string[];
        orig_excludes: string[];
        merge_excludes: boolean;
        use_connects: string[];
        orig_connects: string[];
        merge_connects: boolean;
        use_blockers: string[];
        orig_run_at: string | null;
        orig_noframes: boolean | null;
      };
    };
  };
};

type SandboxMode = 'js' | 'raw' | 'dom';

type Resource = {
  name: string;
  url: string;
  error?: string;
  content?: string;
  meta?: string;
};

type WebRequestRule = {
  selector: { include?: string | string[]; match?: string | string[]; exclude?: string | string[] } | string;
  action:
    | string
    | {
        cancel?: boolean;
        redirect?:
          | {
              url: string;
              from?: string;
              to?: string;
            }
          | string;
      };
};

declare module '*.js'
declare const unsafeWindow: Window;