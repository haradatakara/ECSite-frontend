interface Props {
  children: React.ReactNode;
  isRequired: boolean; //必須項目
}
export default function InputLabel({ children, isRequired }: Props) {
  return (
    <label className="block text-gray-700 text-sm font-bold mb-2">
      {children}
      {isRequired ? <span className="text-red-400">*</span> : ""}
    </label>
  );
}
