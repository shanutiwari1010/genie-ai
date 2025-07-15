"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { phoneSchema, type PhoneFormData } from "@/lib/schemas/auth"
import { fetchCountries, getDialCode, type Country } from "@/lib/utils/countries"
import { simulateOTPSend } from "@/lib/utils/otp"
import { Loader2 } from "lucide-react"

interface PhoneFormProps {
  onOTPSent: (phone: string, countryCode: string, otp: string) => void
}

export function PhoneForm({ onOTPSent }: PhoneFormProps) {
  const [countries, setCountries] = useState<Country[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingCountries, setIsLoadingCountries] = useState(true)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
  })

  const selectedCountryCode = watch("countryCode")

  useEffect(() => {
    fetchCountries().then((data) => {
      setCountries(data)
      setIsLoadingCountries(false)
    })
  }, [])

  const onSubmit = async (data: PhoneFormData) => {
    setIsLoading(true)
    try {
      const fullPhone = `${data.countryCode}${data.phone}`
      const otp = await simulateOTPSend(fullPhone)

      toast({
        title: "OTP Sent!",
        description: `Verification code sent to ${fullPhone}`,
      })

      onOTPSent(data.phone, data.countryCode, otp)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md bg-white border-none text-black">
      <CardHeader>
        <CardTitle>Welcome to Gemini Chat</CardTitle>
        <CardDescription>Enter your phone number to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select onValueChange={(value) => setValue("countryCode", value)} disabled={isLoadingCountries}>
              <SelectTrigger className="bg-white text-black">
                <SelectValue placeholder={isLoadingCountries ? "Loading countries..." : "Select country"} />
              </SelectTrigger>
              <SelectContent className="bg-white text-black">
                {countries.map((country) => (
                  <SelectItem key={country.cca2} value={getDialCode(country)} className="bg-white text-black">
                    <div className="flex items-center gap-2 ">
                      <span>{country.flag}</span>
                      <span>{country.name.common}</span>
                      <span className="text-muted-foreground">{getDialCode(country)}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.countryCode && <p className="text-sm text-destructive">{errors.countryCode.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="flex">
              <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-muted text-muted-foreground">
                {selectedCountryCode || "+1"}
              </div>
              <Input {...register("phone")} id="phone" type="tel" placeholder="1234567890" className="rounded-l-none bg-white text-black" />
            </div>
            {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send OTP
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
