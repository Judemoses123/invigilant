import LeftNavbar from "../../components/navigationComponents/LeftNavbar";
import getUserAsync from "../../store/asyncThunks/getUserAsync";
import { getCreatedTests } from "../../utils/api/getCreatedTests";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import TopNavbar from "../../components/navigationComponents/TopNavbar";
import TestDashboard from "../../components/testComponents/TestDashboard";
import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const myTests = () => {
  const [createdTests, setCreatedTests] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

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
      <div className="h-screen w-screen flex flex-row">
        <LeftNavbar location="mytest" />
        <div className="flex flex-col w-full">
          <TopNavbar location="My Tests" />
          <div className="shadow-sm h-full overflow-auto">
            {loading && (
              <div className="w-full text-sm flex items-center justify-center m-4">
                <Box sx={{ display: "flex" }}>
                  <CircularProgress />
                </Box>
              </div>
            )}
            <TestDashboard
              showOptions={true}
              copyToClipboard={copyToClipboard}
              createdTests={createdTests}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default myTests;
