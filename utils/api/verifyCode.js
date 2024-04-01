const verifyCode = async (payload) => {
  const { otp, id } = payload;

  const response = await fetch(`/api/verifyCode/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      otp,
      id,
    }),
  });
  const data = await response.json();
  console.log(data);
  return data;
};

export default verifyCode;
