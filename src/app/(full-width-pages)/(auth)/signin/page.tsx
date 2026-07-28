import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Diamas Core",
  description: "Sign in to your Diamas Core merchant portal",
};

export default function SignIn() {
  return <SignInForm />;
}
