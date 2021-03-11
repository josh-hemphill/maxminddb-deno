mod utils;

use maxminddb::geoip2;
use serde::Serialize;
use std::collections::BTreeMap;
use std::net::IpAddr;
use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[derive(Serialize)]
struct Metadata {
    pub binary_format_major_version: u16,
    pub binary_format_minor_version: u16,
    pub build_epoch: u64,
    pub database_type: String,
    pub description: BTreeMap<String, String>,
    pub ip_version: u16,
    pub languages: Vec<String>,
    pub node_count: u32,
    pub record_size: u16,
}
impl Metadata {
    pub fn new(db: &maxminddb::Reader<Vec<u8>>) -> Metadata {
        let metadata = &db.metadata;
        Metadata {
            binary_format_major_version: metadata.binary_format_major_version.clone(),
            binary_format_minor_version: metadata.binary_format_minor_version.clone(),
            build_epoch: metadata.build_epoch.clone(),
            database_type: metadata.database_type.clone(),
            description: metadata.description.clone(),
            ip_version: metadata.ip_version.clone(),
            languages: metadata.languages.clone(),
            node_count: metadata.node_count.clone(),
            record_size: metadata.record_size.clone(),
        }
    }
}

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
            db: maxminddb::Reader::from_source(local_arr).expect_throw("Invalid Database Binary"),
        }
    }

    pub fn lookup_city(&self, ip_str: &str) -> Result<JsValue, JsValue> {
        let ip_addr_str: IpAddr = ip_str.parse::<IpAddr>().expect_throw("Invalid IP");
        let result: geoip2::City = self.db.lookup(ip_addr_str).expect_throw("Result Not Found");
        Ok(
            JsValue::from_serde(&result)
                .expect_throw("Result Could not be converted to Javascript"),
        )
    }

    #[wasm_bindgen(getter = metadata)]
    pub fn get_metadata(&self) -> Result<JsValue, JsValue> {
        let metadata = Metadata::new(&self.db);
        Ok(JsValue::from_serde(&metadata)
            .expect_throw("Result Could not be converted to Javascript"))
    }
}

#[wasm_bindgen(start)]
pub fn run() -> Result<(), JsValue> {
    utils::set_panic_hook();
    Ok(())
}
