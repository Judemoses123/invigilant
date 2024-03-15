import LeftNavbar from "@/components/navigationComponents/LeftNavbar";
import TopNavbar from "@/components/navigationComponents/TopNavbar";
import CreateTestForm from "../components/testComponents/CreateTestFrom";
import TestDisplay from "../components/testComponents/TestDisplay";
import { useEffect, useState } from "react";
import { addTest } from "../utils/api/addTest";
import { useRouter } from "next/router";

const createTest = () => {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);

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
    const testData = { ...data, questions };
    console.log(testData);
    const response = await addTest(testData);
    if (response.status === "success") {
      router.replace("/dashboard");
    }
  };

  return (
    <div className="flex flex-row h-full overflow-y-auto">
      <LeftNavbar location="createTest" />
      <div className="w-full h-full overflow-y-hidden overflow-x-hidden">
        <TopNavbar />
        <div className="h-full overflow-y-auto flex flex-row mb-10 pb-10">
          <CreateTestForm
            editing={editing}
            addQuestion={addQuestion}
            question={questions[editIndex]}
            getEditedQuestion={getEditedQuestion}
          />
          <TestDisplay
            editing={false}
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

export default createTest;
