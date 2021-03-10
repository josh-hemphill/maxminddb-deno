/* tslint:disable */
/* eslint-disable */
/**
*/
export function run(): void;
/**
*/
export class Maxmind {
  free(): void;
/**
* @param {Uint8Array} js_db
*/
  constructor(js_db: Uint8Array);
/**
* @param {string} ip_str
* @returns {any}
*/
  lookup_city(ip_str: string): any;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_maxmind_free: (a: number) => void;
  readonly maxmind_new: (a: number, b: number) => number;
  readonly maxmind_lookup_city: (a: number, b: number, c: number) => number;
  readonly run: () => void;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
  readonly __wbindgen_free: (a: number, b: number) => void;
  readonly __wbindgen_start: () => void;
}

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
