<div align="center">

  <h1><code>maxminddb</code> Deno</h1>

  <strong>A library that enables the usage of MaxmindDB geoIP databases by using the Rust library in a WebAssembly module</strong>

  <p>
    <a href="https://github.com/josh-hemphill/maxminddb-deno/releases"><img src="https://img.shields.io/github/v/tag/josh-hemphill/subslate?sort=semver&style=flat-square" alt="version" /></a>
    <a href="https://github.com/josh-hemphill/maxminddb-deno/actions/workflows/test.yml"><img src="https://img.shields.io/github/workflow/status/josh-hemphill/maxminddb-deno/Test?label=Tests&style=flat-square" alt="Test Status" /></a>
    <a href="https://github.com/josh-hemphill/maxminddb-deno/actions/workflows/build.yml"><img src="https://img.shields.io/github/workflow/status/josh-hemphill/maxminddb-deno/Build?label=Build&style=flat-square" alt="Build Status" /></a>
    <a href="https://deno.land/x/maxminddb/mod.ts"><img src="https://img.shields.io/static/v1?label=&message=Deno&logo=deno&color=informational&style=flat-square" alt="Deno Page" /></a>
    <a href="https://doc.deno.land/https/deno.land/x/maxminddb/mod.ts"><img src="https://img.shields.io/static/v1?label=&message=API-Doc&color=informational&style=flat-square&logo=deno" alt="API doc" /></a>
  </p>

  <sub>Built with 🦀🕸 by <a href="https://rustwasm.github.io/">The Rust and WebAssembly Working Group</a></sub>
</div>

## About

Uses the [Rust MaxmindDB library](https://crates.io/crates/maxminddb) and stripping of all filesystem dependency to create a WASM binary that gets embedded (there's currently some issues around how to handle loading WASM in Deno libraries, so it's inlined as a `Uint8Array`) to let you pass in the database yourself in `js/ts` and make it queryable.

Unfortunately, there's not currently a good way to auto-generate the type information for the exported object, so you'll have to refer to the example or now, though I will be working on getting that sorted out.

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

## Contributing

### Build Setup

For running the automated build (which includes compiling the rust wasm) you'll need the following tools installed

  - [Deno](https://deno.land/#installation)
  - [Rust](https://doc.rust-lang.org/cargo/getting-started/installation.html)
  - [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/)

Once you have all the necessary tools installed, you can just run `deno run --allow-run --allow-read --allow-write build.ts`

It builds the wasm and interfacing javascript and typescript definitions, does some transformation on the javascript to support Deno, and writes it to the dist folder.

### Testing

Under `test/test.ts`, the single non-comprehensive test downloads the available GeoLite2 test database from the Maxmind github repo, and uses that to test that basic functionality works. Since it fetches the test database over the network every run, it is a little slower (Though the test database is pretty small).
