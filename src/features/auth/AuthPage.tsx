"use client";
import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function AuthPage() {
  const [activeAuth, setActiveAuth] = useState("login");

  return (
    <>
      {activeAuth === "login" ? (
        <LoginForm setActiveAuth={setActiveAuth} />
      ) : (
        <RegisterForm setActiveAuth={setActiveAuth} />
      )}
    </>
  );
}