import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import BgGradient from "@/components/common/BgGradient";
import AuthCard from "@/components/auth/AuthCard";
import AuthButton from "@/components/auth/AuthButton";
import AuthField from "@/components/auth/AuthField";
import AuthError from "@/components/auth/AuthError";
import SocialButtons from "@/components/auth/SocialButtons";
import { register } from "@/store/authSlice";

export default function SignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim()) {
      setError("Enter your email address.");
      return;
    }
    if (!password) {
      setError("Enter your password.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await dispatch(register({ email: email.trim(), password })).unwrap();
      navigate("/");
    } catch (message) {
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex justify-center items-center py-16">
      <BgGradient>
        <AuthCard
          title="Create your account"
          subtitle="Welcome! Please fill in the details to get started."
          footer={
            <>
              Already have an account?{" "}
              <Link to="/sign-in" className="font-semibold text-gray-900">
                Sign in
              </Link>
            </>
          }
        >
          <SocialButtons />
          <form onSubmit={handleSubmit} noValidate>
            <AuthError message={error} />
            <div className="flex flex-col gap-5">
              <AuthField
                id="email"
                label="Email address"
                type="email"
                autoComplete="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <AuthField
                id="password"
                label="Password"
                type="password"
                autoComplete="new-password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <AuthButton className="mt-8" loading={loading} />
          </form>
        </AuthCard>
      </BgGradient>
    </section>
  );
}