import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AccessAlarmsIcon from "@mui/icons-material/AccessAlarms";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { ArrowBackIos } from "@mui/icons-material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import HttpsOutlinedIcon from "@mui/icons-material/HttpsOutlined";
import loginAsync from "../../store/asyncThunks/loginAsync";
import Link from "next/link";
import { startTest } from "../../utils/api/startTest";
import signupAsync from "../../store/asyncThunks/signupAsync";
import submitTest from "../../utils/api/submitTest";
import Webcam from "react-webcam";
import postPicture from "../../utils/api/postPicture";
import postTabChanged from "../../utils/api/postTabChanged";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";

import * as canvas from "canvas";

import * as faceapi from "face-api.js";
import getUserAsync from "../../store/asyncThunks/getUserAsync";

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

export default function Test(props) {
  useEffect(() => {}, [props.test]);
  const name = useSelector((state) => state.auth.name);
  const videoRef = useRef();
  const [seconds, setSeconds] = useState(0);
  const [showOverlay, setShowOverlay] = useState(true);
  const [index, setIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");
  const [flags, setFlags] = useState(0);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const webcamRef = useRef();

  const nameInputRef = useRef();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const testContainerRef = useRef();

  useEffect(() => {
    if (!isLoggedIn) {
      async function fetchTests() {
        dispatch(getUserAsync());
      }
      fetchTests();
    }
  }, [isLoggedIn]);

  const signupHandler = async () => {
    const signupData = {
      name: nameInputRef.current.value,
      email: emailInputRef.current.value,
      password: passwordInputRef.current.value,
    };
    console.log(signupData);
    const response = await dispatch(signupAsync(signupData));
    console.log(response);
  };
  const loginHandler = async () => {
    const loginData = {
      email: emailInputRef.current.value,
      password: passwordInputRef.current.value,
    };
    console.log(loginData);
    const response = await dispatch(loginAsync(loginData));
    console.log(response);
  };

  const toggleMode = () => {
    setMode((prev) => {
      if (prev === "login") return "signup";
      return "login";
    });
  };

  const capture = async () => {
    const imageSrc = webcamRef.current ? webcamRef.current.getScreenshot() : "";
    if (!!imageSrc) {
      const response = await postPicture(imageSrc, props.test._id);
      if (!!response) {
        return response;
      }
      return {
        status: "failed",
      };
    }
    return {
      status: "failed",
    };
  };

  useEffect(() => {
    if (isLoggedIn && !!props.test) {
      setInterval(async () => {
        if (started && isLoggedIn && !!props.test && !completed) {
          const response = await capture();
          if (!!response && response.status == "success") {
            setFlags(response.flags);
          }
        }
      }, 5000);
    }
  }, [isLoggedIn, props.test]);

  useEffect(() => {
    let intervalId;
    let timeOutId;

    if (props.test) {
      if (seconds == 0) setSeconds(Number(props.test.duration) * 60);

      if (isLoggedIn && started) {
        intervalId = setInterval(() => {
          setSeconds((prev) => {
            if (prev > 0) {
              return prev - 1;
            } else {
              setCompleted(true);
              return 0;
            }
          });
        }, 1000);
        timeOutId = setTimeout(() => {
          setCompleted(true);
        }, props.test.duration * 60000);
      }
    }

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeOutId);
    };
  }, [props.test, started, isLoggedIn]);

  useEffect(() => {
    if (!!props.test && !!props.test.startTime && !!props.test.endTime) {
      if (
        Date.now() >= props.test.startTime &&
        Date.now() <= props.test.endTime
      ) {
        console.log("active");
        setStarted(true);
        setCompleted(false);
      } else {
        console.log("expired");
        setStarted(true);
        setCompleted(true);
      }
    }
  }, [props.test]);

  const setCorrectOption = (index, optionIndex) => {
    props.setCorrectOption(index, optionIndex);
  };

  const setAnswerText = (index, answerText) => {
    props.setAnswerText(index, answerText);
  };

  const startTestHandler = async () => {
    if (!!props.test) {
      console.log(props.test);
      const response = await startTest(props.test._id);
      if (response.status == "success") {
        setStarted(true);
        goFullScreen();
      } else {
        // setError(response.message);
        setTimeout(() => {
          setError("");
        }, 5000);
      }
    }
  };
  const submitHandler = async () => {
    setShowModal(false);
    setCompleted(true);
    const response = await submitTest(props.test._id);
  };

  useEffect(() => {
    document.addEventListener("visibilitychange", async (event) => {
      console.log("changed", !!props.test, isLoggedIn, started, !completed);
      if (!!props.test && isLoggedIn && started && !completed) {
        console.log(props.test);
        if (document.visibilityState == "visible") {
          console.log("tab is active");
        } else {
          console.log("tab is inactive");
          const response = await postTabChanged(props.test._id);
          if (response && response.status == "success") {
            setFlags(response.flags);
          }
        }
      }
    });
  }, []);

  const goFullScreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
    // } else {
    //   // Exit fullscreen mode if necessary
    //   if (document.exitFullscreen) {
    //     document.exitFullscreen();
    //   } else if (document.mozCancelFullScreen) {
    //     document.mozCancelFullScreen();
    //   } else if (document.webkitExitFullscreen) {
    //     document.webkitExitFullscreen();
    //   } else if (document.msExitFullscreen) {
    //     document.msExitFullscreen();
    //   }
    // }
  };

  useEffect(() => {
    const isFullscreen =
      document.fullscreenElement ||
      document.mozFullScreen ||
      document.webkitIsFullScreen ||
      document.msFullscreenElement;
    console.log(isFullscreen);
  }, []);

  return (
    <>
      {!!error && (
        <div className="p-2 w-full border border-red-400 bg-red-200 flex flex-row justify-between">
          <div>{error}</div>
          <div className=" cursor-pointer" onClick={() => setError("")}>
            X
          </div>
        </div>
      )}
      {!!!isLoggedIn && !started && !completed && (
        <div className="mr-2 mb-2 h-screen w-screen flex flex-row">
          <div
            style={{ flexDirection: "column" }}
            className={`bg-white h-full overflow-hidden ${
              !showOverlay ? "w-12" : "w-0 p-0"
            }`}
          >
            <div
              onClick={() => setShowOverlay((prev) => !prev)}
              className="text-2xl font-bold text-slate-500 italic w-full bg-white h-14 flex items-center justify-center"
            >
              <MenuIcon />
            </div>
          </div>
          <div
            className={` h-full  flex flex-col items-center justify-start w-full `}
          >
            <div className="bg-slate-50 w-full h-full flex flex-col items-center justify-center">
              <form className="flex flex-col gap-8 w-[30%] m-auto">
                {mode === "signup" && (
                  <div className="flex flex-row justify-between w-full relative items-center">
                    <PersonOutlineIcon className="absolute m-4" />
                    <label
                      className=" font-bold absolute top-[-15%] bg-white ml-4 text-xs text-[#0094c1]"
                      htmlFor="text"
                    >
                      Name
                    </label>
                    <input
                      ref={nameInputRef}
                      name="text"
                      type="text"
                      placeholder="Enter your name"
                      className="rounded-xl  h-min bg-[white] border-[#0094c1] border-[1.5px] w-full p-3 pl-14 active:bg-white focus:bg-white active:border-[#4682b4]"
                    />
                  </div>
                )}
                <div className="flex flex-row justify-between w-full relative items-center">
                  <EmailOutlinedIcon className="absolute m-4" />
                  <label
                    className=" font-bold absolute top-[-15%] bg-white ml-4 text-[0.65rem] text-[#0094c1]"
                    htmlFor="email"
                  >
                    Email Id
                  </label>
                  <input
                    ref={emailInputRef}
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className="rounded-xl  h-min bg-[white] border-[#0094c1] border-[1.5px] w-full p-3 pl-14 active:bg-white focus:bg-white active:border-[#4682b4]"
                  />
                </div>
                <div className="flex flex-row justify-between w-full relative items-center">
                  <HttpsOutlinedIcon className="absolute m-4" />
                  <label
                    className=" font-bold absolute top-[-15%] bg-white ml-4 text-xs text-[#0094c1]"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <input
                    ref={passwordInputRef}
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    className="rounded-xl  h-min bg-white border-[#0094c1] border-[1.5px] w-full p-3 pl-14 active:bg-white focus:bg-white"
                  />
                </div>
                {mode === "login" && (
                  <div className="text-slate-600 text-sm text-right">
                    forgot your password?
                  </div>
                )}
                <button
                  onClick={mode === "login" ? loginHandler : signupHandler}
                  type="button"
                  className="bg-[#0094c1] p-4 rounded-xl h-min mt-1 text-white hover:bg-[#0094c1] font-bold"
                >
                  {mode === "login" ? "LOGIN" : "SIGNUP"}
                </button>
                <div
                  onClick={toggleMode}
                  className="text-center hover:font-bold"
                >
                  {mode === "login"
                    ? `Don't have an account? Signup Now`
                    : `Have an existing account? Login Now`}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {!!isLoggedIn && !started && !completed && (
        <div className="mr-2 mb-2 h-screen w-screen flex flex-row">
          <div
            className={`bg-white h-full overflow-hidden box-border border-r ${
              showOverlay ? "w-1/5 p-2" : "w-0 p-0"
            }`}
          >
            <div className="text-2xl font-bold text-slate-500 italic text-center w-full flex flex-row items-center justify-start mb-2">
              <div
                onClick={() => setShowOverlay((prev) => !prev)}
                className=" w-full flex justify-between flex-row text-2xl font-bold text-slate-500[white] italic items-center p-2 pl-1"
              >
                <span className="pl-4">Invigilant</span>
                <MenuOpenIcon />
              </div>
            </div>
            <div className="bg-white rounded-md overflow-hidden border">
              <Webcam
                mirrored={true}
                screenshotFormat="image/jpeg"
                ref={webcamRef}
                screenshotQuality={1}
                minScreenshotHeight={720}
                minScreenshotWidth={1280}
              />
            </div>
            <div className="p-2 text-slate-500 h-min">
              <div>{`Candidate : ${name}`}</div>
            </div>
          </div>
          <div
            style={{ flexDirection: "column" }}
            className={`bg-white  h-full overflow-hidden ${
              !showOverlay ? "w-12" : "w-0 p-0"
            }`}
          >
            <div
              onClick={() => setShowOverlay((prev) => !prev)}
              className="text-2xl font-bold text-slate-500 italic w-full  h-14 flex items-center justify-center"
            >
              <MenuIcon />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center w-full">
            <div className="flex flex-col w-5/6 gap-2 ">
              <div className="text-2xl mb-4 font-bold text-blue-400">
                {props.test && `Welcome to the ${props.test.name} test`}
              </div>
              {props.test && (
                <div className=" font-semibold text-base">
                  <div>
                    Duration : {Math.floor(props.test.duration / 60)} hours{" "}
                    {props.test.duration % 60} minutes
                  </div>
                  <div>Number of questions : {props.test.questions.length}</div>
                </div>
              )}
              <header className="font-semibold text-sm mt-4">
                Test rules and guidelines.
              </header>
              <ul className="font-sm text-sm list-disc ml-4">
                <li>
                  Sit in a well-lit space with natural or artificial light.
                </li>
                <li>Choose a quiet environment to take the exam.</li>
                <li>Connect to a reliable and stable internet connection.</li>
                <li>
                  Avoid adjusting the camera angle or leaving the frame during
                  the exam.
                </li>
                <li>
                  If you are disconnected due to a technical failure, you can
                  reconnect on the same exam url, the timer will continue
                  ticking
                </li>
              </ul>
              <button
                onClick={startTestHandler}
                className=" bg-green-500 text-white p-2 rounded-md w-max mt-4 pl-4 pr-4"
              >
                Start Test
              </button>
            </div>
          </div>
        </div>
      )}

      {!!isLoggedIn && started && !completed && (
        <div
          ref={testContainerRef}
          className="mr-2 mb-2 h-screen w-screen flex flex-row"
        >
          <div
            className={` bg-white h-full overflow-hidden box-border border-r ${
              showOverlay ? "w-1/5 p-2" : "w-0 p-0"
            }`}
          >
            <div className="text-2xl border-b font-bold text-slate-500 italic text-center w-full flex flex-row items-center justify-start mb-2">
              <div
                onClick={() => setShowOverlay((prev) => !prev)}
                className="text-2xl font-bold text-slate-500 italic flex items-center justify-center p-2 pl-1"
              >
                <MenuOpenIcon />
                <span className="pl-4">Invigilant</span>
              </div>
            </div>
            <div className="bg-white rounded-md overflow-hidden border">
              {/* <video id="video" ref={videoRef} autoPlay playsInline></video> */}
              <Webcam
                mirrored={true}
                screenshotFormat="image/jpeg"
                ref={webcamRef}
                screenshotQuality={0.3}
                minScreenshotHeight={720}
                minScreenshotWidth={1280}
              />
            </div>
            <div className="p-2 text-slate-500 h-min">
              <div>{`Candidate : ${name}`}</div>
            </div>
            <div className="p-2 text-slate-500 h-min">
              <div>{`Warning Flags: ${flags}`}</div>
            </div>
          </div>
          <div
            style={{ flexDirection: "column" }}
            className={`bg-white h-full overflow-hidden ${
              !showOverlay ? "w-12" : "w-0 p-0"
            }`}
          >
            <div
              onClick={() => setShowOverlay((prev) => !prev)}
              className="text-2xl border-b font-bold text-slate-500 italic w-full h-14 flex items-center justify-center"
            >
              <MenuIcon />
            </div>
          </div>
          <div
            className={` h-full  flex flex-col items-center justify-start ${
              showOverlay ? "w-4/5" : "w-full"
            }`}
          >
            {props.test && props.test.questions.length > 0 && (
              <div className="font-bold p-2 border-b w-full justify-between flex flex-row sticky top-0 bg-white shadow-sm">
                <div className="flex items-center align-middle">
                  {props.test.name}
                </div>
                <div className="flex flex-row justify-between gap-2">
                  <div className="flex border p-2 text-nowrap rounded-md justify-between gap-2">
                    <AccessAlarmsIcon />
                    <span>
                      {`${Math.floor(seconds / (60 * 60))}h ${Math.floor(
                        (seconds % (60 * 60)) / 60
                      )}m ${seconds % 60}s`}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowModal(true)}
                    className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-md w-full"
                  >
                    Sumbit
                  </button>
                </div>
              </div>
            )}
            {props.test && (
              <div className="w-full m-auto flex flex-row h-full overflow-hidden">
                <div className="w-full overflow-auto flex flex-col justify-between">
                  {!!props.test && (
                    <div className="flex flex-col justify-between gap-4 align-top w-full p-10">
                      <div className="flex flex-row justify-between">
                        <span>{`${index + 1}) ${
                          props.test.questions[index].questionText
                        }`}</span>
                        <div className="flex flex-col gap-2">
                          <span>
                            Points: {props.test.questions[index].points}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col justify-start gap-2 w-full">
                        {props.test.questions[index].type === "mcq" &&
                          props.test.questions[index].options.map(
                            (option, idx) => {
                              return (
                                <div className="bg-slate-50 border rounded-md p-2 flex">
                                  <input
                                    key={props.test.questions[index]._id}
                                    id={index + 1}
                                    name={index + 1}
                                    value={idx + 1}
                                    type="radio"
                                    checked={
                                      props.test.questions[index]
                                        .correctOption ==
                                      idx + 1
                                    }
                                    onChange={(e) => {
                                      setCorrectOption(index, e.target.value);
                                    }}
                                  />
                                  <label
                                    htmlFor={idx + 1}
                                    className={`pl-2 pr-2 w-fit`}
                                  >
                                    {option}
                                  </label>
                                </div>
                              );
                            }
                          )}
                        {props.test.questions[index].type === "desc" && (
                          <div className="w-full">
                            <textarea
                              key={props.test.questions[index]._id}
                              onBlur={(e) => {
                                setAnswerText(index, e.target.value);
                              }}
                              defaultValue={
                                props.test.questions[index].answerText
                              }
                              className={`p-2 bg-slate-50 border rounded-md w-full`}
                              placeholder="type your answer here..."
                            ></textarea>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="flex flex-row w-full p-2 justify-between">
                    <button
                      disabled={index <= 0}
                      onClick={() => setIndex((prev) => prev - 1)}
                      className={`p-2 bg-[#006baa] text-white rounded-lg border justify-self-start ${
                        index <= 0 && "invisible"
                      }`}
                    >
                      <ArrowBackIos className="ml-2" />
                    </button>
                    <button
                      disabled={
                        props.test && index >= props.test.questions.length - 1
                      }
                      onClick={() => setIndex((prev) => prev + 1)}
                      className={`p-2 bg-[#006baa] rounded-lg text-white border justify-self-end ${
                        props.test &&
                        index >= props.test.questions.length - 1 &&
                        "invisible"
                      }`}
                    >
                      <ArrowForwardIosIcon className="ml-1 mr-1" />
                    </button>
                  </div>
                </div>
                <div className="bg-slate-50 w-72">
                  <div className="bg-slate-100 p-2 border">Questions</div>
                  <div className="bg-slate-100 p-2 grid grid-cols-6 m-2 border gap-1">
                    {props.test &&
                      props.test.questions.map((question, idx) => {
                        return (
                          <div
                            onClick={() => {
                              setIndex(idx);
                            }}
                            className={`aspect-square border-blue-950 border flex items-center justify-center font-semibold rounded-full
                      ${
                        !!question.correctOption || !!question.answerText
                          ? "bg-green-500 text-white"
                          : " text-white bg-red-400"
                      }  
                      ${idx == index ? " text-white bg-blue-500" : ""} 
                      `}
                          >
                            {idx + 1}
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {!!isLoggedIn && started && !completed && showModal && (
        <div className=" top-0 l-0 z-50 absolute w-screen h-screen flex flex-col items-center justify-center bg-[#000000a4]">
          <div className="p-6 m-auto w-2/5 rounded-md border border-black fixed z-50  flex flex-col items-center justify-evenly bg-white">
            <span>Are you sure you want to submit this test?</span>
            <div className=" flex flex-row  gap-4">
              <button
                onClick={() => setShowModal(false)}
                className=" bg-red-500 text-white p-2 rounded-md w-max mt-4 pl-4 pr-4"
              >
                Cancel
              </button>
              <button
                onClick={submitHandler}
                className=" bg-green-500 text-white p-2 rounded-md w-max mt-4 pl-4 pr-4"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      {!!isLoggedIn && started && completed && (
        <div className="h-screen w-screen bg-slate-100 flex flex-col items-center justify-center gap-20 ">
          <div className="flex flex-col items-center justify-center">
            <div className="text-4xl text-blue-500 font-bold">
              Test Submitted Succesfully
            </div>
            <div>The result will be shared with you soon</div>
          </div>
          <Link href="/dashboard">Redirect to dashboard</Link>
        </div>
      )}
    </>
  );
}
