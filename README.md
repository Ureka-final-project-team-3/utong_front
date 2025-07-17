
# 📱 U-Tong: 데이터 거래 플랫폼
<img width="300" height="300" alt="image" src="https://github.com/user-attachments/assets/5f05958a-0561-47c1-a7c6-04f3a431d53a" />

U-Tong은 사용자가 자신의 데이터를 주식 방식으로 쉽게 거래하고, 실시간 시세 변동과 다양한 거래 기능을 제공하는 웹 플랫폼입니다.

##  주요 스택

| 구분       | 기술                                                                                                                                                      |
|------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| Frontend   |![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white) ![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white) ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)![Framer](https://img.shields.io/badge/Framer-black?style=for-the-badge&logo=framer&logoColor=blue) ![Apache Kafka](https://img.shields.io/badge/Apache%20Kafka-000?style=for-the-badge&logo=apachekafka) ![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)  |
| Backend   |![Spring](https://img.shields.io/badge/spring-%236DB33F.svg?style=for-the-badge&logo=spring&logoColor=white)![Apache Kafka](https://img.shields.io/badge/Apache%20Kafka-000?style=for-the-badge&logo=apachekafka) ![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)![MySQL](https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white)![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens) |




## 프로젝트 구조
<details>
  <summary> front-end </summary>

```
src
├───apis
├───assets
│   ├───icon
│   └───image
├───components
│   ├───BackButton
│   ├───common
│   └───NavigationBar
├───layout
├───pages
│   ├───AlarmPage
│   ├───AuthPage
│   ├───ChargePage
│   ├───CouponPage
│   ├───EditProfilePage
│   ├───EventPage
│   ├───HistoryPage
│   ├───LiveChartPage
│   │   ├───components
│   │   └───mock
│   ├───MainPage
│   ├───MyPage
│   ├───NotFoundPage
│   ├───PointChargePage
│   ├───ServiceGuidePage
│   ├───StartPage
│   ├───StoragePage
│   ├───TestPage
│   ├───TradeHistoryPage
│   └───TradePage
│       ├───BuyDataPage
│       │   └───components
│       ├───components
│       └───SellDataPage
│           └───components
├───router
└───utils
```
</details>

<details>
  <summary> back-end 파일구조 </summary>

### back-end
```
├─main
│  ├─java
│  │  └─com
│  │      └─ureka
│  │          └─team3
│  │              └─utong_backend
│  │                  ├─auth
│  │                  │  ├─controller
│  │                  │  ├─dto
│  │                  │  ├─entity
│  │                  │  ├─filter
│  │                  │  ├─repository
│  │                  │  ├─service
│  │                  │  ├─test
│  │                  │  └─util
│  │                  │      ├─config
│  │                  │      └─oauth
│  │                  ├─common
│  │                  │  ├─dto
│  │                  │  ├─exception
│  │                  │  │  └─business
│  │                  │  └─handler
│  │                  ├─config
│  │                  ├─coupon
│  │                  │  ├─controller
│  │                  │  ├─dto
│  │                  │  ├─entity
│  │                  │  ├─repository
│  │                  │  └─service
│  │                  ├─datatrade
│  │                  │  ├─controller
│  │                  │  ├─dto
│  │                  │  ├─entity
│  │                  │  ├─enums
│  │                  │  ├─facade
│  │                  │  ├─handler
│  │                  │  ├─processor
│  │                  │  ├─repository
│  │                  │  ├─service
│  │                  │  ├─utils
│  │                  │  └─validator
│  │                  ├─gift
│  │                  │  ├─controller
│  │                  │  ├─dto
│  │                  │  ├─entity
│  │                  │  ├─repository
│  │                  │  └─service
│  │                  ├─line
│  │                  │  ├─controller
│  │                  │  ├─dto
│  │                  │  ├─entity
│  │                  │  ├─repository
│  │                  │  └─service
│  │                  ├─mypage
│  │                  │  ├─controller
│  │                  │  ├─dto
│  │                  │  ├─entity
│  │                  │  ├─repository
│  │                  │  └─service
│  │                  ├─plan
│  │                  │  └─entity
│  │                  ├─price
│  │                  │  ├─controller
│  │                  │  ├─dto
│  │                  │  ├─entity
│  │                  │  ├─repository
│  │                  │  └─service
│  │                  ├─roulette
│  │                  │  ├─controller
│  │                  │  ├─dto
│  │                  │  ├─entity
│  │                  │  ├─repository
│  │                  │  ├─service
│  │                  │  └─util
│  │                  └─toss
│  │                      ├─config
│  │                      ├─controller
│  │                      ├─dto
│  │                      └─service
│  └─resources
│      └─static
└─test
    └─java
        └─com
            └─ureka
                └─team3
                    └─utong_backend
                        ├─coupon
                        │  └─service
                        ├─datatrade
                        │  ├─repository
                        │  └─service
                        ├─gift
                        │  └─service
                        ├─line
                        │  └─service
                        ├─mypage
                        │  └─service
                        └─price
                            └─service

```
</details>


<details>
  <summary> admin 파일구조 </summary>
  
```
유통 어드민
├─main
│  ├─java
│  │  └─ureka
│  │      └─team3
│  │          └─utong_admin
│  │              ├─auth
│  │              │  ├─config
│  │              │  ├─controller
│  │              │  ├─entity
│  │              │  ├─repository
│  │              │  └─service
│  │              ├─code
│  │              │  ├─controller
│  │              │  ├─dto
│  │              │  ├─entity
│  │              │  ├─repository
│  │              │  └─service
│  │              ├─common
│  │              │  ├─dto
│  │              │  ├─exception
│  │              │  │  └─business
│  │              │  └─handler
│  │              ├─coupon
│  │              │  ├─controller
│  │              │  ├─dto
│  │              │  ├─entity
│  │              │  ├─repository
│  │              │  └─service
│  │              ├─gifticon
│  │              │  ├─controller
│  │              │  ├─dto
│  │              │  │  ├─request
│  │              │  │  └─response
│  │              │  ├─entity
│  │              │  ├─repository
│  │              │  └─service
│  │              ├─groupcode
│  │              │  ├─controller
│  │              │  ├─dto
│  │              │  ├─entity
│  │              │  ├─repository
│  │              │  └─service
│  │              ├─price
│  │              │  ├─controller
│  │              │  ├─dto
│  │              │  ├─entity
│  │              │  ├─repository
│  │              │  └─service
│  │              ├─roullette
│  │              │  ├─controller
│  │              │  ├─dto
│  │              │  ├─entity
│  │              │  ├─repository
│  │              │  └─service
│  │              ├─s3
│  │              │  ├─config
│  │              │  └─service
│  │              └─user
│  │                  ├─controller
│  │                  ├─dto
│  │                  ├─entity
│  │                  ├─repository
│  │                  └─service
│  └─resources
│      └─templates
└─test
    └─java
        └─ureka
            └─team3
                └─utong_admin
                    ├─code
                    │  ├─controller
                    │  └─service
                    ├─gifticon
                    │  ├─controller
                    │  └─service
                    ├─groupcode
                    │  ├─controller
                    │  └─service
                    ├─price
                    │  ├─controller
                    │  └─service
                    └─s3
                        └─service
```
</details>


## 메인 기능

### 1 주식형 데이터 경매/거래
- 평균가 ± 범위 내에서 자유롭게 거래
- 판매 대기, 구매 대기열 시스템
- 예약 판매/구매, 주문 취소 가능
- 거래 단위: 1GB
- 판매/구매 시 Toast 메시지 표시
- **조건 기반 거래**: 자동화된 정기적 매매 가능

### 2 실시간 시세 변동
- Kafka + WebSocket으로 실시간 시세 스트리밍
- 실시간 차트(UI: `Recharts` 또는 `Chart.js`)
- 임계값 이상 변동 시 알림 (Toastify + Jotai)
- 알림 ON/OFF 설정 가능

### 3 기프티콘 상점
- 판매후 수익금(포인트)를 현금화하는 방법
- 등록된 기프티콘을 구매한다.

### 4 이벤트
- 매일 1번 이벤트 참여가능
- 룰렛이벤트 쿠폰 종류
  - 수수료 면제쿠폰
  - 포인트 할인쿠폰

### 5 마이페이지
- 내 거래 내역, 관심 상품 표시
- 서비스가이드
- 백그라운드 알림 수신여부
- 내 기프티콘 보관함

### 6 인증 기능
- 이메일/비밀번호 로그인
- OAuth (카카오, 네이버, 구글)
- Captcha
- 회원가입 시 요금제 자동 조회

### 7 어드민 페이지
- 기프티콘 조회/삭제
- 회원 조회/삭제



## utong 정책

- 조건:
  - 거래 수수료는 거래액의 일정 %
  - 무제한 데이터 요금제 사용자는 판매 불가
  - 구매한 데이터 재판매 불가


## 커밋 컨벤션

- `feat`: Add a new feature
- `fix`: Bug fix
- `docs`: Documentation updates
- `style`: Code formatting, missing semicolons, cases where no code change is involved
- `refactor`: Code refactoring
- `test`: Test code, adding refactoring tests
- `build`: Build task updates, package manager updates



## 개발 서버 실행
```bash
npm install
npm run dev
```


## 팀원소개
<table>
  <thead>
    <tr>
      <th align="center">소속</th>
      <th align="center">이름</th>
      <th align="center" width="130">역할</th>
      <th align="left">주요 담당 업무 및 책임</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center" rowspan="3"><strong>프론트엔드</strong></td>
      <td align="center" width="150">
        <img src="https://avatars.githubusercontent.com/u/100756731?v=4" width="60" /><br/>
        <strong>김현우</strong><br/>
        <a href="https://github.com/gusdn6288">@gusdn6288</a>
      </td>
      <td align="center">프론트<br/>팀장</td>
      <td>마이페이지, 충전페이지, 정보수정, 마일리지상점, 기프티콘 보관함, 쿠폰함, 거래내역페이지 구현</td>
    </tr>
    <tr>
      <td align="center" width="150">
        <img src="https://avatars.githubusercontent.com/u/87470993?v=4" width="60" /><br/>
        <strong>유동석</strong><br/>
        <a href="https://github.com/Youdongseok">@Youdongseok</a>
      </td>
      <td align="center">차트<br/>개발자</td>
      <td>실시간 시세 차트 개발 및 구현, 데이터 판매/구매 거래 기능 설계 및 개발, 이벤트 페이지 구현</td>
    </tr>
    <tr>
      <td align="center" width="150">
        <img src="https://avatars.githubusercontent.com/u/196130116?v=4" width="60" /><br/>
        <strong>이채민</strong><br/>
        <a href="https://github.com/chemnida">@chemnida</a>
      </td>
      <td align="center">디자인<br/>리더</td>
      <td>스타트, 메인, 로그인, 회원가입, 아이디·비밀번호 찾기, 비밀번호 재설정, 알림 페이지 UI 구현 및 API 연동</td>
    </tr>
    <tr>
      <td align="center" rowspan="4"><strong>백엔드</strong></td>
      <td align="center" width="150">
        <img src="https://avatars.githubusercontent.com/u/50442066?v=4" width="60" /><br/>
        <strong>손민혁</strong><br/>
        <a href="https://github.com/Sonminhyeok">@Sonminhyeok</a>
      </td>
      <td align="center">백엔드<br/>팀장</td>
      <td>Spring Security, OAuth2를 사용한 인증/인가, 선착순 이벤트 쿠폰 발급</td>
    </tr>
    <tr>
      <td align="center" width="150">
        <img src="https://avatars.githubusercontent.com/u/80302833?v=4" width="60" /><br/>
        <strong>신수현</strong><br/>
        <a href="https://github.com/suhyun9764">@suhyun9764</a>
      </td>
      <td align="center">기술<br/>리더</td>
      <td>개발 환경 인프라 구축, 거래/판매 기능 구현, 실시간 시세 및 거래 데이터(SSE, Kafka) 기능 구현</td>
    </tr>
    <tr>
      <td align="center" width="150">
        <img src="https://avatars.githubusercontent.com/u/99180728?v=4" width="60" /><br/>
        <strong>장승범</strong><br/>
        <a href="https://github.com/JSeungBeom">@JSeungBeom</a>
      </td>
      <td align="center">배포<br/>담당자</td>
      <td>개발 환경 인프라 구축 (EC2), 어드민 페이지 구축, 스케줄러 구현</td>
    </tr>
    <tr>
      <td align="center" width="150">
        <img src="https://avatars.githubusercontent.com/u/198446498?v=4" width="60" /><br/>
        <strong>이도연</strong><br/>
        <a href="https://github.com/doyeonLee-Luna">@doyeonLee-Luna</a>
      </td>
      <td align="center">API<br/>담당자</td>
      <td>마이페이지 구현, Payment Service API 연동 결제 시스템 구현, Front-end와 API 연동 담당</td>
    </tr>
  </tbody>
</table>

