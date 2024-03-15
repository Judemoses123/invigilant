import { getTest } from "@/utils/api/getTest";
import Test from "../../components/testComponents/Test";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import getBlankTest from "../../utils/api/getBlankTest";
import { setTestResponse } from "../../utils/api/setTest.js";
import { useDispatch, useSelector } from "react-redux";
import getUserAsync from "@/store/asyncThunks/getUserAsync";

const test = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [test, setTest] = useState(null);
  const params = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    async function fetchTest() {
      if (params) {
        const testId = params.testId;
        if (!isLoggedIn) {
          const token = localStorage.getItem("token");
          if (token) {
            dispatch(getUserAsync());
          }
        }
        if (isLoggedIn) {
          const response = await getBlankTest(testId);
          console.log(response);
          if (response.status === "success") {
            setTest(response.test);
          }
        }
      }
    }
    fetchTest();
  }, [params, isLoggedIn]);

  const setCorrectOption = (index, optionIndex) => {
    console.log(index, optionIndex);
    optionIndex = Number(optionIndex);
    setTest((prev) => {
      const newQuestions = [...prev.questions];
      newQuestions[index].correctOption = optionIndex;
      console.log({ ...prev, questions: newQuestions });
      if (test) setTestResponse({ ...prev, questions: newQuestions });
      return { ...prev, questions: newQuestions, opened: true };
    });
  };
  const setAnswerText = (index, answerText) => {
    console.log(index, answerText);
    setTest((prev) => {
      const newQuestions = [...prev.questions];
      newQuestions[index].answerText = answerText;
      console.log({ ...prev, questions: newQuestions });
      if (test) setTestResponse({ ...prev, questions: newQuestions });
      return { ...prev, questions: newQuestions, opened: true };
    });
  };
  return (
    <div>
      <Test
        setCorrectOption={setCorrectOption}
        setAnswerText={setAnswerText}
        test={test}
      />
    </div>
  );
};
export default test;
