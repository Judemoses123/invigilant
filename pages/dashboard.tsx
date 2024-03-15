import Link from "next/link";
import LeftNavbar from "../components/navigationComponents/LeftNavbar";
import TopNavbar from "../components/navigationComponents/TopNavbar";
import { useEffect, useState } from "react";
import { getCreatedTests } from "../utils/api/getCreatedTests";
import { useDispatch } from "react-redux";
import getUserAsync from "../store/asyncThunks/getUserAsync";

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import TestDashboard from "../components/testComponents/TestDashboard";
const dashboard = () => {
  const [createdTests, setCreatedTests] = useState([]);
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");

  const copyToClipboard = (text) => {
    setMessage("Test Link Copied");
    setTimeout(() => {
      setMessage("");
    }, 2000);
    console.log("text", text);
    var textField = document.createElement("textarea");
    textField.innerText = text;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
  };

  useEffect(() => {
    async function fetchTests() {
      dispatch(getUserAsync());
      const response = await getCreatedTests();
      console.log(response);
      setCreatedTests(response.createdTests);
    }
    fetchTests();
  }, []);
  return (
    <>
      {!!message && (
        <div className="p-2 border border-green-400 bg-green-100 flex flex-row justify-between">
          <div>{message}</div>
          <CloseOutlinedIcon onClick={() => setMessage("")} />
        </div>
      )}
      <main className="flex flex-row">
        <LeftNavbar location="dashboard" />
        <div className="w-[100%] ">
          <TopNavbar location={"Dashboard"} />
          <div className="flex flex-row w-full  max-h-[calc(100vh-2.5rem)] overflow-y-auto p-2 gap-2">
            <div className="border  w-1/2 overflow-x-hidden shadow-sm rounded-md">
              <div className="border-b p-2 flex flex-row justify-between">
                <span>My Tests</span>
                <Link href={"/my-tests"}>See More</Link>
              </div>

              <TestDashboard copyToClipboard={copyToClipboard} createdTests={createdTests} />
            </div>
            <div className=" w-1/2 h-min border shadow-sm rounded-md">
              <div className="border p-2">
                <Link href={"/createTest"}>
                  <button className="text-blue-800 hover:text-blue-500">
                    Create Test
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
export default dashboard;
