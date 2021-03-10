<div align="center">

  <h1><code>maxminddb_deno</code></h1>

  <strong>A library that enables the usage of MaxmindDB geoIP databases by using the Rust library in a WebAssembly module</strong>

  <p>
    <a href="https://travis-ci.org/josh-hemphill/maxminddb-deno"><img src="https://img.shields.io/github/workflow/status/josh-hemphill/maxminddb-deno/test?logo=deno&style=flat-square" alt="Build Status" /></a>
  </p>

  <sub>Built with 🦀🕸 by <a href="https://rustwasm.github.io/">The Rust and WebAssembly Working Group</a></sub>
</div>

## About

Uses the [Rust MaxmindDB library](https://crates.io/crates/maxminddb) and stripping of all filesystem dependency to create a WASM binary that gets embedded (there's currently some issues around how to handle loading WASM in Deno libraries, so it's inlined as a `Uint8Array`) to let you pass in the database yourself in `js/ts` and make it queryable.

## 🚴 Usage

Instantiate a new MaxmindDB database by passing it as a raw `Uint8Array`
```ts
import { Maxmind } from "./mod.ts";
const dbRawFile = await Deno.readFile('./GeoLite2-City.mmdb')
const db = new Maxmind(dbRawFile)
const result = db.lookup_city('8.8.8.8')
result = {{
  city: {
    geoname_id: 4752186,
    names: Map {
      "en" => "Chesapeake",
      "ja" => "チェサピーク",
      "pt-BR" => "Chesapeake",
      "ru" => "Чесапик",
      "zh-CN" => "切萨皮克"
    }
  },
  continent: {
    code: "NA",
    geoname_id: 6255149,
    names: Map {
      "de" => "Nordamerika",
      "en" => "North America",
      "es" => "Norteamérica",
      "fr" => "Amérique du Nord",
      "ja" => "北アメリカ",
      "pt-BR" => "América do Norte",
      "ru" => "Северная Америка",
      "zh-CN" => "北美洲"
    }
  },
  country: {
    geoname_id: 6252001,
    is_in_european_union: undefined,
    iso_code: "US",
    names: Map {
      "de" => "USA",
      "en" => "United States",
      "es" => "Estados Unidos",
      "fr" => "États-Unis",
      "ja" => "アメリカ合衆国",
      "pt-BR" => "Estados Unidos",
      "ru" => "США",
      "zh-CN" => "美国"
    }
  },
  location: {
    latitude: 36.7348,
    longitude: -76.2343,
    metro_code: 544,
    time_zone: "America/New_York"
  },
  postal: { code: "23320" },
  registered_country: {
    geoname_id: 6252001,
    is_in_european_union: undefined,
    iso_code: "US",
    names: Map {
      "de" => "USA",
      "en" => "United States",
      "es" => "Estados Unidos",
      "fr" => "États-Unis",
      "ja" => "アメリカ合衆国",
      "pt-BR" => "Estados Unidos",
      "ru" => "США",
      "zh-CN" => "美国"
    }
  },
  represented_country: undefined,
  subdivisions: [
    {
      geoname_id: 6254928,
      iso_code: "VA",
      names: Map {
        "en" => "Virginia",
        "fr" => "Virginie",
        "ja" => "バージニア州",
        "pt-BR" => "Virgínia",
        "ru" => "Вирджиния",
        "zh-CN" => "弗吉尼亚州"
      }
    }
  ],
  traits: undefined
}}
```
