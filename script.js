'use strict';

const API_URL = 'https://opentdb.com/api.php?amount=10&type=multiple';
const title = document.getElementById('title');
const genre = document.getElementById('genre');
const difficulty = document.getElementById('difficulty');
const question = document.getElementById('question');
const stBtn = document.getElementById('st-btn');
const myAnswers = document.getElementById('my-answers');

class Quiz {
    constructor(quizData) {
        this.quizzes = quizData.results;
        this.correctAnswerNum = 0;
    }
    getQuizCategory(index) {
        return this.quizzes[index - 1].category;
    }
    getQuizDifficulty(index) {
        return this.quizzes[index - 1].difficulty;
    }
    getQuizQuestion(index) {
        return this.quizzes[index - 1].question;
    }
    getNumQuiz() {
        return this.quizzes.length;
    }
    getCorrectAnswer(index) {
        return this.quizzes[index - 1].correct_answer;
    }
    getIncorrectAnswers(index) {
        return this.quizzes[index - 1].incorrect_answers;
    }
    countCorrectAnswerSum(index, answer) {
        const correctAnswer = this.quizzes[index - 1].correct_answer;
        if (answer === correctAnswer) {
            return this.correctAnswerNum ++;
        }
    }
    getCorrectAnswerSum() {
        return this.correctAnswerNum;
    }
};

//開始ボタンを押した時の動き
stBtn.addEventListener('click', () => {
    stBtn.hidden = true;
    await fetchQuizData(1);
});

// APIからクイズデータを取得
const fetchQuizData = async (index) => {
    title.innerHTML = '取得中';
    question.innerHTML = '少々お待ち下さい';

    const response = await fetch(API_URL);
    const quizData = await response.json();
    const quizInstance = new Quiz(quizData);

    setNextQuiz(quizInstance, index);
};

//クイズの問題数に応じて条件分岐
const setNextQuiz = (quizInstance, index) => {
    while (myAnswers.firstChild) {
        myAnswers.removeChild(myAnswers.firstChild);
    }
    if (index <= quizInstance.getNumQuiz()) {
        makeQuiz(quizInstance, index);
    } else {
        finishQuiz(quizInstance);
    }
};

//クイズを作成し正答数をカウント
const makeQuiz = (quizInstance, index) => {
    title.innerHTML = `問題${index}`;
    genre.innerHTML = `[ジャンル]${quizInstance.getQuizCategory(index)}`;
    difficulty.innerHTML = `[難易度]${quizInstance.getQuizDifficulty(index)}`;
    question.innerHTML = `[クイズ]${quizInstance.getQuizQuestion(index)}`;

    const answers = buildAnswers(quizInstance, index);
    answers.forEach((answer) => {
        const answerElem = document.createElement('ol');
        myAnswers.appendChild(answerElem);

        const answerBtn = document.createElement('button');
        answerBtn.innerHTML = answer;
        myAnswers.appendChild(answerBtn);
        answerBtn.addEventListener('click', () => {
            quizInstance.countCorrectAnswerSum(index, answer);
            index ++;
            setNextQuiz(quizInstance, index);
        });
    });
};

//クイズの正答数を表示しリトライボタンを生成
const finishQuiz = (quizInstance) => {
    title.innerHTML = `あなたの正答数は${quizInstance.getCorrectAnswerSum()}です！！`;
    genre.innerHTML = '';
    difficulty.innerHTML = '';
    question.innerHTML = `再チャレンジしたい場合は以下をクリック`;
    const retryBtn = document.createElement('button');
    retryBtn.innerHTML = 'ホームに戻る';
    myAnswers.appendChild(retryBtn);
    retryBtn.addEventListener('click', () => {
        location.reload();
    });
};

//クイズの選択肢を生成
const buildAnswers = (quizInstance, index) => {
    const answers = [
        quizInstance.getCorrectAnswer(index),
        ...quizInstance.getIncorrectAnswers(index)
    ];
    return shuffleArray(answers);
};

//クイズの選択肢をランダムに配置
const shuffleArray = ([...array]) => {
    for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};