import { useSelector } from "react-redux";

const TopNavbar = (props) => {
  const name = useSelector((state) => state.auth.name);
  return (
    <div className="bg-white h-max p-2 flex flex-row justify-between border-b-2 sticky top-0">
      <div className="font-bold">{props.location}</div>
      <div>
        Hello, <span className=" font-bold">{name}</span>
      </div>
    </div>
  );
};
export default TopNavbar;
