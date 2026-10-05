# AP European History Unit 1 Quizzer

A no-build study site created from the supplied Unit 1 question bank. It separates multiple-choice questions from free-response questions, saves progress in the browser, supports shuffled MCQ practice, and includes the original prompt text for every item.

## Run locally

```bash
npm start
```

Then open <http://localhost:4173>.

## Notes

- MCQ items with a keyed answer in the source provide immediate feedback. A small set of source questions have no answer key printed in the supplied PDF; the app clearly marks those as self-check items rather than inventing an answer.
- The source PDF is not committed. `data/questions.js` contains the extracted study content used by the app.
