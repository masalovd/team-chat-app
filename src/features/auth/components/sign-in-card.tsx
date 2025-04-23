import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { AuthProvider, SignInFlow } from "../types";
import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { TriangleAlert } from "lucide-react";

interface SignInCardProps {
  setState: (state: SignInFlow) => void;
};

export const SignInCard = ({ setState }: SignInCardProps) => {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signIn } = useAuthActions();

  const handlePasswordSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setPending(true);
    signIn("password", { email, password, flow: "signIn" })
      .catch(() => {
        setError("Invalid email or password");
      })
      .finally(() => {
        setPending(false);
      });
  };

  const handleProviderSignIn = (value: AuthProvider) => {
    setPending(true);
    signIn(value)
      .finally(() => {
        setPending(false);
      });
  }

  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="font-bold text-xl">
          Sign in to continue
        </CardTitle>
        <CardDescription>
          Please enter your email and password to sign in.
        </CardDescription>
      </CardHeader>
      {error && (
        <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-0.6">
          <TriangleAlert className="size-4" />
          {error}
        </div>
      )}
      <CardContent className="space-y-5 px-0 pb-0">
        <form onSubmit={handlePasswordSignIn} className="space-y-2.5">
          <Input
            disabled={pending}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
          />
          <Input
            disabled={pending}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            required
          />
          <Button type="submit" className="w-full" size={"lg"} disabled={pending}>
            Sign In
          </Button>
        </form>
        <Separator />
        <div className="flex flex-col gap-y-2.5">
          <Button
            disabled={pending}
            variant={"outline"}
            onClick={() => handleProviderSignIn("google")}
            size={"lg"}
            className="w-full relative"
          >
            <FcGoogle className="size-5 absolute top-2.5 left-2.5" />
            Continue with Google
          </Button>
        </div>
        <p className="text-xs text-center text-muted-foreground">
          Don&apos;t have an account? <span className="text-sky-700 hover:underline cursor-pointer" onClick={() => setState("signUp")}>
            Sign up
          </span>
        </p>
      </CardContent>
    </Card>
  );
};