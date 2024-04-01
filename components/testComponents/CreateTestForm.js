import { useEffect, useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

export default function CreateTestForm(props) {
  const [mode, setMode] = useState("mcq");
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [showTimingForm, setShowTimingForm] = useState(false);
  const [name, setName] = useState("New Test");
  const [hour, setHour] = useState(0);
  const [duration, setDuration] = useState(
    !!props.test ? props.test.duration : 60
  );
  const [minutes, setMinutes] = useState(0);
  const [question, setQuestion] = useState({
    type: "mcq",
    questionText: "",
    options: [""],
    correctOption: 1,
    points: 0,
  });

  const questionRef = useRef();
  const pointsInputRef = useRef();

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === "mcq" ? "desc" : "mcq"));
    setQuestion((prevQuestion) => ({
      ...prevQuestion,
      type: mode === "mcq" ? "desc" : "mcq",
      questionText: "",
      options: mode === "mcq" ? [""] : [],
    }));
  };

  const questionTextHandler = () => {
    setQuestion((prevQuestion) => ({
      ...prevQuestion,
      questionText: questionRef.current.value,
    }));
  };

  const addOptionHandler = () => {
    setQuestion((prevQuestion) => ({
      ...prevQuestion,
      options: [...prevQuestion.options, ""],
    }));
  };

  const editOptionHandler = (e) => {
    const id = e.target.id;
    setQuestion((prevQuestion) => {
      const prevOptions = [...prevQuestion.options];
      prevOptions[id - 1] = e.target.value;
      return { ...prevQuestion, options: prevOptions };
    });
  };

  const deleteOption = (id) => {
    setQuestion((prevQuestion) => ({
      ...prevQuestion,
      options: prevQuestion.options.filter((_, index) => index + 1 !== id),
    }));
  };

  const correctOptionHandler = (option) => {
    setQuestion((prevQuestion) => ({
      ...prevQuestion,
      correctOption: option,
    }));
  };

  const getTestData = () => {
    props.getTestData({
      name,
      hour: Math.floor(duration / 60),
      minutes: duration % 60,
    });
  };

  const addQuestionHandler = () => {
    props.addQuestion(question);
    setQuestion({
      type: "mcq",
      questionText: "",
      options: [""],
      correctOption: 1,
      points: 0,
    });
    questionRef.current.value = "";
    setShowQuestionForm(false);
  };

  const editQuestionHandler = () => {
    props.getEditedQuestion({
      type: mode,
      questionText: questionRef.current.value,
      options: question.options,
      correctOption: question.correctOption,
      points: pointsInputRef.current.value,
    });
    setQuestion({
      type: "mcq",
      questionText: "",
      options: [""],
      correctOption: 1,
      points: 0,
    });
    questionRef.current.value = "";
    setShowQuestionForm(false);
  };

  const pointsChangeHandler = () => {
    setQuestion((prevQuestion) => ({
      ...prevQuestion,
      points: pointsInputRef.current.value,
    }));
  };

  useEffect(() => {
    if (props.editing && props.question) {
      setMode(props.question.type);
      setQuestion(props.question);
    }
  }, [props.editing, props.question]);

  useEffect(() => {
    if (props.test) {
      setDuration(props.test.duration);
    }
  }, [props]);
  return (
    <form className="border m-2 p-2 w-1/3 h-max shadow-sm rounded-md bg-white">
      <div className="flex flex-col justify-between gap-2">
        <input
          onInput={(e) => setName(e.target.value)}
          type="text"
          defaultValue={props.test && props.test.name}
          placeholder="Test Name"
          className="p-1 rounded-sm bg-slate-50 border"
        />

        <div className="border rounded-md">
          <div
            onClick={() => setShowQuestionForm((prev) => !prev)}
            className="flex flex-row justify-between p-2 border-b"
          >
            <div>Questions</div>
            <div>
              {!showQuestionForm ? (
                <KeyboardArrowDownIcon />
              ) : (
                <KeyboardArrowUpIcon />
              )}
            </div>
          </div>
          {(showQuestionForm || question.questionText != "") && (
            <div className="border-t">
              <div className="p-2 flex flex-row gap-2 w-full relative">
                <span className="p-2 absolute flex items-center">Points:</span>
                <input
                  onInput={pointsChangeHandler}
                  ref={pointsInputRef}
                  className={`text-${
                    props.editing ? "sm" : "base"
                  } p-2 border w-full pl-16`}
                  type="number"
                  value={question.points}
                  min={0}
                />
              </div>
              <textarea
                ref={questionRef}
                onInput={questionTextHandler}
                className="border w-[-webkit-fill-available] m-2 p-2"
                name="question"
                id="question"
                placeholder="Type your question here..."
                value={question.questionText}
              />
              {mode === "mcq" &&
                question.options.map((q, index) => (
                  <div className="w-full flex flex-row gap-2 p-2" key={index}>
                    <input
                      type="radio"
                      name="option"
                      id={index + 1}
                      value={index + 1}
                      onChange={(e) => correctOptionHandler(e.target.value)}
                      checked={index + 1 == question.correctOption}
                    />
                    <input
                      onInput={editOptionHandler}
                      className="border w-full p-2"
                      type="text"
                      name="option-value"
                      placeholder="Type the option here..."
                      id={index + 1}
                      value={q}
                    />
                    <button
                      onClick={() => deleteOption(index + 1)}
                      type="button"
                      className="flex flex-row items-center text-red-400"
                    >
                      <CloseIcon />
                    </button>
                  </div>
                ))}
              {mode === "mcq" && (
                <button
                  onClick={addOptionHandler}
                  className="w-[-webkit-fill-available] m-2 p-2 bg-blue-500 text-white border rounded-md"
                  type="button"
                >
                  Add Option
                </button>
              )}
              <button
                onClick={
                  props.editing ? editQuestionHandler : addQuestionHandler
                }
                type="button"
                className="w-[-webkit-fill-available] m-2 p-2 bg-green-500 text-white rounded-md"
              >
                {props.editing ? "Edit Question" : "Add Question"}
              </button>
            </div>
          )}
        </div>

        <div className="border rounded-md">
          <div
            onClick={() => setShowTimingForm((prev) => !prev)}
            className="flex flex-row justify-between p-2 border-b"
          >
            <div>Timings</div>
            <div>
              {!showTimingForm ? (
                <KeyboardArrowDownIcon />
              ) : (
                <KeyboardArrowUpIcon />
              )}
            </div>
          </div>
          {showTimingForm && !props.editing && (
            <div className="flex flex-col p-2 gap-2 ">
              <input
                type="range"
                min={0}
                max={180}
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              ></input>
              <div className="gap-2 flex flex-row">
                <span>{Math.floor(duration / 60)} Hours</span>
                <span>{duration % 60} Minutes</span>
              </div>
            </div>
          )}
          {showTimingForm && props.editing && (
            <div className="flex flex-col p-2 gap-2 ">
              <input
                type="range"
                min={0}
                max={180}
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              ></input>
              <div className="gap-2 flex flex-row">
                <span>{Math.floor(duration / 60)} Hours</span>
                <span>{duration % 60} Minutes</span>
              </div>
            </div>
          )}
        </div>

        {props.questions.length > 0 && (
          <div className="flex flex-row w-full">
            <div className="w-full">
              <button
                onClick={getTestData}
                type="button"
                className="p-2 bg-green-500 text-white rounded-md w-full"
              >
                {props.editing ? "Edit Test" : "Create Test"}
              </button>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
