import "react-toastify/dist/ReactToastify.css";
import {
  Auth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { firebaseApp } from "../firebase";
import axios from "axios";
import DisabledButton from "../parts/buttons/DisabledButton";
import { useForm, SubmitHandler } from "react-hook-form";
import ErrorMessage from "../parts/ErrorMessage";
import Toasters from "../parts/Toasters";
import AbleButton from "../parts/buttons/AbleButton";
import { useState } from "react";
import ThreeLoading from "../parts/ThreeLoading";
import { useCookies } from "react-cookie";
import InputLabel from "../parts/inputs/InputLabel";
import GoogleAuthButton from "../parts/buttons/GoogleAuthButton";
import Input from "../templates/Input";
import { validateContent, validateMail, validateOneMorePass, validatePass, validateUserName } from "../utils/FormValidation";
import RadioButtons from "../templates/RadioButtons";

const auth: Auth = firebaseApp.auth;

enum Gender {
  男性 = 1,
  女性 = 2,
  その他 = 3,
}

type InputForm = {
  userName: string;
  mail: string;
  pass: string;
  oneMorePass: string;
  gender: number;
  content: boolean;
};

const genderList = [
  { id: "male", name: "男性", value: 1, required: true },
  { id: "female", name: "女性", value: 2, required: false },
  { id: "other", name: "その他", value: 3, required: false },
];

export default function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    getValues,
  } = useForm<InputForm>({
    defaultValues: {
      gender: 1,
    },
    delayError: 5000,
    mode: "onChange",
  });

  const toasters = Toasters();
  const [confirm, setConfirm] = useState(false);
  const [isRevealPassword, setIsRevealPassword] = useState(false);

  const [, setCookie] = useCookies(["mail"]);

  const onChangeConfirm = () => setConfirm(!confirm);

  const onSubmit: SubmitHandler<InputForm> = async (data) => {
    if (confirm) {
      const { userName, mail, pass } = data;
      await createUserWithEmailAndPassword(auth, mail, pass)
        .then((userCredential) => {
          const currentUser: any = auth.currentUser;
          updateProfile(currentUser, {
            displayName: userName,
          });
          createUserInfo(data, userCredential.user.uid).then((user) => {
            navigate("/signIn");
            toasters.success(
              "会員登録に成功しました！ログインしてサービスをご利用ください"
            );
          });
        })
        .catch((error) => {
          if (
            error.message === "Firebase: Error (auth/email-already-in-use)."
          ) {
            toasters.error("そのメールアドレスは既に登録済みです。");
            onChangeConfirm();
          }
        });
    } else {
      onChangeConfirm();
    }
  };

  const navigate = useNavigate();

  const createUserInfo = async (user: InputForm, uid: string) => {
    await axios
      .post(
        `http://localhost:3000/auth/`,
        JSON.stringify({
          id: uid,
          name: user.userName,
          mail: user.mail,
          gender: user.gender,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((user) => {
        const tomorrowDate = new Date();
        tomorrowDate.setMonth(tomorrowDate.getMonth() + 1);
        setCookie("mail", user.data.mail, { expires: tomorrowDate });
      })
      .catch((err) => console.log(err));
  };

  const onChangePassDisplay = () => setIsRevealPassword(!isRevealPassword);

  return (
    <div className="py-10">
      {isSubmitting && <ThreeLoading />}
      <div className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
        <div
          className="hidden lg:block lg:w-1/2 bg-cover"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1546514714-df0ccc50d7bf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=667&q=80')",
          }}
        ></div>
        <div className="w-full p-8 lg:w-1/2">
          <p className="text-xl text-gray-600 text-center">
            {confirm
              ? "以下の入力内容で登録します。"
              : "会員登録してPelupaを利用しましょう！"}
          </p>
          {confirm ? (
            ""
          ) : (
            <div>
              <GoogleAuthButton children="Googleで会員登録" />
              <div className="mt-4 flex items-center justify-between">
                <span className="border-b w-1/5 lg:w-1/4"></span>
                or login with email
                <span className="border-b w-1/5 lg:w-1/4"></span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mt-4">
              {confirm ? (
                <>
                  <InputLabel children="名前" isRequired={true} />
                  <p className="text-gray-700">{getValues("userName")}</p>
                </>
              ) : (
                <Input
                  children="名前"
                  isRequired={true}
                  register={register}
                  type="text"
                  name="userName"
                  rules={validateUserName()}
                  error={errors.userName}
                />
              )}
            </div>

            <div className="mt-4">
              <InputLabel children="性別" isRequired={true} />
              {confirm ? (
                <p className="text-gray-700">{Gender[getValues("gender")]}</p>
              ) : (
                <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  {genderList.map(({ id, name, value, required }) => (
                    <li
                      key={id}
                      className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600"
                    >
                      <RadioButtons children={name} value={value} id={id} register={register} defaultCheckTarget={getValues("gender")} />
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-4">
              {confirm ? (
                <>
                  <InputLabel children="メールアドレス" isRequired={true} />
                  <p className="text-gray-700">{getValues("mail")}</p>
                </>
              ) : (
                <Input
                  children="メールアドレス"
                  isRequired={true}
                  register={register}
                  type="text"
                  name="mail"
                  rules={validateMail()}
                  error={errors.mail}
                />
              )}
            </div>

            <div className="mt-4">
              <div className="flex justify-between"></div>
              {confirm ? (
                <>
                  <InputLabel children="パスワード" isRequired={true} />
                  <input type="password" value={getValues("pass")} className="text-gray-700" disabled />
                </>
              ) : (
                <Input
                  children="パスワード"
                  isRequired={true}
                  register={register}
                  type={isRevealPassword ? "text" : "password"}
                  name="pass"
                  rules={validatePass()}
                  error={errors.pass}
                />
              )}
            </div>
            {confirm ? (
              ""
            ) : (
              <div className="mt-4">
                <Input
                  children="確認用パスワード"
                  isRequired={true}
                  register={register}
                  type={isRevealPassword ? "text" : "password"}
                  name="oneMorePass"
                  rules={validateOneMorePass(getValues("pass"))}
                  error={errors.oneMorePass}
                />
              </div>
            )}
            {!confirm ? (
              <div className="flex items-center mt-1">
                <input
                  id="display-password"
                  type="checkbox"
                  checked={isRevealPassword}
                  onChange={() => onChangePassDisplay()}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="display-password"
                  className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  パスワードを表示する
                </label>
              </div>
            ) : (
              ""
            )}

            <div className="mt-5">
              {confirm ? (
                ""
              ) : (
                <div className="flex items-center">
                  <input
                    {...register("content", validateContent())}
                    id="checked-checkbox"
                    type="checkbox"
                    className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="checked-checkbox"
                    className="ml-2 text-lg font-medium text-gray-900 dark:text-gray-300"
                  >
                    ご利用規約に同意します
                  </label>
                </div>
              )}
              {errors.content && (
                <ErrorMessage>{errors.content.message}</ErrorMessage>
              )}
            </div>
            <div className="mt-8">
              {!isValid ? (
                <DisabledButton children="登録内容を確認する" />
              ) : (
                <AbleButton children="登録内容を確認する" />
              )}
            </div>
            <div className="mt-2">
              {confirm ? (
                <DisabledButton
                  onClick={() => onChangeConfirm()}
                  children="戻る"
                />
              ) : (
                ""
              )}
            </div>
          </form>

          <div className="mt-4 flex items-center justify-between">
            <span className="border-b w-1/5 md:w-1/4"></span>
            <button
              onClick={() => navigate("/signIn")}
              className="text-xs text-gray-500 uppercase"
            >
              ログインする
            </button>
            <span className="border-b w-1/5 md:w-1/4"></span>
          </div>
        </div>
      </div>
    </div>
  );
}
