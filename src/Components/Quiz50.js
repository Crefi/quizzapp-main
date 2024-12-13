import React, { useState, useEffect } from "react";
import quizData from "../QuizData/quizData.json";
import {
  Typography,
  Paper,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  AppBar,
  Toolbar,
  Badge,
  Radio
} from "@mui/material";
import { green, red } from "@mui/material/colors";
import { shuffle } from "lodash";
import "./Quiz.css";

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">Quiz App</Typography>
      </Toolbar>
    </AppBar>
  );
};
const Quiz50 = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(
    quizData.map(() => [])
  );

  const [answerStatus, setAnswerStatus] = useState(
    Array(quizData.length).fill(null)
  );
  const [rightCount, setRightCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [originalQuestionNumber, setOriginalQuestionNumber] = useState(null);

  const [randomizedQuestions, setRandomizedQuestions] = useState([]);

  useEffect(() => {
    const shuffledQuestions = shuffle(quizData);
    setRandomizedQuestions(shuffledQuestions.slice(0, 50));
  }, []);

useEffect(() => {
  if (randomizedQuestions.length > 0) {
    const currentQuestion = randomizedQuestions[currentQuestionIndex];
    const questionIndexInOriginal = quizData.findIndex(
      (question) => question.question === currentQuestion.question
    );
    setOriginalQuestionNumber(questionIndexInOriginal + 1);
  }
}, [currentQuestionIndex, randomizedQuestions]);

  


  const handleAnswerChange = (event) => {
    const optionIndex = parseInt(event.target.value);
    const updatedSelectedAnswers = [...selectedAnswers];

    if (currentQuestion.type === "single") {
      updatedSelectedAnswers[currentQuestionIndex] = [optionIndex];
    } else {
      if (updatedSelectedAnswers[currentQuestionIndex].includes(optionIndex)) {
        updatedSelectedAnswers[currentQuestionIndex] = updatedSelectedAnswers[
          currentQuestionIndex
        ].filter((item) => item !== optionIndex);
      } else {
        updatedSelectedAnswers[currentQuestionIndex].push(optionIndex);
      }
    }

    setSelectedAnswers(updatedSelectedAnswers);
  };

  const handleShowSolution = () => {
    const newAnswerStatus = [...answerStatus];
    const correctAnswers =
      randomizedQuestions[currentQuestionIndex].correctAnswer;

    const isCorrect =
      JSON.stringify(selectedAnswers[currentQuestionIndex].sort()) ===
      JSON.stringify(correctAnswers.sort());

    newAnswerStatus[currentQuestionIndex] = isCorrect ? "correct" : "incorrect";
    setAnswerStatus(newAnswerStatus);

    if (isCorrect) {
      setScore(score + 1);
      setRightCount((prevRightCount) => prevRightCount + 1);
    } else {
      setWrongCount((prevWrongCount) => prevWrongCount + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswers((prevSelectedAnswers) => {
      const newSelectedAnswers = [...prevSelectedAnswers];
      newSelectedAnswers[currentQuestionIndex] = [];
      return newSelectedAnswers;
    });

    setCurrentQuestionIndex((prevIndex) => {
      const newIndex = prevIndex + 1;
      return newIndex < randomizedQuestions.length ? newIndex : prevIndex;
    });

    setAnswerStatus(Array(randomizedQuestions.length).fill(null));
  };

  const handlePreviousQuestion = () => {
    setSelectedAnswers((prevSelectedAnswers) => {
      const newSelectedAnswers = [...prevSelectedAnswers];
      newSelectedAnswers[currentQuestionIndex] = [];
      return newSelectedAnswers;
    });

    setCurrentQuestionIndex((prevIndex) => {
      const newIndex = prevIndex - 1;
      return newIndex >= 0 ? newIndex : prevIndex;
    });
  };

  const handleFinishQuiz = () => {
    setQuizCompleted(true);
  };

  const currentQuestion = randomizedQuestions[currentQuestionIndex];
  const showSolution = answerStatus[currentQuestionIndex] !== null;
  const isLastQuestion = currentQuestionIndex === randomizedQuestions.length - 1;

  const finalScore = (score / randomizedQuestions.length) * 100;

  return (
    <div>
      <Navbar />
      <Paper elevation={3} className="quiz-container">
        <Typography variant="h4">AZ-104 </Typography>
       

        <div className="question-container">
          {currentQuestion ? (
            <>
              <Typography variant="h6">
                {isLastQuestion
                  ? "Quiz Completed!"
                  : `Question ${currentQuestionIndex + 1} / ${randomizedQuestions.length}`}
              </Typography>
              {originalQuestionNumber && (
                <Typography variant="body1"  style={{ marginBottom: '8px' }}>
                  Original Question Number: {originalQuestionNumber} 
                </Typography>
              )}
              <Typography variant="body1">
                  {currentQuestion.question.split('\n').map((line, index) => (
                    <span key={index}>
                      {line}
                    <br />
                    </span>
                  ))}
            </Typography>
              {currentQuestion.questionImage && (
                <img
                  src={currentQuestion.questionImage}
                  alt={`Question ${currentQuestionIndex + 1}`}
                  className="question-image"
                />
              )}
              <FormGroup
                value={selectedAnswers[currentQuestionIndex]}
                onChange={handleAnswerChange}
                className="FormGroup"
              >
                {currentQuestion.options.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    value={index.toString()}
                    control={
                      currentQuestion.type === "single" ? (
                        <Radio
                          checked={selectedAnswers[currentQuestionIndex][0] === index}
                        />
                      ) : (
                        <Checkbox
                          checked={selectedAnswers[currentQuestionIndex].includes(
                            index
                          )}
                        />
                      )
                    }
                    label={`${String.fromCharCode(65 + index)}. ${option}`}
                    className={
                      showSolution &&
                      (currentQuestion.correctAnswer.includes(index)
                        ? "correct"
                        : selectedAnswers[currentQuestionIndex].includes(index) &&
                          !currentQuestion.correctAnswer.includes(index)
                        ? "incorrect"
                        : "")
                    }
                    style={{
                      backgroundColor:
                        showSolution &&
                        (currentQuestion.correctAnswer.includes(index)
                          ? green[100]
                          : selectedAnswers[currentQuestionIndex].includes(index)
                          ? red[100]
                          : ""),
                    }}
                  />
                ))}
              </FormGroup>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleShowSolution}
                disabled={selectedAnswers[currentQuestionIndex].length === 0 || showSolution}
              >
                Show Answer
              </Button>
            </>
          ) : (
            <Typography variant="body1">No question available.</Typography>
          )}
          <div className="navigation-buttons">
            <Button
              variant="outlined"
              color="primary"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0 || isLastQuestion}
            >
              Previous Question
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={isLastQuestion ? handleFinishQuiz : handleNextQuestion}
              disabled={(isLastQuestion && quizCompleted) || selectedAnswers[currentQuestionIndex].length === 0}
            >
              {isLastQuestion ? "Finish Quiz" : "Next Question"}
            </Button>
          </div>
        </div>
        <div className="statistics">
          <Badge color="success" badgeContent={rightCount} className="badge">
            <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
              Right
            </Typography>
          </Badge>
          <span className="divider">|</span>
          <Badge color="error" badgeContent={wrongCount} className="badge">
            <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
              Wrong
            </Typography>
          </Badge>
        </div>
        {showSolution && (
          <div className="solution-description">
            {currentQuestion.answerImage && (
              <img
                src={process.env.PUBLIC_URL + currentQuestion.answerImage}
                alt={`Answer for Question ${currentQuestionIndex + 1}`}
                className="answer-image"
              />
            )}
            <Typography variant="body2">
              Correct Answer(s):{" "}
              {currentQuestion.correctAnswer
                .map((index) => String.fromCharCode(65 + index))
                .join(", ")}
            </Typography>
            <a
              href={currentQuestion.link}
              target="_blank"
              rel="noopener noreferrer"
              className="external-link"
            >
              ExamTopics Link For the Question
            </a>
          </div>
        )}
        {quizCompleted && (
          <div className="quiz-completed">
            <Typography variant="h6">Your Final Score:</Typography>
            <Typography variant="body1">{finalScore.toFixed(2)}%</Typography>
          </div>
        )}
      </Paper>
    </div>
  );
};

export default Quiz50;
