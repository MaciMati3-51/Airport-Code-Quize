const airports = [
    // HND and NRT removed
    { code: "YGJ", name: "米子鬼太郎空港" },
    { code: "IWK", name: "岩国錦帯橋空港" },
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
    { code: "TKS", name: "徳島空港" },
    { code: "AGJ", name: "粟国空港" },
    { code: "ASJ", name: "奄美空港" },
    { code: "HAC", name: "八丈島空港" },
    { code: "IBR", name: "茨城空港" },
    { code: "IKI", name: "壱岐空港" },
    { code: "IWJ", name: "石見空港" },
    { code: "KKX", name: "喜界空港" },
    { code: "KTD", name: "北大東空港" },
    { code: "KKJ", name: "北九州空港" },
    { code: "UEO", name: "久米島空港" },
    { code: "MMJ", name: "松本空港" },
    { code: "MMD", name: "南大東空港" },
    { code: "MSJ", name: "三沢空港" },
    { code: "MYE", name: "三宅島空港" },
    { code: "MBE", name: "紋別空港" },
    { code: "SHB", name: "中標津空港" },
    { code: "TNE", name: "種子島空港" },
    { code: "NTQ", name: "能登空港" },
    { code: "OBO", name: "帯広空港" },
    { code: "ONJ", name: "大館能代空港" },
    { code: "OKD", name: "丘珠空港" },
    { code: "OKE", name: "沖永良部空港" },
    { code: "OKI", name: "隠岐空港" },
    { code: "OIR", name: "奥尻空港" },
    { code: "OIM", name: "大島空港" },
    { code: "RIS", name: "利尻空港" },
    { code: "HSG", name: "佐賀空港" },
    { code: "SHI", name: "下地島空港" },
    { code: "TJH", name: "但馬空港" },
    { code: "TRA", name: "多良間空港" },
    { code: "TKN", name: "徳之島空港" },
    { code: "TTJ", name: "鳥取空港" },
    { code: "TSJ", name: "対馬空港" },
    { code: "WKJ", name: "稚内空港" },
    { code: "KUM", name: "屋久島空港" },
    { code: "OGN", name: "与那国空港" },
    { code: "RNJ", name: "与論空港" }
];

// Game State
let gameState = {
    mode: 'normal',
    timeLimit: 10,
    currentQuestions: [],
    currentQuestionIndex: 0,
    score: 0,
    timerId: null,
    timeLeft: 0,
    selectedOption: null,
    isSubmitted: false
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
    modeInputs: document.querySelectorAll('input[name="mode"]'),
    answerBtn: document.getElementById('answer-btn'),
    feedbackOverlay: document.getElementById('feedback-overlay'),
    feedbackIcons: {
        correct: document.querySelector('.feedback-icon.correct'),
        wrong: document.querySelector('.feedback-icon.wrong')
    }
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
    elements.answerBtn.addEventListener('click', submitAnswer);
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
    gameState.selectedOption = null;
    gameState.isSubmitted = false;

    // Generate Questions
    gameState.currentQuestions = generateQuestions(5);

    switchScreen('quiz');
    loadQuestion();
}

// Fisher-Yates Shuffle
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function generateQuestions(count) {
    const shuffled = shuffleArray([...airports]);
    return shuffled.slice(0, count).map(correct => {
        // Generate options: 1 correct + 3 wrong
        const others = airports.filter(a => a.code !== correct.code);
        const wrongOptions = shuffleArray(others).slice(0, 3);
        const options = shuffleArray([correct, ...wrongOptions]);
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
    gameState.selectedOption = null;
    gameState.isSubmitted = false;
    elements.answerBtn.disabled = true;

    // Reset Feedback
    elements.feedbackIcons.correct.classList.remove('show');
    elements.feedbackIcons.wrong.classList.remove('show');

    q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = gameState.mode === 'normal' ? opt.name : opt.code;
        btn.onclick = () => selectOption(opt, btn);
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

function selectOption(opt, btnElement) {
    if (gameState.isSubmitted) return;

    // Remove selected class from others
    const buttons = elements.optionsGrid.querySelectorAll('.option-btn');
    buttons.forEach(b => b.classList.remove('selected'));

    // Select this one
    btnElement.classList.add('selected');
    gameState.selectedOption = opt;
    elements.answerBtn.disabled = false;
}

function submitAnswer() {
    if (gameState.isSubmitted || !gameState.selectedOption) return;

    gameState.isSubmitted = true;
    stopTimer();

    const q = gameState.currentQuestions[gameState.currentQuestionIndex];
    const isCorrect = gameState.selectedOption.code === q.target.code;
    const buttons = elements.optionsGrid.querySelectorAll('.option-btn');

    // Visual Feedback
    if (isCorrect) {
        gameState.score++;
        elements.feedbackIcons.correct.classList.add('show');
        // Find the button with the correct answer and mark it
        buttons.forEach(b => {
            if (b.classList.contains('selected')) b.classList.add('correct');
        });
    } else {
        elements.feedbackIcons.wrong.classList.add('show');
        // Find selected and mark wrong
        buttons.forEach(b => {
            if (b.classList.contains('selected')) b.classList.add('wrong');
        });
        // Highlight correct
        buttons.forEach(b => {
            const text = b.textContent;
            const correctText = gameState.mode === 'normal' ? q.target.name : q.target.code;
            if (text === correctText) b.classList.add('correct');
        });
    }

    elements.answerBtn.disabled = true;

    // Wait before next question
    setTimeout(() => {
        gameState.currentQuestionIndex++;
        loadQuestion();
    }, 1000); // 1 second to see the result
}

function handleTimeout() {
    if (gameState.isSubmitted) return;
    gameState.isSubmitted = true;

    const buttons = elements.optionsGrid.querySelectorAll('.option-btn');
    elements.answerBtn.disabled = true;

    // Show correct answer and X mark (unless they selected nothing, still wrong)
    elements.feedbackIcons.wrong.classList.add('show');

    const q = gameState.currentQuestions[gameState.currentQuestionIndex];
    buttons.forEach(b => {
        const text = b.textContent;
        const correctText = gameState.mode === 'normal' ? q.target.name : q.target.code;
        if (text === correctText) b.classList.add('correct');
    });

    setTimeout(() => {
        gameState.currentQuestionIndex++;
        loadQuestion();
    }, 1000);
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
