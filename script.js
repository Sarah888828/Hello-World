const parkingLots = [
  {
    id: "buldang-public",
    name: "불당 제1주차장",
    address: "천안시 서북구 검은들1길 15",
    district: "서북구",
    type: "paid",
    typeLabel: "공영주차장",
    distance: "불당동",
    price: null,
    priceLabel: "요금은 공식 안내 확인",
    hours: "24시간 운영",
    capacity: "144면 · 급속 충전기 6기",
    note: "천안도시공사 유료 공영주차장 현황 기준",
    charger: { exists: true, count: "6기 (급속)", output: "100kW", price: "550원/kWh", operator: "환경부", source: "https://www.happecharger.com/maps/stationDetail/ME23B307", verified: "해피차저 충전소 정보 확인 · 실제 결제 요금은 회원/결제 방식에 따라 달라질 수 있음" }
  },
  {
    id: "buldang-2",
    name: "불당 제2주차장",
    address: "천안시 서북구 불당동 735",
    district: "서북구",
    type: "paid",
    typeLabel: "공영주차장",
    distance: "불당동",
    price: null,
    priceLabel: "요금은 공식 안내 확인",
    hours: "24시간 운영",
    capacity: "49면",
    note: "천안도시공사 유료 공영주차장 현황 기준",
    charger: { exists: false, count: "공사 현황에 충전기 미기재" }
  },
  {
    id: "buldang-3",
    name: "불당 제3주차장",
    address: "천안시 서북구 불당동 910",
    district: "서북구",
    type: "free",
    typeLabel: "공영주차장",
    distance: "불당동",
    price: null,
    priceLabel: "요금은 공식 안내 확인",
    hours: "운영시간 현장 확인",
    capacity: "57면 · 급속 충전기 2기",
    note: "천안도시공사 무료 노외주차장 현황 기준",
    charger: { exists: true, count: "2기 (급속)", output: "200kW", price: "550원/kWh", operator: "환경부", source: "https://www.happecharger.com/maps/stationDetail/ME20C2b2", verified: "해피차저 충전소 정보 확인 · 실제 결제 요금은 회원/결제 방식에 따라 달라질 수 있음" }
  },
  {
    id: "buldang-4",
    name: "불당 제4주차장",
    address: "천안시 서북구 불당동 970",
    district: "서북구",
    type: "free",
    typeLabel: "공영주차장",
    distance: "불당동",
    price: null,
    priceLabel: "요금은 공식 안내 확인",
    hours: "운영시간 현장 확인",
    capacity: "28면",
    note: "천안도시공사 무료 노외주차장 현황 기준",
    charger: { exists: false, count: "공사 현황에 충전기 미기재" }
  },
  {
    id: "buldang-5",
    name: "불당 제5주차장",
    address: "천안시 서북구 불당동 1543 (불당25로 154)",
    district: "서북구",
    type: "paid",
    typeLabel: "공영주차장",
    distance: "불당동",
    price: null,
    priceLabel: "요금은 공식 안내 확인",
    hours: "24시간 운영",
    capacity: "128면",
    note: "천안도시공사 유료 공영주차장 현황 기준. 현장 기준 면수는 변경될 수 있습니다.",
    charger: { exists: false, count: "공사 현황에 충전기 미기재" }
  },
  {
    id: "dujeong-1", name: "두정 제1주차장", address: "천안시 서북구 두정동 1366", district: "서북구", type: "paid", typeLabel: "공영주차장 · 유료", distance: "서북구", price: null, priceLabel: "요금은 공식 안내 확인", hours: "24시간 운영", capacity: "18면", note: "천안도시공사 유료주차장 현황 기준", charger: { exists: false, count: "공사 현황에 충전기 미기재" }
  },
  {
    id: "dujeong-station-1", name: "두정역 제1주차장", address: "천안시 서북구 두정동 91-1", district: "서북구", type: "paid", typeLabel: "공영주차장 · 유료", distance: "서북구", price: null, priceLabel: "요금은 공식 안내 확인", hours: "24시간 운영", capacity: "42면 · 급속 충전기 2기", note: "천안도시공사 유료주차장 현황 기준", charger: { exists: true, count: "2기 (급속)", output: "공식 현황 확인", price: "충전사업자 안내 확인", operator: "현장 안내 확인" }
  },
  {
    id: "notae-park", name: "노태공원 주차장", address: "천안시 서북구 노태산로 131", district: "서북구", type: "paid", typeLabel: "공영주차장 · 유료/야간 무료", distance: "서북구", price: null, priceLabel: "공원 주차요금 공식 안내 확인", hours: "09:00~21:00 · 야간 21:00~09:00 무료 개방", capacity: "98면 · 완속 충전기 2기", note: "천안도시공사 현황 및 야간 무료 개방 안내 기준", charger: { exists: true, count: "2기 (완속)", output: "공식 현황 확인", price: "충전사업자 안내 확인", operator: "현장 안내 확인" }
  },
  {
    id: "daeheung-1", name: "대흥 제1주차장", address: "천안시 동남구 대흥로 205", district: "동남구", type: "paid", typeLabel: "공영주차장 · 유료", distance: "동남구", price: null, priceLabel: "요금은 공식 안내 확인", hours: "24시간 운영", capacity: "20면", note: "천안도시공사 유료주차장 현황 기준", charger: { exists: false, count: "공사 현황에 충전기 미기재" }
  },
  {
    id: "daeheung-temporary", name: "대흥로 제1주차장 (임시무료)", address: "천안역 ~ 온양나드리 지하도", district: "동남구", type: "temporary", typeLabel: "공영주차장 · 임시무료", distance: "동남구", price: null, priceLabel: "임시 무료 (공식 현황 기준)", hours: "24시간 운영", capacity: "34면 · 급속 충전기 1기", note: "임시무료 운영 여부는 방문 전 공식 안내 확인", charger: { exists: true, count: "1기 (급속)", output: "공식 현황 확인", price: "충전사업자 안내 확인", operator: "현장 안내 확인" }
  },
  {
    id: "sinbu-1", name: "신부 제1주차장", address: "천안시 동남구 터미널8길 7", district: "동남구", type: "paid", typeLabel: "공영주차장 · 유료", distance: "동남구", price: null, priceLabel: "요금은 공식 안내 확인", hours: "24시간 운영", capacity: "38면", note: "천안도시공사 유료주차장 현황 기준", charger: { exists: false, count: "공사 현황에 충전기 미기재" }
  },
  {
    id: "sinbu-4", name: "신부 제4주차장", address: "천안시 동남구 먹거리9길 16", district: "동남구", type: "paid", typeLabel: "공영주차장 · 야간 무료", distance: "동남구", price: null, priceLabel: "요금 및 야간 개방 조건 공식 안내 확인", hours: "09:00~21:00 · 야간 21:00~09:00 무료 개방", capacity: "13면", note: "천안도시공사 현황 및 야간 무료 개방 안내 기준", charger: { exists: false, count: "공사 현황에 충전기 미기재" }
  },
  {
    id: "sinbu-5", name: "신부 제5주차장", address: "천안시 동남구 먹거리11길 12", district: "동남구", type: "paid", typeLabel: "공영주차장 · 유료", distance: "동남구", price: null, priceLabel: "요금은 공식 안내 확인", hours: "24시간 운영", capacity: "232면 · 급속 2기 · 완속 10기", note: "천안도시공사 유료주차장 현황 기준", charger: { exists: true, count: "급속 2기 · 완속 10기", output: "공식 현황 확인", price: "충전사업자 안내 확인", operator: "현장 안내 확인" }
  },
  {
    id: "myeongdong", name: "명동주차장", address: "천안시 동남구 명동길 36", district: "동남구", type: "paid", typeLabel: "공영주차장 · 유료", distance: "동남구", price: null, priceLabel: "요금은 공식 안내 확인", hours: "24시간 운영", capacity: "77면", note: "천안도시공사 유료주차장 현황 기준", charger: { exists: false, count: "공사 현황에 충전기 미기재" }
  },
  {
    id: "ilbong-park", name: "일봉공원 주차장", address: "천안시 동남구 다가동 460-6", district: "동남구", type: "paid", subType: "park", typeLabel: "공영주차장 · 공원", distance: "동남구", price: null, priceLabel: "도시공원 주차요금 공식 안내 확인", hours: "09:00~21:00 · 야간 21:00~09:00 무료 개방", capacity: "160면", note: "천안도시공사 도시공원 주차장 현황 기준", charger: { exists: false, count: "공사 현황에 충전기 미기재" }
  },
  {
    id: "samgeori-park", name: "삼거리공원 주차장", address: "천안시 동남구 삼룡동 291-4", district: "동남구", type: "paid", subType: "park", typeLabel: "공영주차장 · 공원", distance: "동남구", price: null, priceLabel: "도시공원 주차요금 공식 안내 확인", hours: "09:00~21:00 · 야간 21:00~09:00 무료 개방", capacity: "293면", note: "천안도시공사 도시공원 주차장 현황 기준", charger: { exists: false, count: "공사 현황에 충전기 미기재" }
  },
  {
    id: "mokcheon-camping", name: "목천캠핑카주차장", address: "천안시 동남구 목천읍 운전리 503", district: "동남구", type: "paid", subType: "camping", typeLabel: "공영주차장 · 캠핑카", distance: "동남구", price: null, priceLabel: "캠핑카 주차요금 공식 안내 확인", hours: "24시간 운영", capacity: "179면", note: "천안도시공사 유료주차장 현황 기준", charger: { exists: false, count: "공사 현황에 충전기 미기재" }
  },
  {
    id: "daeheung-road-2", name: "대흥로 제2주차장", address: "중앙장례식장 ~ 신성기계 구간", district: "동남구", type: "free", typeLabel: "공영 노상주차장 · 무료", distance: "동남구", price: null, priceLabel: "무료 노상주차장 (공식 현황 기준)", hours: "운영시간 공식 안내 확인", capacity: "28면", note: "도로 사정에 따라 노상 주차면이 변동될 수 있음", charger: { exists: false, count: "공사 현황에 충전기 미기재" }
  },
  {
    id: "beodeul-road-1", name: "버들로 제1주차장", address: "광성장 ~ 1번국도 직전 구간", district: "동남구", type: "free", typeLabel: "공영 노상주차장 · 무료", distance: "동남구", price: null, priceLabel: "무료 노상주차장 (공식 현황 기준)", hours: "운영시간 공식 안내 확인", capacity: "45면", note: "도로 사정에 따라 노상 주차면이 변동될 수 있음", charger: { exists: false, count: "공사 현황에 충전기 미기재" }
  },
  {
    id: "seongjeong-road-1", name: "성정로 제1주차장", address: "쌍용스토어 ~ 미래안경 구간", district: "서북구", type: "free", typeLabel: "공영 노상주차장 · 무료", distance: "서북구", price: null, priceLabel: "무료 노상주차장 (공식 현황 기준)", hours: "운영시간 공식 안내 확인", capacity: "27면", note: "도로 사정에 따라 노상 주차면이 변동될 수 있음", charger: { exists: false, count: "공사 현황에 충전기 미기재" }
  },
  {
    id: "seonghwang-road-2", name: "성황로 제2주차장", address: "형제주유소 ~ 1번국도 직전 구간", district: "동남구", type: "free", typeLabel: "공영 노상주차장 · 무료", distance: "동남구", price: null, priceLabel: "무료 노상주차장 (공식 현황 기준)", hours: "운영시간 공식 안내 확인", capacity: "50면 · 급속 충전기 1기", note: "도로 사정에 따라 노상 주차면이 변동될 수 있음", charger: { exists: true, count: "1기 (급속)", output: "공식 현황 확인", price: "충전사업자 안내 확인", operator: "현장 안내 확인" }
  },
  {
    id: "seonghwang-road-3", name: "성황로 제3주차장", address: "천안장로교회 앞 ~ 만나식당 직전 구간", district: "동남구", type: "free", typeLabel: "공영 노상주차장 · 무료", distance: "동남구", price: null, priceLabel: "무료 노상주차장 (공식 현황 기준)", hours: "운영시간 공식 안내 확인", capacity: "22면", note: "도로 사정에 따라 노상 주차면이 변동될 수 있음", charger: { exists: false, count: "공사 현황에 충전기 미기재" }
  },
  {
    id: "sinyong-road-1", name: "신용로 제1주차장", address: "한춘정육식당 ~ 다가동공구상가 구간", district: "동남구", type: "free", typeLabel: "공영 노상주차장 · 무료", distance: "동남구", price: null, priceLabel: "무료 노상주차장 (공식 현황 기준)", hours: "운영시간 공식 안내 확인", capacity: "95면 · 완속 충전기 2기", note: "도로 사정에 따라 노상 주차면이 변동될 수 있음", charger: { exists: true, count: "2기 (완속)", output: "공식 현황 확인", price: "충전사업자 안내 확인", operator: "현장 안내 확인" }
  },
  {
    id: "ssangyong-daero-1", name: "쌍용대로 제1주차장", address: "보현빌딩(KT) ~ 에덴약국 구간", district: "서북구", type: "free", typeLabel: "공영 노상주차장 · 무료", distance: "서북구", price: null, priceLabel: "무료 노상주차장 (공식 현황 기준)", hours: "운영시간 공식 안내 확인", capacity: "43면", note: "도로 사정에 따라 노상 주차면이 변동될 수 있음", charger: { exists: false, count: "공사 현황에 충전기 미기재" }
  },
  {
    id: "jungang-road-1", name: "중앙로 제1주차장", address: "금산상회 ~ 늑대와여우 컴퓨터 구간", district: "동남구", type: "free", typeLabel: "공영 노상주차장 · 무료", distance: "동남구", price: null, priceLabel: "무료 노상주차장 (공식 현황 기준)", hours: "운영시간 공식 안내 확인", capacity: "18면", note: "도로 사정에 따라 노상 주차면이 변동될 수 있음", charger: { exists: false, count: "공사 현황에 충전기 미기재" }
  },
  {
    id: "chadol-road-1", name: "차돌로 제1주차장", address: "한우다 ~ 도매전기재료 구간", district: "서북구", type: "free", typeLabel: "공영 노상주차장 · 무료", distance: "서북구", price: null, priceLabel: "무료 노상주차장 (공식 현황 기준)", hours: "운영시간 공식 안내 확인", capacity: "64면 · 완속 충전기 1기", note: "도로 사정에 따라 노상 주차면이 변동될 수 있음", charger: { exists: true, count: "1기 (완속)", output: "공식 현황 확인", price: "충전사업자 안내 확인", operator: "현장 안내 확인" }
  },
  {
    id: "gwangdeok-1", name: "광덕 제1주차장", address: "천안시 동남구 광덕면·리 403-9", district: "동남구", type: "free", typeLabel: "공영 노외주차장 · 무료", distance: "동남구", price: null, priceLabel: "무료 노외주차장 (공식 현황 기준)", hours: "운영시간 공식 안내 확인", capacity: "424면 · 급속 충전기 6기", note: "천안도시공사 무료 노외주차장 현황 기준", charger: { exists: true, count: "6기 (급속)", output: "공식 현황 확인", price: "충전사업자 안내 확인", operator: "현장 안내 확인" }
  },
  {
    id: "gwangdeok-2", name: "광덕 제2주차장", address: "천안시 동남구 광덕면·리 560-2", district: "동남구", type: "free", typeLabel: "공영 노외주차장 · 무료", distance: "동남구", price: null, priceLabel: "무료 노외주차장 (공식 현황 기준)", hours: "운영시간 공식 안내 확인", capacity: "151면 · 급속 2기 · 완속 1기", note: "천안도시공사 무료 노외주차장 현황 기준", charger: { exists: true, count: "급속 2기 · 완속 1기", output: "공식 현황 확인", price: "충전사업자 안내 확인", operator: "현장 안내 확인" }
  },
  {
    id: "guseong-1", name: "구성 제1주차장", address: "천안시 동남구 구성동 531", district: "동남구", type: "free", typeLabel: "공영 노외주차장 · 무료", distance: "동남구", price: null, priceLabel: "무료 노외주차장 (공식 현황 기준)", hours: "운영시간 공식 안내 확인", capacity: "18면", note: "천안도시공사 무료 노외주차장 현황 기준", charger: { exists: false, count: "공사 현황에 충전기 미기재" }
  },
  {
    id: "mokcheon-1", name: "목천 제1주차장", address: "천안시 동남구 목천읍 운전리 562", district: "동남구", type: "free", typeLabel: "공영 노외주차장 · 무료", distance: "동남구", price: null, priceLabel: "무료 노외주차장 (공식 현황 기준)", hours: "운영시간 공식 안내 확인", capacity: "112면 · 급속 충전기 8기", note: "천안도시공사 무료 노외주차장 현황 기준", charger: { exists: true, count: "8기 (급속)", output: "공식 현황 확인", price: "충전사업자 안내 확인", operator: "현장 안내 확인" }
  },
  {
    id: "mokcheon-2", name: "목천 제2주차장", address: "천안시 동남구 목천읍 서흥리 124-1", district: "동남구", type: "free", typeLabel: "공영 노외주차장 · 무료", distance: "동남구", price: null, priceLabel: "무료 노외주차장 (공식 현황 기준)", hours: "운영시간 공식 안내 확인", capacity: "25면", note: "천안도시공사 무료 노외주차장 현황 기준", charger: { exists: false, count: "공사 현황에 충전기 미기재" }
  },
  {
    id: "byeongcheon-1", name: "병천 제1주차장", address: "천안시 동남구 병천면·리 211-1", district: "동남구", type: "free", typeLabel: "공영 노외주차장 · 무료", distance: "동남구", price: null, priceLabel: "무료 노외주차장 (공식 현황 기준)", hours: "운영시간 공식 안내 확인", capacity: "114면 · 급속 충전기 2기", note: "천안도시공사 무료 노외주차장 현황 기준", charger: { exists: true, count: "2기 (급속)", output: "공식 현황 확인", price: "충전사업자 안내 확인", operator: "현장 안내 확인" }
  },
  {
    id: "bongmyeong-1", name: "봉명 제1주차장", address: "천안시 동남구 봉명동 10-2", district: "동남구", type: "free", typeLabel: "공영 노외주차장 · 무료", distance: "동남구", price: null, priceLabel: "무료 노외주차장 (공식 현황 기준)", hours: "운영시간 공식 안내 확인", capacity: "62면", note: "천안도시공사 무료 노외주차장 현황 기준", charger: { exists: false, count: "공사 현황에 충전기 미기재" }
  },
  {
    id: "bongmyeong-2", name: "봉명 제2주차장", address: "천안시 동남구 봉명동 20-2", district: "동남구", type: "free", typeLabel: "공영 노외주차장 · 무료", distance: "동남구", price: null, priceLabel: "무료 노외주차장 (공식 현황 기준)", hours: "운영시간 공식 안내 확인", capacity: "21면", note: "천안도시공사 무료 노외주차장 현황 기준", charger: { exists: false, count: "공사 현황에 충전기 미기재" }
  },
  {
    id: "bukmyeon-1", name: "북면 제1주차장", address: "천안시 동남구 북면 은지리 101", district: "동남구", type: "free", typeLabel: "공영 노외주차장 · 무료", distance: "동남구", price: null, priceLabel: "무료 노외주차장 (공식 현황 기준)", hours: "운영시간 공식 안내 확인", capacity: "23면", note: "천안도시공사 무료 노외주차장 현황 기준", charger: { exists: false, count: "공사 현황에 충전기 미기재" }
  },
  {
    id: "bukmyeon-2", name: "북면 제2주차장", address: "천안시 동남구 북면 은지리 45-1", district: "동남구", type: "free", typeLabel: "공영 노외주차장 · 무료", distance: "동남구", price: null, priceLabel: "무료 노외주차장 (공식 현황 기준)", hours: "운영시간 공식 안내 확인", capacity: "13면", note: "천안도시공사 무료 노외주차장 현황 기준", charger: { exists: false, count: "공사 현황에 충전기 미기재" }
  },
  {
    id: "sajik-1", name: "사직 제1주차장", address: "천안시 동남구 사직동 287-5", district: "동남구", type: "free", typeLabel: "공영 노외주차장 · 무료", distance: "동남구", price: null, priceLabel: "무료 노외주차장 (공식 현황 기준)", hours: "운영시간 공식 안내 확인", capacity: "57면 · 완속 충전기 1기", note: "천안도시공사 무료 노외주차장 현황 기준", charger: { exists: true, count: "1기 (완속)", output: "공식 현황 확인", price: "충전사업자 안내 확인", operator: "현장 안내 확인" }
  },
  {
    id: "seonggeo-1", name: "성거 제1주차장", address: "천안시 서북구 성거읍 천흥리 430-5", district: "서북구", type: "free", typeLabel: "공영 노외주차장 · 무료", distance: "서북구", price: null, priceLabel: "무료 노외주차장 (공식 현황 기준)", hours: "운영시간 공식 안내 확인", capacity: "47면", note: "천안도시공사 무료 노외주차장 현황 기준", charger: { exists: false, count: "공사 현황에 충전기 미기재" }
  },
  {
    id: "seonggeo-2", name: "성거 제2주차장", address: "천안시 서북구 성거읍 저리 54-3", district: "서북구", type: "free", typeLabel: "공영 노외주차장 · 무료", distance: "서북구", price: null, priceLabel: "무료 노외주차장 (공식 현황 기준)", hours: "운영시간 공식 안내 확인", capacity: "25면", note: "천안도시공사 무료 노외주차장 현황 기준", charger: { exists: false, count: "공사 현황에 충전기 미기재" }
  },
  {
    id: "seongseong-1", name: "성성 제1주차장", address: "천안시 서북구 성성동 511-9", district: "서북구", type: "free", typeLabel: "공영 노외주차장 · 무료", distance: "서북구", price: null, priceLabel: "무료 노외주차장 (공식 현황 기준)", hours: "운영시간 공식 안내 확인", capacity: "62면 · 급속 충전기 2기", note: "천안도시공사 무료 노외주차장 현황 기준", charger: { exists: true, count: "2기 (급속)", output: "공식 현황 확인", price: "충전사업자 안내 확인", operator: "현장 안내 확인" }
  },
  {
    id: "seongjeong-1", name: "성정 제1주차장", address: "천안시 서북구 성정동 175-1", district: "서북구", type: "free", typeLabel: "공영 노외주차장 · 무료", distance: "서북구", price: null, priceLabel: "무료 노외주차장 (공식 현황 기준)", hours: "운영시간 공식 안내 확인", capacity: "12면", note: "천안도시공사 무료 노외주차장 현황 기준", charger: { exists: false, count: "공사 현황에 충전기 미기재" }
  },
  {
    id: "seongjeong-2", name: "성정 제2주차장", address: "천안시 서북구 성정동 436-10", district: "서북구", type: "free", typeLabel: "공영 노외주차장 · 무료", distance: "서북구", price: null, priceLabel: "무료 노외주차장 (공식 현황 기준)", hours: "운영시간 공식 안내 확인", capacity: "69면 · 급속 충전기 2기", note: "천안도시공사 무료 노외주차장 현황 기준", charger: { exists: true, count: "2기 (급속)", output: "공식 현황 확인", price: "충전사업자 안내 확인", operator: "현장 안내 확인" }
  },
  {
    id: "seongjeong-3", name: "성정 제3주차장", address: "천안시 서북구 성정동 602-35", district: "서북구", type: "free", typeLabel: "공영 노외주차장 · 무료", distance: "서북구", price: null, priceLabel: "무료 노외주차장 (공식 현황 기준)", hours: "운영시간 공식 안내 확인", capacity: "27면", note: "천안도시공사 무료 노외주차장 현황 기준", charger: { exists: false, count: "공사 현황에 충전기 미기재" }
  },
  {
    id: "seonghwan-1", name: "성환 제1주차장", address: "천안시 서북구 성환읍·리 357-10", district: "서북구", type: "free", typeLabel: "공영 노외주차장 · 무료", distance: "서북구", price: null, priceLabel: "무료 노외주차장 (공식 현황 기준)", hours: "운영시간 공식 안내 확인", capacity: "24면", note: "천안도시공사 무료 노외주차장 현황 기준", charger: { exists: false, count: "공사 현황에 충전기 미기재" }
  },
  {
    id: "sinbang-1", name: "신방 제1주차장", address: "천안시 동남구 신방동 1901", district: "동남구", type: "free", typeLabel: "공영 노외주차장 · 무료", distance: "동남구", price: null, priceLabel: "무료 노외주차장 (공식 현황 기준)", hours: "운영시간 공식 안내 확인", capacity: "49면", note: "천안도시공사 무료 노외주차장 현황 기준", charger: { exists: false, count: "공사 현황에 충전기 미기재" }
  },
  {
    id: "sinbu-3", name: "신부 제3주차장", address: "천안시 동남구 신부동 331-43", district: "동남구", type: "free", typeLabel: "공영 노외주차장 · 무료", distance: "동남구", price: null, priceLabel: "무료 노외주차장 (공식 현황 기준)", hours: "운영시간 공식 안내 확인", capacity: "13면", note: "천안도시공사 무료 노외주차장 현황 기준", charger: { exists: false, count: "공사 현황에 충전기 미기재" }
  },
  {
    id: "ssangyong-station-1", name: "쌍용역 제1주차장", address: "천안시 서북구 쌍용동 409-2, 410-2", district: "서북구", type: "free", typeLabel: "공영 노외주차장 · 무료", distance: "서북구", price: null, priceLabel: "무료 노외주차장 (공식 현황 기준)", hours: "운영시간 공식 안내 확인", capacity: "52면", note: "천안도시공사 무료 노외주차장 현황 기준", charger: { exists: false, count: "공사 현황에 충전기 미기재" }
  },
  {
    id: "ssangyong-2", name: "쌍용 제2주차장", address: "천안시 서북구 쌍용동 655", district: "서북구", type: "free", typeLabel: "공영 노외주차장 · 무료", distance: "서북구", price: null, priceLabel: "무료 노외주차장 (공식 현황 기준)", hours: "운영시간 공식 안내 확인", capacity: "70면 · 급속 충전기 4기", note: "천안도시공사 무료 노외주차장 현황 기준", charger: { exists: true, count: "4기 (급속)", output: "공식 현황 확인", price: "충전사업자 안내 확인", operator: "현장 안내 확인" }
  },
  {
    id: "ssangyong-3", name: "쌍용 제3주차장", address: "천안시 서북구 쌍용동 1299", district: "서북구", type: "free", typeLabel: "공영 노외주차장 · 무료", distance: "서북구", price: null, priceLabel: "무료 노외주차장 (공식 현황 기준)", hours: "운영시간 공식 안내 확인", capacity: "13면", note: "천안도시공사 무료 노외주차장 현황 기준", charger: { exists: false, count: "공사 현황에 충전기 미기재" }
  },
  {
    id: "ssangyong-4", name: "쌍용 제4주차장", address: "천안시 서북구 쌍용동 2074", district: "서북구", type: "free", typeLabel: "공영 노외주차장 · 무료", distance: "서북구", price: null, priceLabel: "무료 노외주차장 (공식 현황 기준)", hours: "운영시간 공식 안내 확인", capacity: "44면", note: "천안도시공사 무료 노외주차장 현황 기준", charger: { exists: false, count: "공사 현황에 충전기 미기재" }
  },
  {
    id: "ssangyong-5", name: "쌍용 제5주차장", address: "천안시 서북구 쌍용동 2114", district: "서북구", type: "free", typeLabel: "공영 노외주차장 · 무료", distance: "서북구", price: null, priceLabel: "무료 노외주차장 (공식 현황 기준)", hours: "운영시간 공식 안내 확인", capacity: "19면", note: "천안도시공사 무료 노외주차장 현황 기준", charger: { exists: false, count: "공사 현황에 충전기 미기재" }
  },
  {
    id: "ssangyong-6", name: "쌍용 제6주차장", address: "천안시 서북구 쌍용동 1564", district: "서북구", type: "free", typeLabel: "공영 노외주차장 · 무료", distance: "서북구", price: null, priceLabel: "무료 노외주차장 (공식 현황 기준)", hours: "운영시간 공식 안내 확인", capacity: "52면", note: "천안도시공사 무료 노외주차장 현황 기준", charger: { exists: false, count: "공사 현황에 충전기 미기재" }
  },
  {
    id: "ssangyong-7", name: "쌍용 제7주차장", address: "천안시 서북구 쌍용동 1564", district: "서북구", type: "free", typeLabel: "공영 노외주차장 · 무료", distance: "서북구", price: null, priceLabel: "무료 노외주차장 (공식 현황 기준)", hours: "운영시간 공식 안내 확인", capacity: "19면", note: "천안도시공사 무료 노외주차장 현황 기준", charger: { exists: false, count: "공사 현황에 충전기 미기재" }
  },
  {
    id: "anseo-1", name: "안서 제1주차장", address: "천안시 동남구 안서동 526-39", district: "동남구", type: "free", typeLabel: "공영 노외주차장 · 무료", distance: "동남구", price: null, priceLabel: "무료 노외주차장 (공식 현황 기준)", hours: "운영시간 공식 안내 확인", capacity: "121면 · 급속 충전기 2기", note: "천안도시공사 무료 노외주차장 현황 기준", charger: { exists: true, count: "2기 (급속)", output: "공식 현황 확인", price: "충전사업자 안내 확인", operator: "현장 안내 확인" }
  },
  {
    id: "cheongdang-2", name: "청당 제2주차장", address: "천안시 동남구 청당동 567", district: "동남구", type: "free", typeLabel: "공영 노외주차장 · 무료", distance: "동남구", price: null, priceLabel: "무료 노외주차장 (공식 현황 기준)", hours: "운영시간 공식 안내 확인", capacity: "17면", note: "천안도시공사 무료 노외주차장 현황 기준", charger: { exists: false, count: "공사 현황에 충전기 미기재" }
  }
];

let parkingGrid;
let searchInput;
let searchButton;
let sortSelect;
let resultCount;
let emptyState;
let filterButtons = [];
let parkingDialog;
let activeFilter = "all";
let activeDistrictFilter = "all";

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
}

function initializeHomepage() {
  parkingGrid = document.querySelector("#parking-grid");
  searchInput = document.querySelector("#search-input");
  searchButton = document.querySelector("#search-button");
  sortSelect = document.querySelector("#sort-select");
  resultCount = document.querySelector("#result-count");
  emptyState = document.querySelector("#empty-state");
  filterButtons = [...document.querySelectorAll(".filter-chip")];
  const districtFilter = document.querySelector("#district-filter");
  parkingDialog = document.querySelector("#parking-dialog");

  if (!parkingGrid || !searchInput || !searchButton || !sortSelect || !resultCount || !emptyState || !parkingDialog) return;

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      filterButtons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle("active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });
      renderParkingLots();
    });
  });
  districtFilter?.addEventListener("change", () => {
    activeDistrictFilter = districtFilter.value;
    renderParkingLots();
  });

  searchInput.addEventListener("input", renderParkingLots);
  searchButton.addEventListener("click", renderParkingLots);
  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") renderParkingLots();
  });
  sortSelect.addEventListener("change", renderParkingLots);
  parkingGrid.addEventListener("click", (event) => {
    const detailButton = event.target.closest("[data-lot-id]");
    if (detailButton) showParkingDetails(detailButton.dataset.lotId);
  });
  document.querySelector("#dialog-close")?.addEventListener("click", () => parkingDialog.close());
  parkingDialog.addEventListener("click", (event) => {
    if (event.target === parkingDialog) parkingDialog.close();
  });
  document.querySelector("#reset-search")?.addEventListener("click", () => {
    searchInput.value = "";
    activeFilter = "all";
      activeDistrictFilter = "all";
      if (districtFilter) districtFilter.value = "all";
    filterButtons.forEach((button) => {
      const isActive = button.dataset.filter === "all";
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
    renderParkingLots();
    searchInput.focus();
  });

  renderParkingLots();
}

function getVisibleLots() {
  const query = searchInput.value.trim().toLocaleLowerCase("ko-KR");
  return parkingLots
    .filter((lot) => activeFilter === "all" || lot.type === activeFilter)
    .filter((lot) => activeDistrictFilter === "all" || lot.district === activeDistrictFilter)
    .filter((lot) => !query || `${lot.name} ${lot.address} ${lot.typeLabel} ${lot.charger?.exists ? `전기차 충전 ${lot.charger.count} ${lot.charger.output} 급속 ${lot.charger.price}` : "충전기 없음"}`.toLocaleLowerCase("ko-KR").includes(query))
    .sort((first, second) => sortSelect.value === "capacity"
      ? parseCapacity(first.capacity) - parseCapacity(second.capacity)
      : first.name.localeCompare(second.name, "ko-KR"));
}

function parseCapacity(capacity) {
  return Number(capacity.match(/\d+/)?.[0] ?? 0);
}

function getCardTypeClass(lot) {
  if (lot.type === "free") return "free-tag";
  if (lot.type === "temporary") return "temporary-tag";
  if (lot.subType === "park") return "park-tag";
  if (lot.subType === "camping") return "camping-tag";
  return "";
}

function getLotDetailUrl(lot) {
  const detailedLots = new Set(["buldang-public", "buldang-2", "buldang-3", "buldang-4", "buldang-5"]);
  if (detailedLots.has(lot.id)) return `${getBasePath()}parking/${encodeURIComponent(lot.id)}/index.html`;
  return `https://map.naver.com/p/search/${encodeURIComponent(lot.name + " " + lot.address)}`;
}

function getBasePath() {
  const currentPath = window.location.pathname;
  const parkingIndex = currentPath.indexOf("/parking/");
  if (parkingIndex >= 0) return currentPath.slice(0, parkingIndex + 1);
  if (currentPath.endsWith("/")) return currentPath;
  return currentPath.slice(0, currentPath.lastIndexOf("/") + 1);
}

function renderParkingDetailPage(lot) {
  const main = document.querySelector("#home");
  document.title = `${lot.name} | 불당 주차`;
  document.querySelector('meta[name="description"]').content = `${lot.name} 위치와 이용 정보를 확인하세요.`;
  document.querySelector(".nav-link.active")?.classList.remove("active");
  document.querySelector('.nav-link[href*="#parking-list"]')?.classList.add("active");
  const charger = lot.charger;
  const chargerRows = charger.exists
    ? `<div><dt>충전기 유무</dt><dd>있음 · ${escapeHtml(charger.count)}</dd></div>
       <div><dt>충전 속도</dt><dd>급속 · ${escapeHtml(charger.output)}</dd></div>
       <div><dt>운영 사업자</dt><dd>${escapeHtml(charger.operator)}</dd></div>
       <div><dt>충전 단가</dt><dd>${escapeHtml(charger.price)}</dd></div>`
    : `<div><dt>충전기 유무</dt><dd>공식 주차장 현황에 등록된 충전기 없음</dd></div>`;
  main.innerHTML = `
    <section class="detail-page-hero">
      <a class="detail-back" href="${getBasePath()}#parking-list"><span aria-hidden="true">←</span> 주차장 목록</a>
      <p class="section-kicker">PARKING DETAILS · CHEONAN</p>
      <h1 class="detail-page-title">${escapeHtml(lot.name)}</h1>
      <p class="detail-page-address">${escapeHtml(lot.address)}</p>
    </section>
    <section class="detail-page-content" aria-label="${escapeHtml(lot.name)} 상세 정보">
      ${lot.id === "buldang-5" ? `
      <figure class="detail-photo-card">
        <img class="detail-parking-photo" src="${getBasePath()}buldang-public-parking.jpg" alt="충청일보 기사에 실린 천안 불당 제5공영주차장 현장 사진" />
        <figcaption><span>불당 제5공영주차장 · 현장 사진</span><a href="https://www.ccdailynews.com/news/articleView.html?idxno=2066845" target="_blank" rel="noreferrer">사진 출처 · 충청일보 ↗</a></figcaption>
      </figure>` : ""}
      <article class="detail-info-card">
        <div class="detail-page-card-heading"><span class="type-tag ${lot.type === "nearby" ? "nearby-tag" : ""}">${escapeHtml(lot.typeLabel)}</span><span class="distance-tag">${escapeHtml(lot.distance)}</span></div>
        <h2>주차장 이용 정보</h2>
        <dl class="detail-info-list">
          <div><dt>주소</dt><dd>${escapeHtml(lot.address)}</dd></div>
          <div><dt>주차요금</dt><dd>${lot.price == null ? "천안도시공사 공식 요금표 확인" : `${lot.price.toLocaleString("ko-KR")}원 / 1시간`}</dd></div>
          <div><dt>운영시간</dt><dd>${escapeHtml(lot.hours)}</dd></div>
          <div><dt>주차 가능 대수</dt><dd>${escapeHtml(lot.capacity)}</dd></div>
          <div><dt>안내</dt><dd>${escapeHtml(lot.note)}</dd></div>
        </dl>
        <h2 class="charger-heading">전기차 충전 안내</h2>
        <dl class="detail-info-list charger-info-list">${chargerRows}</dl>
        ${charger.exists ? `<p class="charger-data-note">${escapeHtml(charger.verified)}. 실제 단가는 충전기 화면에서 결제 전에 확인해 주세요.</p><a class="detail-official-link" href="${escapeHtml(charger.source)}" target="_blank" rel="noreferrer">충전소 상세·실시간 정보 보기 ↗</a>` : `<p class="charger-data-note">천안도시공사 공식 주차장 현황에 전기차 충전기 수량이 표시되지 않습니다. 주변 충전소는 지도에서 확인해 주세요.</p>`}
        <p class="detail-page-disclaimer">주차장 명칭·주소·운영 현황은 천안도시공사 공식 목록을 기준으로 표시했어요. 요금과 운영 조건은 변경될 수 있으니 방문 전에 공식 안내나 현장 표지판을 확인해 주세요.</p>
    <a class="detail-side-note" href="https://www.cauc.or.kr/_parking/main.asp?no=2" target="_blank" rel="noreferrer">주차요금 공식 안내 ↗</a>
        <a class="detail-official-link" href="https://www.cauc.or.kr/_parking/main.asp?no=2" target="_blank" rel="noreferrer">주차요금 공식 안내 ↗</a>
        <a class="detail-map-link" href="https://map.naver.com/p/search/${encodeURIComponent(lot.name + " " + lot.address)}" target="_blank" rel="noreferrer">지도에서 길찾기 <span aria-hidden="true">↗</span></a>
      </article>
      <aside class="detail-side-note"><span class="guide-icon" aria-hidden="true">✳</span><h2>방문 전에 확인해 주세요</h2><p>주차 가능 대수와 요금은 실시간으로 연동되지 않아요. 출발 전 최신 정보를 확인해 주세요.</p><a href="https://www.cheonan.go.kr/" target="_blank" rel="noreferrer">천안시 홈페이지 ↗</a></aside>
    </section>
  `;
  main.classList.add("detail-page");
}

function renderParkingLots() {
  const visibleLots = getVisibleLots();
  resultCount.textContent = String(visibleLots.length).padStart(2, "0");
  emptyState.hidden = visibleLots.length > 0;
  parkingGrid.hidden = visibleLots.length === 0;
  parkingGrid.innerHTML = visibleLots.map((lot) => `
      <article class="parking-card">
      <div class="card-topline">
        <span class="type-tag ${getCardTypeClass(lot)}">${escapeHtml(lot.typeLabel)}</span>
        <span class="distance-tag">${escapeHtml(lot.distance)}</span>
      </div>
      <h3 class="card-title">${escapeHtml(lot.name)}</h3>
      <p class="card-address" title="${escapeHtml(lot.address)}">${escapeHtml(lot.address)}</p>
      <div class="card-divider"></div>
      <div class="card-meta"><span>${escapeHtml(lot.priceLabel)}</span><span class="card-price">${lot.price == null ? "공식 안내 확인" : `${lot.price.toLocaleString("ko-KR")}원 / 시간`}</span></div>
      <p class="capacity-label">총 주차면 <strong>${escapeHtml(lot.capacity.split(" · ")[0])}</strong></p>
      <p class="availability-unavailable"><span aria-hidden="true">◷</span> 실시간 빈자리 정보 없음</p>
      <div class="card-bottom"><span class="hours-label">${escapeHtml(lot.charger.exists ? `⚡ 충전 ${lot.charger.count}` : lot.hours)}</span><a class="detail-button" href="${getLotDetailUrl(lot)}"${lot.id.startsWith("buldang-") ? "" : ' target="_blank" rel="noreferrer"'}>${lot.id.startsWith("buldang-") ? "상세 보기　→" : "지도 보기　↗"}</a></div>
    </article>
  `).join("");
}

function showParkingDetails(lotId) {
  const lot = parkingLots.find((item) => item.id === lotId);
  if (!lot) return;

  document.querySelector("#dialog-title").textContent = lot.name;
  document.querySelector("#dialog-address").textContent = lot.address;
  document.querySelector("#dialog-details").innerHTML = [
    ["주차장 종류", lot.typeLabel],
    ["위치 안내", lot.distance],
    ["이용 요금", lot.price == null ? "천안도시공사 공식 요금표 확인" : `${lot.price.toLocaleString("ko-KR")}원 / 1시간`],
    ["운영시간", lot.hours],
    ["주차 가능 대수", lot.capacity],
    ["참고", lot.note]
  ].map(([label, value]) => `<div class="detail-row"><span>${escapeHtml(label)}</span><span>${escapeHtml(value)}</span></div>`).join("");

  const directionsLink = document.querySelector("#dialog-directions");
  directionsLink.href = `https://map.naver.com/p/search/${encodeURIComponent(lot.name + " " + lot.address)}`;
  parkingDialog.showModal();
}

const lotPathMatch = window.location.pathname.match(/\/parking\/([^/]+)\/?$/);
const detailPageId = document.querySelector("#home")?.dataset.parkingLot;
const selectedLotId = detailPageId || (lotPathMatch
  ? decodeURIComponent(lotPathMatch[1])
  : new URLSearchParams(window.location.search).get("lot"));
const selectedLot = parkingLots.find((lot) => lot.id === selectedLotId);

if (selectedLot) {
  renderParkingDetailPage(selectedLot);
} else {
  initializeHomepage();
}