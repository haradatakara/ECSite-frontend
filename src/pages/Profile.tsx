import { Auth, updateEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { firebaseApp } from "../firebase";
import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import ErrorMessage from "../parts/ErrorMessage";
import "react-toastify/dist/ReactToastify.css";
import Toasters from "../parts/Toasters";
import { useState, useEffect } from "react";
import ThreeLoading from "../parts/ThreeLoading";
import { useCookies } from "react-cookie";
import AbleButton from "../parts/buttons/AbleButton";
import InputLabel from "../parts/inputs/InputLabel";

const auth: Auth = firebaseApp.auth;

enum Gender {
  男性 = 1,
  女性 = 2,
  その他 = 3,
}

const genderList = [
  { id: "male", name: "男性", value: 1, required: true },
  { id: "female", name: "女性", value: 2, required: false },
  { id: "other", name: "その他", value: 3, required: false },
];

type InputForm = {
  name: string;
  mail: string;
  gender: number;
  address: string;
};

export default function Profile() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
    setValue,
  } = useForm<InputForm>({
    delayError: 5000,
    mode: "onChange",
  });

  const toasters = Toasters();
  const [confirm] = useState(false);

  const [cookie, setCookie] = useCookies(["mail", "uid", "jwt"]);

  const config = {
    // config設定
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cookie.jwt}`,
    },
  };

  const navigate = useNavigate();

  //ユーザー情報の更新処理を行う
  const onSubmit: SubmitHandler<InputForm> = async (user: InputForm) => {
    //firebaseのauthenticationの情報を変更
    updateEmail(auth.currentUser!, user.mail)
      .then(() => {
        updateApiProfile(user);
      })
      .catch(() => {
        toasters.error("ユーザー情報の更新に失敗しました。");
      });
  };

  useEffect(() => {
    //ユーザー情報を取得
    fetchProfile();

    return () => {
      // コンポーネントがアンマウントされる際に実行される処理
    };
  }, []);

  //DBへのユーザー情報の更新処理
  const updateApiProfile = async (user: InputForm) => {
    await axios
      .put(
        "http://localhost:3000/user/",
        JSON.stringify({
          id: cookie.uid,
          name: user.name,
          mail: user.mail,
          address: user.address,
          gender: user.gender,
        }),
        config
      )
      .then((user) => {
        toasters.saved();
        navigate("/");
        setCookie("mail", user.data.mail);
      })
      .catch((err) => toasters.error(err));
  };

  //ユーザー情報を取得する
  const fetchProfile = async () => {
    await axios
      .get(`http://localhost:3000/user/${cookie.uid}`, config)
      .then((user) => {
        setValue("name", user.data.name);
        setValue("mail", user.data.mail);
        setValue("gender", user.data.gender);
        setValue("address", user.data.address);
      })
      .catch(() => toasters.error("ユーザー情報の取得に失敗しました。"));
  };

  return (
    <div className="py-10">
      {isSubmitting && <ThreeLoading />}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
        <div className="w-full p-8">
          <p className="text-xl text-gray-600 text-center">
            {confirm ? "以下の入力内容で登録します。" : "プロフィール情報"}
          </p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mt-4">
              <InputLabel children="名前" isRequired={true} />
              {confirm ? (
                <p className="text-gray-700">{getValues("name")}</p>
              ) : (
                <input
                  {...register("name", {
                    required: {
                      value: true,
                      message: "入力が必須の項目です。",
                    },
                    maxLength: {
                      value: 50,
                      message: "50字以内で入力してください。",
                    },
                  })}
                  className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                  type="text"
                />
              )}
              {errors.name && (
                <ErrorMessage>{errors.name.message}</ErrorMessage>
              )}
            </div>

            <div className="mt-4">
              <InputLabel children="性別" isRequired={true} />
              {confirm ? (
                <p className="text-gray-700">{Gender[getValues("gender")]}</p>
              ) : (
                <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  {genderList.map(({ id, name, value }) => (
                    <li
                      key={id}
                      className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600"
                    >
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
                            defaultChecked={getValues("gender") === value}
                          />
                          {name}
                        </label>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              {errors.name && (
                <ErrorMessage>{errors.name.message}</ErrorMessage>
              )}
            </div>

            <div className="mt-4">
              <InputLabel children="メールアドレス" isRequired={true} />
              {confirm ? (
                <p className="text-gray-700">{getValues("mail")}</p>
              ) : (
                <input
                  {...register("mail", {
                    required: {
                      value: true,
                      message: "入力が必須の項目です。",
                    },
                    pattern: {
                      value:
                        /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@[A-Za-z0-9_.-]+.[A-Za-z0-9]+$/,
                      message: "メールアドレスの形式が不正です",
                    },
                  })}
                  className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                  type="email"
                />
              )}
              {errors.mail && (
                <ErrorMessage>{errors.mail.message}</ErrorMessage>
              )}
            </div>

            <div className="mt-4">
              <div className="flex justify-between">
                <InputLabel children="住所" isRequired={false} />
              </div>
              {confirm ? (
                <input type="text" className="text-gray-700" disabled />
              ) : (
                <input
                  {...register("address", {
                    maxLength: {
                      value: 100,
                      message: "100字以内で入力してください。",
                    },
                  })}
                  className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                  type="text"
                />
              )}
              {errors.address && (
                <ErrorMessage>{errors.address.message}</ErrorMessage>
              )}
            </div>
            <div className="mt-8 px-10">
              <AbleButton children="プロフィールを更新する" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
