import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SignInFlow } from "../types";
import { useState } from "react";

interface SignUpCardProps {
  setState: (state: SignInFlow) => void;
};

export const SignUpCard = ({ setState }: SignUpCardProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="font-bold text-xl">
          Sign up to continue
        </CardTitle>
        <CardDescription>
          Please enter your email and password to sign up.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 px-0 pb-0">
        <form action="" className="space-y-2.5">
          <Input 
            disabled={false}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
          />
          <Input 
            disabled={false}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            required
          />
          <Input 
            disabled={false}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            type="password"
            required
          />
          <Button type="submit" className="w-full" size={"lg"} disabled={false}>
            Sign In
          </Button>
        </form>
        <Separator/>
        <div className="flex flex-col gap-y-2.5">
          <Button 
          disabled={false}
          variant={"outline"}
          onClick={() => {}}
          size={"lg"}
          className="w-full relative"
          >
            <FcGoogle className="size-5 absolute top-2.5 left-2.5"/>
            Continue with Google
          </Button>
        </div>
        <p className="text-xs text-center text-muted-foreground">
          Already have an account? <span className="text-sky-700 hover:underline cursor-pointer" onClick={() => setState("signIn")}>
            Sign in
          </span>
        </p>
      </CardContent>
    </Card>
  );
};