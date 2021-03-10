const dbFile = await Deno.readFile("./GeoLite2-City.mmdb");
const wasm = await Deno.readFile("../wasm-deno-maxminddb/pkg/wasm_deno_maxminddb_bg.wasm");

import init,{ Maxmind } from "../wasm-deno-maxminddb/pkg/wasm_deno_maxminddb.js";

await init(wasm)

const maxmind = new Maxmind(dbFile)

const result = maxmind.lookup_city('8.8.8.8')
let tested = false;
Deno.test({
	name: 'Google DNS is in time_zone America/Chicago',
	fn: () => {
		tested = true
		result.location.time_zone === "America/Chicago" || (() => {throw Error()});
	}
})
if (!tested) console.log(result)
