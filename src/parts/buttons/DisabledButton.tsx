interface Props {
  children?: React.ReactNode;
  onClick?: () => void;
}

export default function DisabledButton({ children, onClick }: Props) {
  return (
    <button onClick={onClick} className="bg-gray-500 text-white font-bold py-2 px-4 w-full rounded">
      {children}
    </button>
  );
}
