const airports = [
    { code: "HND", name: "羽田空港" },
    { code: "NRT", name: "成田国際空港" },
    { code: "KIX", name: "関西国際空港" },
    { code: "ITM", name: "伊丹空港" },
    { code: "CTS", name: "新千歳空港" },
    { code: "FUK", name: "福岡空港" },
    { code: "NGO", name: "中部国際空港" },
    { code: "OKA", name: "那覇空港" },
    { code: "ISG", name: "新石垣空港" },
    { code: "MMY", name: "宮古空港" },
    { code: "KOJ", name: "鹿児島空港" },
    { code: "KMJ", name: "熊本空港" },
    { code: "KMI", name: "宮崎空港" },
    { code: "NGS", name: "長崎空港" },
    { code: "OIT", name: "大分空港" },
    { code: "MYJ", name: "松山空港" },
    { code: "TAK", name: "高松空港" },
    { code: "KCZ", name: "高知空港" },
    { code: "HIJ", name: "広島空港" },
    { code: "UBJ", name: "山口宇部空港" },
    { code: "IZO", name: "出雲空港" },
    { code: "OKJ", name: "岡山空港" },
    { code: "UKB", name: "神戸空港" },
    { code: "FKS", name: "福島空港" },
    { code: "SDJ", name: "仙台空港" },
    { code: "AOJ", name: "青森空港" },
    { code: "HKD", name: "函館空港" },
    { code: "AKJ", name: "旭川空港" },
    { code: "KUH", name: "釧路空港" },
    { code: "MMB", name: "女満別空港" },
    { code: "HNA", name: "花巻空港" },
    { code: "SYO", name: "庄内空港" },
    { code: "GAJ", name: "山形空港" },
    { code: "KIJ", name: "新潟空港" },
    { code: "TOY", name: "富山空港" },
    { code: "KMQ", name: "小松空港" },
    { code: "FSZ", name: "静岡空港" },
    { code: "SHM", name: "南紀白浜空港" },
    { code: "AXT", name: "秋田空港" },
    { code: "TKS", name: "徳島空港" }
];

// Game State
let gameState = {
    mode: 'normal',
    timeLimit: 10,
    currentQuestions: [],
    currentQuestionIndex: 0,
    score: 0,
    timerId: null,
    timeLeft: 0
};

// DOM Elements
const screens = {
    start: document.getElementById('start-screen'),
    quiz: document.getElementById('quiz-screen'),
    result: document.getElementById('result-screen')
};

const elements = {
    timeSlider: document.getElementById('time-setting'),
    timeDisplay: document.getElementById('time-display'),
    startBtn: document.getElementById('start-btn'),
    currentQ: document.getElementById('current-q'),
    timerText: document.getElementById('timer-text'),
    timerCircle: document.querySelector('.circle'),
    questionText: document.getElementById('question-text'),
    questionLabel: document.getElementById('question-label'),
    optionsGrid: document.getElementById('options-grid'),
    finalScore: document.getElementById('final-score'),
    feedbackMsg: document.getElementById('feedback-msg'),
    restartBtn: document.getElementById('restart-btn'),
    modeInputs: document.querySelectorAll('input[name="mode"]')
};

// Initialization
function init() {
    setupEventListeners();
}

function setupEventListeners() {
    elements.timeSlider.addEventListener('input', (e) => {
        elements.timeDisplay.textContent = `${e.target.value}s`;
    });

    elements.startBtn.addEventListener('click', startGame);
    elements.restartBtn.addEventListener('click', () => switchScreen('start'));
}

function switchScreen(screenName) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[screenName].classList.add('active');
}

function startGame() {
    // Get Settings
    gameState.mode = document.querySelector('input[name="mode"]:checked').value;
    gameState.timeLimit = parseInt(elements.timeSlider.value);
    gameState.score = 0;
    gameState.currentQuestionIndex = 0;

    // Generate Questions
    gameState.currentQuestions = generateQuestions(5);

    switchScreen('quiz');
    loadQuestion();
}

function generateQuestions(count) {
    const shuffled = [...airports].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map(correct => {
        // Generate options: 1 correct + 3 wrong
        const others = airports.filter(a => a.code !== correct.code);
        const wrongOptions = others.sort(() => 0.5 - Math.random()).slice(0, 3);
        const options = [correct, ...wrongOptions].sort(() => 0.5 - Math.random());
        return {
            target: correct,
            options: options
        };
    });
}

function loadQuestion() {
    if (gameState.currentQuestionIndex >= gameState.currentQuestions.length) {
        endGame();
        return;
    }

    const q = gameState.currentQuestions[gameState.currentQuestionIndex];
    elements.currentQ.textContent = gameState.currentQuestionIndex + 1;

    // Display Question based on mode
    if (gameState.mode === 'normal') {
        elements.questionText.textContent = q.target.code;
        elements.questionText.style.fontSize = '4rem'; // Larger for 3 letters
        elements.questionLabel.textContent = "Which airport is this?";
    } else {
        elements.questionText.textContent = q.target.name;
        elements.questionText.style.fontSize = '2rem'; // Smaller for full text
        elements.questionLabel.textContent = "What is the code?";
    }

    // Render Options
    elements.optionsGrid.innerHTML = '';
    q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = gameState.mode === 'normal' ? opt.name : opt.code;
        btn.onclick = () => handleAnswer(opt, btn);
        elements.optionsGrid.appendChild(btn);
    });

    startTimer();
}

function startTimer() {
    clearInterval(gameState.timerId);
    gameState.timeLeft = gameState.timeLimit;
    updateTimerDisplay();

    // Reset Circle Animation state
    elements.timerCircle.style.strokeDasharray = "100, 100";
    elements.timerCircle.parentElement.classList.remove('warning', 'danger');

    gameState.timerId = setInterval(() => {
        gameState.timeLeft--;
        updateTimerDisplay();

        if (gameState.timeLeft <= 0) {
            clearInterval(gameState.timerId);
            handleTimeout();
        }
    }, 1000);
}

function updateTimerDisplay() {
    elements.timerText.textContent = gameState.timeLeft;

    // Update Circle
    const percentage = (gameState.timeLeft / gameState.timeLimit) * 100;
    elements.timerCircle.style.strokeDasharray = `${percentage}, 100`;

    if (percentage <= 60 && percentage > 30) {
        elements.timerCircle.parentElement.classList.add('warning');
    } else if (percentage <= 30) {
        elements.timerCircle.parentElement.classList.remove('warning');
        elements.timerCircle.parentElement.classList.add('danger');
    }
}

function stopTimer() {
    clearInterval(gameState.timerId);
}

function handleAnswer(selected, btnElement) {
    if (btnElement.disabled) return; // Prevent double clicks

    stopTimer();

    // Disable all buttons
    const buttons = elements.optionsGrid.querySelectorAll('.option-btn');
    buttons.forEach(b => b.disabled = true);

    const q = gameState.currentQuestions[gameState.currentQuestionIndex];
    const isCorrect = selected.code === q.target.code;

    if (isCorrect) {
        btnElement.classList.add('correct');
        gameState.score++;
    } else {
        btnElement.classList.add('wrong');
        // Highlight correct answer
        buttons.forEach(b => {
            const text = b.textContent;
            const correctText = gameState.mode === 'normal' ? q.target.name : q.target.code;
            if (text === correctText) b.classList.add('correct');
        });
    }

    // Wait before next question
    setTimeout(() => {
        gameState.currentQuestionIndex++;
        loadQuestion();
    }, 1500);
}

function handleTimeout() {
    const buttons = elements.optionsGrid.querySelectorAll('.option-btn');
    buttons.forEach(b => b.disabled = true);

    // Show correct answer
    const q = gameState.currentQuestions[gameState.currentQuestionIndex];
    buttons.forEach(b => {
        const text = b.textContent;
        const correctText = gameState.mode === 'normal' ? q.target.name : q.target.code;
        if (text === correctText) b.classList.add('correct');
    });

    setTimeout(() => {
        gameState.currentQuestionIndex++;
        loadQuestion();
    }, 1500);
}

function endGame() {
    elements.finalScore.textContent = gameState.score;

    let msg = "";
    if (gameState.score === 5) msg = "Perfect! You're a Pilot! ✈️";
    else if (gameState.score >= 3) msg = "Great Job! Keep flying! 🛫";
    else msg = "Nice try! Study more! 📖";

    elements.feedbackMsg.textContent = msg;
    switchScreen('result');
}

// Start
init();
