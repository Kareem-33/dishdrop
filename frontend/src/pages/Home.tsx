import Features from "../components/sections/home/Features";
import Hero from "../components/sections/home/Hero";
import HowItWorks from "../components/sections/home/HowItWorks";
import StartBanner from "../components/ui/StartBanner";

const Home = () => {
  document.title ="DishDrop - Turn Cooking Videos Into Recipes You Can Actually Cook From";
  return (
    <div className="pt-[80px]">
      <Hero />
      <HowItWorks />
      <Features />
      <StartBanner />
    </div>
  );
};

export default Home;
