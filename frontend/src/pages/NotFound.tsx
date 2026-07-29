import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="pt-[80px]">
      <div className="px-[20px] py-[40px] md:px[122px] py-[80px]">
        <div
          className="flex flex-col items-center gap-[10px] mb-[40px] md:mb-[50px] md:max-w-[620px]
        mx-auto bg-white border border-border-default rounded-lg p-[25px]"
        >
          <h1 className="text-6xl font-black text-accent-primary/25">404</h1>
          <h3 className="text-2xl font-bold">Page not found</h3>
          <p>The page you are looking for does not exist or has been moved</p>
          <Link to="/" className="text-accent-primary font-bold underline underline-offset-2">
            Go back to the homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
