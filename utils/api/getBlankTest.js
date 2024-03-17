const getBlankTest = async (testId) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`/api/getBlankTest/${testId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });
  const data = await response.json();
  return data;
};
export default getBlankTest;
