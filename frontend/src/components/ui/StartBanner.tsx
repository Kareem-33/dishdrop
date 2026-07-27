import VideoUrlInput from "./VideoUrlInput";
const StartBanner = () => {
  return (
    <div className="relative overflow-hidden bg-dark-bg px-[20px] py-[80px] md:p-[122px]
    flex flex-col gap-[40px] bg-[url('/dot.svg')] bg-top-left">
      <div className="blur-[75px] md:blur-[150px] opacity-75 md:opacity-50 w-[150px] aspect-square md:w-[300px] rounded-full bg-accent-primary absolute top-[-50px] left-[-20px] z-0" />
      <div className="blur-[75px] md:blur-[150px] opacity-75 md:opacity-50 w-[150px] aspect-square md:w-[300px] rounded-full bg-accent-primary absolute bottom-[-50px] right-[-75px] z-0" />
      <div className="space-y-[10px] text-dark-text z-10 md:text-center  md:mx-auto">
        <h2 className="font-heading text-2xl md:text-4xl">
          Start cooking from videos today
        </h2>
        <p className="text-sm opacity-60">
          Free to use. No credit card required. Instant recipes.
        </p>
      </div>
      <VideoUrlInput className="z-10 md:w-[620px] md:mx-auto" />
    </div>
  );
};

export default StartBanner;
