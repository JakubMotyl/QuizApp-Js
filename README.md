# Quiz App

Simple browser-based quiz application (no build step). Uses static files to present a shuffled quiz, track per-quiz score and accumulate a total score across sessions while the page is open.

Key behaviors are implemented in [`app.js`](app.js): [`showFrontPage`](app.js), [`shuffleQuestions`](app.js), [`showQuizPage`](app.js) and [`finalPage`](app.js). Question data is exported from [`questions`](data.js) in [`data.js`](data.js). Main HTML and styles are in [`index.html`](index.html) and [`style.css`](style.css).

Features
- Start a 10-question daily quiz (questions are shuffled).
- Select answers, get instant feedback (correct/wrong).
- Progress bar and question numbering per quiz.
- Final score for the quiz and accumulated total score shown on the front page.

Quick start
1. Open [`index.html`](index.html) in your browser (recommended to serve via a static server).
   - Example (Node): run `npx http-server` in the project root and open the printed URL.
   - Example (Python): run `python -m http.server` and visit `http://localhost:8000`.
2. Click "Daily Quiz" to begin.

Files
- [`index.html`](index.html) — app entry point.
- [`style.css`](style.css) — styles for UI.
- [`app.js`](app.js) — app logic: rendering, event handling and score flow.
- [`data.js`](data.js) — exported question set as [`questions`](data.js).

Notes
- Current dataset contains 10 questions. The UI shows total points as `/200`. With 10 questions the implied maximum is $$10 \times 20 = 200$$ points (displayed as $200$).
- No persistence beyond the page lifecycle (refresh clears accumulated total).

Contributing
- Add or edit questions in [`data.js`](data.js).
- Keep the same object shape: { id, question, answers, correctAnswer }.
