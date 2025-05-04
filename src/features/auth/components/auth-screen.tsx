"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Icons } from "@/components/reusables/icons";
import { SignInFlow } from "../types";
import { SignInCard } from "./sign-in-card";
import { SignUpCard } from "./sign-up-card";

export function AuthScreen() {
  const [state, setState] = useState<SignInFlow>("signIn");
  const pathName = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathName !== "/auth") {
      router.push("/auth");
    }
  }, [pathName, router]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6 md:p-12">
      <section className="relative w-full max-w-6xl rounded-xl shadow-2xl overflow-hidden lg:grid lg:grid-cols-2">
        {/* ← Gradient “Welcome” panel (hidden on small screens) */}
        <div className="hidden lg:flex flex-col items-center justify-center 
                        bg-gradient-to-br from-indigo-700 to-gray-800 
                        text-white py-20 px-16">
          <Icons.golub className="w-40 h-40 text-indigo-300 mb-6" />
          <h2 className="text-4xl font-bold mb-4">Welcome to Golub</h2>
          <p className="text-xl text-indigo-200 text-center max-w-xs">
            Open‑source messenger.
          </p>
        </div>

        {/* → White form panel (no inner borders) */}
        <div className="bg-white py-16 px-12 flex flex-col justify-center lg:rounded-r-xl">

          {/* Centered form card */}
          <div className="w-full max-w-md mx-auto">
            {state === "signIn" ? (
              <SignInCard setState={setState} />
            ) : (
              <SignUpCard setState={setState} />
            )}
          </div>

        </div>
      </section>
    </div>
  );
}
