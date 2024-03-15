import { createAsyncThunk } from "@reduxjs/toolkit";
import { login } from "../reducers/auth";

const loginAsync = createAsyncThunk(
  "auth/loginAsync",
  async (payload, { dispatch }) => {
    const response = await fetch(
      `/api/login`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          email: payload.email,
          password: payload.password,
        }),
      }
    );
    const data = await response.json();
    console.log(data);
    if (data.status === "success") {
      dispatch(
        login({
          token: data.user.token,
          name: data.user.name,
          email: data.user.email,
        })
      );
      localStorage.setItem("token", data.user.token);
    }
    return { message: data.message, status: data.status };
  }
);
export default loginAsync;
