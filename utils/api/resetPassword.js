export default async function resetPassword(payload) {
  try {
    const { password, id } = payload;
    const response = await fetch(`/api/resetPassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
        id,
      }),
    });

    if (!response.ok) throw new Error("somethign went wrong");
    const data = await response.json();
    return data;
    console.log(data);
  } catch (err) {
    console.log(err);
  }
}
