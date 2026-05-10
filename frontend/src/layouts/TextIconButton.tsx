interface Buttonprops {
  icon: string;
  text: string;
  className?: string;
}

const TextIconButton = ({ icon, text, className = "" }: Buttonprops) => {
  return (
    <button className={`flex w-fit h-fit relative gap-2 px-5 py-2 ${className}`}>
      <img 
        src={icon} 
        alt="Icon" 
        className="h-full object-cover"
      />
      <p>{text}</p>
    </button>
  );
};

export default TextIconButton;