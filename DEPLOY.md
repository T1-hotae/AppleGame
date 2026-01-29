# 🚀 배포 가이드

## GitHub 연결

이 프로젝트는 이미 **origin**으로 GitHub와 연결되어 있습니다.

- **원격 저장소**: `https://github.com/T1-hotae/AppleGame.git`
- **브랜치**: `main`

### 변경사항을 GitHub에 올리기

```bash
git add .
git commit -m "커밋 메시지"
git push origin main
```

### 다른 GitHub 저장소에 연결하려면

```bash
# 기존 origin 제거 후 새 저장소 연결
git remote remove origin
git remote add origin https://github.com/사용자명/저장소명.git
git push -u origin main
```

(GitHub에서 새 저장소를 만든 뒤 위 URL을 해당 저장소 주소로 바꾸세요.)

---

## 환경 변수 설정

### 1. Vercel 배포

1. [Vercel](https://vercel.com)에 로그인
2. **Add New** → **Project** → GitHub 저장소 연결 후 Import
3. **Environment Variables**에서 다음 변수 추가:
   - `SUPABASE_URL`: Supabase 프로젝트 URL (예: `https://xxxxx.supabase.co`)
   - `SUPABASE_KEY`: Supabase **anon** (public) key  
   (Supabase 대시보드 → Settings → API에서 확인)
4. **Build Settings**는 `vercel.json`에 이미 설정됨:
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. **Deploy** 클릭

배포 시 `npm run build`가 실행되며, 환경 변수로 `dist/config.js`가 생성된 뒤 `dist` 폴더가 배포됩니다.

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

