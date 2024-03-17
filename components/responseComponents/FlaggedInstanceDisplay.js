import { useState } from "react";
import TabIcon from "@mui/icons-material/Tab";

const FlaggedInstanceDisplay = (props) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`flex gap-2 items-center justify-start p-2 bg-slate-50 rounded-md border ${
        open ? "flex-col" : "flex-row"
      }`}
    >
      <div
        onClick={() => setOpen((prev) => !prev)}
        className={`border overflow-hidden ${open ? "w-full" : "w-40"}`}
      >
        {props.instance.flagType == "Irregular Face Detection" && (
          <img className=" object-contain" src={props.instance.image} />
        )}
        {props.instance.flagType == "Tab Change" && (
          <div className="w-full">
            <TabIcon className="w-full text-7xl text-gray-400" />
          </div>
        )}
      </div>
      <div className="flex flex-col align-top h-full items-start justify-start self-start">
        <div>
          Time: {new Date(props.instance.timestamp).toLocaleTimeString()}
        </div>
        <div>Type: {props.instance.flagType}</div>
      </div>
    </div>
  );
};

export default FlaggedInstanceDisplay;
