import {dirname,fromFileUrl,resolve} from "https://deno.land/std/path/mod.ts";
const testDir = dirname(fromFileUrl(import.meta.url))
const dbFile = await Deno.readFile( resolve(testDir,"GeoLite2-City-Test.mmdb"));

const MaxmindModule = await import(resolve(testDir,'../','dist','lib.js'))
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
if (!tested) console.log(result)
