"use server";

import { redirect } from "next/navigation";

import { api } from "~/trpc/server";

const signOut = async () => {
  await api.auth.signout();
  redirect("/");
};

export { signOut };
