import { useEffect, useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
export default function CreateTestForm(props) {
  const [mode, setMode] = useState("mcq");
  const [question, setQuestion] = useState({
    type: "mcq",
    questionText: "",
    options: [""],
    correctOption: 1,
    points: 0,
  });
  const toggleMode = () => {
    setMode((prev) => {
      if (prev === "mcq") {
        setQuestion({
          type: "desc",
          questionText: "",
          points: question.points,
        });
        return "desc";
      }
      setQuestion({
        type: "mcq",
        questionText: "",
        options: [""],
        correctOption: 1,
        points: question.points,
      });
      return "mcq";
    });
  };
  const questionRef = useRef();
  const pointsInputRef = useRef();

  const questionTextHandler = () => {
    setQuestion((prev) => {
      return { ...prev, questionText: questionRef.current.value };
    });
  };
  const addOptionHandler = () => {
    setQuestion((prev) => {
      const newOptions = [...prev.options, ""];
      return { ...prev, options: newOptions };
    });
  };
  const editOptionHandler = (e) => {
    if (!props.editing) {
      const id = e.target.id;
      setQuestion((prev) => {
        const prevOptions = prev.options;
        prevOptions[id - 1] = e.target.value;
        return { ...prev, options: prevOptions };
      });
    }
  };
  const deleteOption = (id) => {
    setQuestion((prev) => {
      let prevOptions = [...prev.options];
      prevOptions.splice(Number(id) - 1, 1);
      return { ...prev, options: prevOptions };
    });
  };

  const correctOptionHandler = (option) => {
    setQuestion((prev) => {
      return { ...prev, correctOption: option };
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
    // pointsInputRef.current.value = "";
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

    // pointsInputRef.current.value = "";
  };

  const pointsChangeHandler = () => {
    setQuestion((prev) => {
      return { ...prev, points: pointsInputRef.current.value };
    });
  };

  useEffect(() => {
    if (props.editing && props.question) {
      setMode(props.question.type);
      setQuestion(props.question);
    }
  }, [props.editing, props.question]);

  

  return (
    <form className="border m-2 p-2 w-1/3 h-max shadow-sm rounded-md bg-white">
      <h2 className="p-2 border-b">Edit Test</h2>
      <div className="p-2 flex flex-row gap-2 w-full">
        <span className="p-2">Points:</span>
        {!props.editing && (
          <input
            onInput={pointsChangeHandler}
            ref={pointsInputRef}
            className="text-sm bg-slate-50 p-2 border"
            type="number"
            name=""
            id=""
            defaultValue={question.points}
          />
        )}
        {props.editing && (
          <input
            onInput={pointsChangeHandler}
            ref={pointsInputRef}
            className="text-sm bg-slate-50 p-2 border w-full"
            type="number"
            name=""
            id=""
            defaultValue={question.points}
          />
        )}
      </div>
      <div className="flex flex-row justify-evenly w-full p-2 gap-2">
        {!props.editing && (
          <>
            <button
              // onClick={toggleMode}
              type="button"
              className={` w-full ${
                mode === "mcq" ? "bg-[#0094c1]" : "bg-[aliceblue]"
              } ${
                mode === "mcq" ? "text-white" : "text-black"
              }  rounded-md p-2`}
            >
              Multiple Choice Question
            </button>
          </>
        )}
        {props.editing && (
          <>
            <button
              // onClick={toggleMode}
              type="button"
              className={`${
                mode === "mcq" ? "bg-[#0094c1]" : "bg-[aliceblue]"
              } ${
                mode === "mcq" ? "text-white" : "text-black"
              }  rounded-md p-2`}
            >
              Multiple Choice Question
            </button>
          </>
        )}
      </div>
      {!props.editing && (
        <textarea
          ref={questionRef}
          onInput={questionTextHandler}
          className="border w-[-webkit-fill-available] m-2 p-2"
          name="question"
          id="question"
          placeholder="Type your question here..."
        ></textarea>
      )}
      {props.editing && (
        <textarea
          ref={questionRef}
          onInput={questionTextHandler}
          className="border w-[-webkit-fill-available] m-2 p-2"
          name="question"
          id="question"
          placeholder="Type your question here..."
          defaultValue={question.questionText}
        ></textarea>
      )}
      {!props.editing &&
        mode === "mcq" &&
        question.options.map((q, index) => {
          return (
            <div className="w-full flex flex-row gap-2 p-2" key={index}>
              <input
                type="radio"
                name="option"
                id="1"
                value={index + 1}
                onChange={(e) => correctOptionHandler(e.target.value)}
                checked={index + 1 == question.correctOption ? true : false}
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
          );
        })}

      {props.editing &&
        mode === "mcq" &&
        props.question &&
        props.question.type == "mcq" &&
        question.options.map((q, index) => {
          return (
            <div className="w-full flex flex-row gap-2 p-2" key={index}>
              <input
                type="radio"
                name="option"
                id="1"
                defaultValue={index + 1}
                onChange={(e) => correctOptionHandler(e.target.value)}
                defaultChecked={
                  index + 1 == props.question.correctOption ? true : false
                }
              />
              <input
                onInput={editOptionHandler}
                className="border w-full p-2"
                type="text"
                name="option-value"
                placeholder="Type the option here..."
                id={index + 1}
                defaultValue={q}
              />
              <button
                onClick={() => deleteOption(index + 1)}
                type="button"
                className="flex flex-row items-center text-red-400"
              >
                <CloseIcon />
              </button>
            </div>
          );
        })}

      {mode === "mcq" && (
        <button
          onClick={addOptionHandler}
          className="w-[-webkit-fill-available] m-2 p-2 bg-[#0094c1] text-white rounded-md"
          type="button"
        >
          Add Option
        </button>
      )}
      {!props.editing && (
        <button
          onClick={addQuestionHandler}
          type="button"
          className="w-[-webkit-fill-available] m-2 p-2 bg-green-500 text-white rounded-md"
        >
          Add Question
        </button>
      )}
      {props.editing && (
        <button
          onClick={editQuestionHandler}
          type="button"
          className="w-[-webkit-fill-available] m-2 p-2 bg-green-500 text-white rounded-md"
        >
          Edit Question
        </button>
      )}
    </form>
  );
}
