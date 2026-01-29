# 🚀 배포 가이드

## 환경 변수 설정

### 1. Vercel 배포

1. [Vercel](https://vercel.com)에 로그인
2. 새 프로젝트 생성 → GitHub 저장소 연결
3. **Environment Variables** 설정:
   - `SUPABASE_URL`: `https://yxnpyecehzovuefoipkw.supabase.co`
   - `SUPABASE_KEY`: (Supabase 프로젝트의 anon key)
4. **Build Settings**:
   - Build Command: `npm run build`
   - Output Directory: `.`
5. Deploy 클릭

### 2. Netlify 배포

1. [Netlify](https://netlify.com)에 로그인
2. 새 사이트 생성 → GitHub 저장소 연결
3. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `.`
4. **Environment variables** 추가:
   - `SUPABASE_URL`: `https://yxnpyecehzovuefoipkw.supabase.co`
   - `SUPABASE_KEY`: (Supabase 프로젝트의 anon key)
5. Deploy site 클릭

### 3. GitHub Pages 배포

GitHub Pages는 환경 변수를 직접 지원하지 않으므로:

1. 로컬에서 `config.js` 파일 생성:
   ```bash
   cp config.example.js config.js
   # config.js에 실제 값 입력
   ```

2. GitHub Actions를 사용한 자동 배포:
   - `.github/workflows/deploy.yml` 파일 생성 (선택사항)
   - 또는 수동으로 `config.js`를 커밋 (보안 주의)

## 로컬 개발

```bash
# config.js 파일 생성
cp config.example.js config.js

# config.js 파일을 열어서 실제 Supabase 값 입력
# 그 후 브라우저에서 index.html 열기
```

## 중요 사항

- ⚠️ `config.js` 파일은 **절대 Git에 커밋하지 마세요** (`.gitignore`에 포함됨)
- ✅ `config.example.js`는 템플릿으로 Git에 포함됩니다
- 🔒 배포 시 환경 변수를 사용하여 키를 안전하게 관리하세요

