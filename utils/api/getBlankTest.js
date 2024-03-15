const getBlankTest = async (testId) => {
  console.log(testId);
  const token = localStorage.getItem("token");
  const response = await fetch(`/api/getBlankTest/${testId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });
  const data = await response.json();
  console.log(data);
  return data;
};
export default getBlankTest;
