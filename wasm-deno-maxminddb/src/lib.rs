mod utils;

use maxminddb::geoip2;
use std::net::IpAddr;
use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub struct Maxmind {
    db: maxminddb::Reader<Vec<u8>>,
}

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
        let ip_addr_str: IpAddr = ip_str.parse::<IpAddr>().expect_throw("Invalid IP");
        let city: geoip2::City = self.db.lookup(ip_addr_str).expect_throw("Result Not Found");
        Ok(serde_wasm_bindgen::to_value(&city).unwrap())
    }
}

#[wasm_bindgen(start)]
pub fn run() -> Result<(), JsValue> {
    utils::set_panic_hook();
    Ok(())
}
