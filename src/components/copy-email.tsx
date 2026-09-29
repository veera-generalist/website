"use client";

import { IconCopy } from "@tabler/icons-react";
import { toast } from "sonner";
import { Button, type ButtonProps } from "@/components/ui/button";

export function CopyEmail({ email, ...props }: { email: string } & ButtonProps) {
  return (
    <Button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(email);
          toast.success("Email copied to clipboard");
        } catch {
          toast.error(`Couldn't copy. My email is ${email}`);
        }
      }}
      {...props}
    >
      <IconCopy size={18} aria-hidden /> Copy email
    </Button>
  );
}
