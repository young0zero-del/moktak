// 음식 메뉴 데이터
const foodMenu = [
    {
        image: '[오구샌]바질치즈샌드위치 1.png',
        correct: '오구샌 - 바질치즈샌드위치',
        brand: '오구샌',
        menu: '바질치즈샌드위치'
    },
    {
        image: '11. 모짜렐라 인 더 베이컨 세트_누끼 1.png',
        correct: '롯데리아 - 모짜렐라 인 더 베이컨',
        brand: '롯데리아',
        menu: '모짜렐라 인 더 베이컨'
    },
    {
        image: '뚜레쥬르_다크초코케이크 1.png',
        correct: '뚜레쥬르 - 다크초코케이크',
        brand: '뚜레쥬르',
        menu: '다크초코케이크'
    },
    {
        image: '뚜레쥬르_스트로베리퀸.png',
        correct: '뚜레쥬르 - 스트로베리퀸',
        brand: '뚜레쥬르',
        menu: '스트로베리퀸'
    },
    {
        image: '망고 설빙.png',
        correct: '설빙 - 망고 설빙',
        brand: '설빙',
        menu: '망고 설빙'
    },
    {
        image: '메인메뉴_핫바베큐+ 반마리 누끼 (1) 1.png',
        correct: 'BBQ - 핫바베큐 반마리',
        brand: 'BBQ',
        menu: '핫바베큐 반마리'
    },
    {
        image: '멕시카나_치토스치킨.png',
        correct: '멕시카나 - 치토스치킨',
        brand: '멕시카나',
        menu: '치토스치킨'
    },
    {
        image: '멕시카나_치토스치킨치토스치즈볼세트 2.  1.png',
        correct: '멕시카나 - 치토스치킨치즈볼세트',
        brand: '멕시카나',
        menu: '치토스치킨치즈볼세트'
    },
    {
        image: '명랑핫도그_명랑\'s 치즈스틱.png',
        correct: '명랑핫도그 - 명랑\'s 치즈스틱',
        brand: '명랑핫도그',
        menu: '명랑\'s 치즈스틱'
    },
    {
        image: '불닭육회냉쫄면(1280-960) 1.png',
        correct: '불닭발땡초동대문엽기떡볶이 - 불닭육회냉쫄면',
        brand: '불닭발땡초동대문엽기떡볶이',
        menu: '불닭육회냉쫄면'
    },
    {
        image: '신전떡볶이.png',
        correct: '신전떡볶이 - 신전떡볶이',
        brand: '신전떡볶이',
        menu: '신전떡볶이'
    },
    {
        image: '우지커피 1.png',
        correct: '커피전문점 - 우지커피',
        brand: '커피전문점',
        menu: '우지커피'
    },
    {
        image: '제육덮밥_제미나이_보정 1.png',
        correct: '한식당 - 제육덮밥',
        brand: '한식당',
        menu: '제육덮밥'
    },
    {
        image: '피자.png',
        correct: '피자헛 - 피자',
        brand: '피자헛',
        menu: '피자'
    },
    {
        image: '햄버거.png',
        correct: '맥도날드 - 햄버거',
        brand: '맥도날드',
        menu: '햄버거'
    }
];

// 게임 상태
let currentQuestionIndex = 0;
let score = 0;
let correctAnswers = 0;
let timeLeft = 30;
let timerInterval = null;
let questions = [];

// DOM 요소
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const foodImage = document.getElementById('food-image');
const optionsContainer = document.getElementById('options');
const timerElement = document.getElementById('timer');
const timerContainer = document.querySelector('.timer');
const currentScoreElement = document.getElementById('current-score');
const currentQuestionElement = document.getElementById('current-question');
const totalQuestionsElement = document.getElementById('total-questions');

// 게임 시작
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);

function startGame() {
    // 초기화
    currentQuestionIndex = 0;
    score = 0;
    correctAnswers = 0;
    
    // 문제 섞기
    questions = shuffleArray([...foodMenu]);
    
    // 화면 전환
    startScreen.classList.remove('active');
    gameScreen.classList.add('active');
    
    // 총 문제 수 표시
    totalQuestionsElement.textContent = questions.length;
    
    // 첫 문제 표시
    showQuestion();
}

function showQuestion() {
    if (currentQuestionIndex >= questions.length) {
        endGame();
        return;
    }
    
    const question = questions[currentQuestionIndex];
    
    // 이미지 표시
    foodImage.src = question.image;
    
    // 문제 번호 업데이트
    currentQuestionElement.textContent = currentQuestionIndex + 1;
    
    // 옵션 생성
    const options = generateOptions(question);
    displayOptions(options, question.correct);
    
    // 타이머 시작
    startTimer();
}

function generateOptions(correctQuestion) {
    const options = [correctQuestion.correct];
    
    // 오답 생성 (다른 음식 중에서 랜덤 선택)
    const otherFoods = foodMenu.filter(f => f.correct !== correctQuestion.correct);
    const shuffled = shuffleArray(otherFoods);
    
    for (let i = 0; i < 3 && i < shuffled.length; i++) {
        options.push(shuffled[i].correct);
    }
    
    // 옵션 섞기
    return shuffleArray(options);
}

function displayOptions(options, correctAnswer) {
    optionsContainer.innerHTML = '';
    
    options.forEach(option => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        optionDiv.textContent = option;
        optionDiv.addEventListener('click', () => selectOption(optionDiv, option, correctAnswer));
        optionsContainer.appendChild(optionDiv);
    });
}

function selectOption(optionElement, selectedAnswer, correctAnswer) {
    // 타이머 정지
    clearInterval(timerInterval);
    
    // 모든 옵션 비활성화
    const allOptions = document.querySelectorAll('.option');
    allOptions.forEach(opt => opt.classList.add('disabled'));
    
    // 정답 체크
    const isCorrect = selectedAnswer === correctAnswer;
    
    if (isCorrect) {
        optionElement.classList.add('correct');
        score += 100;
        correctAnswers++;
        currentScoreElement.textContent = score;
    } else {
        optionElement.classList.add('wrong');
        // 정답 표시
        allOptions.forEach(opt => {
            if (opt.textContent === correctAnswer) {
                opt.classList.add('correct');
            }
        });
    }
    
    // 다음 문제로 (1.5초 후)
    setTimeout(() => {
        currentQuestionIndex++;
        showQuestion();
    }, 1500);
}

function startTimer() {
    timeLeft = 30;
    timerElement.textContent = timeLeft;
    timerContainer.classList.remove('warning', 'danger');
    
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        
        if (timeLeft <= 5) {
            timerContainer.classList.add('danger');
        } else if (timeLeft <= 10) {
            timerContainer.classList.add('warning');
        }
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeout();
        }
    }, 1000);
}

function handleTimeout() {
    // 모든 옵션 비활성화
    const allOptions = document.querySelectorAll('.option');
    allOptions.forEach(opt => opt.classList.add('disabled'));
    
    // 정답 표시
    const question = questions[currentQuestionIndex];
    allOptions.forEach(opt => {
        if (opt.textContent === question.correct) {
            opt.classList.add('correct');
        }
    });
    
    // 다음 문제로
    setTimeout(() => {
        currentQuestionIndex++;
        showQuestion();
    }, 1500);
}

function endGame() {
    clearInterval(timerInterval);
    
    // 화면 전환
    gameScreen.classList.remove('active');
    resultScreen.classList.add('active');
    
    // 결과 계산
    const totalQuestions = questions.length;
    const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
    const rank = calculateRank(accuracy);
    
    // 결과 표시
    document.getElementById('final-score').textContent = score;
    document.getElementById('accuracy').textContent = accuracy + '%';
    document.getElementById('rank').textContent = rank.position;
    
    // 등수별 메시지 및 애니메이션
    displayRankResult(rank, accuracy);
}

function calculateRank(accuracy) {
    if (accuracy === 100) {
        return { position: '1등', level: 'first', emoji: '👑' };
    } else if (accuracy >= 80) {
        return { position: '2등', level: 'middle', emoji: '🥈' };
    } else if (accuracy >= 60) {
        return { position: '3등', level: 'middle', emoji: '🥉' };
    } else if (accuracy >= 40) {
        return { position: '4등', level: 'middle', emoji: '😊' };
    } else {
        return { position: '꼴찌', level: 'last', emoji: '🪓' };
    }
}

function displayRankResult(rank, accuracy) {
    const resultAnimation = document.getElementById('result-animation');
    const resultTitle = document.getElementById('result-title');
    const rankMessage = document.getElementById('rank-message');
    
    resultAnimation.textContent = rank.emoji;
    resultTitle.textContent = rank.position + '!';
    
    // 등수별 스타일 적용
    resultTitle.className = 'result-title ' + rank.level;
    resultAnimation.className = 'result-animation';
    
    // 메시지 설정
    let message = '';
    if (rank.level === 'first') {
        resultAnimation.classList.add('crown');
        message = '🎉 완벽합니다! 음식 메뉴 전문가시네요! 정말 기특해요! 🎉';
    } else if (rank.level === 'last') {
        resultAnimation.classList.add('guillotine');
        message = '💀 아쉽네요... 단두대에 오르셨습니다! 다시 도전해보세요! 💀';
    } else {
        message = `👍 ${rank.position}! 좋은 결과입니다. 조금만 더 노력하면 1등! 👍`;
    }
    
    rankMessage.textContent = message;
}

function restartGame() {
    resultScreen.classList.remove('active');
    startScreen.classList.add('active');
    
    // 점수 초기화
    currentScoreElement.textContent = '0';
}

// 배열 섞기
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}
