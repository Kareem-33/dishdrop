
const Footer = () => {
  return (
    <>
      <div
        className="bg-dark-bg text-dark-text px-[20px] py-[40px] md:px-[122px] border-t border-accent-primary/25
    flex flex-col gap-[40px]"
      >
        <div className="space-y-[10px]">
          <img src="/logo.svg" className="h-[35px]" />
          <p className="text-sm opacity-60 max-w-3/4">
            Turn any cooking video into a recipe in seconds with AI.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-[40px] md:grid-cols-4 md:border-t border-accent-primary/25 md:pt-[40px]">
          <ul className="text-sm text-dark-text/60 space-y-[10px]">
            <h3 className="text-base font-semibold text-dark-text">Product</h3>
            <li className="hover:text-accent-primary cursor-pointer">How It Works</li>
            <li className="hover:text-accent-primary cursor-pointer">Pricing</li>
          </ul>
          <ul className="text-sm text-dark-text/60 space-y-[10px]">
            <h3 className="text-base font-semibold text-dark-text">Company</h3>
            <li className="hover:text-accent-primary cursor-pointer">About</li>
            <li className="hover:text-accent-primary cursor-pointer">Contact</li>
          </ul>
          <ul className="text-sm text-dark-text/60 space-y-[10px]">
            <h3 className="text-base font-semibold text-dark-text">Legal</h3>
            <li className="hover:text-accent-primary cursor-pointer">Privacy</li>
            <li className="hover:text-accent-primary cursor-pointer">Terms</li>
          </ul>
          <ul className="text-sm text-dark-text/60 space-y-[10px]">
            <h3 className="text-base font-semibold text-dark-text">Social</h3>
            <li className="hover:text-accent-primary cursor-pointer">GitHub</li>
            <li className="hover:text-accent-primary cursor-pointer">Twitter</li>
          </ul>
        </div>
      </div>
      <div className="p-[15px] bg-[#240B00] text-dark-text/60 flex items-center justify-center text-sm">
        © 2026 Dish Drop. All rights reserved.
      </div>
    </>
  );
};

export default Footer;
