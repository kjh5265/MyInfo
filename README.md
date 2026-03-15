# MyInfo

> 나만의 정보를 보여주는 개인 포트폴리오 웹사이트

## 기술 스택

- **React** - UI 프레임워크
- **Vite** - 빌드 도구
- **Tailwind CSS** - 스타일링
- **Lucide React** - 아이콘

## 기능

- 다크모드 지원 (우측 상단 토글)
- 깔끔하고 예쁜 UI 디자인
- 프로필 섹션 (기본 정보, 기술 스택, 취미)
- 그라데이션 효과 및 애니메이션

## 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build
```

## 트러블슈팅

### DarkModeToggle와 다른 버튼이 겹칠 때

**증상:** DarkModeToggle와 다른 fixed 요소가 겹치거나 배치되지 않음

**원인:** DarkModeToggle 컴포넌트가 자체적으로 `fixed top-4 right-4` 스타일 가지고 있음

**해결:**
- DarkModeToggle에서 `fixed` 제거
- 부모 컨테이너에서 flexbox로 배치 관리
```jsx
// Bad
<div className="fixed top-4 right-4">
  <DarkModeToggle />
</div>

// Good - DarkModeToggle에서 fixed 제거 후
<div className="fixed top-4 right-4 flex items-center gap-3">
  <DarkModeToggle />
</div>
```

### Tailwind CSS가 적용되지 않을 때

**증상:** 디자인이 적용되지 않고 기본 HTML처럼 보임

**원인:** `postcss.config.js` 또는 `tailwind.config.js` 파일이 없을 때 발생

**해결:**
1. `tailwind.config.js` 생성:
```js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: { extend: {} },
  plugins: [],
}
```

2. `postcss.config.js` 생성:
```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

3. `npm run dev` 재실행

**참고:** Tailwind v4는 설정 방식이 다름. v3 사용 권장 (`npm install -D tailwindcss@3`)

## 변경 이력 (Changelog)

### Telegram 알림 설정

**필요한 환경변수 (Vercel에서 설정)**:
1. `TELEGRAM_TOKEN` - @BotFather에서 발급
2. `TELEGRAM_CHAT_ID` - @userinfobot에서 확인

**Vercel 설정**:
1. Dashboard → 프로젝트 → Settings → Environment Variables
2. 아래 추가:
   - Key: `VITE_TELEGRAM_TOKEN`, Value: Bot 토큰
   - Key: `VITE_TELEGRAM_CHAT_ID`, Value: Chat ID

### 2026-03-15
- [+] 프로젝트 초기 설정 완료 (Vite + React + Tailwind)
- [+] 다크모드 토글 기능 추가
- [+] 프로필 컴포넌트 기본 구조 구현
- [+] Git 초기화 및 첫 커밋
- [+] 디자인 개선: 중앙 정렬 + 그라데이션 효과 +现代化 UI
- [+] 트러블슈팅 가이드 추가 (Tailwind 설정 문제)
