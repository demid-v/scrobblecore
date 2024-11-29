"use client";

import { useResetAtom } from "jotai/utils";

import { Button } from "~/components/ui/button";
import { scrobblesAtom } from "~/lib/store";

const SignOutButton = () => {
  const resetScrobbles = useResetAtom(scrobblesAtom);

  return (
    <Button
      type="submit"
      onClick={() => {
        resetScrobbles();
      }}
    >
      Sign out
    </Button>
  );
};

export default SignOutButton;
