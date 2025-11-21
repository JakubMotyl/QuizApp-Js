import { questions } from "./data.js";

const unavailableCategories = [
  {
    quiz_title: "Math",
    quiz_desc: "12 mixed questions",
    icon: '<i class="fa-solid fa-calculator"></i>',
  },
  {
    quiz_title: "History",
    quiz_desc: "8 mixed questions",
    icon: '<i class="fa-solid fa-landmark"></i>',
  },
  {
    quiz_title: "Biology",
    quiz_desc: "6 mixed questions",
    icon: '<i class="fa-solid fa-dna"></i>',
  },
];

const wrapper = document.querySelector(".wrapper");

window.addEventListener("DOMContentLoaded", () => {
  showFrontPage();
});

const showFrontPage = () => {
  const welcomeEl = document.createElement("div");
  welcomeEl.style.display = "flex";
  welcomeEl.style.flexDirection = "column";
  welcomeEl.style.gap = "0.5rem";
  welcomeEl.style.height = "100%";

  const currentTotalScore = localStorage.getItem("totalScore") || 0;

  welcomeEl.innerHTML = `
      <div class="greeting__container">
        <div>
          <p class="greeting-top">👋 Hi,</p>
          <span class="greeting-bottom">Nice to see you!</span>
        </div>  
        <div class="total-points__container">
          <p class="total-points-top">Total points</p>
          <span class="total-points-bottom">${currentTotalScore}/200</span>
        </div>
      </div>
      <div class="quiz-boxes__container">
        <div class="quiz-box">
          <p class="category-title">👉 Practice now</p>
          <button id="startQuiz1" class="start-quiz">
            <div class="quiz-icon">
              <i class="fa-solid fa-laptop"></i>
            </div>
            <div style="display: flex; flex-direction:column; align-items:start;">
              <p class="quiz-title">Web Development</p>
              <span class="quiz-desc">10 mixed questions</span>
            </div>
          </button>
        </div>
        <div class="quiz-box">
          <p class="category-title">🤞 New quizzes coming soon </p>
          <div class="comming-quizzes">
            ${unavailableCategories
              .map(
                (category) =>
                  `
                <button class="start-quiz unavailable-btn">
                  <div class="quiz-icon">
                    ${category.icon}
                  </div>
                  <div style="display: flex; flex-direction:column; align-items:start;">
                    <p class="quiz-title">${category.quiz_title}</p>
                    <span class="quiz-desc">${category.quiz_desc}</span>
                  </div>
                </button>
              `
              )
              .join("")}
          </div>
        </div>
      </div>
  `;
  wrapper.appendChild(welcomeEl);

  const startQuizBtn = document.getElementById("startQuiz1");

  startQuizBtn.addEventListener("click", () => {
    showQuizPage(welcomeEl);
  });
};

const shuffleQuestions = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const showQuizPage = (welcomeEl) => {
  if (welcomeEl) welcomeEl.remove();

  wrapper.innerHTML = `
    <div class="question-area"></div>
    <button class="next-btn">Next Question</button>
  `;

  const questionArea = wrapper.querySelector(".question-area");
  const nextBtn = wrapper.querySelector(".next-btn");

  const shuffledArray = shuffleQuestions(questions);
  let currentQuestionIndex = 0;
  let score = 0;
  let answerSelected = false;

  let timerInterval;

  const renderQuestion = (index) => {
    clearInterval(timerInterval);

    const question = shuffledArray[index];
    answerSelected = false;
    nextBtn.disabled = true;

    let timeStart = 30;

    questionArea.innerHTML = `
      <div class="numbering__container">
        <div class="numbering-top__container">
          <div class="numbering-top">
            <p>Question</p>
            <span>${index + 1}/${shuffledArray.length}</span>
          </div>
          <div class="numbering-top">
            <p>Time Left</p>
            <span id="countdownTime">00:${timeStart}</span>
          </div>
        </div>
        <div class="progress-bar-bg">
          <div class="progress-bar"></div>
        </div>
      </div>
      <div class="questions__container">
        <div class="question-text">
          <p>${question.question}</p>
        </div>
        <div class="answers__container">
          ${question.answers
            .map(
              (answer) =>
                `
              <div class="answer-box">
                <p>${answer}</p>
              </div>
            `
            )
            .join("")}
        </div> 
      </div>
    `;

    // Coundown Function
    function handleCountdown(timeLeft) {
      const countdownTime = questionArea.querySelector("#countdownTime");

      if (!countdownTime) return;

      timerInterval = setInterval(() => {
        timeLeft--;
        countdownTime.innerHTML = `00:${
          timeLeft >= 10 ? timeLeft : `0${timeLeft}`
        }`;

        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          currentQuestionIndex++;

          if (currentQuestionIndex < shuffledArray.length) {
            renderQuestion(currentQuestionIndex);
          } else {
            finalPage(score, shuffledArray.length);
          }
        }
      }, 1000);
    }

    handleCountdown(timeStart);

    // Custom progress bar
    const progressBar = questionArea.querySelector(".progress-bar");
    const progress = ((index + 1) / shuffledArray.length) * 100;
    progressBar.style.width = `${progress}%`;

    const answerBoxes = questionArea.querySelectorAll(".answer-box");
    answerBoxes.forEach((box) => {
      box.addEventListener("click", () => {
        clearInterval(timerInterval);
        const selectedAnswer = box.textContent.trim();
        if (selectedAnswer === question.correctAnswer) {
          box.classList.add("correct-answer");
          score++;
        } else {
          box.classList.add("wrong-answer");
        }
        answerBoxes.forEach((b) => (b.style.pointerEvents = "none"));
        answerSelected = true;
        nextBtn.disabled = false;
      });
    });
  };

  // render pierwszego pytania
  renderQuestion(currentQuestionIndex);

  nextBtn.addEventListener("click", () => {
    if (!answerSelected) return;
    currentQuestionIndex++;
    if (currentQuestionIndex < shuffledArray.length) {
      renderQuestion(currentQuestionIndex);
    } else {
      finalPage(score, shuffledArray.length);
    }
  });
};

const finalPage = (score, totalQuestions) => {
  const previousTotal = parseInt(localStorage.getItem("totalScore") || 0);

  const newTotal = previousTotal + score;

  localStorage.setItem("totalScore", newTotal);

  wrapper.innerHTML = `
    <div class="final__container">
      <h2 class="final-title">🎉 Quiz Finished!</h2>
      <p class="final-score">You scored <span>${score}</span> out of <span>${totalQuestions}</span></p>
      <button class="restart-btn">Restart Quiz</button>
    </div>
  `;

  const restartBtn = wrapper.querySelector(".restart-btn");
  restartBtn.addEventListener("click", () => {
    wrapper.innerHTML = "";
    showFrontPage();
  });
};
