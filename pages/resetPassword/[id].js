import { PasswordOutlined } from "@mui/icons-material";
import { useEffect, useState } from "react";
import resetPassword from "../../utils/api/resetPassword";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";

const ResetPassword = () => {
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [id, setId] = useState(null);
  const params = useParams();
  const router = useRouter();
  const updatePassword = async () => {
    if (password.trim().length < 5 || confirmPassword.trim().length < 0) {
      setError("Invalid Password");
    }
    if (password != confirmPassword) {
      setError("Passwords do not match");
    }
    const response = await resetPassword({ password, id });
    if (response.status === "success") {
      router.push("/dashboard");
    }
  };

  useEffect(() => {
    if (params) {
      setId(params["id"]);
    }
  }, [params]);

  return (
    <div className="w-screen h-screen flex flex-col items-center">
      <form className="flex flex-col w-[40%] m-auto">
        <div className="mb-16">
          <div className="font-bold text-4xl m-auto text-blue-500 text-center">
            Reset Password
          </div>
        </div>

        <div className="flex flex-row justify-between w-full relative items-center mt-4 mb-4">
          <PasswordOutlined className="absolute m-4" />
          <label
            className="font-bold absolute top-[-15%] bg-white ml-4 text-[0.65rem] text-blue-500"
            htmlFor="password"
          >
            Password
          </label>

          <input
            onInput={(e) => setPassword(e.target.value)}
            name="password"
            type="password"
            placeholder="Enter your password"
            className="rounded-xl h-min bg-[white] border-blue-500 border-[1.5px] w-full p-3 pl-14 active:bg-white focus:bg-white active:border-blue-500"
          />
        </div>

        <div className="flex flex-row justify-between w-full relative items-center mt-4 mb-4">
          <PasswordOutlined className="absolute m-4" />
          <label
            className="font-bold absolute top-[-15%] bg-white ml-4 text-[0.65rem] text-blue-500"
            htmlFor="password"
          >
            Confirm Password
          </label>

          <input
            onInput={(e) => setConfirmPassword(e.target.value)}
            name="password"
            type="text"
            placeholder="Enter your password"
            className="rounded-xl h-min bg-[white] border-blue-500 border-[1.5px] w-full p-3 pl-14 active:bg-white focus:bg-white active:border-blue-500"
          />
        </div>

        {!!error && (
          <div className="text-red-400 w-full text-center">{error}</div>
        )}

        <button
          onClick={updatePassword}
          type="button"
          className="bg-blue-500 p-4 rounded-xl h-min text-white hover:bg-blue-400 font-bold"
        >
          Update Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
