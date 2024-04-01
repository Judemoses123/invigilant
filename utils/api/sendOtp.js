export default async function sendOtp(email) {
  try {
    const response = await fetch("/api/sendCode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
      }),
    });

    if (!response.ok) {
      throw new Error("Send OTP Failed");
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
  }
}
