# 🍎 사과 뒤집기 게임

Canvas API와 JavaScript로 만든 메모리 카드 게임입니다. Supabase를 사용하여 점수를 저장하고 리더보드를 확인할 수 있습니다.

## 🎮 게임 방법

1. "게임 시작" 버튼을 클릭합니다
2. 카드를 클릭하여 뒤집습니다
3. 같은 색상의 사과 2개를 찾아 매칭합니다
4. 모든 쌍을 매칭하면 게임 완료!
5. 이름을 입력하고 점수를 저장할 수 있습니다

## 🔧 환경 변수 설정

### 로컬 개발

1. `config.example.js`를 `config.js`로 복사
2. `config.js`에 실제 Supabase URL과 Key 입력

```bash
cp config.example.js config.js
```

### 배포 시 환경 변수 설정

#### Vercel 배포

1. [Vercel](https://vercel.com)에 가입/로그인
2. GitHub 저장소를 연결
3. 프로젝트 Settings > Environment Variables에서 추가:
   - `SUPABASE_URL`: Supabase 프로젝트 URL
   - `SUPABASE_KEY`: Supabase anon key
4. 빌드 시 환경 변수가 주입됩니다

#### Netlify 배포

1. [Netlify](https://netlify.com)에 가입/로그인
2. GitHub 저장소를 연결
3. Site settings > Environment variables에서 추가:
   - `SUPABASE_URL`: Supabase 프로젝트 URL
   - `SUPABASE_KEY`: Supabase anon key
4. 빌드 명령어에 환경 변수 주입 스크립트 추가 필요

#### GitHub Pages 배포

GitHub Pages는 환경 변수를 직접 지원하지 않으므로:
1. `config.js` 파일을 직접 생성 (Git에 커밋하지 않음)
2. 또는 GitHub Actions를 사용하여 빌드 시 주입

## 🚀 배포 방법

### Vercel 배포

1. [Vercel](https://vercel.com)에 가입/로그인
2. GitHub 저장소를 연결
3. 환경 변수 설정 (위 참조)
4. 자동으로 배포됩니다

### Netlify 배포

1. [Netlify](https://netlify.com)에 가입/로그인
2. GitHub 저장소를 연결
3. 환경 변수 설정 (위 참조)
4. 빌드 설정 없이 바로 배포 가능

### GitHub Pages 배포

1. GitHub 저장소의 Settings > Pages로 이동
2. Source를 `main` 브랜치로 설정
3. `/ (root)` 폴더 선택
4. 저장 후 자동 배포

## 🛠️ 기술 스택

- HTML5 Canvas API
- Vanilla JavaScript
- Supabase (데이터베이스)
- CSS3

## 📝 라이선스

MIT License

