import React, { useState } from "react";
import { useRegister } from "../../hooks/authHooks";
import { useVerifyEmail } from "../../hooks/authHooks";

export default function Register() {
  const { register, loading: registering, error: registerError } = useRegister();
  const { verify, loading: verifying, error: verifyError } = useVerifyEmail();

  const [step, setStep] = useState("register");

  const [full_name, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const [code, setCode] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await register({
        full_name,
        email,
        password,
        password_confirmation,
      });

      setStep("verify"); // move to OTP
    } catch {}
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      const res = await verify(email, code);
      alert("Verified!");

      localStorage.setItem("token", res.token);
      // redirect later
      navigate("/dashboard");
    } catch {}
  };

  return (
    <>
      {step === "register" && (
        <form onSubmit={handleRegister}>
          <h2>Register</h2>

          <input
            placeholder="Full Name"
            value={full_name}
            onChange={(e) => setFullName(e.target.value)}
          />

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={password_confirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
          />

          <button disabled={registering}>
            {registering ? "Registering..." : "Register"}
          </button>

          {registerError && <p>{registerError}</p>}
        </form>
      )}

      {step === "verify" && (
        <form onSubmit={handleVerify}>
          <h2>Verify Email</h2>

          <p>Code sent to {email}</p>

          <input
            placeholder="6-digit code"
            value={code}
            maxLength={6}
            onChange={(e) => setCode(e.target.value)}
          />

          <button disabled={verifying}>
            {verifying ? "Verifying..." : "Verify"}
          </button>

          {verifyError && <p>{verifyError}</p>}
        </form>
      )}
    </>
  );
}
