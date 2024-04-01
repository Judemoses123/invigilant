import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useRef, useState } from "react";
import PreviewIcon from "@mui/icons-material/Preview";
export default function TestDisplay(props) {
  const [name, setName] = useState("New Test");
  const [hour, setHour] = useState(0);
  const [minutes, setMinutes] = useState(0);

  const editHandler = (index) => {
    console.log(index);
    props.editHandler(index);
  };

  const deleteHandler = (index) => {
    console.log(index);
    props.deleteHandler(index);
  };

  useEffect(() => {
    let hours;
    let minute;
    if (props.editing && props.test) {
      hours = Math.floor(props.test.duration / 60);
      minute = props.test.duration % 60;
      setName(props.test.name);
      console.log(hours);
      setHour(hours);
      console.log(minute);
      setMinutes(minute);
    }
  }, [props.test]);

  return (
    <div className="border mr-2 mt-2 mb-2 w-full h-fit shadow-sm rounded-md bg-white">
      <div className=" p-2 flex flex-row justify-start gap-2 border-b">
        <PreviewIcon className=" text-blue-500" />
        <span>Preview</span>
      </div>
      <div className="h-fit bg-white">
        {props.questions.map((question, qIndex) => {
          return (
            <div className="flex flex-col justify-between p-2 border-b gap-4 align-top">
              <div className="flex flex-row justify-between">
                <span>{question.questionText}</span>
                <div className="flex flex-col gap-2">
                  <span>Points: {question.points}</span>
                  <div className="text-sm flex flex-row">
                    <span
                      onClick={() => editHandler(qIndex)}
                      className="text-green-500 border-r pr-2"
                    >
                      <EditIcon />
                    </span>
                    <span
                      onClick={() => deleteHandler(qIndex)}
                      className="text-red-500 pl-2"
                    >
                      <DeleteIcon />
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-row justify-start gap-10 w-full">
                {question.type === "mcq" &&
                  question.options.map((option, index) => {
                    return (
                      <span
                        className={`pl-2 pr-2 bg-slate-50 border rounded-md 
                        ${
                          index == Number(question.correctOption) - 1
                            ? "text-green-500 bg-green-500 border-green-500"
                            : "text-black"
                        }
                        `}
                      >
                        {option}
                      </span>
                    );
                  })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
