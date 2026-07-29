
const LoadingSpinner = () => {
  return (
    <div className="h-[calc(100vh-100px)] flex items-center">
      <div className="mx-auto animate-[spin_1s_linear_infinite] w-[50px] aspect-square rounded-full border-4 border-t-transparent border-accent-primary" />
    </div>
  );
};

export default LoadingSpinner;
