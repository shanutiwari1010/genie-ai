"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { phoneSchema, type PhoneFormData } from "@/lib/schemas/auth"
import { fetchCountries, getDialCode, type Country } from "@/lib/utils/countries"
import { simulateOTPSend } from "@/lib/utils/otp"
import { Loader2, Check, MessageCircleMore } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
} from "@/components/ui/command"
import { cn } from "@/lib/utils"

interface PhoneFormProps {
  onOTPSent: (phone: string, countryCode: string, otp: string) => void
}

export function PhoneForm({ onOTPSent }: PhoneFormProps) {
  const [countries, setCountries] = useState<Country[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingCountries, setIsLoadingCountries] = useState(true)
  const [open, setOpen] = useState(false)
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
  const selectedCountry = countries.find(c => getDialCode(c) === selectedCountryCode)

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
      <CardHeader className="flex flex-col justify-center items-center">
        <MessageCircleMore className="h-9 w-9"/>
        <CardTitle>Welcome to Gemini Chat</CardTitle>
        <CardDescription>Enter your phone number to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between bg-white text-black "
                >
                  {selectedCountry ? (
                    <div className="flex items-center gap-2">
                      <span>{selectedCountry.flag}</span>
                      <span>{selectedCountry.name.common}</span>
                      <span className="text-muted-foreground">
                        {getDialCode(selectedCountry)}
                      </span>
                    </div>
                  ) : isLoadingCountries ? (
                    "Loading countries..."
                  ) : (
                    "Select country"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0 bg-white text-black border border-gray-200">
                <Command className="bg-white text-black" >
                  <CommandInput  placeholder="Search country..." />
                  <CommandList >
                    <CommandEmpty>No country found.</CommandEmpty>
                    {countries.map((country) => {
                      const dial = getDialCode(country)
                      return (
                        <CommandItem
                          key={country.cca2}
                          value={country.name.common.toLowerCase()}
                          onSelect={() => {
                            setValue("countryCode", dial)
                            setOpen(false)
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <span>{country.flag}</span>
                            <span>{country.name.common}</span>
                            <span className="text-muted-foreground">{dial}</span>
                          </div>
                          {selectedCountryCode === dial && (
                            <Check className="ml-auto h-4 w-4 text-primary" />
                          )}
                        </CommandItem>
                      )
                    })}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {errors.countryCode && <p className="text-sm text-destructive">{errors.countryCode.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="flex">
              <div className="flex items-center px-3 border border-r-0 rounded-l-md ">
                {selectedCountryCode || "+1"}
              </div>
              <Input {...register("phone")} id="phone" type="tel" placeholder="1234567890" className="rounded-l-none bg-white text-black" />
            </div>
            {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
          </div>

          <Button type="submit" className="w-full bg-gray-900 hover:bg-gray-950 text-white dark:from-gray-900 dark:to-gray-800" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin " />}
            Send OTP
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
