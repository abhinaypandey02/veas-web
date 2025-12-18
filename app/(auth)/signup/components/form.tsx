"use client";

import React from "react";
import { useSetToken, useToken } from "naystack/graphql/client";
import { useLogout, useLogin } from "@/app/(auth)/utils";

export default function Form() {
  const signup = useLogin();
  const signup2 = useLogout();
  const set = useSetToken();
  const token = useToken();
  console.log(set);
  const handleSignUp = () => {
    signup({
      email: "abhinay@gmail.com",
      password: "abhinay@gmail.com",
    });
  };
  return (
    <>
      <button onClick={handleSignUp}>Signup</button>
      <button onClick={() => signup2()}>Logout</button>
      {token}
    </>
  );
}
