# 불당 주차 — 천안 불당동 공영주차장 안내

천안도시공사 공식 현황을 바탕으로 천안시 공영주차장 전체 목록을 제공하는 HTML·CSS·JavaScript 사이트입니다. 현재 화면 데이터는 공식 현황 55개 항목(유료 노외 15, 무료 노상 9, 무료 노외 31)에 임시무료 항목을 포함해 구성되어 있어 분류·개수는 공식 자료 변경에 따라 갱신해야 합니다. Node.js 서버는 게시판 문의를 SQLite 데이터베이스에 저장합니다.

## 사이트에서 할 수 있는 일

- 천안도시공사 공식 현황에 등록된 유료·무료 공영주차장 목록을 확인합니다.
- 주차장 이름 또는 주소를 검색하고 이름순·면수순으로 정렬합니다.
- 주차장을 즐겨찾기에 추가하고 목록/지도 검색 보기로 전환합니다. 즐겨찾기는 현재 브라우저의 localStorage에만 저장되며 서버나 다른 기기와 동기화되지 않습니다.
- 메인 화면에서 빠른 검색 칩과 모바일 접이식 내비게이션으로 원하는 정보를 빠르게 찾습니다.
- 각 주차장의 상세 페이지에서 주소, 주차 면수, 운영 정보와 지도 길찾기를 확인합니다.
- 거리 측정 페이지에서 브라우저 위치를 허용하면 불당 제1주차장 대표점까지의 근사 직선거리를 계산합니다. Kakao 지도 두 점 측정은 JavaScript 키가 설정된 경우 사용할 수 있습니다.
- 공식 현황에 등록된 전기차 충전기 수량과 확인 가능한 급속 충전기 정보를 살펴봅니다.
- 천안중앙교회 Tesla 수퍼차저 목록 및 별도 상세 안내 페이지를 제공합니다.
- 불당 제5주차장 상세 페이지에서 현장 사진과 사진 출처를 확인합니다.
- 문의 게시판에서 문의를 작성하고 SQLite에 저장·조회합니다.
- 이용 안내에서 주차장·거리 측정 FAQ를 확인하고, 문의 게시판에서 주차 정보 정정/제보를 접수합니다. 제보는 공식 자료 확인 후 수동 검토해야 합니다.
- 회원가입·로그인 폼의 HTML/CSS 시안을 확인합니다. 계정 인증과 저장 기능은 연결되어 있지 않습니다.

주차장 운영 정보와 충전 정보는 바뀔 수 있습니다. 공식 무료 노상주차장 면수는 도로 사정에 따라 변동될 수 있으며, 충전요금은 회원 또는 결제 방식에 따라 다를 수 있으므로 방문 전 공식 안내나 현장에서 확인해 주세요.

## 프로젝트 파일

```text
index.html                      메인 페이지
style.css                       공통 디자인과 반응형 스타일
script.js                       검색, 정렬, 목록 및 상세 정보 표시
server.mjs                      웹 서버, 문의 API와 SQLite 연결
package.json                    Node.js 실행 설정
.gitignore                      로컬 SQLite 데이터 파일 제외
database/users.sql              회원 테이블 스키마 초안 (미적용)
buldang-public-parking.jpg      불당 제5주차장 사진
robots.txt                      검색 로봇 접근 안내
sitemap.xml                     검색엔진용 페이지 목록
parking/
  buldang-public/index.html     불당 제1주차장 상세
  buldang-2/index.html          불당 제2주차장 상세
  buldang-3/index.html          불당 제3주차장 상세
  buldang-4/index.html          불당 제4주차장 상세
  buldang-5/index.html          불당 제5주차장 상세
distance/
  index.html                    Three.js 거리 측정 화면
  distance.js                   브라우저 위치·직선거리·3D 장면
geocode-kakao.mjs                Kakao REST 주소 지오코딩 도구 (환경변수 키 필요)
charging/
  index.html                    천안 전기차 충전소 목록
  central-church/index.html     천안중앙교회 Tesla 수퍼차저 상세
board/
  index.html                    문의 게시판 페이지
  board.js                      문의 등록·목록 조회 API 연결
guide/
  index.html                    별도 이용 안내 페이지
account/
  signup/index.html             회원가입 화면 시안
  login/index.html              로그인 화면 시안
data/
  inquiries.sqlite              실행 시 자동 생성되는 데이터베이스
```

## SQLite와 사이트 실행

Node.js 22.13 이상이 필요합니다. 프로젝트 폴더에서 서버를 실행하세요.

```powershell
npm start
```

브라우저에서 `http://127.0.0.1:8780/`을 열면 메인 페이지, `/guide/`는 이용 안내, `/board/`는 문의 게시판, `/distance/`는 거리 측정, `/charging/`은 전기차 충전소 목록, `/charging/central-church/`는 천안중앙교회 수퍼차저 상세, `/account/signup/`은 회원가입, `/account/login/`은 로그인 화면입니다. 처음 실행할 때 `data/inquiries.sqlite` 파일과 `inquiries` 테이블이 자동 생성됩니다. Cloudflare Pages 배포본은 D1 binding을 사용합니다.

회원가입과 로그인은 Pages Function에서 D1 `users` 테이블과 연동됩니다. 비밀번호는 PBKDF2-SHA-256(Workers 지원 반복 횟수 100,000)으로 해시해 저장하며 원문은 저장하지 않습니다. 로그인 API는 자격 증명을 검증하지만 세션 쿠키·로그아웃·보호된 사용자 영역은 아직 구현되지 않아 로그인 상태가 유지되지 않습니다. 공개 운영 전에는 이메일 인증, 스팸 방지, 약관·개인정보 동의 기록, 세션 관리, 계정 삭제와 관리자 기능을 추가로 구성해야 합니다.

거리 측정 페이지에는 Kakao 지도 SDK용 두 지점 마커·선·Polyline 거리 계산 UI가 있습니다. 실제 지도를 활성화하려면 Kakao Developers JavaScript 키와 허용 도메인이 필요합니다. 키는 HTML/브라우저에 노출되는 공개 앱 키이므로 Kakao Developers에서 도메인을 제한하고 GitHub에 실제 키를 커밋하지 않아야 합니다. 현재 배포에는 키가 없어 지도 영역은 설정 안내를 표시합니다. 지도 두 지점 간 길이는 직선거리이며 실제 도로 경로가 아닙니다. 위치 거리 계산은 불당 제1주차장 대표 좌표만 지원하고, Geolocation 좌표는 서버에 저장하지 않습니다. 거리 페이지는 현재 Three.js가 아닌 Kakao 지도 기반으로 구성되어 있습니다.

Kakao 지도 사용 준비: Kakao Developers에서 앱을 만들고 플랫폼에 `https://hello-world-e90.pages.dev`와 실제 테스트 도메인을 등록한 뒤 JavaScript 키를 발급합니다. 키는 브라우저에 노출되는 공개 키이므로 Kakao Developers에서 허용 도메인을 제한하고 저장소에는 저장하지 않습니다. Cloudflare Pages 환경변수 `KAKAO_JAVASCRIPT_KEY`로 설정하면 Pages Worker의 `/api/config`가 런타임에 키를 제공하고 지도 SDK를 활성화합니다. 키가 비어 있거나 등록 도메인이 맞지 않으면 지도 설정 안내를 표시합니다. 실제 지점 간 선 길이는 직선거리이며 도로 경로가 아닙니다.

공영주차장 주소를 Kakao Local API로 좌표화하려면 로컬에서 Kakao Developers REST 키를 환경변수로 설정하고 `node geocode-kakao.mjs`를 실행합니다. 스크립트는 매칭이 불완전하면 좌표 JSON을 생성하지 않습니다. 생성 파일 `data/parking-coordinates.json`은 로컬/개인 데이터로 취급해 Git에 올리지 않습니다. 좌표를 전체 사용자에게 제공하려면 권리·이용조건을 확인하고, 검수된 공개 가능한 좌표 데이터만 별도 배포 설정에 반영해야 합니다. REST API 키를 프런트엔드나 저장소에 넣지 마세요.

`database/users.sql`은 회원가입용 테이블 설계 문서입니다. 실제 D1 테이블은 `migrations/0002_create_users.sql`로 생성됩니다. 인증 API 경로는 `/api/auth/signup` 및 `/api/auth/login`입니다.

공영주차장 카드에는 천안도시공사 공식 현황의 총 주차면수와 별도로 “실시간 빈자리 정보 없음”을 표시합니다. 공식 현황 및 전국 주차장정보 표준데이터는 현재 잔여면수가 아닌 시설 규모·운영 정보이므로, 실시간 API가 공식 제공되기 전까지 빈자리 숫자를 추정하지 않습니다.

메인페이지 지도 보기는 좌표 지도나 실시간 교통·잔여면수를 제공하지 않습니다. 필터된 주차장 주소를 외부 지도 검색 링크로 보여줍니다. 즐겨찾기는 로그인 계정과 연결되지 않습니다.

```powershell
$env:PORT=8781; npm start
```

위 예시는 포트를 8781로 바꿔 실행합니다. SQLite는 Node.js 내장 `node:sqlite` 모듈을 사용하므로 별도 DB 서버나 npm 패키지를 설치할 필요가 없습니다.

## 데이터와 출처

- 주차장명·주소·면수·주차장별 충전기 수량(55곳): [천안도시공사 공영주차장 현황](https://www.cauc.or.kr/_parking/main.asp?no=1)
- 주차요금 안내: [천안도시공사 공영주차장 요금안내](https://www.cauc.or.kr/_parking/main.asp?no=2)
- 공공 주차장 정보 참고: [공공데이터포털 주차장정보 표준데이터](https://www.data.go.kr/data/15012896/standard.do). 사설 주차장 실시간 혼잡 정보 API는 현재 연동되어 있지 않습니다.
- 천안중앙교회 수퍼차저 위치·운영 정보는 Tesla 공식 [충전소 찾기](https://www.tesla.com/findus)에서 확인하세요. 페이지에 기재한 V3 6기·최대 250kW 정보는 공개 검색으로 확인한 값이며 요금·이용 가능 차량·출입 조건은 Tesla 앱/현장 기준으로 확인해야 합니다.
- 제1·제3주차장 충전소 상세 정보: 각 상세 페이지의 해피차저 출처 링크를 참고하세요.
- 제5주차장 사진: [충청일보 기사](https://www.ccdailynews.com/news/articleView.html?idxno=2066845). 사진은 출처 및 저작권 표시를 유지하세요.

공식 주차장 표에 충전기가 표시되지 않은 장소는 “충전기 없음”으로 단정하지 않고, “공식 현황에 등록된 충전기 없음”으로 표현합니다. 충전요금 및 실시간 상태는 실시간 API 연동 정보가 아닙니다.

## 검색엔진 설정 및 배포

`robots.txt`는 모든 검색 로봇의 사이트 접근을 허용하고 `sitemap.xml` 위치를 안내합니다. 지금은 아직 공개 도메인이 정해지지 않아 두 파일에 `YOUR_DOMAIN`이라는 자리표시자를 사용하고 있습니다.

사이트를 Cloudflare Pages 같은 HTTPS 호스팅 서비스에 공개 배포한 뒤:

1. `robots.txt`의 `https://YOUR_DOMAIN/sitemap.xml`을 실제 사이트 주소로 바꿉니다.
2. `sitemap.xml`의 모든 `https://YOUR_DOMAIN/`을 실제 도메인으로 바꿉니다. 끝의 `/`는 유지합니다.
3. 사이트 루트에 `robots.txt`, `sitemap.xml`, `index.html`, `style.css`, `script.js`, 이미지 파일과 `parking/` 폴더를 함께 배포합니다.
4. 배포 후 `https://실제도메인/robots.txt`와 `https://실제도메인/sitemap.xml`이 열리는지 확인하고, 필요하면 사이트맵을 검색엔진에 제출합니다.

문의 데이터는 `inquiries` 단일 테이블에 저장됩니다. 비공개 표시는 일반 문의 목록 응답에서 본문을 제외하지만 관리자 인증·비공개 관리자 조회 화면은 아직 없습니다. 서버는 기본적으로 `127.0.0.1`에만 바인딩됩니다. 공개 운영 전에는 인증, 스팸 방지, 개인정보 보유·삭제 정책, HTTPS, 원격 접근이 가능한 Node.js 호스팅과 데이터베이스 백업을 구성해야 합니다. SQLite 파일(`data/*.sqlite`)은 Git에서 제외됩니다. Cloudflare Pages 같은 정적 호스팅에서는 Node API를 실행할 수 없습니다.

회원가입과 로그인 화면은 HTML·CSS 시안이며 실제 가입, 인증, 정보 저장은 동작하지 않습니다. 회원가입 시안에는 닉네임, 이메일, 비밀번호, 여성·남성 성별 항목만 표시하며 집주소 입력란은 없습니다. 개인정보를 실제로 입력하지 마세요.

`YOUR_DOMAIN`을 실제 주소로 바꾸기 전에는 `robots.txt`와 사이트맵을 검색엔진 제출용으로 사용할 수 없습니다. 실시간 주차 현황·충전소 API는 연결되어 있지 않습니다.