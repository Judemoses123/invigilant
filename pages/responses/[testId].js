import { useParams } from "next/navigation";
import TopNavbar from "../../components/navigationComponents/TopNavbar";
import { useEffect, useState } from "react";
import getResponses from "../../utils/api/getResponses";
import getUserAsync from "../../store/asyncThunks/getUserAsync";
import { useDispatch } from "react-redux";
import LeftNavbar from "../../components/navigationComponents/LeftNavbar";
import { useRouter } from "next/router";
import FlaggedInstanceDisplay from "../../components/responseComponents/FlaggedInstanceDisplay";
import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const response = () => {
  const params = useParams();
  const [testId, setTestId] = useState(null);
  const [test, setTest] = useState(null);
  const [solvedTest, setSolvedTest] = useState(null);
  const dispatch = useDispatch();
  const [mode, setMode] = useState("questions");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  console.log(router.asPath.split("/")[1]);

  useEffect(() => {
    async function fetchTests() {
      dispatch(getUserAsync());
    }
    fetchTests();
  }, []);
  useEffect(() => {
    if (params) {
      setTestId(params["testId"]);
    }
  }, [params]);
  useEffect(() => {
    async function getResponsesFetcher() {
      setLoading(true);
      if (testId) {
        const response = await getResponses(testId);
        console.log(response);
        if ((response.status = "success")) setTest(response.test);
      }
      setLoading(false);
    }

    getResponsesFetcher();
  }, [testId]);
  return (
    <div className="w-screen h-screen overflow-hidden flex flex-row">
      <LeftNavbar location="mytest" />
      <div className="flex flex-col w-full h-full">
        <TopNavbar location={"Responses"} />
        <div className="flex flex-row p-2 gap-2 h-full overflow-auto w-full ">
          <div className="w-1/3 border h-full overflow-hidden pb-10 shadow-md rounded-md bg-white">
            <div className="p-2 border-b">All Responses</div>
            <ul className="h-full overflow-auto">
              {loading && (
                <div className="w-full text-sm flex items-center justify-center m-4">
                  <Box sx={{ display: "flex" }}>
                    <CircularProgress />
                  </Box>
                </div>
              )}
              {test &&
                test.solved.map((t, index) => {
                  return (
                    <div
                      onClick={() => setSolvedTest(t)}
                      className={`flex flex-row w-full border border-b p-2 justify-between items-center ${
                        solvedTest && solvedTest._id === t._id && "bg-slate-100"
                      }`}
                    >
                      <div className="flex flex-col">
                        <div>{t.userId.name}</div>
                        <div className=" text-sm">{t.userId.email}</div>
                      </div>
                      <div className="text-sm">
                        <div>
                          {t.scoredPoints}/{test.totalPoints} Points
                        </div>
                        <div>
                          {t.flaggedInstances.length > 0 && (
                            <div className=" text-red-400">
                              {t.flaggedInstances.length} Warnings
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </ul>
          </div>
          <div className="w-2/3 border h-full overflow-auto shadow-md rounded-md bg-white">
            {solvedTest && (
              <div className="flex flex-row w-full p-2 gap-2 sticky top-0 bg-white border-b">
                <div
                  onClick={() => setMode("questions")}
                  className={`p-2 w-full rounded-md border ${
                    mode === "questions" &&
                    "bg-gradient-to-br from-[#006baa] to-[#0094c1] text-white"
                  }`}
                >
                  Questions
                </div>
                {solvedTest.flaggedInstances.length > 0 && (
                  <div
                    onClick={() => setMode("flags")}
                    className={`p-2 w-full rounded-md border ${
                      mode === "flags" &&
                      "bg-gradient-to-br from-[#006baa] to-[#0094c1] text-white"
                    }`}
                  >
                    Flags
                  </div>
                )}
              </div>
            )}
            {solvedTest &&
              mode &&
              mode == "questions" &&
              solvedTest.questions.map((q, index) => {
                return (
                  <div className="p-2  m-2 mt-2 flex flex-col gap-2 border rounded-md mb-6 bg-slate-50">
                    <div className="w-full flex flex-row justify-between">
                      <div>{`${index + 1}) ${q.questionText}`}</div>
                      <div>{q.points} Points</div>
                    </div>
                    <div className="flex flex-col w-full gap-2">
                      {q.type === "mcq" &&
                        q.options.map((o, i) => {
                          return (
                            <div className="w-full flex flex-row items-center gap-2">
                              <span
                                className={`border p-1 rounded-md w-full ${
                                  i + 1 == +q.correctOption &&
                                  (+q.correctOption ==
                                  +test.questions[index].correctOption
                                    ? "border-green-400 bg-green-100"
                                    : "border-red-500 bg-red-100")
                                } ${
                                  !!!q.correctOption &&
                                  i + 1 ==
                                    +test.questions[index].correctOption &&
                                  "border-blue-400 bg-blue-100"
                                }`}
                              >
                                {o}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                );
              })}
            {solvedTest && mode && mode == "flags" && (
              <div className="p-2 flex flex-col gap-1">
                {solvedTest.flaggedInstances.map((instance) => {
                  return <FlaggedInstanceDisplay instance={instance} />;
                })}
              </div>
            )}
            {!solvedTest && (
              <div className="w-full h-full flex items-center justify-center">
                Select result to see responses
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default response;
