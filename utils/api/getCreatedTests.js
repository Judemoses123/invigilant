exports.getCreatedTests = async (test) => {
  console.log("HEY ");
  const token = localStorage.getItem("token");
  const response = await fetch(`/api/getCreatedTests`, {
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
