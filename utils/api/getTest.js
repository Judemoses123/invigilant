exports.getTest = async (testId) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`/api/getTest/${testId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });
  const data = await response.json();
  return data;
};
