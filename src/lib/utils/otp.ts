export function generateOTP(): string {
  return "123456"; // Hardcoded for development
}

export function simulateOTPSend(phone: string): Promise<string> {
  return new Promise((resolve) => {
    const otp = "123456"; // Always return hardcoded OTP
    console.log(`OTP for ${phone}: ${otp}`); // Still log for debugging
    setTimeout(() => {
      resolve(otp);
    }, 1000);
  });
}

export function simulateOTPVerification(
  inputOTP: string,
  actualOTP: string
): Promise<boolean> {
  console.log(actualOTP);
  return new Promise((resolve) => {
    setTimeout(() => {
      // Always check against hardcoded OTP
      resolve(inputOTP === "123456");
    }, 500);
  });
}
