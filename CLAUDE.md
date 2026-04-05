# MyInfo 프로젝트

개인 포트폴리오 + 1:1 채팅 웹앱. React + Vite + Tailwind, Firebase Firestore, Vercel 배포.

## 스택

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide React
- **DB**: Firebase Firestore (실시간)
- **배포**: Vercel (serverless api/ 디렉토리)
- **알림**: Telegram Bot API (환경변수: VITE_TELEGRAM_TOKEN, VITE_TELEGRAM_CHAT_ID)

## 주요 파일

```
src/
  App.jsx                  # 루트 컴포넌트, 관리자 로그인 처리
  firebase.js              # Firestore 초기화 (db export)
  components/
    CommentSection.jsx     # 채팅 시스템 전체 (핵심)
    Profile.jsx            # 프로필 페이지
    DarkModeToggle.jsx     # 다크모드 토글
api/
  send-notification.js    # Telegram 알림 Vercel serverless (미사용 중)
docs/
  기능한줄요약.md          # 기능 목록 한줄 요약
```

## Firestore 컬렉션 구조

```
conversations/{userId}
  authorName: string       # 사용자 닉네임
  lastMessage: string      # 마지막 메시지 내용
  lastMessageAt: ISO string
  userId: string

chats/{userId}/messages/{msgId}
  content: string
  userId: string           # 발신자 (admin이면 "admin")
  authorName: string
  isAdmin: boolean
  disabled: boolean        # soft delete 플래그
  createdAt: ISO string
```

## 채팅 동작 방식

- **사용자**: `chats/{userId}/messages` 구독 → 본인 대화만 보임
- **관리자**: `conversations` 구독 → 전체 대화 목록 → 클릭 시 해당 `chats/{userId}/messages` 구독
- 관리자 비밀번호: `5265` (App.jsx, CommentSection.jsx에 하드코딩)
- 메시지 제한: 5분/20개, 하루/100개, 최대 20자 (localStorage 기반)
- 닉네임 `재현` 사용 불가

## 개발/배포

```bash
npm run dev     # 로컬 개발서버
npm run build   # 빌드
```

환경변수 (.env):
```
VITE_TELEGRAM_TOKEN=...
VITE_TELEGRAM_CHAT_ID=...
```
