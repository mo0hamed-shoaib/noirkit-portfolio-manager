"use client";

import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ConfirmEmailPage() {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if the user came from a confirmation link
    const token = searchParams.get("token");
    const type = searchParams.get("type");

    if (token && type === "signup") {
      setIsConfirmed(true);
    }
    setIsLoading(false);
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-gray-400">Verifying your email...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        {/* Brand Header */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <img
            src="/icon.png"
            alt="NoirKit logo"
            width="32"
            height="32"
            className="rounded"
          />
          <span className="text-2xl font-mono font-bold tracking-wide">
            NoirKit
          </span>
        </div>

        <div className="border border-green-500/30 rounded-lg p-8 mb-8">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-mono text-green-400 mb-4">
            {isConfirmed ? "Email Confirmed!" : "Welcome to NoirKit!"}
          </h2>
          <p className="text-gray-300 mb-6">
            {isConfirmed
              ? "Your email has been successfully confirmed. You can now sign in to your account and start building your portfolio."
              : "Thank you for joining NoirKit! Your account is ready to use."}
          </p>

          <div className="space-y-4">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 bg-white text-black hover:bg-gray-100 transition-all duration-300 px-6 py-3 rounded font-medium"
            >
              Sign In to Your Account
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="text-gray-500 text-sm">
          <p>
            Having trouble? Contact me at{" "}
            <a
              href="mailto:mohamed.g.shoaib@gmail.com"
              className="text-white hover:underline"
            >
              mohamed.g.shoaib@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
