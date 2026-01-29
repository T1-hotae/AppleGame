// 배포 시 환경 변수를 config.js에 주입하고 dist/에 정적 파일을 모으는 스크립트
// Vercel, Netlify 등에서 빌드 시 실행

const fs = require('fs');
const path = require('path');

const OUT_DIR = 'dist';
const ASSETS = ['index.html', 'style.css', 'game.js'];

// dist 폴더 생성
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

// 정적 파일 복사
for (const file of ASSETS) {
  const src = path.join(__dirname, file);
  const dest = path.join(__dirname, OUT_DIR, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`  복사: ${file}`);
  }
}

// 환경 변수로 config.js 생성
const supabaseUrl = process.env.SUPABASE_URL || 'https://yxnpyecehzovuefoipkw.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4bnB5ZWNlaHpvdnVlZm9pcGt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1ODczNzYsImV4cCI6MjA4NTE2MzM3Nn0.AkXus8dfJdEM_xKaa2puc4qJj7ha0-C0snYzQZbXNBA';

const configContent = `// 환경 변수 설정 (빌드 시 자동 생성)
// 이 파일은 .gitignore에 포함되어 있습니다

window.SUPABASE_URL = '${supabaseUrl}';
window.SUPABASE_KEY = '${supabaseKey}';
`;

fs.writeFileSync(path.join(__dirname, OUT_DIR, 'config.js'), configContent);
console.log('✅ dist/ 빌드 완료 (config.js 포함)');

