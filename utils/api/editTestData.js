exports.editTestData = async (test) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`/api/editTest`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({
      ...test,
    }),
  });
  const data = await response.json();
  console.log(data);
  return data;
};
