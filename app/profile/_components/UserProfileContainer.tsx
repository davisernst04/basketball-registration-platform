import { getProfile } from "../actions";
import UserProfile from "./UserProfile";
import { redirect } from "next/navigation";

export default async function UserProfileContainer() {
  const result = await getProfile();

  if (!result.success || !result.data) {
    redirect("/sign-in");
  }

  return <UserProfile initialProfile={result.data} />;
}
