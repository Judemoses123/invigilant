import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import HttpsOutlinedIcon from "@mui/icons-material/HttpsOutlined";
import loginAsync from "../../store/asyncThunks/loginAsync";
import signupAsync from "../../store/asyncThunks/signupAsync";
import { Link } from "@mui/material";

const AuthForm = (props) => {
  const random = Math.round(Math.random() * 4);
  const images = [
    "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  const router = useRouter();
  const dispatch = useDispatch();
  const toggleMode = () => {
    setMode((prev) => {
      if (prev === "login") return "signup";
      return "login";
    });
  };
  const [error, setError] = useState("");
  const [mode, setMode] = useState("login");

  const nameInputRef = useRef();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const signupHandler = async () => {
    const signupData = {
      name: nameInputRef.current.value,
      email: emailInputRef.current.value,
      password: passwordInputRef.current.value,
    };
    console.log(signupData);
    const response = await dispatch(signupAsync(signupData));
    console.log(response);
    if (response.payload.status === "success" && !!props.redirect) {
      router.push("/dashboard");
    } else {
      setError(response.payload.message);
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };
  const loginHandler = async () => {
    const loginData = {
      email: emailInputRef.current.value,
      password: passwordInputRef.current.value,
    };
    console.log(loginData);
    const response = await dispatch(loginAsync(loginData));
    console.log(response);
    if (response.payload.status === "success" && !!props.redirect) {
      router.push("/dashboard");
    } else {
      setError(response.payload.message);
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };
  return (
    <div className="flex flex-row from-black">
      <div className="w-1/2 h-screen  text-black flex">
        {/* <div className="w-1/2 h-20 absolute top-0 left-0 bg-gradient-to-b from-[#000000d4] to-transparent"></div> */}
        <img
          src={images[random]}
          className="object-cover object-center saturate-[1.25]"
        />
        <div className="absolute w-1/2 p-2  text-3xl font-bold text-white italic bg-gradient-to-b from-[#000000d4] to-transparent">
          Invigilant
        </div>
      </div>
      <div className="w-1/2 h-screen bg-white text-black flex p-2 flex-col align-middle justify-center">
        <div className="flex flex-col gap-5 ">
          <form className="flex flex-col gap-8 w-[55%] m-auto">
            <div className="font-bold text-6xl m-auto text-blue-500 mb-5 text-center">
              Welcome
              <div className="font-normal text-sm m-auto text-[#001f3f] align-middle">
                {mode === "login" ? "Login" : "Signup"} with Email
              </div>
            </div>
            {mode === "signup" && (
              <div className="flex flex-row justify-between w-full relative items-center">
                <PersonOutlineIcon className="absolute m-4" />
                <label
                  className=" font-bold absolute top-[-15%] bg-white ml-4 text-xs text-blue-500"
                  htmlFor="text"
                >
                  Name
                </label>
                <input
                  ref={nameInputRef}
                  name="text"
                  type="text"
                  placeholder="Enter your name"
                  className="rounded-xl  h-min bg-[white] border-blue-500 border-[1.5px] w-full p-3 pl-14 active:bg-white focus:bg-white active:border-blue-500"
                />
              </div>
            )}
            <div className="flex flex-row justify-between w-full relative items-center">
              <EmailOutlinedIcon className="absolute m-4" />
              <label
                className=" font-bold absolute top-[-15%] bg-white ml-4 text-[0.65rem] text-blue-500"
                htmlFor="email"
              >
                Email Id
              </label>
              <input
                ref={emailInputRef}
                name="email"
                type="email"
                placeholder="Enter your email"
                className="rounded-xl  h-min bg-[white] border-blue-500 border-[1.5px] w-full p-3 pl-14 active:bg-white focus:bg-white active:border-blue-500"
              />
            </div>
            <div className="flex flex-row justify-between w-full relative items-center">
              <HttpsOutlinedIcon className="absolute m-4" />
              <label
                className=" font-bold absolute top-[-15%] bg-white ml-4 text-xs text-blue-500"
                htmlFor="password"
              >
                Password
              </label>
              <input
                ref={passwordInputRef}
                name="password"
                type="password"
                placeholder="Enter your password"
                className="rounded-xl  h-min bg-white border-blue-500 border-[1.5px] w-full p-3 pl-14 active:bg-white focus:bg-white"
              />
            </div>
            {!!error && (
              <div className=" text-red-400 w-full text-center">{error}</div>
            )}
            {mode === "login" && (
              <Link href="/forgotPassword">
                <div className="text-blue-400 text-sm text-right">
                  forgot your password?
                </div>
              </Link>
            )}
            <button
              onClick={mode === "login" ? loginHandler : signupHandler}
              type="button"
              className="bg-blue-500 p-4 rounded-xl h-min mt-1 text-white hover:bg-blue-400 font-bold"
            >
              {mode === "login" ? "LOGIN" : "SIGNUP"}
            </button>
            <div onClick={toggleMode} className="text-center hover:font-bold">
              {mode === "login"
                ? `Don't have an account? Signup Now`
                : `Have an existing account? Login Now`}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
