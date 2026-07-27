
interface SocialMediaBadgeProps {
  name: string,
  className?: string,
}

const SocialMediaBadge = ({name, className=""}: SocialMediaBadgeProps) => {
  return (
    <div
      className={`text-dark-text rounded-[5px] font-bold px-[10px] py-[3px] text-xs w-fit ${className}`}
    >
      {name}
    </div>
  );
};

export default SocialMediaBadge;
