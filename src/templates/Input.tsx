import { FieldError, UseFormRegister } from "react-hook-form";
import InputLabel from "../parts/inputs/InputLabel";
import InputText from "../parts/inputs/InputText";

type Props = {
  name: string; //バリデーションチェックに必要な名称
  type: string; //input要素のtype
  rules: any; //バリデーションチェック
  register: UseFormRegister<any>; //バリデーションチェックのハンドラー
  error?: FieldError; // エラー
  children: React.ReactNode; // ラベルに表示するタイトル
  isRequired: boolean; //必須項目
};

export default function Input({
  children,
  type,
  isRequired,
  name,
  rules,
  register,
  error,
}: Props) {
  return (
    <>
      <InputLabel children={children} isRequired={isRequired} />
      <InputText
        name={name}
        type={type}
        rules={rules}
        register={register}
        error={error}
      />
    </>
  );
}
