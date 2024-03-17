import { createAsyncThunk } from "@reduxjs/toolkit";
import { login } from "../reducers/auth";

const getUserAsync = createAsyncThunk(
  "auth/getUserAsync",
  async (payload, { dispatch }) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`/api/getUser`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      method: "GET",
    });
    const data = await response.json();
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
export default getUserAsync;
