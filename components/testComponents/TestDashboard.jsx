import Link from "next/link";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import LinkIcon from "@mui/icons-material/Link";
import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";

const TestDashboard = (props) => {
  return (
    <ul className="p-2 overflow-x-hidden overflow-y-auto ">
      {props.createdTests &&
        props.createdTests.map((test) => {
          const hours = Math.floor(test.test.duration / 60);
          const minutes = test.test.duration % 60;
          return (
            <li className="grid grid-cols-3 border-b p-2 gap-1 text-sm">
              <span className="text-sm col-span-2">{test.name}</span>
              <span className="text-green-500 text-right text-sm col-span-1">{`${
                hours > 0 ? hours + "h" : ""
              } ${minutes > 0 ? minutes + "m" : ""}`}</span>
              <div className="grid-cols-3 grid gap-2 col-span-2">
                <Link
                  href={`/editTest/${test.test._id}`}
                  className="flex flex-col items-center justify-center bg-slate-50 p-2 rounded-md border row-span-1"
                >
                  <EditNoteOutlinedIcon className=" text-green-500 text-[1.2rem]" />
                  Edit
                </Link>
                <button
                  onClick={() =>
                    props.copyToClipboard(
                      `http://localhost:3000/test/${test.test._id}`
                    )
                  }
                  className="flex flex-col items-center justify-center bg-slate-50 p-2 rounded-md border row-span-1"
                >
                  <LinkIcon className="text-blue-400 text-[1.2rem]" />
                  Copy
                </button>
                <Link
                  href={`/responses/${test.test._id}`}
                  className="flex flex-col items-center justify-center bg-slate-50 p-2 rounded-md border row-span-1"
                >
                  <QuizOutlinedIcon className="text-orange-500 text-[1.2rem]" />
                  Responses
                </Link>
              </div>
              <span className="text-right italic text-xs col-span-1">
                {`${test.test.questions.length} Questions`}
              </span>
            </li>
          );
        })}
    </ul>
  );
};

export default TestDashboard;
