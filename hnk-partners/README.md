# HNK Partners Homepage

HNK Partners 전용 정적 홈페이지 프로젝트입니다. 기존 VR MEDI TOUR & HOME 홈페이지와 섞이지 않도록 `hnk-partners/` 폴더 내부에서만 독립적으로 구성했습니다.

## Branch

- 작업 브랜치: `hnk-partners-homepage`

## 파일 구조

```text
hnk-partners/
├── index.html
├── README.md
├── css/
│   └── style.css
├── js/
│   └── script.js
└── assets/
    └── images/
        ├── hero-vault.webp
        ├── private-lounge.webp
        ├── art-storage.webp
        ├── valuables-storage.webp
        ├── secure-transport.webp
        └── ai-concierge.webp
```

## 언어 구조

- 기본 언어: 중국어 간체 (`zh-CN`)
- 추가 언어: 한국어 (`ko`), 영어 (`en`)
- 상단 우측 언어 전환 표시: `中文 | 한국어 | English`
- 주요 문구, 메뉴, 서비스명, 버튼, 푸터 문구는 `js/script.js`의 `translations` 객체에서 관리합니다.
- 사용자가 선택한 언어는 `localStorage`에 저장되어 재방문 시 유지됩니다.

## 이미지 사용 방식

아래 파일명이 `assets/images/` 안에 추가되면 자동으로 각 섹션 배경에 적용됩니다.

- `hero-vault.webp`
- `private-lounge.webp`
- `art-storage.webp`
- `valuables-storage.webp`
- `secure-transport.webp`
- `ai-concierge.webp`

이미지 파일이 없어도 CSS 그라디언트 placeholder가 표시되어 레이아웃이 깨지지 않습니다.

## 콘텐츠 표현 원칙

- 실제 운영, 보험, 보안 인증, 보안 운송 계약이 확정되지 않은 내용은 단정하지 않습니다.
- 중국어는 “咨询”, “协调”, “规划中”, “合作洽谈中”처럼 신중한 표현을 사용합니다.
- 한국어는 “상담”, “연계”, “기획 중”, “협의 중”처럼 신중한 표현을 사용합니다.
- 영어는 “consulting”, “coordination”, “planned”, “under discussion”처럼 신중한 표현을 사용합니다.
- 안전성, 보상, 인증, 운송 책임에 대해 확정적이거나 과장된 표현은 사용하지 않습니다.

## 로컬 확인

브라우저에서 `hnk-partners/index.html` 파일을 직접 열거나, 저장소 루트에서 간단한 정적 서버를 실행해 확인할 수 있습니다.

```bash
python3 -m http.server 8080
```

이후 `http://localhost:8080/hnk-partners/`로 접속합니다.

## 추천 커밋 메시지

```text
Add multilingual HNK Partners homepage
```

## 추천 PR 제목

```text
Add multilingual HNK Partners homepage
```
