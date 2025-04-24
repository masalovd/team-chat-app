"use client";

import Image from "next/image";
import Link from "next/link";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import VerificationInput from "react-verification-input";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useGetWorkspaceInfo } from "@/features/workspaces/api/use-get-workspace-info";
import { useJoin } from "@/features/workspaces/api/use-join";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const JoinPage = () => {
  const router = useRouter();

  const workspaceId = useWorkspaceId();
  const { data: workspaceInfo, isLoading } = useGetWorkspaceInfo({ id: workspaceId });

  const { mutate, isPending } = useJoin();

  const isMember = useMemo(() => workspaceInfo?.isMember, [workspaceInfo?.isMember]);

  useEffect(() => {
    if (isMember) {
      router.push(`/workspaces/${workspaceId}`);
    }
  }, [isMember, router, workspaceId]);

  const handleComplete = (value: string) => {
    mutate({
      workspaceId,
      joinCode: value
    }, {
      onSuccess: (id) => {
        router.replace(`/workspaces/${id}`)
        toast.success("You have joined to the workspace!")
      },
      onError: () => {
        toast.error("Failed to join a workspace!")
      }
    })
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-y-8 items-center justify-center bg-white p-8 rounded-lg shadow-sm">
      <Image src="/golub.svg" width={60} height={60} alt="Logo" />
      <div className="flex flex-col gap-y-4 items-center justify-center max-w-md">
        <div className="flex flex-col gap-y-2 items-center justify-center">
          <h1 className="text-2xl font-bold">Join a {workspaceInfo?.name} workspace</h1>
          <p className="text-md text-muted-foreground">
            Enter the workspace code to join
          </p>
        </div>
        <VerificationInput
          length={6}
          classNames={{
            container: cn(
              "flex gap-x-2",
              isPending && "opacity-50 cursor-not-allowed"
            ),
            character:
              "uppercase h-auto rounded-md border border-ray-300 flex items-center justify-center text-lg font-medium text-gray-500",
            characterInactive: "bg-muted",
            characterSelected: "bg-white text-black",
            characterFilled: "bg-white text-black",
          }}
          autoFocus
          onComplete={handleComplete}
        />
      </div>
      <div className="flex gap-x-4">
        <Button size="lg" variant="outline" asChild>
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}

export default JoinPage;