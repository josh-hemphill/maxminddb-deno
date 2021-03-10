import {dirname,fromFileUrl,resolve,join} from "https://deno.land/std/path/mod.ts";
const dir = resolve(dirname(fromFileUrl(import.meta.url)))
if (Array.from(Deno.readDirSync(dir)).some(v => v.name === 'dist' && v.isDirectory)) {
	await Deno.remove(resolve(dir,'dist'),{recursive:true})
}
await Deno.mkdir(resolve(dir,'dist'))
let p: Deno.Process = Deno.run({
	cmd:['wasm-pack','build','--target','web',resolve(dir,'wasm-deno-maxminddb')]
})
await p.status()
p = Deno.run({
	cmd:['wasm-gc','wasm_deno_maxminddb_bg.wasm'],
	cwd: 'wasm-deno-maxminddb/pkg'
})
await p.status()

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

await Deno.copyFile(resolve(dir,'wasm-deno-maxminddb/pkg/wasm_deno_maxminddb.d.ts'), join(resolve('dist'), 'lib.d.ts'))

const wasm = JSON.stringify(Array.from(await Deno.readFile(resolve(dir,"wasm-deno-maxminddb/pkg/wasm_deno_maxminddb_bg.wasm"))));
const lib = enc.enc(enc.dec(await Deno.readFile(resolve(dir,"wasm-deno-maxminddb/pkg/wasm_deno_maxminddb.js"))).replace(`
    const { instance, module } = await load(await input, imports);

    wasm = instance.exports;
    init.__wbindgen_wasm_module = module;
    wasm.__wbindgen_start();
    return wasm;
}

export default init;

`,`
    const { instance } = await load(input, imports);

    wasm = instance.exports;
	wasm.__wbindgen_start();
}
`).replace(`
async function init(input) {
`,`{
let input = new Uint8Array(${wasm});
`));

await Deno.writeFile(join(resolve('dist'),'lib.js'),lib)
