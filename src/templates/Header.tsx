import * as React from "react";
import { useState } from "react";
import AbleButton from "../parts/buttons/AbleButton";
import { firebaseApp } from "../firebase";
import { Auth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const auth: Auth = firebaseApp.auth;

export default function Header() {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies();
  const logout = () => {
    auth
      .signOut()
      .then(() => {
        removeCookie("jwt");
        removeCookie("uid");
        navigate("/signIn");
      })
      .catch((err) => {
        alert(err.message);
        console.error(err);
      });
  };
  return (
    <div
      id="header"
      className="bg-red-400 w-auto flex justify-between items-center px-10 py-5"
    >
      <div className="w-1/2">
        <p>Image</p>
      </div>
      <div className="flex justify-between items-center w-1/2">
        <button onClick={() => navigate("/profile")} className="w-1/3 text-white">プロフィール</button>
        <button onClick={() => navigate("/profile")} className="w-1/3 text-white">商品一覧</button>
        <AbleButton onClick={logout} children="ログアウト" />
      </div>
    </div>
  );
}
