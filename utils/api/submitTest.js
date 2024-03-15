const submitTest = async (testId) => {
  console.log(testId);
  const token = localStorage.getItem("token");
  const response = await fetch(`/api/submitTest/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({
      testId: testId,
    }),
  });
  const data = await response.json();
  console.log(data);
  return data;
};

export default submitTest;
