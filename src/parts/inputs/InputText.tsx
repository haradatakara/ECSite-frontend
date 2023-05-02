import { FieldError, UseFormRegister } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";

type Props = {
  name: string;
  type: string;
  rules: any;
  register: UseFormRegister<any>;
  error?: FieldError;
};

export default function InputText({
  name,
  type,
  rules,
  register,
  error,
}: Props) {
  return (
    <>
      <input
        {...register(name, rules)}
        className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
        type={type}
      />
      {error && <ErrorMessage>{error.message}</ErrorMessage>}
    </>
  );
}
