mod utils;

use maxminddb::geoip2;
use std::net::{IpAddr, Ipv4Addr};
use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {}

#[wasm_bindgen]
pub struct Maxmind {
    db: maxminddb::Reader<Vec<u8>>,
}

#[wasm_bindgen(typescript_custom_section)]
const ITEXT_STYLE: &'static str = r#"
interface ITextStyle {
    bold: boolean;
    italic: boolean;
    size: number;
}
"#;

#[wasm_bindgen]
impl Maxmind {
    #[wasm_bindgen(constructor)]
    pub fn new(js_db: Box<[u8]>) -> Maxmind {
        let local_arr: Vec<u8> = js_db.into_vec();
        Maxmind {
            db: maxminddb::Reader::from_source(local_arr).unwrap(),
        }
    }

    pub fn lookup_city(&self, ip_str: &str) -> Result<JsValue, JsValue> {
        let ip_addr: IpAddr = IpAddr::V4(ip_str.parse::<Ipv4Addr>().unwrap());
        let city: geoip2::City = self.db.lookup(ip_addr).unwrap();
        serde_wasm_bindgen::to_value(&city).map_err(|err| err.into())
    }
}
