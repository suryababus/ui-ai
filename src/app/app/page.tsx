import UIGenerator from "@/components/ui-generator";
import SignInWithGoogle from "@/components/ui/sign-in-google";
import { headers } from "next/headers";
import { FunctionComponent } from "react";

interface AppPageProps {}

const AppPage: FunctionComponent<AppPageProps> = () => {
  const headersList = headers();
  const email = headersList.get("email") ?? "";

  if (!email) {
    return <SignInWithGoogle />;
  }

  return <UIGenerator />;
};

export default AppPage;
