Deno.run({
	cmd:['cargo','build','--target','wasm32-unknown-unknown'],
	cwd: 'wasm-deno-maxminddb'
})
Deno.run({
	cmd:['wasm-gc','wasm_deno_maxminddb.wasm'],
	cwd: 'wasm-deno-maxminddb/target/wasm32-unknown-unknown/debug/'
})
Deno.run({
	cmd:['wasm-pack','build','--target','web','wasm-deno-maxminddb']
})
Deno.run({
	cmd:['wasm-gc','wasm_deno_maxminddb_bg.wasm'],
	cwd: 'wasm-deno-maxminddb/pkg'
})

class encDec {
	encoder: TextEncoder;
	decoder: TextDecoder;
	constructor(){
		this.encoder = new TextEncoder();
		this.decoder = new TextDecoder();
	}
	enc(str: string) {return this.encoder.encode(str)}
	dec(buf: ArrayBuffer) {return this.decoder.decode(buf)}
}

const enc =  new encDec()

await Deno.copyFile('./wasm-deno-maxminddb/pkg/wasm_deno_maxminddb.d.ts','./dist/lib.d.ts')
const wasm = JSON.stringify(Array.from(await Deno.readFile("./wasm-deno-maxminddb/pkg/wasm_deno_maxminddb_bg.wasm")));
const lib = enc.enc(enc.dec(await Deno.readFile("./wasm-deno-maxminddb/pkg/wasm_deno_maxminddb.js")).replace(`
    init.__wbindgen_wasm_module = module;

    return wasm;
}

export default init;
`,'\n}').replace(`
async function init(input) {
`,`{
let input = new Uint8Array(${wasm});
`));

await Deno.writeFile('./dist/lib.js',lib)
