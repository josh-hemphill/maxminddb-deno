import {dirname,fromFileUrl,resolve,toFileUrl} from "https://deno.land/std/path/mod.ts";
const testDir = dirname(fromFileUrl(import.meta.url))
const dbFile = await fetch('https://github.com/maxmind/MaxMind-DB/raw/main/test-data/GeoLite2-City-Test.mmdb')
	.then(v => v.arrayBuffer())
	.then(v => new Uint8Array(v));

const MaxmindModule: typeof import('../dist/lib.d.ts') = await import(toFileUrl(resolve(testDir,'../','dist','lib.js')).toString())
const Maxmind = MaxmindModule.Maxmind

const maxmind = new Maxmind(dbFile)

let result: Record<string,Record<string,string>> = {}

result = maxmind.lookup_city('2a02:d100::0001')

let tested = false;
Deno.test({
	name: 'Random IP Check',
	fn: () => {
		tested = true
		result?.location?.time_zone === "Europe/Warsaw" || (() => {throw Error("Result Missing")});
	}
})

Deno.test({
	name: 'Check Metadata',
	fn: () => {
		maxmind?.metadata?.languages?.includes('en') || (() => {throw Error("Metadata Missing")});
	}
})
if (!tested) console.log(result)
