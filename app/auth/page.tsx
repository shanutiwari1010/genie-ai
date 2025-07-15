"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PhoneForm } from "@/components/auth/phone-form"
import { OTPForm } from "@/components/auth/otp-form"
import { useAuthStore } from "@/lib/stores/auth-store"

export default function AuthPage() {
  const [step, setStep] = useState<"phone" | "otp">("phone")
  const [phoneData, setPhoneData] = useState<{
    phone: string
    countryCode: string
    otp: string
  } | null>(null)

  const { isAuthenticated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  const handleOTPSent = (phone: string, countryCode: string, otp: string) => {
    setPhoneData({ phone, countryCode, otp })
    setStep("otp")
  }

  const handleBack = () => {
    setStep("phone")
    setPhoneData(null)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      {step === "phone" ? (
        <PhoneForm onOTPSent={handleOTPSent} />
      ) : (
        phoneData && (
          <OTPForm
            phone={phoneData.phone}
            countryCode={phoneData.countryCode}
            expectedOTP={phoneData.otp}
            onBack={handleBack}
          />
        )
      )}
    </div>
  )
}
