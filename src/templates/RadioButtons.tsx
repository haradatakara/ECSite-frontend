import { UseFormRegister } from "react-hook-form";

type Props = {
  children: string;
  id: string;
  value: string | number;
  register: UseFormRegister<any>; //バリデーションチェックのハンドラー
  defaultCheckTarget: string | number;
};

export default function RadioButtons({
  children,
  id,
  value,
  register,
  defaultCheckTarget,
}: Props) {
  return (
    <div className="flex items-center pl-3">
      <label
        htmlFor={id}
        className="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300 flex items-center"
      >
        <input
          className="w-4 h-4 mr-1 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
          id={id}
          type="radio"
          value={value}
          {...register("gender")}
          defaultChecked={defaultCheckTarget === value}
        />
        {children}
      </label>
    </div>
  );
}
