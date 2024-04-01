import AuthForm from "../components/authComponents/AuthForm";
const Homepage = () => {
  return (
    <div>
      <AuthForm redirect={true} />
    </div>
  );
};
export default Homepage;
