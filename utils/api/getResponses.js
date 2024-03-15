const getResponses = async (testId) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`/api/getResponses/${testId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });
  const data = await response.json();
  return data;
};

export default getResponses;
