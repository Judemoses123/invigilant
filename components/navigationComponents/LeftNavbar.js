import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import TextSnippetOutlinedIcon from "@mui/icons-material/TextSnippetOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import Link from "next/link";

import { useState } from "react";
const LeftNavbar = (props) => {
  const [showNavigation, setShowNavigation] = useState(true);
  return (
    <div
      className={`w-1/5 p-2 shadow-sm bg-white border-r h-screen flex flex-col items-center box-border ${
        showNavigation ? "w-1/5" : "w-min"
      }`}
    >
      {showNavigation && (
        <div
          onClick={() => setShowNavigation((prev) => !prev)}
          className="w-full text-2xl font-bold text-blue-500 flex justify-between border-b pb-2 pl-2 gap-4 items-center mb-4 "
        >
          <span >Invigilant</span>
          <MenuOpenIcon />
        </div>
      )}
      {!showNavigation && (
        <div
          onClick={() => setShowNavigation((prev) => !prev)}
          className="w-full text-2xl font-bold text-blue-500 border-b pb-2 italic text-center mb-4"
        >
          <MenuOutlinedIcon />
        </div>
      )}
      <div className=" text-slate-500 mt-4 w-full flex flex-col text-[14px] h-64 justify-evenly">
        <Link
          href={`/dashboard`}
          className={`items-center p-2  rounded-md flex  gap-2 ${
            props.location === "dashboard" && "text-blue-500"
          } ${showNavigation ? "flex-row" : "flex-col text-xs"}`}
        >
          <DashboardOutlinedIcon />
          <span>Dashboard</span>
        </Link>
        <Link
          href={"/my-tests"}
          className={`items-center p-2  rounded-md flex gap-2 ${
            props.location === "mytest" && "text-blue-500"
          } ${showNavigation ? "flex-row" : "flex-col text-xs"}`}
        >
          <TextSnippetOutlinedIcon />
          <span>My Tests</span>
        </Link>
        <Link
          href={`/createTest`}
          className={`items-center p-2  rounded-md flex text-center gap-2 ${
            props.location === "createTest" && "text-blue-500"
          } ${showNavigation ? "flex-row" : "flex-col text-xs"}`}
        >
          <EditNoteOutlinedIcon />
          <span>Create Test</span>
        </Link>

        {/* <Link
          href={"/responses"}
          className={`items-center p-2  rounded-md flex gap-2 ${
            props.location === "result" &&
            "bg-gradient-to-br from-[#ffffff30] to-[#ffffff18]"
          } ${showNavigation ? "flex-row" : "flex-col text-xs"}`}
        >
          <EmojiEventsOutlinedIcon />
          <span>Results</span>
        </Link> */}
        {/* <Link
          href={"/setting"}
          className={`items-center p-2  rounded-md flex gap-2 ${
            props.location === "setting" &&
            "bg-gradient-to-br from-[#ffffff30] to-[#ffffff18]"
          } ${showNavigation ? "flex-row" : "flex-col text-xs"}`}
        >
          <SettingsOutlinedIcon />
          <span>Setting</span>
        </Link> */}
      </div>
    </div>
  );
};
export default LeftNavbar;
