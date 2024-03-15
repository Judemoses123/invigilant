import LeftNavbar from "@/components/navigationComponents/LeftNavbar";
import getUserAsync from "@/store/asyncThunks/getUserAsync";
import { getCreatedTests } from "@/utils/api/getCreatedTests";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import TopNavbar from "@/components/navigationComponents/TopNavbar";
import TestDashboard from "@/components/testComponents/TestDashboard";

const myTests = () => {
  const [createdTests, setCreatedTests] = useState([]);
  const [message, setMessage] = useState("");
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
      <div className="h-screen w-screen flex flex-row">
        <LeftNavbar location="mytest" />
        <div className="flex flex-col w-full">
          <TopNavbar location="My Tests" />
          <div className="p-2 m-2 rounded-md shadow-sm border">
            <TestDashboard
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
