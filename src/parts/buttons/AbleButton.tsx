interface Props {
  children?: React.ReactNode;
  onClick?: () => void;
}

export default function AbleButton({ 
  children,
  onClick
}: Props) {
  return (
    <button
      type="submit"
      onClick={onClick}
      className="bg-red-500 text-white font-bold py-2 px-4 w-full rounded hover:bg-red-400"
    >{children}</button>
  );
}
