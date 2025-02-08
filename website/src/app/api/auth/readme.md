# Login scheme with a layered defense mechanism

## Scheme

**1. Two-Tier Rate Limiting:**

- **IP Rate Limiting:** Limits login attempts from a single IP address to 5 requests within a 15-minute timeframe. This deters automated attacks originating from the same source.
- **User Rate Limiting (Implicit):** While not explicitly mentioned, the subsequent steps (3 password attempts and account lockout) effectively limit attempts for a specific user ID within the hour timeframe.

**2. Password Attempts:**

- Users get 3 attempts to enter the correct password before encountering additional challenges.

**3. CAPTCHA + Password:**

- After 3 failed password attempts, users need to solve a CAPTCHA challenge followed by entering the correct password. This helps prevent automated brute-force attacks.

Can be done only twice

**4. OTP Verification:**

- If the user fails the CAPTCHA + password challenge, they have 2 attempts to enter a valid OTP (One-Time Password) received via email or phone number.
- The 5-minute cool-off period between OTP resends prevents rapid guessing attempts.

**5. Lockouts:**

- The account gets locked for 15 minutes after failing both CAPTCHAs and exceeding the password attempts.
- After exceeding OTP attempts, the account gets locked out for a longer duration (1 hour) to discourage persistent attacks.

**Benefits:**

- Combines rate limiting, password attempts, CAPTCHAs, OTP verification, and lockouts for a multi-layered defense.
- Provides a balance between security and user experience with separate lockout durations.
- Offers a password reset link for legitimate users to recover access after a temporary lockout.
  The login scheme you described outlines a strong security approach with a layered defense mechanism. Here's a breakdown of its components:

## Summary

    In an hour timeframe :

        Define a ip rate limiting : limit rate to 5 requests per 15 minutes and on top of that ( for specific user id )
        3 times wrong password ->
        2 captcha-password based  -> failure lock account for 15 minutes

    3 OTP verification via email / phone number with 5 min cool off between resend OTP
    Lockout user for 1 hour giving a password reset link

--

OTP messages : 5 messages per 15 minutes per user on top of ip filtering.
Email OTP messages : 5 requests per 15 minutes

--

Use mobile otp to confirm place order time ( if user phone number is not verified )
SMS Bulk not to be used : SMS service for the same ( Bulk sms services )
