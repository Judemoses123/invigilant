import LeftNavbar from "../../components/navigationComponents/LeftNavbar";
import TopNavbar from "../../components/navigationComponents/TopNavbar";
import CreateTestForm from "../../components/testComponents/CreateTestForm";
import TestDisplay from "../../components/testComponents/TestDisplay";
import { useEffect, useState } from "react";
import { addTest } from "../../utils/api/addTest";
import { useRouter } from "next/router";
import { useParams } from "next/navigation";
import { getTest } from "../../utils/api/getTest";
import { editTestData } from "../../utils/api/editTestData";

const editTest = () => {
  const params = useParams();
  const router = useRouter();
  const [testId, setTestId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  const [test, setTest] = useState(null);
  const addQuestion = (question) => {
    setQuestions((prev) => {
      return [question, ...prev];
    });
  };

  const editHandler = (index) => {
    console.log(index);
    setEditing(true);
    setEditIndex(index);
  };

  const deleteHandler = (index) => {
    setQuestions((prev) => {
      return prev.filter((item, idx) => idx != index);
    });
  };

  const getEditedQuestion = (question) => {
    if (editing) {
      console.log(question);
      setQuestions((prev) => {
        const newQuestion = [...prev];
        newQuestion[editIndex] = question;
        return newQuestion;
      });
    }
    setEditIndex(-1);
  };

  const getTestData = async (data) => {
    const testData = { ...data, questions, testId: testId };
    const response = await editTestData(testData);
    if (response.status === "success") {
      router.replace("/dashboard");
    }
  };

  useEffect(() => {
    async function fetchTest() {
      if (params) {
        const testId = params.testId;
        console.log(testId);
        const response = await getTest(testId);
        console.log(response);
        setQuestions(response.test.questions);
        setTestId(testId);
        setTest(response.test);
      }
    }
    fetchTest();
  }, [params]);
  return (
    <div className="flex flex-row h-full overflow-y-auto">
      <LeftNavbar />
      <div className="w-full h-full overflow-y-hidden overflow-x-hidden">
        <TopNavbar />
        <div className="h-full overflow-y-auto flex flex-row mb-10 pb-10">
          <CreateTestForm
            editing={editing}
            addQuestion={addQuestion}
            question={editing ? questions[editIndex] : null}
            getEditedQuestion={getEditedQuestion}
          />
          <TestDisplay
            editing={true}
            test={test}
            editHandler={editHandler}
            deleteHandler={deleteHandler}
            questions={questions}
            getTestData={getTestData}
          />
        </div>
      </div>
    </div>
  );
};

export default editTest;
