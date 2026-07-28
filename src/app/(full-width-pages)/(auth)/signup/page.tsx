import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Diamas Core",
  description: "Create an account on Diamas Core",
};

export default function SignUp() {
  return <SignUpForm />;
}
