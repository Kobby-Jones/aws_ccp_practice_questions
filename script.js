import data from './questions.json'

function solveQuestions(quizData){
    let correct = new Set();
    let incorrect = new Set();
    let totalNumberOfQuestions = 0;
    const quizTitle = quizData.quiz_title;
    const quizDescription = quizData.quiz_description;
    const questionData = quizData.questions;
    const passPercent = quizData.pass_percent;
    const modalTextElement = document.getElementById("modal-text");
    const quizContainerElement = document.getElementById("quiz-container");
    console.log(quizDescription);

    const dialog = document.querySelector("dialog");
    const showButton = document.getElementById("view-explanatin");
    const closeButton = document.getElementById("close-modal-btn");
    const quizTitleElement = document.getElementById("quiz-title");
    const quizDescriptionElement = document.getElementById("quiz-description");

    function main() {
        // update quiz meta data
        document.title = quizTitle;
        quizTitleElement.innerHTML = quizTitle;
        quizDescriptionElement.innerHTML = quizDescription;

        const passPercentElement = document.getElementById("pass-percent");
        passPercentElement.innerHTML = passPercent + "%";
        totalNumberOfQuestions = questionData.length;
        // shuffle the questionData to randomize the order of the questions
        for (let i = questionData.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [questionData[i], questionData[j]] = [questionData[j], questionData[i]];
        }

        let formattedQuestions = questionData.map(formatSingleQuestionData);
        updateScore();
        // display the formattedQuestions
        formattedQuestions.forEach((question, idx) => {
            renderSingleQuestion(question, idx + 1);
        });
    }

    /**
     * Formats the question data from the given QuizData object.
     *
     * @param {Object} singleQuizData - The singleQuizData object containing prompt and correct_response.
     * @return {Object} The formatted question object with the following properties:
     *   - id: The ID of the question.
     *   - question: The text of the question.
     *   - answers: The array of answer options.
     *   - correctAnswer: The text of the correct answer.
     *   - explanation: The explanation of the correct answer.
     */
function formatSingleQuestionData(singleQuizData = null) {
const { prompt, correct_response, id } = singleQuizData;
const questionText = prompt.question;
const answers = prompt.answers;
const isMultipleChoice = correct_response.length > 1; // Check if multiple answers are correct

const correctAnswers = correct_response.map(
(answer) => answers[answer.toLowerCase().charCodeAt(0) - 97]
);

return {
id: id,
question: questionText,
answers: answers,
correctAnswers: correctAnswers, // Store as an array
explanation: prompt?.explanation || "",
isMultipleChoice: isMultipleChoice, // Boolean to check if it's multi-answer
};
}


    /**
     * Renders a single question with its options and submit button.
     *
     * @param {Object} singleQuestionData - The data of the question to render.
     * @param {number} rootIndex - The index of the question in the quiz.
     * @return {void} return nothing.
     */

        const renderSingleQuestion = (singleQuestionData = {}, rootIndex = 1) => {
const { id, explanation, answers, correctAnswers, question, isMultipleChoice } = singleQuestionData;

// Shuffle answers for randomization
for (let i = answers.length - 1; i > 0; i--) {
const j = Math.floor(Math.random() * (i + 1));
[answers[i], answers[j]] = [answers[j], answers[i]];
}

const optionsHTML = answers
.map((option, index) => {
    const optionId = `${id}_${index}`;
    return `
        <div class="question-lable">
            <input type="${isMultipleChoice ? "checkbox" : "radio"}" 
                    id="${optionId}" 
                    name="answer_${id}" 
                    value="${option}" />
            <label for="${optionId}">${option}</label>
        </div>
    `;
})
.join("");


const container = document.createElement("div");
container.innerHTML = `
<form data-correct-answer='${JSON.stringify(correctAnswers)}' 
        data-question-id="${id}" 
        class="single-question-container" 
        onsubmit="submitButtonListener(event)">
    <div style="display: flex; justify-content: space-between;">
        <p style="font-weight: 600">Question ${rootIndex}:</p>
    

    </div>
    <p style="margin-bottom: 8px; line-height: 1.5">${question}</p>
    <div class="options-container">
        ${optionsHTML}
    </div>
    <div style="display: flex; gap: 8px;">
        <button type="submit" id="submit-button" class="button">Submit</button>
    </div>
</form>
`;

quizContainerElement.appendChild(container);
};




    /**
     * Updates the score on the page based on the number of correct and incorrect answers.
     *
     * @return {void} This function does not return a value.
     */
    function updateScore() {
        const currentParcentageElement = document.getElementById("current-score");
        const correctAnswerElement = document.getElementById("correct-answers");
        const wrongAnswerElement = document.getElementById("wrong-answers");
        correctAnswerElement.innerHTML = correct.size;
        wrongAnswerElement.innerHTML = incorrect.size;
        const score = Number((correct.size / totalNumberOfQuestions) * 100).toFixed(2);
        currentParcentageElement.innerHTML = score;
    }

    /**
     * Handles the event when the submit button is clicked.
     *
     * @param {Event} e - The event object.
     * @return {void} This function does not return anything.
     */
        function submitButtonListener(event) {
event.preventDefault();

const form = event.target;
const correctAnswers = JSON.parse(form.dataset.correctAnswer); // Convert correct answers from JSON
const selectedAnswers = Array.from(form.querySelectorAll("input:checked")).map(input => input.value);

// Check if selected answers are correct
const isCorrect = selectedAnswers.length === correctAnswers.length &&
                selectedAnswers.every(ans => correctAnswers.includes(ans));

// Update the correct or incorrect set
if (isCorrect) {
correct.add(form.dataset.questionId); // Add to correct answers set
} else {
incorrect.add(form.dataset.questionId); // Add to incorrect answers set
}

// Update the score
updateScore();
// Get the explanation from the form's dataset
}





    function renderExplanation(ev) {
        ev.preventDefault(); // Prevent default button behavior

        const explanation = ev.target.dataset?.explanation || "No explanation found";
        const modalTextElement = document.getElementById("modal-text");
        const modal = document.getElementById("modal");

        modalTextElement.innerHTML = explanation; // Set modal content
        modal.showModal(); // Show the modal

        // Close modal when clicking outside the content
        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                modal.close();
            }
        });
}

}

solveQuestions(data)
