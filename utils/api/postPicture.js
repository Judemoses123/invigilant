const postPicture = async (imageSrc) => {
  try {
    const token = localStorage.getItem("token");
    console.log('SNAP');
    const response = await fetch(`/api/postPicture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        imageSrc: imageSrc,
      }),
    });
    if (!response.ok) {
      throw new Error("Something went wrong");
    }
    const data = await response.json();
    console.log(data);
  } catch (err) {
    console.log(err);
  }
};
export default postPicture;
