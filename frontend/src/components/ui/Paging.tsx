
interface PagingProps {
  totalPages: number;
  page?: number;
  setPage?: (page: number) => void;
}

const Paging = ({ totalPages, page = 1, setPage }: PagingProps) => {
  return (
    <div className="flex items-center justify-center gap-[10px]">
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((p) => (
        <span
          key={p}
          className={`w-[35px] h-[35px] rounded-full flex items-center justify-center border cursor-pointer
              font-bold border-border-default transition-all duration-300 ease-in-out
              ${p === page ? "bg-subtle text-accent-primary" : "bg-card hover:bg-page "}`}
          onClick={() => {
            setPage && setPage(p);
            window.scroll({ top: 0, behavior: "smooth" });
          }}
        >
          {p}
        </span>
      ))}
    </div>
  );
};

export default Paging;
