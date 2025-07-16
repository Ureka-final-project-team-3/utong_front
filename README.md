# 📱 U-Tong: 데이터 거래 플랫폼
<img width="1440" height="1024" alt="시작" src="https://github.com/user-attachments/assets/da4b70ab-1292-4bca-932b-3f8565d3c794" />

U-Tong은 사용자가 자신의 데이터를 주식 방식으로 쉽게 거래하고, 실시간 시세 변동과 다양한 거래 기능을 제공하는 웹 플랫폼입니다.


## 👥 팀원 소개

<table>
  <tr>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/u/100756731?v=4" width="100" /><br/>
      <strong>김현우</strong><br/>
      <a href="https://github.com/gusdn6288">@gusdn6288</a>
    </td>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/u/87470993?v=4" width="100" /><br/>
      <strong>유동석</strong><br/>
      <a href="https://github.com/Youdongseok">@Youdongseok</a>
    </td>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/u/196130116?v=4" width="100" /><br/>
      <strong>이채민</strong><br/>
      <a href="https://github.com/chemnida">@chemnida</a>
    </td>
  </tr>
</table>



##  주요 스택

| 구분       | 기술                                                                                                                                                      |
|------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| Frontend   |![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white) ![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white) ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)![Framer](https://img.shields.io/badge/Framer-black?style=for-the-badge&logo=framer&logoColor=blue) ![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101) ![Apache Kafka](https://img.shields.io/badge/Apache%20Kafka-000?style=for-the-badge&logo=apachekafka) ![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)  |




## 📦 프로젝트 구조
```
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


## 🔑 메인 기능

### 1️⃣ 주식형 데이터 경매/거래
- 평균가 ± 범위 내에서 자유롭게 거래
- 판매 대기, 구매 대기열 시스템
- 예약 판매/구매, 주문 취소 가능
- 거래 단위: 1GB
- 판매/구매 시 Toast 메시지 표시
- **조건 기반 거래**: 자동화된 정기적 매매 가능

### 2️⃣ 실시간 시세 변동
- Kafka + WebSocket으로 실시간 시세 스트리밍
- 실시간 차트(UI: `Recharts` 또는 `Chart.js`)
- 임계값 이상 변동 시 알림 (Toastify + Jotai)
- 알림 ON/OFF 설정 가능

### 3️⃣ 기프티콘 상점
- 판매후 수익금(포인트)를 현금화하는 방법
- 등록된 기프티콘을 구매한다.

### 4️⃣ 이벤트
- 매일 1번 이벤트 참여가능
- 룰렛이벤트 쿠폰 종류
  - 수수료 면제쿠폰
  - 포인트 할인쿠폰

### 5️⃣ 마이페이지
- 내 거래 내역, 관심 상품 표시
- 서비스가이드
- 백그라운드 알림 수신여부
- 내 기프티콘 보관함

### 6️⃣ 인증 기능
- 이메일/비밀번호 로그인
- OAuth (카카오, 네이버, 구글)
- Captcha
- 회원가입 시 요금제 자동 조회

### 7️⃣ 어드민 페이지
- 기프티콘 조회/삭제
- 회원 조회/삭제



## 📡 세부 기능

- 조건:
  - 거래 수수료는 거래액의 일정 %
  - 무제한 데이터 요금제 사용자는 판매 불가
  - 구매한 데이터 재판매 불가


## 🎯 커밋 컨벤션

- `feat`: Add a new feature
- `fix`: Bug fix
- `docs`: Documentation updates
- `style`: Code formatting, missing semicolons, cases where no code change is involved
- `refactor`: Code refactoring
- `test`: Test code, adding refactoring tests
- `build`: Build task updates, package manager updates



## 🖥️ 개발 서버 실행
```bash
npm install
npm run dev
