import React, { useState } from "react";
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
  Radio,
  TextField, // Add TextField for question number input
} from "@mui/material";
import { green, red } from "@mui/material/colors";
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

const Quiz = () => {
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

  const [searchQuestionNumber, setSearchQuestionNumber] = useState(""); // Add a new state variable for question number input

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
    const correctAnswers = quizData[currentQuestionIndex].correctAnswer;

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

    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setAnswerStatus(Array(quizData.length).fill(null));
  };

  const handlePreviousQuestion = () => {
    setSelectedAnswers((prevSelectedAnswers) => {
      const newSelectedAnswers = [...prevSelectedAnswers];
      newSelectedAnswers[currentQuestionIndex] = [];
      return newSelectedAnswers;
    });

    setCurrentQuestionIndex(currentQuestionIndex - 1);
  };

  const handleSearchQuestion = () => {
    const questionNumber = parseInt(searchQuestionNumber);
    if (!isNaN(questionNumber) && questionNumber >= 1 && questionNumber <= quizData.length) {
      setCurrentQuestionIndex(questionNumber - 1);
      setSearchQuestionNumber("");
    } else {
      // Handle invalid input (e.g., display an error message)
      alert("Invalid question number. Please enter a valid question number between 1 and " + quizData.length);
    }
  };
  

  const currentQuestion = quizData[currentQuestionIndex];
  const showSolution = answerStatus[currentQuestionIndex] !== null;
  return (
    <div>
      <Navbar />
      <Paper elevation={3} className="quiz-container">
        <Typography variant="h4">AZ-104 </Typography>
        <div className="question-number">
          Question {currentQuestionIndex + 1} / {quizData.length}
        </div>
        {/* Add a TextField for entering the question number */}
        <TextField
          label="Go to Question Number"
          variant="outlined"
          type="number"
          value={searchQuestionNumber}
          onChange={(e) => setSearchQuestionNumber(e.target.value)}
          inputProps={{
            min: 1,
            max: quizData.length,
          }}
          className="MuiTextField-root" // Apply the TextField style
        />

        {/* Add a button to trigger question navigation */}
        <Button
              variant="outlined"
              color="primary"
              onClick={handleSearchQuestion}
              className="search-button" // Apply the button style
            >
              Go
      </Button>
        {currentQuestion && (
          <div className="question-container">
            <Typography variant="h6">
              Question {currentQuestionIndex + 1}
            </Typography>
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
                      <Radio checked={selectedAnswers[currentQuestionIndex][0] === index} />
                    ) : (
                      <Checkbox checked={selectedAnswers[currentQuestionIndex].includes(index)} />
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
            <div className="navigation-buttons">
              <Button
                variant="outlined"
                color="primary"
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                Previous Question
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleNextQuestion}
                disabled={
                  currentQuestionIndex === quizData.length - 1 ||
                  selectedAnswers[currentQuestionIndex].length === 0
                }
              >
                Next Question
              </Button>
            </div>
          </div>
        )}
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
        {currentQuestionIndex === quizData.length && (
          <div className="quiz-completed">
            <Typography variant="h6">Quiz Completed!</Typography>
            <Typography variant="body1">Your score: {score}</Typography>
          </div>
        )}
      </Paper>
    </div>
  );
};

export default Quiz;
