"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowLeft } from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/lib/stores/auth-store";
import { otpSchema, type OTPFormData } from "@/lib/schemas/auth";
import { simulateOTPVerification, simulateOTPSend } from "@/lib/utils/otp";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface OTPFormProps {
  phone: string;
  countryCode: string;
  expectedOTP: string;
  onBack: () => void;
}

export function OTPForm({
  phone,
  countryCode,
  expectedOTP,
  onBack,
}: OTPFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [currentOTP, setCurrentOTP] = useState(expectedOTP);
  const { toast } = useToast();
  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
  });

  const onSubmit = async (data: OTPFormData) => {
    setIsLoading(true);
    try {
      const isValid = await simulateOTPVerification(data.otp, currentOTP);

      if (isValid) {
        const user = {
          id: `user-${Date.now()}`,
          phone,
          countryCode,
          name: `User ${phone.slice(-4)}`,
        };

        login(user);

        toast({
          title: "Welcome!",
          description: "You've been successfully logged in.",
        });
      } else {
        toast({
          title: "Invalid OTP",
          description: "Please check your code and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    try {
      const fullPhone = `${countryCode}${phone}`;
      const newOTP = await simulateOTPSend(fullPhone);
      setCurrentOTP(newOTP);

      toast({
        title: "OTP Resent!",
        description: `New verification code sent to ${fullPhone}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-white text-black">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex flex-col justify-center items-center gap-2">
            <CardTitle>Verify Your Phone</CardTitle>
            <CardDescription>
              Enter the 6-digit code sent to {countryCode}
              {phone}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp">Verification Code</Label>
            <Input
              {...register("otp")}
              id="otp"
              type="text"
              placeholder="123456"
              maxLength={6}
              className="text-center bg-white text-lg tracking-widest"
            />
            {errors.otp && (
              <p className="text-sm text-destructive">{errors.otp.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full  bg-gray-900 hover:bg-gray-950 text-white  dark:from-gray-900 dark:to-gray-800"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verify OTP
          </Button>

          <div className="text-center">
            <Button
              type="button"
              variant="link"
              onClick={handleResendOTP}
              disabled={isResending}
              className="text-sm  text-gray-950"
            >
              {isResending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Resend OTP
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
