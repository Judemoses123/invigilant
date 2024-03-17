import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useRef, useState } from "react";
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

  const getTestData = () => {
    props.getTestData({ name: name, hour: hour, minutes: minutes });
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
      <div className=" p-2 flex flex-row justify-between border-b">
        {!props.editing && (
          <input
            onChange={(e) => setName(e.target.value)}
            type="text"
            defaultValue={"New Test"}
            contentEditable={true}
            placeholder="Test Name"
            className="p-1 rounded-sm bg-slate-50 border"
          />
        )}
        {props.editing && (
          <input
            onChange={(e) => setName(e.target.value)}
            type="text"
            value={name}
            contentEditable={true}
            placeholder="Test Name"
            className="p-1 rounded-sm bg-slate-50 border"
          />
        )}
        <div className="flex flex-row gap-2 items-center">
          <span className="">Duration:</span>
          {!props.editing && (
            <select
              name="hour"
              id="hour"
              onChange={(e) => setHour(e.target.value)}
            >
              <option value="0">0 Hour</option>
              <option value="1">1 Hour</option>
              <option value="2">2 Hour</option>
              <option value="3">3 Hour</option>
            </select>
          )}
          {props.editing && (
            <select
              name="hour"
              id="hour"
              onChange={(e) => setHour(e.target.value)}
              value={hour}
            >
              <option value="0">0 Hour</option>
              <option value="1">1 Hour</option>
              <option value="2">2 Hour</option>
              <option value="3">3 Hour</option>
            </select>
          )}
          {!props.editing && (
            <select
              name="minute"
              id="minute"
              onChange={(e) => setMinutes(e.target.value)}
            >
              <option value="0">0 Minutes</option>
              <option value="10">10 Minutes</option>
              <option value="20">20 Minutes</option>
              <option value="30">30 Minutes</option>
              <option value="40">40 Minutes</option>
              <option value="50">50 Minutes</option>
            </select>
          )}
          {props.editing && (
            <select
              name="minute"
              id="minute"
              onChange={(e) => setMinutes(e.target.value)}
              value={minutes}
            >
              <option value="0">0 Minutes</option>
              <option value="10">10 Minutes</option>
              <option value="20">20 Minutes</option>
              <option value="30">30 Minutes</option>
              <option value="40">40 Minutes</option>
              <option value="50">50 Minutes</option>
            </select>
          )}
        </div>
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
                            ? "text-green-500"
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
      {props.questions.length > 0 && (
        <div className="p-2 flex flex-row">
          <div>
            {!props.editing && (
              <button
                type="button"
                onClick={getTestData}
                className="p-2 bg-green-500 text-white rounded-md"
              >
                Create Test
              </button>
            )}
            {props.editing && (
              <button
                type="button"
                onClick={getTestData}
                className="p-2 bg-green-500 text-white rounded-md"
              >
                Edit Test
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
