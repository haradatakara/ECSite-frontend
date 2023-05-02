import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Auth, signInWithEmailAndPassword } from "firebase/auth";
import { SubmitHandler, useForm } from "react-hook-form";
import { firebaseApp } from "../firebase";
import DisabledButton from "../parts/buttons/DisabledButton";
import AbleButton from "../parts/buttons/AbleButton";
import ErrorMessage from "../parts/ErrorMessage";
import Toasters from "../parts/Toasters";
import ThreeLoading from "../parts/ThreeLoading";
import InputLabel from "../parts/inputs/InputLabel";
import GoogleAuthButton from "../parts/buttons/GoogleAuthButton";

const auth: Auth = firebaseApp.auth;
const toasters = Toasters();

type InputForm = {
  mail: string;
  pass: string;
};

export default function SignIn() {
  const [cookies, setCookie] = useCookies(["mail", "jwt", "uid"]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<InputForm>({
    defaultValues: {
      mail: cookies.mail,
    },
    delayError: 5000,
    mode: "onChange",
  });
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<InputForm> = async (data) => {
    const { mail, pass } = data;
    await signInWithEmailAndPassword(auth, mail, pass)
      .then((userCredential) => {
        const user = userCredential.user;
        //トークンIDをクッキーにセットする
        const tomorrowDate = new Date();
        tomorrowDate.setMonth(tomorrowDate.getMonth() + 1);
        user
          .getIdToken()
          .then((idToken) =>
            setCookie("jwt", idToken, { expires: tomorrowDate })
          );
        setCookie("uid", user.uid, { expires: tomorrowDate });
        //ホーム画面に移動
        navigate("/");
        toasters.success(
          "ログインに成功しました。ECサイトをお楽しみください！"
        );
      })
      .catch((error) => {
        if (error.message === "Firebase: Error (auth/wrong-password).") {
          toasters.error("パスワードに誤りがあります。");
        } else if (error.message === "Firebase: Error (auth/invalid-email).") {
          toasters.error("メールアドレスが無効です。");
        } else if (error.message === "Firebase: Error (auth/user-not-found).") {
          toasters.error("登録したユーザーは見つかりませんでした。");
        }
      });
  };

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
          <h2 className="text-2xl font-semibold text-gray-700 text-center">
            Hey!!
          </h2>
          <p className="text-xl text-gray-600 text-center">Welcome back!</p>
          <GoogleAuthButton children="Googleでログインする" />
          <div className="mt-4 flex items-center justify-between">
            <span className="border-b w-1/5 lg:w-1/4"></span>
            or login with email
            <span className="border-b w-1/5 lg:w-1/4"></span>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mt-4">
              <InputLabel children="メールアドレス" isRequired={false} />
              <input
                {...register("mail", {
                  required: {
                    value: true,
                    message: "入力必須です。",
                  },
                })}
                defaultValue={cookies.mail}
                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                type="email"
              />
              {errors.mail && (
                <ErrorMessage>{errors.mail.message}</ErrorMessage>
              )}
            </div>
            <div className="mt-4">
              <div className="flex justify-between">
                <InputLabel children="パスワード" isRequired={false} />
                <a href="void" className="text-xs text-gray-500">
                  パスワードを忘れましたか?
                </a>
              </div>
              <input
                {...register("pass", {
                  required: {
                    value: true,
                    message: "入力必須です。",
                  },
                })}
                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                type="password"
              />
            </div>
            <div className="mt-8">
              {!isValid ? (
                <DisabledButton children="ログインする" />
              ) : (
                <AbleButton children="ログインする" />
              )}
            </div>
            {errors.pass && <ErrorMessage>{errors.pass.message}</ErrorMessage>}
          </form>

          <div className="mt-4 flex items-center justify-between">
            <span className="border-b w-1/5 md:w-1/4"></span>
            <button
              onClick={() => navigate("/signUp")}
              className="text-xs text-gray-500 uppercase"
            >
              会員登録する
            </button>
            <span className="border-b w-1/5 md:w-1/4"></span>
          </div>
        </div>
      </div>
    </div>
  );
}
