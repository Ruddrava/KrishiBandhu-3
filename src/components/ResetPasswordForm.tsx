import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Loader2, Lock, CheckCircle } from "lucide-react";
import krishiBandhuLogo from "figma:asset/93a11ef0f4c1a2af6f65d747ec6e1d56f7092a96.png";

interface ResetPasswordFormProps {
  onPasswordReset: () => void;
}

export function ResetPasswordForm({ onPasswordReset }: ResetPasswordFormProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);

  // Check if this is a valid password reset session
  useEffect(() => {
    const checkResetSession = async () => {
      try {
        const { supabase } = await import("../utils/supabase/client");
        
        const { data, error } = await supabase.auth.getSession();
        
        if (data.session && !error) {
          setIsValidSession(true);
        } else {
          setError("Invalid or expired password reset link. Please request a new one.");
        }
      } catch (error) {
        console.error("Session check error:", error);
        setError("Failed to verify reset session. Please try again.");
      }
    };

    checkResetSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords don't match. Please try again.");
      setLoading(false);
      return;
    }

    // Validate password strength
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      const { supabase } = await import("../utils/supabase/client");
      
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        setError(`Password update failed: ${error.message}`);
        return;
      }

      setSuccess(true);
      
      // Redirect back to login after a short delay
      setTimeout(() => {
        onPasswordReset();
      }, 2000);

    } catch (error) {
      console.error("Password reset error:", error);
      setError(
        `Password reset error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6 space-y-6 text-center">
          <div className="space-y-4">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
            <h1 className="text-2xl font-semibold text-green-800">
              Password Reset Successful!
            </h1>
            <p className="text-sm text-green-600">
              Your password has been updated successfully. You will be redirected to the login page shortly.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (!isValidSession && error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6 space-y-6">
          <div className="text-center space-y-2">
            <img
              src={krishiBandhuLogo}
              alt="KrishiBandhu Logo"
              className="h-16 w-auto mx-auto"
            />
            <h1 className="text-2xl font-semibold text-green-800">
              Reset Password
            </h1>
          </div>

          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>

          <Button
            onClick={onPasswordReset}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Back to Login
          </Button>
        </Card>
      </div>
    );
  }

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
            Reset Password
          </h1>
          <p className="text-sm text-green-600">
            Enter your new password below
          </p>
        </div>

        {/* Reset password form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your new password"
              required
              minLength={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
              required
              minLength={6}
            />
          </div>

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                {error}
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
                Updating password...
              </>
            ) : (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Update Password
              </>
            )}
          </Button>
        </form>

        <div className="text-center">
          <Button
            variant="ghost"
            onClick={onPasswordReset}
            className="text-green-600 hover:text-green-700"
          >
            Back to Login
          </Button>
        </div>
      </Card>
    </div>
  );
}