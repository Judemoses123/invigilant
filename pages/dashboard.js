import Link from "next/link";
import LeftNavbar from "../components/navigationComponents/LeftNavbar";
import TopNavbar from "../components/navigationComponents/TopNavbar";
import { useEffect, useState } from "react";
import { getCreatedTests } from "../utils/api/getCreatedTests";
import { useDispatch } from "react-redux";
import getUserAsync from "../store/asyncThunks/getUserAsync";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import TestDashboard from "../components/testComponents/TestDashboard";
const dashboard = () => {
  const [createdTests, setCreatedTests] = useState([]);
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
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
      setLoading(true);
      dispatch(getUserAsync());
      const response = await getCreatedTests();
      console.log(response);
      setCreatedTests(response.createdTests);
      setLoading(false);
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
      <main className="flex flex-row h-screen overflow-hidden">
        <LeftNavbar location="dashboard" />
        <div className="w-[100%] h-full overflow-hidden">
          <TopNavbar location={"Dashboard"} />

          <div className="flex flex-col w-full overflow-y-auto gap-2 h-full">
            <div
              style={{ textShadow: "1px 1px 17px black" }}
              className="overflow-hidden relative flex items-center justify-center h-max"
            >
              <img
                className=" object-cover w-full h-40 object-center brightness-[80%]"
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              />
              <div className="absolute flex items-center flex-col justify-center h-full  text-white z-10 top-0  m-auto align-middle">
                <div className="text-7xl font-bold drop-shadow-lg shadow-black">
                  Invigilant
                </div>
                <span>Easy, Secure, Tests</span>
              </div>
            </div>
            <div className="p-2">
              <div className=" w-full h-min border shadow-sm rounded-md mb-2 bg-white">
                <Link href={"/createTest"} className="border p-2 flex flex-row">
                  <div className=" items-center gap-2 flex flex-row">
                    <NoteAddIcon className="text-blue-500" />
                    <button className="text-blue-500">Create Test</button>
                  </div>
                </Link>
              </div>
              <div className="border w-full overflow-hidden h-full shadow-sm rounded-md bg-white">
                <div className="border-b p-2 flex flex-row justify-between sticky top-0">
                  <span>My Tests</span>
                  <Link href={"/my-tests"}>See More</Link>
                </div>
                {loading && (
                  <div className="w-full text-sm flex items-center justify-center m-4">
                    <Box sx={{ display: "flex" }}>
                      <CircularProgress />
                    </Box>
                  </div>
                )}
                <TestDashboard
                  showOptions={false}
                  copyToClipboard={copyToClipboard}
                  createdTests={createdTests}
                  size={3}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
export default dashboard;
