# 불당 주차 — 천안 불당동 공영주차장 안내

천안 불당동에 있는 공영주차장 정보를 찾아볼 수 있는 정적 웹사이트입니다. HTML, CSS, 순수 JavaScript로 만들었고 별도의 프레임워크나 빌드 과정 없이 브라우저에서 실행할 수 있습니다.

## 사이트에서 할 수 있는 일

- 천안도시공사 공식 현황에 등록된 불당 제1~제5주차장을 확인합니다.
- 주차장 이름 또는 주소를 검색하고 이름순·면수순으로 정렬합니다.
- 각 주차장의 상세 페이지에서 주소, 주차 면수, 운영 정보와 지도 길찾기를 확인합니다.
- 공식 현황에 등록된 전기차 충전기 수량과 확인 가능한 급속 충전기 정보를 살펴봅니다.
- 불당 제5주차장 상세 페이지에서 현장 사진과 사진 출처를 확인합니다.

주차장 운영 정보와 충전 정보는 바뀔 수 있습니다. 충전요금은 회원 또는 결제 방식에 따라 다를 수 있으므로 방문 전 공식 안내나 현장에서 확인해 주세요.

## 프로젝트 파일

```text
index.html                      메인 페이지
style.css                       공통 디자인과 반응형 스타일
script.js                       검색, 정렬, 목록 및 상세 정보 표시
buldang-public-parking.jpg      불당 제5주차장 사진
robots.txt                      검색 로봇 접근 안내
sitemap.xml                     검색엔진용 페이지 목록
parking/
  buldang-public/index.html     불당 제1주차장 상세
  buldang-2/index.html          불당 제2주차장 상세
  buldang-3/index.html          불당 제3주차장 상세
  buldang-4/index.html          불당 제4주차장 상세
  buldang-5/index.html          불당 제5주차장 상세
```

## 로컬에서 보기

`index.html`을 브라우저에서 열면 메인 페이지를 볼 수 있습니다. 상세 페이지는 각 주차장 폴더 안의 `index.html`을 열거나, 웹 서버를 실행한 다음 아래 경로로 접속하면 됩니다.

```text
/parking/buldang-public/index.html
/parking/buldang-2/index.html
/parking/buldang-3/index.html
/parking/buldang-4/index.html
/parking/buldang-5/index.html
```

예를 들어, Node.js가 설치된 컴퓨터에서 PowerShell 또는 터미널로 프로젝트 폴더에 이동한 후 다음 명령을 실행하면 로컬 웹 서버를 열 수 있습니다.

```powershell
npx --yes http-server .
```

표시된 로컬 주소(예: `http://localhost:8080`)를 브라우저에 입력하세요. `npx` 사용이 어렵다면 정적 파일 호스팅 서비스에 폴더 내용을 업로드하면 됩니다.

## 데이터와 출처

- 주차장명·주소·면수·주차장별 충전기 수량: [천안도시공사 공영주차장 현황](https://www.cauc.or.kr/_parking/main.asp?no=1)
- 주차요금 안내: [천안도시공사 공영주차장 요금안내](https://www.cauc.or.kr/_parking/main.asp?no=2)
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

`YOUR_DOMAIN`을 실제 주소로 바꾸기 전에는 `robots.txt`와 사이트맵을 검색엔진 제출용으로 사용할 수 없습니다. 이 저장소에는 아직 도메인 이름, 자동 빌드, 분석 도구 또는 실시간 주차·충전 API가 설정되어 있지 않습니다.