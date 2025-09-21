import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Loader2, User, ArrowLeft, Mail } from "lucide-react";
import krishiBandhuLogo from "figma:asset/93a11ef0f4c1a2af6f65d747ec6e1d56f7092a96.png";

interface AuthFormProps {
  onAuthSuccess: (accessToken: string) => void;
}

export function AuthForm({ onAuthSuccess }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    farmSize: "",
    location: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        // Login logic using Supabase
        const { supabase } = await import(
          "../utils/supabase/client"
        );

        const { data, error } =
          await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
          });

        if (error) {
          setError(`Login failed: ${error.message}`);
          return;
        }

        if (data.session?.access_token) {
          onAuthSuccess(data.session.access_token);
        }
      } else {
        // Register via our server
        const { projectId, publicAnonKey } = await import(
          "../utils/supabase/info"
        );

        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-1aa6be21/signup`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${publicAnonKey}`,
            },
            body: JSON.stringify(formData),
          },
        );

        const result = await response.json();

        if (!response.ok) {
          setError(`Registration failed: ${result.error}`);
          return;
        }

        // After successful registration, log them in
        const { supabase } = await import(
          "../utils/supabase/client"
        );

        const { data, error } =
          await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
          });

        if (error) {
          setError(
            `Auto-login after registration failed: ${error.message}`,
          );
          return;
        }

        if (data.session?.access_token) {
          onAuthSuccess(data.session.access_token);
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      setError(
        `Authentication error: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const { supabase } = await import("../utils/supabase/client");
      
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setError(`Password reset failed: ${error.message}`);
        return;
      }

      setSuccessMessage(
        "Password reset email sent! Please check your inbox and follow the instructions to reset your password."
      );
    } catch (error) {
      console.error("Password reset error:", error);
      setError(
        `Password reset error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        {/* Logo and header */}
        <div className="text-center space-y-2">
          <img
            src={krishiBandhuLogo}
            alt="KrishiBandhu Logo"
            className="h-16 w-auto mx-auto"
          />
          <h1 className="text-2xl font-semibold text-green-800">
            KrishiBandhu
          </h1>
          <p className="text-sm text-green-600">
            Smart Crop Advisory System
          </p>
        </div>

        {/* Conditional form rendering */}
        {isForgotPassword ? (
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="resetEmail">Email Address</Label>
              <Input
                id="resetEmail"
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="Enter your email address"
                required
              />
            </div>

            {(error || successMessage) && (
              <Alert className={successMessage ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                <AlertDescription className={successMessage ? "text-green-800" : "text-red-800"}>
                  {successMessage || error}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending reset email...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Reset Email
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setIsForgotPassword(false);
                setError("");
                setSuccessMessage("");
                setResetEmail("");
              }}
              className="w-full text-green-600 hover:text-green-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Sign In
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                handleInputChange("email", e.target.value)
              }
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                handleInputChange("password", e.target.value)
              }
              placeholder="Enter your password"
              required
            />
          </div>

          {!isLogin && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    handleInputChange("name", e.target.value)
                  }
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="farmSize">
                  Farm Size (acres)
                </Label>
                <Input
                  id="farmSize"
                  type="text"
                  value={formData.farmSize}
                  onChange={(e) =>
                    handleInputChange(
                      "farmSize",
                      e.target.value,
                    )
                  }
                  placeholder="e.g., 5.2 acres"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange(
                      "location",
                      e.target.value,
                    )
                  }
                  placeholder="Village, District, State"
                  required
                />
              </div>
            </>
          )}

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Forgot Password Link - Only show in login mode */}
          {isLogin && (
            <div className="text-right">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setIsForgotPassword(true);
                  setError("");
                  setSuccessMessage("");
                }}
                className="text-sm text-green-600 hover:text-green-700 p-0 h-auto font-normal"
              >
                Forgot Password?
              </Button>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {isLogin
                  ? "Signing in..."
                  : "Creating account..."}
              </>
            ) : (
              <>
                <User className="h-4 w-4 mr-2" />
                {isLogin ? "Sign In" : "Create Account"}
              </>
            )}
          </Button>
        </form>
        )}

        {/* Toggle between login/register - Hide when in forgot password mode */}
        {!isForgotPassword && (
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
                setSuccessMessage("");
              }}
              className="text-green-600 hover:text-green-700"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}