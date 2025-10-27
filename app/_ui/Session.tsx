import { auth } from "../_lib/auth";
import LoginButton from "./LoginButton";
import UserButton from "./UserButton";

async function Session() {
  const session = await auth();
  if (session?.user) return <UserButton user={session.user} />;
  return <LoginButton />;
}

export default Session;
