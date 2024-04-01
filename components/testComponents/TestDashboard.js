import Link from "next/link";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import LinkIcon from "@mui/icons-material/Link";
import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import WbIncandescentOutlinedIcon from "@mui/icons-material/WbIncandescentOutlined";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";

const TestDashboard = (props) => {
  return (
    <ul className="p-2 overflow-x-hidden overflow-y-auto h-full flex flex-col gap-2">
      {props.createdTests &&
        props.createdTests
          .filter((item, index) => {
            if (props.size) {
              return index < props.size;
            } else {
              return index < props.createdTests.length;
            }
          })
          .map((test) => {
            const hours = Math.floor(test.testId.duration / 60);
            const minutes = test.testId.duration % 60;
            return (
              <li className="flex flex-col border-b p-2 gap-1 text-sm  rounded-md border bg-white">
                <div className="flex flex-row w-full justify-between mb-2">
                  <div className=" flex flex-col">
                    <span className="text-base col-span-2 font-semibold ">
                      {test.name}
                    </span>

                    <span className="italic text-xs col-span-1">
                      {`${test.testId.questions.length} Multiple Choice Questions`}
                    </span>
                  </div>
                  <div className="">
                    <div className="flex flex-row gap-2">
                      <span className="text-sm col-span-1 border pl-2 pr-2 flex flex-row items-center">
                        <AccessTimeOutlinedIcon className="text-sm m-auto" />
                        <div>
                          {`${hours > 0 ? hours + "h" : ""} ${
                            minutes > 0 ? minutes + "m" : ""
                          }`}
                        </div>
                      </span>
                      <div className="border pl-2 pr-2">
                        {test.testId.totalPoints} Points
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid-cols-3 grid gap-1 col-span-2">
                  <button
                    onClick={() =>
                      props.copyToClipboard(
                        `https://invigilant-test.vercel.app/test/${test.testId._id}`
                      )
                    }
                    className="flex flex-row gap-2 items-center justify-start  p-2 pl-4 border row-span-1"
                  >
                    <LinkIcon className="text-blue-400 text-[1.2rem]" />
                    Copy
                  </button>
                  <Link
                    href={`/editTest/${test.testId._id}`}
                    className="flex flex-row gap-2 items-center justify-startp-2 p-2 pl-4  border row-span-1"
                  >
                    <EditNoteOutlinedIcon className=" text-green-500 text-[1.2rem]" />
                    Edit
                  </Link>
                  <Link
                    href={`/responses/${test.testId._id}`}
                    className="flex flex-row gap-2 items-center justify-start p-2 pl-4  border row-span-1"
                  >
                    <QuizOutlinedIcon className="text-orange-500 text-[1.2rem]" />
                    Responses
                  </Link>
                </div>
                {props.showOptions && (
                  <div className="flex flex-row w-full justify-stretch gap-1">
                    <span className="w-full border p-2 flex flex-row items-center justify-start gap-2 ">
                      <div className=" p-2 aspect-square rounded-full bg-blue-200 text-blue-500">
                        <PersonOutlineOutlinedIcon />
                      </div>
                      <div className="flex flex-col justify-start">
                        <div>Total Responses</div>
                        <div className="font-semibold text-xl">
                          {test.testId.solved.length}
                        </div>
                      </div>
                    </span>
                    <span className="w-full border p-2 flex flex-row items-center justify-start gap-2">
                      <div className=" p-2 aspect-square rounded-full bg-green-200 text-green-500">
                        <WbIncandescentOutlinedIcon />
                      </div>
                      <div className="flex flex-col justify-start">
                        <div>Active Now</div>
                        <div className="font-semibold text-xl">
                          {test.testId.solved.reduce((prev, curr) => {
                            return curr.endTime > Date.now() ? prev + 1 : prev;
                          }, 0)}
                        </div>
                      </div>
                    </span>
                    <span className="w-full border p-2 flex flex-row items-center justify-start gap-2">
                      <div className=" p-2 aspect-square rounded-full bg-orange-200 text-orange-500">
                        <DoneOutlinedIcon />
                      </div>
                      <div className="flex flex-col justify-start">
                        <div>Finished</div>
                        <div className="font-semibold text-xl">
                          {test.testId.solved.reduce((prev, curr) => {
                            return curr.endTime < Date.now() ? prev + 1 : prev;
                          }, 0)}
                        </div>
                      </div>
                    </span>
                  </div>
                )}
              </li>
            );
          })}
    </ul>
  );
};

export default TestDashboard;
