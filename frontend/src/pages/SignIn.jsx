import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Pencil } from "lucide-react";

import BgGradient from "@/components/common/BgGradient";
import AuthCard from "@/components/auth/AuthCard";
import AuthButton from "@/components/auth/AuthButton";
import AuthField from "@/components/auth/AuthField";
import AuthError from "@/components/auth/AuthError";
import SocialButtons from "@/components/auth/SocialButtons";
import { toast } from "@/hooks/use-toast";
import { login } from "@/store/authSlice";

const WRONG_CREDENTIALS =
  "Password or email address is incorrect. Try again, or use another method.";

const notAvailable = (title) =>
  toast({
    title,
    description: "This option is not available yet.",
  });

export default function SignIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = (event) => {
    event.preventDefault();
    if (!email.trim()) {
      setError("Enter your email address.");
      return;
    }
    setError("");
    setStep("password");
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    if (!password) {
      setError("Enter your password.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await dispatch(login({ email: email.trim(), password })).unwrap();
      navigate("/");
    } catch (message) {
      setError(
        message === "Invalid email or password" ? WRONG_CREDENTIALS : message
      );
    } finally {
      setLoading(false);
    }
  };

  const goBackToEmail = () => {
    setStep("email");
    setPassword("");
    setError("");
  };

  return (
    <section className="flex justify-center items-center py-16">
      <BgGradient>
        {step === "email" ? (
          <AuthCard
            title="Sign in to TalkToText"
            subtitle="Welcome back! Please sign in to continue"
            footer={
              <>
                Don’t have an account?{" "}
                <Link to="/sign-up" className="font-semibold text-gray-900">
                  Sign up
                </Link>
              </>
            }
          >
            <SocialButtons />
            <form onSubmit={handleEmailSubmit} noValidate>
              <AuthError message={error} />
              <AuthField
                id="email"
                label="Email address"
                type="email"
                autoComplete="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <AuthButton className="mt-8" />
            </form>
          </AuthCard>
        ) : (
          <AuthCard
            title="Enter your password"
            subtitle="Enter the password associated with your account"
          >
            <div className="-mt-6 mb-8 flex items-center justify-center gap-2 text-gray-500">
              <span>{email}</span>
              <button
                type="button"
                onClick={goBackToEmail}
                aria-label="Edit email"
                className="bg-transparent text-gray-700 hover:bg-transparent hover:text-gray-900"
              >
                <Pencil size={14} />
              </button>
            </div>
            <form onSubmit={handlePasswordSubmit} noValidate>
              <AuthError message={error} />
              <AuthField
                id="password"
                label="Password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                autoFocus
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                labelRight={
                  <button
                    type="button"
                    onClick={() => notAvailable("Password reset is not available yet")}
                    className="bg-transparent text-[13px] font-medium text-gray-900 hover:bg-transparent hover:underline"
                  >
                    Forgot password?
                  </button>
                }
              />
              <AuthButton className="mt-8" loading={loading} />
              <button
                type="button"
                onClick={() => notAvailable("Other sign-in methods are not available yet")}
                className="mx-auto mt-4 block bg-transparent text-[13px] font-medium text-gray-700 hover:bg-transparent hover:text-gray-900"
              >
                Use another method
              </button>
            </form>
          </AuthCard>
        )}
      </BgGradient>
    </section>
  );
}