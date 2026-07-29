import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Link } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore";
import { useState } from "react";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { loading, signup } = useAuthStore();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }
    if (!email || !password) {
      return toast.error("Missing required fields");
    }
    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters long");
    }
    if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      return toast.error("Invalid email format");
    }

    signup({ name, email, password, confirmPassword });
  };

  document.title = `Sign up | DishDrop - Turn Cooking Videos Into Recipes You Can Actually Cook From`;

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="pt-[80px]">
      <div className="px-[20px] py-[40px]">
        <div className="md:w-[600px] mx-auto p-[25px] text-center rounded-lg border border-border-default bg-card flex flex-col items-center gap-[30px]">
          <div className="w-full p-[10px] bg-page rounded-xl flex items-center gap-[10px] text-text-secondary">
            <Link
              to="/login"
              className="transition-all duration-300 ease-in-out p-[10px] flex-1 rounded text-center"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="transition-all duration-300 ease-in-out p-[10px] flex-1 bg-card shadow-lg font-bold text-accent-primary shadow-black/5 rounded-lg text-center"
            >
              Sign up
            </Link>
          </div>
          <div>
            <h1 className="font-heading text-2xl">Create your account</h1>
            <p className="opacity-60">Start saving recipes from any video</p>
          </div>
          <Button variant="ghost" className="w-full">
            <img
              src="/icons/google.svg"
              alt="google icon"
              className="w-[22px]"
            />
            Sign up with google
          </Button>
          <div className="w-full flex items-center gap-[10px] ">
            <hr className="flex-1 opacity-20" />
            <span className="opacity-40 text-sm">OR</span>
            <hr className="flex-1 opacity-20" />
          </div>
          <form
            className="w-full text-left space-y-[25px]"
            onSubmit={handleSubmit}
          >
            <Input
              label="Name"
              placeholder="John Doe"
              optional
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Password"
              placeholder="Enter your password"
              className="w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
            />
            <Input
              label="Confirm Password"
              placeholder="Re-enter your password"
              className="w-full"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
            />
            {/* <CheckboxItem className="text-sm" size="sm" line={false}>
              I agree to the{" "}
              <span className="text-accent-primary font-bold">
                Terms of Service and Privacy Policy
              </span>
            </CheckboxItem> */}
            <Button variant="primary" className="w-full" type="submit">
              Sign up
            </Button>
          </form>
          <hr className="w-full opacity-20" />
          <span className="text-sm">
            Don’t have an account?{" "}
            <Link
              to="/login"
              className="text-accent-primary font-bold underline"
            >
              Log in
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Signup;
