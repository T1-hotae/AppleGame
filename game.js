// Supabase 설정 (config.js에서 로드)
const SUPABASE_URL = window.SUPABASE_URL;
const SUPABASE_KEY = window.SUPABASE_KEY;

// Supabase 클라이언트 초기화
let supabaseClient;

function initSupabase() {
    try {
        // Supabase CDN에서 로드된 경우 (UMD 빌드)
        if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
            console.log('Supabase 클라이언트 초기화 완료');
            return true;
        }
    } catch (error) {
        console.error('Supabase 초기화 오류:', error);
    }
    return false;
}

// 게임 상태
const gameState = {
    cards: [],
    flippedCards: [],
    matchedPairs: 0,
    totalPairs: 0,
    score: 0,
    gameStarted: false,
    gameOver: false,
    startTime: null,
    elapsedTime: 0,
    timer: null,
    canFlip: true
};

// Canvas 설정
let canvas, ctx;

// Canvas 크기 설정
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;

// 게임 설정
const GRID_ROWS = 4;
const GRID_COLS = 4;
const CARD_WIDTH = (CANVAS_WIDTH - 20) / GRID_COLS - 10;
const CARD_HEIGHT = (CANVAS_HEIGHT - 20) / GRID_ROWS - 10;
const CARD_SPACING = 10;

// 사과 색상 (다양한 사과 종류)
const APPLE_COLORS = [
    '#FF6B6B', // 빨간 사과
    '#4ECDC4', // 청록 사과
    '#FFE66D', // 노란 사과
    '#95E1D3', // 민트 사과
    '#F38181', // 분홍 사과
    '#AA96DA', // 보라 사과
    '#FCBAD3', // 핑크 사과
    '#A8E6CF'  // 연두 사과
];

// 카드 클래스
class Card {
    constructor(x, y, color, id) {
        this.x = x;
        this.y = y;
        this.width = CARD_WIDTH;
        this.height = CARD_HEIGHT;
        this.color = color;
        this.id = id;
        this.isFlipped = false;
        this.isMatched = false;
        this.flipProgress = 0; // 0 = 뒤집힘, 1 = 앞면
    }

    // 카드 그리기
    draw() {
        ctx.save();
        
        // 카드 배경 (뒤면)
        ctx.fillStyle = '#34495e';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // 카드 테두리
        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 3;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        
        // 뒤집기 애니메이션
        if (this.flipProgress > 0) {
            const scaleX = Math.abs(Math.cos(this.flipProgress * Math.PI));
            const centerX = this.x + this.width / 2;
            const centerY = this.y + this.height / 2;
            
            ctx.translate(centerX, centerY);
            ctx.scale(scaleX, 1);
            ctx.translate(-centerX, -centerY);
            
            // 앞면 (사과)
            if (this.flipProgress >= 0.5) {
                this.drawApple();
            }
        } else if (this.isFlipped || this.isMatched) {
            this.drawApple();
        } else {
            // 물음표 표시
            ctx.fillStyle = '#ecf0f1';
            ctx.font = 'bold 40px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('?', this.x + this.width / 2, this.y + this.height / 2);
        }
        
        ctx.restore();
    }

    // 사과 그리기
    drawApple() {
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const size = Math.min(this.width, this.height) * 0.6;
        
        // 사과 몸체
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(centerX, centerY, size / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // 사과 하이라이트
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(centerX - size / 6, centerY - size / 6, size / 4, 0, Math.PI * 2);
        ctx.fill();
        
        // 사과 줄기
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(centerX - 3, centerY - size / 2 - 8, 6, 10);
        
        // 사과 잎
        ctx.fillStyle = '#228B22';
        ctx.beginPath();
        ctx.ellipse(centerX + size / 6, centerY - size / 2 - 5, 8, 5, -0.5, 0, Math.PI * 2);
        ctx.fill();
    }

    // 클릭 감지
    isClicked(mouseX, mouseY) {
        return mouseX >= this.x && mouseX <= this.x + this.width &&
               mouseY >= this.y && mouseY <= this.y + this.height;
    }

    // 카드 뒤집기 애니메이션
    flip() {
        if (this.isFlipped || this.isMatched || !gameState.canFlip) return false;
        if (gameState.flippedCards.length >= 2) return false; // 이미 2개가 뒤집혀 있으면 추가하지 않음
        
        this.isFlipped = true;
        gameState.flippedCards.push(this);
        
        // 애니메이션
        const animate = () => {
            if (this.flipProgress < 1) {
                this.flipProgress += 0.1;
                if (this.flipProgress > 1) this.flipProgress = 1;
                requestAnimationFrame(() => {
                    drawGame();
                    if (this.flipProgress < 1) animate();
                });
            }
        };
        animate();
        
        return true;
    }

    // 카드 뒤집기 취소 (매칭 실패 시)
    unflip(callback) {
        this.isFlipped = false;
        const animate = () => {
            if (this.flipProgress > 0) {
                this.flipProgress -= 0.1;
                if (this.flipProgress < 0) this.flipProgress = 0;
                requestAnimationFrame(() => {
                    drawGame();
                    if (this.flipProgress > 0) animate();
                    else if (callback) callback();
                });
            } else {
                if (callback) callback();
            }
        };
        animate();
    }

    // 매칭 성공 처리
    match() {
        this.isMatched = true;
        this.isFlipped = true;
        this.flipProgress = 1;
    }
}

// 카드 배열 생성 및 섞기
function createCards() {
    const colors = [];
    const totalCards = GRID_ROWS * GRID_COLS;
    const pairsNeeded = totalCards / 2;
    
    // 색상 쌍 생성
    for (let i = 0; i < pairsNeeded; i++) {
        const color = APPLE_COLORS[i % APPLE_COLORS.length];
        colors.push(color, color); // 각 색상을 두 번 추가
    }
    
    // Fisher-Yates 셔플 알고리즘
    for (let i = colors.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [colors[i], colors[j]] = [colors[j], colors[i]];
    }
    
    // 카드 객체 생성
    gameState.cards = [];
    let cardIndex = 0;
    
    for (let row = 0; row < GRID_ROWS; row++) {
        for (let col = 0; col < GRID_COLS; col++) {
            const x = 10 + col * (CARD_WIDTH + CARD_SPACING);
            const y = 10 + row * (CARD_HEIGHT + CARD_SPACING);
            const card = new Card(x, y, colors[cardIndex], cardIndex);
            gameState.cards.push(card);
            cardIndex++;
        }
    }
    
    gameState.totalPairs = pairsNeeded;
    gameState.matchedPairs = 0;
    gameState.flippedCards = [];
    gameState.score = 0;
}

// 게임 그리기
function drawGame() {
    // Canvas 초기화
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // 배경
    ctx.fillStyle = '#ecf0f1';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // 모든 카드 그리기
    gameState.cards.forEach(card => {
        card.draw();
    });
}

// 매칭 체크
function checkMatch() {
    if (gameState.flippedCards.length !== 2) return;
    
    gameState.canFlip = false;
    const [card1, card2] = gameState.flippedCards;
    
    setTimeout(() => {
        if (card1.color === card2.color && card1.id !== card2.id) {
            // 매칭 성공
            card1.match();
            card2.match();
            gameState.matchedPairs++;
            gameState.score += 100;
            gameState.flippedCards = [];
            gameState.canFlip = true;
            
            updateUI();
            drawGame();
            
            // 게임 완료 체크
            if (gameState.matchedPairs === gameState.totalPairs) {
                endGame();
            }
        } else {
            // 매칭 실패 - 카드 뒤집기 취소
            const tempCard1 = card1;
            const tempCard2 = card2;
            gameState.flippedCards = [];
            
            // 두 카드를 동시에 뒤집기 취소
            let unflipCount = 0;
            const checkUnflipComplete = () => {
                unflipCount++;
                if (unflipCount === 2) {
                    gameState.canFlip = true;
                    drawGame();
                }
            };
            
            tempCard1.unflip(checkUnflipComplete);
            tempCard2.unflip(checkUnflipComplete);
        }
    }, 1000);
}

// UI 업데이트
function updateUI() {
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('matches').textContent = gameState.matchedPairs;
    document.getElementById('totalPairs').textContent = gameState.totalPairs;
}

// 타이머 시작
function startTimer() {
    gameState.startTime = Date.now();
    gameState.timer = setInterval(() => {
        if (!gameState.gameOver) {
            const elapsed = Math.floor((Date.now() - gameState.startTime) / 1000);
            document.getElementById('timer').textContent = elapsed;
        }
    }, 1000);
}

// 타이머 중지
function stopTimer() {
    if (gameState.timer) {
        clearInterval(gameState.timer);
        gameState.timer = null;
    }
}

// 게임 시작
function startGame() {
    try {
        console.log('게임 시작 함수 호출됨');
        gameState.gameStarted = true;
        gameState.gameOver = false;
        gameState.canFlip = true;
        gameState.score = 0;
        gameState.matchedPairs = 0;
        gameState.flippedCards = [];
        
        createCards();
        drawGame();
        updateUI();
        startTimer();
        
        document.getElementById('gameOver').classList.add('hidden');
        document.getElementById('startBtn').textContent = '게임 진행 중...';
        document.getElementById('startBtn').disabled = true;
        console.log('게임 시작 완료');
    } catch (error) {
        console.error('게임 시작 오류:', error);
        alert('게임 시작 중 오류가 발생했습니다: ' + error.message);
    }
}

// 게임 종료
function endGame() {
    gameState.gameOver = true;
    stopTimer();
    
    gameState.elapsedTime = Math.floor((Date.now() - gameState.startTime) / 1000);
    const timeBonus = Math.max(0, 1000 - gameState.elapsedTime * 10);
    gameState.score += timeBonus;
    
    document.getElementById('finalScore').textContent = gameState.score;
    document.getElementById('finalTime').textContent = gameState.elapsedTime;
    document.getElementById('gameOver').classList.remove('hidden');
    document.getElementById('startBtn').textContent = '게임 시작';
    document.getElementById('startBtn').disabled = false;
    document.getElementById('saveStatus').textContent = '';
    document.getElementById('playerName').value = '';
}

// 점수 저장
async function saveScore() {
    if (!supabaseClient && !initSupabase()) {
        document.getElementById('saveStatus').textContent = '❌ Supabase 클라이언트를 로드하는 중... 잠시 후 다시 시도해주세요.';
        return;
    }
    
    const playerName = document.getElementById('playerName').value.trim();
    const saveStatusEl = document.getElementById('saveStatus');
    
    try {
        const { data, error } = await supabaseClient
            .from('game_scores')
            .insert([
                {
                    player_name: playerName || null,
                    score: gameState.score,
                    time_seconds: gameState.elapsedTime,
                    matched_pairs: gameState.matchedPairs,
                    total_pairs: gameState.totalPairs
                }
            ])
            .select();
        
        if (error) {
            throw error;
        }
        
        saveStatusEl.textContent = '✅ 점수가 저장되었습니다!';
        saveStatusEl.style.color = '#4ECDC4';
    } catch (error) {
        console.error('점수 저장 오류:', error);
        saveStatusEl.textContent = '❌ 점수 저장에 실패했습니다: ' + error.message;
        saveStatusEl.style.color = '#FF6B6B';
    }
}

// 리더보드 조회
async function loadLeaderboard() {
    if (!supabaseClient && !initSupabase()) {
        alert('Supabase 클라이언트를 로드하는 중... 잠시 후 다시 시도해주세요.');
        return;
    }
    
    const leaderboardList = document.getElementById('leaderboardList');
    leaderboardList.innerHTML = '<p>로딩 중...</p>';
    document.getElementById('leaderboard').classList.remove('hidden');
    
    try {
        const { data, error } = await supabaseClient
            .from('game_scores')
            .select('*')
            .order('score', { ascending: false })
            .limit(10);
        
        if (error) {
            throw error;
        }
        
        if (data && data.length > 0) {
            leaderboardList.innerHTML = `
                <table class="leaderboard-table">
                    <thead>
                        <tr>
                            <th>순위</th>
                            <th>이름</th>
                            <th>점수</th>
                            <th>시간</th>
                            <th>매칭</th>
                            <th>날짜</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map((record, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${record.player_name || '익명'}</td>
                                <td>${record.score.toLocaleString()}</td>
                                <td>${record.time_seconds}초</td>
                                <td>${record.matched_pairs}/${record.total_pairs}</td>
                                <td>${new Date(record.created_at).toLocaleDateString('ko-KR')}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        } else {
            leaderboardList.innerHTML = '<p>아직 기록된 점수가 없습니다.</p>';
        }
    } catch (error) {
        console.error('리더보드 조회 오류:', error);
        leaderboardList.innerHTML = '<p>❌ 리더보드를 불러오는데 실패했습니다: ' + error.message + '</p>';
    }
}

// 게임 리셋
function resetGame() {
    stopTimer();
    gameState.gameStarted = false;
    gameState.gameOver = false;
    gameState.canFlip = true;
    gameState.flippedCards = [];
    
    document.getElementById('timer').textContent = '0';
    document.getElementById('gameOver').classList.add('hidden');
    document.getElementById('startBtn').textContent = '게임 시작';
    document.getElementById('startBtn').disabled = false;
    
    drawGame();
}

// 초기화 함수
function init() {
    // Canvas 초기화
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    
    // Canvas 클릭 이벤트
    canvas.addEventListener('click', (e) => {
        if (!gameState.gameStarted || gameState.gameOver || !gameState.canFlip) return;
        
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // 클릭된 카드 찾기
        for (let card of gameState.cards) {
            if (card.isClicked(mouseX, mouseY) && !card.isFlipped && !card.isMatched) {
                if (gameState.flippedCards.length < 2) {
                    card.flip();
                    drawGame();
                    
                    if (gameState.flippedCards.length === 2) {
                        checkMatch();
                    }
                }
                break;
            }
        }
    });
    
    // Supabase 클라이언트 초기화 (CDN 로드 후)
    initSupabase();
    
    // CDN이 늦게 로드될 경우를 대비
    if (!supabaseClient) {
        const checkSupabase = setInterval(() => {
            if (initSupabase()) {
                clearInterval(checkSupabase);
            }
        }, 100);
        
        // 5초 후 타임아웃
        setTimeout(() => clearInterval(checkSupabase), 5000);
    }
    
    // 버튼 이벤트
    document.getElementById('startBtn').addEventListener('click', startGame);
    document.getElementById('resetBtn').addEventListener('click', resetGame);
    document.getElementById('saveScoreBtn').addEventListener('click', saveScore);
    document.getElementById('leaderboardBtn').addEventListener('click', loadLeaderboard);
    document.getElementById('closeLeaderboardBtn').addEventListener('click', () => {
        document.getElementById('leaderboard').classList.add('hidden');
    });
    
    // Enter 키로 점수 저장
    document.getElementById('playerName').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveScore();
        }
    });
    
    // 초기 화면 그리기
    drawGame();
}

// DOM 로드 완료 후 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

