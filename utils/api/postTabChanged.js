const postTabChanged = async (testId) => {
  console.log(testId);
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`/api/postTabChanged`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        testId: testId,
      }),
    });
    if (!response.ok) {
      throw new Error("Something went wrong");
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
  }
};
export default postTabChanged;
