"use client";

import { toast } from "sonner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowLeft } from "lucide-react";

import { useAuthStore } from "@/lib/stores/auth-store";
import { otpSchema, type OTPFormData } from "@/lib/schemas/auth";
import { simulateOTPVerification, simulateOTPSend } from "@/lib/utils/otp";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
  const login = useAuthStore((state) => state.login);

  const form = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
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

        toast.success("Welcome!", {
          description: "You've been successfully logged in.",
        });
      } else {
        toast.error("Invalid OTP", {
          description: "Please check your code and try again.",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error", {
        description: "Failed to verify OTP. Please try again.",
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

      toast.success("OTP Resent!", {
        description: `New verification code sent to ${fullPhone}`,
      });
    } catch (error) {
      console.error(error);
      toast.error("Error", {
        description: "Failed to resend OTP. Please try again.",
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
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 "
          >
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>One-Time Password</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription>
                    Please enter the one-time password sent to your phone.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify OTP
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={handleResendOTP}
                disabled={isResending}
                className="w-full"
              >
                {isResending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Resend OTP
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
