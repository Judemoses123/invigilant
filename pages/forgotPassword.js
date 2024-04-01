import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { useEffect, useRef, useState } from "react";
import sendOtp from "../utils/api/sendOtp";
import { useRouter } from "next/router";
import verifyCode from "../utils/api/verifyCode";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timeToReset, setTimeToReset] = useState(0);
  const [id, setId] = useState("");
  const router = useRouter();

  const emailInputRef = useRef(null);
  const otpInputRefs = useRef([...Array(4)].map(() => useRef(null)));

  async function sendCode() {
    if (email.trim().length > 5 && email.includes("@")) {
      console.log(email);
      const response = await sendOtp(email);
      console.log(response);
      if (response.status == "success") {
        setSent(true);
        resetTimer();
        setId(response.id);
      }
    } else {
      setError("Input Invalid");
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  }

  const resetTimer = () => {
    setTimeToReset(30);
    const intervalId = setInterval(() => {
      setTimeToReset((prev) => {
        if (prev == 0) {
          clearInterval(intervalId);
          return 0;
        } else {
          return prev - 1;
        }
      });
    }, 1000);
  };

  const resendOtp = async () => {
    const response = await sendOtp(email);
    console.log(response);
    if (response.status == "success") {
      setSent(true);
      resetTimer();
      setId(response.id);
    }
    resetTimer();
  };

  const verifyOtp = async () => {
    const otpString = otp.reduce((prev, curr) => prev + curr, "");
    const response = await verifyCode({ otp: otpString, id });
    if (response.status == "success") {
      localStorage.setItem("token", response.token);
      router.push(`/resetPassword/${response.id}`);
    }
  };

  useEffect(() => {
    if (sent) {
      otpInputRefs.current[0].current.focus();
    }
  }, [sent]);

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== "" && index < otp.length - 1) {
      otpInputRefs.current[index + 1].current.focus();
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center">
      <form className="flex flex-col w-[40%] m-auto">
        <div className="mb-16">
          <div className="font-bold text-4xl m-auto text-blue-500 text-center">
            Reset Password
          </div>
          <div className="w-full text-center text-sm">
            Get verification code on your registered email id.
          </div>
        </div>

        {!sent && (
          <div className="flex flex-row justify-between w-full relative items-center mt-4 mb-4">
            <EmailOutlinedIcon className="absolute m-4" />
            <label
              className="font-bold absolute top-[-15%] bg-white ml-4 text-[0.65rem] text-blue-500"
              htmlFor="email"
            >
              Email Id
            </label>

            <input
              ref={emailInputRef}
              onInput={(e) => setEmail(e.target.value)}
              name="email"
              type="email"
              placeholder="Enter your email"
              className="rounded-xl h-min bg-[white] border-blue-500 border-[1.5px] w-full p-3 pl-14 active:bg-white focus:bg-white active:border-blue-500"
            />
          </div>
        )}
        {sent && (
          <div className="grid grid-cols-4 gap-2">
            {otp.map((char, i) => (
              <input
                key={i}
                ref={otpInputRefs.current[i]}
                className="border-0 col-span-1 p-2 text-center font-bold text-xl border-b-2 border-b-blue-500"
                type="text"
                onChange={(e) => handleOtpChange(i, e.target.value)}
                autoFocus={i === 0}
                maxLength={1}
                value={otp[i]}
                aria-label={`otp-${i + 1}`}
              />
            ))}
          </div>
        )}

        {!!error && (
          <div className="text-red-400 w-full text-center">{error}</div>
        )}
        {sent && (
          <div className="flex flex-row justify-between gap-2 items-center">
            <div className="mt-2 mb-2 w-full">
              Sent a verification code to {email}
            </div>
            {timeToReset == 0 && (
              <button
                onClick={resendOtp}
                className=" text-green-500"
                type="button"
              >
                Resend
              </button>
            )}
            {timeToReset > 0 && (
              <div className=" text-blue-400 w-max whitespace-nowrap">
                {timeToReset} sec
              </div>
            )}
          </div>
        )}

        {sent && (
          <button
            className=" text-sm mt-2 mb-2"
            onClick={() => {
              setSent(false);
              setOtp(["", "", "", ""]);
            }}
          >
            Not your account? re-enter email id.
          </button>
        )}

        <button
          onClick={!sent ? sendCode : verifyOtp}
          type="button"
          className="bg-blue-500 p-4 rounded-xl h-min text-white hover:bg-blue-400 font-bold"
        >
          {!sent ? "Send Verification Code" : "Verify Code"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
