# 천안 주차

천안시 공영주차장을 찾고 이용 정보를 확인하는 웹사이트입니다. 천안도시공사 공개 현황을 바탕으로 주차장 목록을 제공하며, 검색·필터·정렬·즐겨찾기와 지도 앱 검색을 지원합니다.

## 배포 사이트

사이트는 Cloudflare Pages에서 운영합니다. 메인 페이지는 **[천안 주차 열기](https://hello-world-e90.pages.dev/)**입니다.

주요 페이지는 다음과 같습니다.

- [주차장 찾기](https://hello-world-e90.pages.dev/): 천안시 공영주차장 목록과 검색·필터
- [이용 안내](https://hello-world-e90.pages.dev/guide/): 주차 정보 및 사용 관련 안내
- [문의 게시판](https://hello-world-e90.pages.dev/board/): 문의·정보 정정 제보
- [거리 측정](https://hello-world-e90.pages.dev/distance/): 위치 권한을 이용한 직선거리 도구
- [전기차 충전소](https://hello-world-e90.pages.dev/charging/): 공영 충전소와 Tesla 수퍼차저 안내
- [Tesla 수퍼차저 상세](https://hello-world-e90.pages.dev/charging/central-church/)
- [회원가입 화면](https://hello-world-e90.pages.dev/account/signup/) · [로그인 화면](https://hello-world-e90.pages.dev/account/login/)

## 주차장 찾기 기능

메인 화면은 55개 공영주차장 정보를 보여주며 이름·주소 검색, 유료·무료·임시 무료 필터, 서북구·동남구 지역 선택, 이름순·주차면수순 정렬을 제공합니다. 즐겨찾기는 현재 브라우저의 `localStorage`에 저장되며 계정이나 다른 기기와 동기화되지 않습니다. 목록·지도 보기는 선택한 주차장의 주소를 외부 지도 검색으로 열어 줍니다.

주차면수는 총 구획 수이며 실시간 빈자리 수가 아닙니다. 현재 잔여면수 데이터는 연결되어 있지 않으므로 페이지에 임의의 실시간 숫자를 표시하지 않습니다. 요금·운영시간·노상주차 면수는 바뀔 수 있어 방문 전 공식 안내나 현장 표지판을 확인해 주세요.

## 거리 측정의 범위

브라우저 위치 권한을 허용하면 등록 좌표가 있는 목적지까지 근사 직선거리를 계산합니다. 목적지 목록은 좌표가 등록되지 않은 주차장을 “좌표 확인 필요 · 지도에서 수동 선택”으로 표시합니다. 이런 목적지에서 개략 선택판으로 얻는 숫자는 사용자가 찍은 위치를 기준으로 한 참고값이며 실제 주차장 좌표·출입구까지의 거리가 아닙니다. 전체 목적지 자동 계산에 필요한 `data/parking-coordinates.json`은 `.gitignore` 대상입니다. Kakao REST 지오코딩과 좌표 검수가 끝난 55행 파일이 있을 때 `scripts/deploy-pages.ps1`이 이를 일시적으로 `public/data/`에 복사해 Pages 정적 asset으로 포함하고, 배포 뒤 복사본을 삭제합니다. 파일이 없거나 55행이 아니면 좌표 없는 상태로 배포하고 임의 좌표는 만들지 않습니다. 주소 대표점은 공식 지도와 대조해 검수해야 하며 위치 정보는 서버에 저장하지 않습니다.

## 개발 및 실행

프런트엔드는 바닐라 HTML·CSS·JavaScript로 구성되어 별도 프런트엔드 빌드 과정이 필요하지 않습니다. 서버 기능을 로컬에서 확인하려면 Node.js 22.13 이상을 준비하고 프로젝트 루트에서 실행합니다.

```powershell
npm start
```

기본 주소는 `http://127.0.0.1:8780/`입니다. 문의 API는 Node.js 내장 `node:sqlite`로 `data/inquiries.sqlite`에 저장합니다. Cloudflare 공개 사이트는 Pages Functions/Worker와 D1을 사용합니다. 로컬 SQLite 파일은 Git에 포함하지 않습니다.

```text
index.html                         주차장 찾기 메인 화면
style.css                          공통·반응형 디자인과 모션
script.js                          주차장 데이터, 검색·필터·즐겨찾기
nav.js                             공통 메뉴 렌더링
server.mjs                         로컬 서버와 SQLite 문의 API
functions/api/                     Cloudflare Pages API 함수
migrations/                        Cloudflare D1 스키마 마이그레이션
parking/                           불당 공영주차장 상세 페이지
charging/                          전기차 충전 목록과 Tesla 상세
distance/                           거리 측정 화면과 로직
board/                              문의 게시판
guide/                              이용 안내
account/                            회원가입·로그인 화면
database/users.sql                  회원 테이블 설계 문서
geocode-kakao.mjs                   Kakao REST 지오코딩 도구
```

## 배포

GitHub 저장소는 [Sarah888828/Hello-World](https://github.com/Sarah888828/Hello-World)이며 배포 대상은 Cloudflare Pages의 `hello-world` 프로젝트입니다. 최신 좌표 파일을 포함해 배포하려면 PowerShell에서 `./scripts/deploy-pages.ps1`을 실행하세요. 스크립트는 55개 검수 좌표가 있을 때만 정적 asset으로 포함합니다. 좌표 파일이 없으면 경고를 내고, 해당 데이터 없이 정상적으로 배포합니다. 좌표 파일 준비 없이 직접 `wrangler pages deploy`를 실행하면 무시된 JSON은 배포되지 않습니다.

검색엔진 설정은 `robots.txt`와 `sitemap.xml`을 사용합니다. 현재 사이트 도메인은 `https://hello-world-e90.pages.dev/`입니다. 사이트맵과 robots 파일을 수정할 때는 이 주소와 공개 페이지 경로가 일치하는지 확인하세요.

## 회원·문의 기능 상태

문의 내용은 D1의 `inquiries` 테이블에 저장됩니다. 비공개 문의는 공개 목록 API에서 행 전체를 제외하며, 등록 직후 API도 문의 원문을 되돌려주지 않습니다. 관리자 인증과 비공개 문의 조회 화면은 제공하지 않으므로 민감한 개인정보는 입력하지 마세요.

회원가입과 로그인 API는 Cloudflare Pages Functions와 D1의 `users` 테이블을 사용합니다. 비밀번호는 PBKDF2-SHA-256으로 해시해 저장하며, 로그인 성공 후에도 세션 쿠키·로그아웃·보호된 사용자 영역은 구현되어 있지 않아 로그인 상태가 유지되지 않습니다. `database/users.sql`은 참고용 설계 문서입니다.

로그인 API는 D1의 `login_rate_limits` 테이블로 IP당 60초에 최대 30회 요청을 제한합니다. IP 자체 대신 SHA-256 해시를 저장하며, 제한을 넘으면 `429`와 `Retry-After`를 반환합니다. 미등록 이메일도 고정 dummy hash로 PBKDF2 검증을 수행해 잘못된 비밀번호와 같은 `401` 본문을 반환합니다. 이는 단일 D1 데이터베이스를 기준으로 한 제한이며, IP 변경·분산 공격은 별도 방어가 필요하므로 공개 운영에서는 WAF 규칙, CAPTCHA와 추가 모니터링도 검토하세요.

## 데이터 출처와 보안

- 주차장 이름·주소·총 면수·충전기 표기: [천안도시공사 공영주차장 현황](https://www.cauc.or.kr/_parking/main.asp?no=1)
- 주차 요금: [천안도시공사 요금 안내](https://www.cauc.or.kr/_parking/main.asp?no=2)
- 실시간 공공·민간 충전 정보: [무공해차 통합누리집](https://www.ev.or.kr/nportal/monitor/evMap.do)
- Tesla 수퍼차저 운영·요금·차량 호환: [Tesla 충전소 찾기](https://www.tesla.com/findus)
- 불당 제5주차장 사진: [충청일보 기사](https://www.ccdailynews.com/news/articleView.html?idxno=2066845)

API 키나 비밀번호는 소스 코드·GitHub·이 README에 저장하지 마세요. Kakao 지오코딩을 실행할 때는 `KAKAO_REST_KEY` 환경변수를 사용하고, 주소 좌표는 실제 주차장 위치와 대조해 검수해야 합니다. 사이트는 공식 자료에 없는 실시간 주차 가능 대수나 혼잡도를 추정해 표시하지 않습니다.