# 온길 FE (12th-OnGil-FE)

시니어 친화 쇼핑 경험을 목표로 하는 Next.js App Router 기반 프론트엔드 프로젝트입니다.  
상품 탐색, 장바구니, 주문/결제, 리뷰, 마이페이지, 웹 푸시 알림까지 한 흐름으로 구성되어 있습니다.

<p align="left">
  <a href="https://nextjs.org/">
    <img src="https://img.shields.io/badge/Next.js-16.1.1-000000?logo=nextdotjs&logoColor=white" alt="Next.js 16.1.1" />
  </a>
  <a href="https://react.dev/">
    <img src="https://img.shields.io/badge/React-19.2.3-61DAFB?logo=react&logoColor=000000" alt="React 19.2.3" />
  </a>
  <a href="https://www.typescriptlang.org/">
    <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white" alt="TypeScript 5" />
  </a>
  <a href="https://tailwindcss.com/">
    <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" />
  </a>
  <a href="https://authjs.dev/">
    <img src="https://img.shields.io/badge/NextAuth-v5_beta-000000?logo=auth0&logoColor=white" alt="NextAuth v5 beta" />
  </a>
  <a href="https://pnpm.io/">
    <img src="https://img.shields.io/badge/pnpm-Workspace-F69220?logo=pnpm&logoColor=white" alt="pnpm workspace" />
  </a>
</p>

## 목차

- [프로젝트 개요](#프로젝트-개요)
- [주요 화면](#주요-화면)
- [기술 스택](#기술-스택)
- [빠른 시작](#빠른-시작)
- [환경 변수](#환경-변수)
- [스크립트](#스크립트)
- [프로젝트 구조](#프로젝트-구조)
- [라우트 맵](#라우트-맵)
- [API Route Handlers](#api-route-handlers)
- [서버 액션 구조](#서버-액션-구조)
- [아키텍처 개요](#아키텍처-개요)
- [인증 흐름](#인증-흐름)
- [검색/알림/PWA 동작](#검색알림pwa-동작)
- [개발 규칙](#개발-규칙)
- [트러블슈팅](#트러블슈팅)
- [현재 상태/제약](#현재-상태제약)

## 프로젝트 개요

- 목적: 시니어 사용성을 고려한 커머스 프론트엔드 제공
- 핵심 도메인: 카테고리/상품 탐색, 장바구니, 주문, 리뷰, 마이페이지
- 사용자 흐름:

```text
홈/카테고리/검색 -> 상품 상세 -> 장바구니/바로구매 -> 결제 -> 주문/리뷰 -> 마이페이지
```

## 주요 화면

### 대표 화면

<p align="center">
  <img width="420" alt="온길 대표 화면" src="https://github.com/user-attachments/assets/9b010b44-814a-4000-b23b-9d0be0ba8efa" />
</p>

## 기술 스택

| 구분            | 내용                                         |
| --------------- | -------------------------------------------- |
| Framework       | Next.js 16.1.1 (App Router)                  |
| UI Runtime      | React 19.2.3                                 |
| Language        | TypeScript 5 (`strict: true`)                |
| Styling         | Tailwind CSS v4 + tw-animate-css             |
| Auth            | NextAuth v5 beta (`next-auth@5.0.0-beta.30`) |
| Form/Validation | React Hook Form + Zod                        |
| State           | Zustand                                      |
| UI Base         | Radix UI                                     |
| Utility         | clsx, class-variance-authority, date-fns     |
| PWA/Push        | Service Worker, web-push                     |

## 빠른 시작

### 1) 요구사항

- Node.js 20+
- pnpm

### 2) 설치

```bash
pnpm install
```

### 3) 환경 변수 파일 생성

루트에 `.env.local` 파일 생성 후 아래 값 설정:

```bash
BACKEND_API_URL=http://localhost:8080
AUTH_SECRET=replace-with-strong-secret
NEXT_PUBLIC_AUTH_KAKAO_ID=your-kakao-client-id
NEXT_PUBLIC_AUTH_GOOGLE_ID=your-google-client-id
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key
```

### 4) 개발 서버 실행

```bash
pnpm dev
```

브라우저: `http://localhost:3000`

### 5) 빌드/실행/린트

```bash
pnpm build
pnpm start
pnpm lint
```

## 환경 변수

| 키                             | 필수             | 사용 위치                                                             | 설명                   |
| ------------------------------ | ---------------- | --------------------------------------------------------------------- | ---------------------- |
| `BACKEND_API_URL`              | Yes              | `src/lib/api-client.ts`, `src/lib/public-api-client.ts`, `auth.ts` 등 | 백엔드 API 기본 URL    |
| `AUTH_SECRET`                  | Yes              | `auth.ts`                                                             | NextAuth 시크릿        |
| `NEXT_PUBLIC_AUTH_KAKAO_ID`    | Yes              | `src/components/login/login-form.tsx`                                 | 카카오 OAuth Client ID |
| `NEXT_PUBLIC_AUTH_GOOGLE_ID`   | Yes              | `src/components/login/login-form.tsx`                                 | 구글 OAuth Client ID   |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | Push 사용 시 Yes | `src/app/actions/push.ts`, `src/components/pwa/notification-test.tsx` | 웹 푸시 공개키         |
| `VAPID_PRIVATE_KEY`            | Push 사용 시 Yes | `src/app/actions/push.ts`                                             | 웹 푸시 개인키         |

## 스크립트

`package.json` 기준:

- `pnpm dev`: 개발 서버 실행
- `pnpm build`: 프로덕션 빌드
- `pnpm start`: 프로덕션 서버 실행
- `pnpm lint`: ESLint 실행

## 프로젝트 구조

### 루트 구조

```text
.
├─ src/                         # 애플리케이션 소스
├─ public/                      # 정적 리소스 및 SW
├─ auth.ts                      # NextAuth 상세 설정 (providers/callbacks)
├─ auth.config.ts               # 접근 제어 설정
├─ proxy.ts                     # Next.js proxy 기반 보호 라우팅
├─ next.config.ts               # Next.js 설정 (headers/reactCompiler/images)
├─ tsconfig.json                # TypeScript 설정
└─ package.json                 # 스크립트/의존성
```

### `src` 상세

```text
src
├─ app/                         # App Router 엔트리
│  ├─ layout.tsx                # 전역 레이아웃 (SW 등록, CartDataFetcher)
│  ├─ page.tsx                  # 홈
│  ├─ @modal/                   # 인터셉팅 모달 라우트
│  ├─ actions/                  # 서버 액션 도메인 레이어
│  ├─ api/                      # Route Handlers
│  ├─ address/                  # 배송지 페이지군
│  ├─ auth/                     # OAuth 콜백 페이지
│  ├─ body-info/                # 체형 정보
│  ├─ cart/                     # 장바구니
│  ├─ category/                 # 카테고리
│  ├─ login/                    # 로그인
│  ├─ me/                       # 마이페이지
│  ├─ orders/                   # 주문 목록/상세/취소
│  ├─ payment/                  # 결제/완료
│  ├─ product/                  # 상품 상세
│  ├─ review/                   # 리뷰 작성
│  ├─ reviews/                  # 리뷰 관리/상세
│  └─ search/                   # 검색
|
├─ components/                  # 도메인 컴포넌트
│  ├─ ui/                       # 공통 UI primitive
│  ├─ product/
│  ├─ category/
│  ├─ cart/
│  ├─ reviews/
│  ├─ search-bar/
│  ├─ pwa/
│  └─ ...
├─ lib/                         # API 클라이언트/유틸/i18n/SSE
├─ store/                       # Zustand store (cart, notifications)
├─ schemas/                     # Zod schema
├─ types/                       # 공통/도메인 타입
├─ locales/                     # ko/en 번역 리소스
├─ hooks/                       # 커스텀 훅
├─ config/                      # 화면/탭 설정값
└─ mocks/                       # 목 데이터
```

## 라우트 맵

### 주요 페이지 라우트

| 경로                         | 파일                                         | 설명                    |
| ---------------------------- | -------------------------------------------- | ----------------------- |
| `/`                          | `src/app/page.tsx`                           | 홈 (배너/추천/브랜드)   |
| `/login`                     | `src/app/login/page.tsx`                     | 로그인                  |
| `/auth/callback/[provider]`  | `src/app/auth/callback/[provider]/page.tsx`  | OAuth 콜백 처리         |
| `/search`                    | `src/app/search/page.tsx`                    | 검색 결과               |
| `/category`                  | `src/app/category/page.tsx`                  | 카테고리 홈             |
| `/category/[parentId]`       | `src/app/category/[parentId]/page.tsx`       | 부모 카테고리           |
| `/category/[parentId]/[id]`  | `src/app/category/[parentId]/[id]/page.tsx`  | 서브 카테고리 상품 목록 |
| `/product/[id]`              | `src/app/product/[id]/page.tsx`              | 상품 상세               |
| `/cart`                      | `src/app/cart/page.tsx`                      | 장바구니                |
| `/payment`                   | `src/app/payment/page.tsx`                   | 결제                    |
| `/payment/complete`          | `src/app/payment/complete/page.tsx`          | 결제 완료               |
| `/orders`                    | `src/app/orders/page.tsx`                    | 주문 목록               |
| `/orders/[orderId]`          | `src/app/orders/[orderId]/page.tsx`          | 주문 상세               |
| `/orders/[orderId]/cancel`   | `src/app/orders/[orderId]/cancel/page.tsx`   | 주문 취소               |
| `/reviews`                   | `src/app/reviews/page.tsx`                   | 리뷰 관리               |
| `/reviews/detail/[reviewId]` | `src/app/reviews/detail/[reviewId]/page.tsx` | 리뷰 상세               |
| `/review/write/[reviewId]`   | `src/app/review/write/[reviewId]/page.tsx`   | 리뷰 작성               |
| `/me`                        | `src/app/me/page.tsx`                        | 마이페이지              |
| `/me/edit`                   | `src/app/me/edit/page.tsx`                   | 회원정보 편집           |
| `/me/edit/body-info`         | `src/app/me/edit/body-info/page.tsx`         | 체형정보 편집           |
| `/me/wishlist`               | `src/app/me/wishlist/page.tsx`               | 찜 목록                 |
| `/address`                   | `src/app/address/page.tsx`                   | 배송지 목록             |
| `/address/new`               | `src/app/address/new/page.tsx`               | 배송지 등록             |
| `/address/[addressId]`       | `src/app/address/[addressId]/page.tsx`       | 배송지 수정             |

### 접근 보호 경로

`auth.config.ts` / `proxy.ts` 기준 보호 대상:

- `/` : 메인 홈 화면
- `/me` 및 하위 경로
- `/reviews` 및 하위 경로

## API Route Handlers

| 경로                              | Method    | 파일                                              | 역할                      |
| --------------------------------- | --------- | ------------------------------------------------- | ------------------------- |
| `/api/auth/[...nextauth]`         | GET, POST | `src/app/api/auth/[...nextauth]/route.ts`         | NextAuth 핸들러           |
| `/api/search/autocomplete`        | GET       | `src/app/api/search/autocomplete/route.ts`        | 자동완성 프록시           |
| `/api/search/recommend`           | GET       | `src/app/api/search/recommend/route.ts`           | 추천 검색어 프록시        |
| `/api/notifications/subscribe`    | GET       | `src/app/api/notifications/subscribe/route.ts`    | 알림 SSE 프록시           |
| `/api/reviews/images`             | POST      | `src/app/api/reviews/images/route.ts`             | 리뷰 이미지 업로드 프록시 |
| `/api/reviews/[reviewId]/details` | GET       | `src/app/api/reviews/[reviewId]/details/route.ts` | 리뷰 상세 조회 프록시     |

## 서버 액션 구조

`src/app/actions`는 도메인별 백엔드 연동 레이어입니다.

| 파일                              | 주요 함수 예시                                                                               |
| --------------------------------- | -------------------------------------------------------------------------------------------- |
| `address.ts`                      | `getAddresses`, `registerAddress`, `updateAddress`, `deleteAddress`                          |
| `cart.ts`                         | `getCartItems`, `addToCart`, `updateCartItem`, `getCartCount`                                |
| `order.ts`                        | `createOrderFromCart`, `createOrderFromProduct`, `getOrderDetail`, `cancelOrder`             |
| `product.ts`                      | `getProductDetail`, `getSimilarProducts`, `getProductOptions`                                |
| `review.ts`                       | `initPendingReviewAction`, `patchReviewStep*`, `submitReviewAction`, `getReviewDetailAction` |
| `wishlist.ts`                     | `addToWishlist`, `deleteFromWishlist`, `getMyWishlist`                                       |
| `user.ts`                         | `getUserInfo`, `updateProfileImageAction`, `deleteProfileImageAction`                        |
| `body-info.ts`                    | `getMyBodyInfoAction`, `updateBodyInfoAction`, `getSizeOptionsAction`                        |
| `notification.ts`                 | `getUnreadNotifications`, `readNotification`, `readAllNotifications`                         |
| `push.ts`, `push-subscription.ts` | 푸시 구독 저장/삭제/발송                                                                     |
| `category.ts`                     | `getCategories`, `getSubCategories`                                                          |
| `price-alert.ts`                  | `getPriceAlert`, `savePriceAlert`                                                            |

## 아키텍처 개요

```text
UI Component
  -> App Route (page/layout)
  -> Server Action (src/app/actions)
  -> API Client (src/lib/api-client.ts / public-api-client.ts)
  -> Backend API (BACKEND_API_URL)
```

### API 클라이언트 역할 분리

- `src/lib/api-client.ts`
  - 서버 세션(`auth()`)에서 `accessToken` 읽어 Authorization 헤더 자동 주입
  - 인증이 필요한 요청에 사용
- `src/lib/public-api-client.ts`
  - 비인증/공개 데이터 요청용
  - 기본 `revalidate: 60s` 캐시 정책

## 인증 흐름

### 소셜 로그인

1. `/login`에서 카카오/구글 OAuth URL로 리다이렉트
2. `/auth/callback/[provider]`에서 code 수신
3. `next-auth`의 `external-oauth` provider로 `signIn` 수행
4. `auth.ts`에서 백엔드 `/auth/oauth/{provider}` 연동
5. JWT 세션에 `accessToken`, `refreshToken`, `userId` 등 저장

### 토큰 갱신

- `auth.ts`의 JWT callback에서 만료 임박 시 refresh 시도
- refresh 실패 시 세션 무효화(재로그인 유도)

## 검색/알림/PWA 동작

### 검색

- 자동완성: `/api/search/autocomplete`
- 추천검색어: `/api/search/recommend`
- `use-smart-search`에서 디바운스(120ms), 중복 제거, AbortController로 중복 요청 취소
- 최근 검색어는 `localStorage`(`onsinsa:recent-searches`)에 저장

### 실시간 알림(SSE)

- 클라이언트: `src/lib/notification-sse-client.ts`의 `EventSource('/api/notifications/subscribe')`
- 서버: `/api/notifications/subscribe`가 백엔드 SSE 스트림을 프록시
- 상태 저장: `src/store/notifications.ts` (최대 20개, 읽음 상태 관리)

### PWA / Push

- Manifest: `src/app/manifest.ts`
- SW 등록: `src/components/sw-register.tsx` -> `/sw.js`
- SW 처리: `public/sw.js`에서 `push`, `notificationclick` 이벤트 처리
- 설치 프롬프트 UI: `src/components/pwa/install-prompt.tsx`

## 개발 규칙

프로젝트 규칙(`AGENT.md`) 요약:

- 도메인 중심 폴더 구조 우선 (`src/components/<domain>`)
- 공통 UI는 `src/components/ui`에만 배치
- 라우트 내부 전용 컴포넌트는 `src/app/**/_components`
- App Router 규칙(`page.tsx`, `layout.tsx`, `[id]`) 유지
- 경로 alias: `@/* -> src/*`

## 트러블슈팅

### 1) 로그인 실패

- `.env.local`의 OAuth Client ID 및 `AUTH_SECRET` 확인
- OAuth provider에 등록한 redirect URI가 아래와 일치하는지 확인  
  `http://localhost:3000/auth/callback/kakao`  
  `http://localhost:3000/auth/callback/google`

### 2) 백엔드 호출 실패

- `BACKEND_API_URL` 확인
- 백엔드 서버 가동 상태 확인
- 인증 API는 세션 토큰 갱신 실패 시 401/403 가능

### 3) 푸시 알림 동작 불가

- `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY` 설정 확인
- 브라우저 Notification/Service Worker 지원 여부 확인
- 개발 중에는 브라우저 권한이 차단되어 있지 않은지 확인

### 4) SSE 알림 미수신

- 로그인 세션 유지 여부 확인
- `/api/notifications/subscribe` 요청이 200인지 확인
- 권한 이슈 시 `auth-error` 이벤트로 연결 종료될 수 있음

## 현재 상태/제약

- 테스트 스크립트(`pnpm test`)는 현재 정의되어 있지 않습니다.
- `docs/` 디렉터리는 현재 비어 있습니다.
- 라이선스 파일(`LICENSE`)은 저장소에 별도로 없습니다.
- 알림 기능 제약으로 인해 default 브랜치에는 반영하지 않았습니다.
