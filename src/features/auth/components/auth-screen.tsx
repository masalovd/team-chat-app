"use client";

import { useEffect, useState } from "react";
import { SignInFlow } from "../types";
import { SignInCard } from "./sign-in-card";
import { SignUpCard } from "./sign-up-card";
import { usePathname, useRouter } from "next/navigation";

export const AuthScreen = () => {
  const [state, setState] = useState<SignInFlow>("signIn");
  const pathName = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathName !== 'auth') {
      router.push('/auth');
    }
  }, [pathName, router]);

  return (
    <div className="h-full flex items-center justify-center bg-[#5263a6]">
      <div className="md:h-auto md:w-[420px]">
        {state === "signIn" ? (
          <SignInCard setState={setState} />
        ) : (
          <SignUpCard setState={setState} />
        )}
      </div>
    </div>
  );
};
