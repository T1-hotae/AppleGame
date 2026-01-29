// 배포 시 환경 변수를 config.js에 주입하는 스크립트
// Vercel, Netlify 등에서 빌드 시 실행

const fs = require('fs');

const supabaseUrl = process.env.SUPABASE_URL || 'https://yxnpyecehzovuefoipkw.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4bnB5ZWNlaHpvdnVlZm9pcGt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1ODczNzYsImV4cCI6MjA4NTE2MzM3Nn0.AkXus8dfJdEM_xKaa2puc4qJj7ha0-C0snYzQZbXNBA';

const configContent = `// 환경 변수 설정 (빌드 시 자동 생성)
// 이 파일은 .gitignore에 포함되어 있습니다

window.SUPABASE_URL = '${supabaseUrl}';
window.SUPABASE_KEY = '${supabaseKey}';
`;

fs.writeFileSync('config.js', configContent);
console.log('✅ config.js 파일이 생성되었습니다.');

