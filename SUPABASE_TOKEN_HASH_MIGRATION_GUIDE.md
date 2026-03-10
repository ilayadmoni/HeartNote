# Supabase Token Hash (OTP) Flow Migration Guide

## Overview
This guide provides step-by-step instructions for configuring your Supabase project to use the **Token Hash (OTP) flow** instead of the legacy PKCE flow. This migration solves cross-device login issues and prevents redirect parameter drops in production.

---

## ✅ Code Changes Completed

The following code changes have been implemented:

1. **New Unified Confirm Route**: `app/auth/confirm/route.ts`
   - Handles both signup confirmation and password recovery
   - Uses `verifyOtp()` with `token_hash` and `type` parameters
   - Routes users correctly based on flow type

2. **Updated Components**:
   - `UpdatePasswordForm` ✅ Already using `updateUser({ password })`
   - `reset-password/page.tsx` ✅ Already using `updateUser({ password })`
   - No `signInWithPassword` logic in password reset flows

3. **Backward Compatibility**:
   - Old `/auth/callback` route marked as deprecated but kept for transition
   - Middleware supports both PKCE and Token Hash flows during migration

---

## 🔧 Supabase Dashboard Configuration

### Step 1: Access Authentication Settings

1. Log in to [Supabase Dashboard](https://app.supabase.com)
2. Select your **HeartNote** project
3. Navigate to **Authentication** → **URL Configuration**

---

### Step 2: Update URL Configuration

#### Site URL
Set the **Site URL** to your production domain:
```
https://www.heartnote.co.il
```

#### Redirect URLs
Add the following URLs to **Redirect URLs** (one per line):
```
https://www.heartnote.co.il/**
https://www.heartnote.co.il/auth/confirm
https://www.heartnote.co.il/auth/callback
http://localhost:3000/**
http://localhost:3000/auth/confirm
http://localhost:3000/auth/callback
```

**Notes:**
- The wildcard `**` allows any path under your domain
- Keep `/auth/callback` during transition for old email links
- Include localhost URLs for local development
- After migration is complete and all old links expire, you can remove `/auth/callback` entries

---

### Step 3: Update Email Templates

Navigate to **Authentication** → **Email Templates**

#### 🔹 Confirm Signup Email Template

**Subject**: `אישור הרשמה ל-HeartNote`

**Email Body** (Update the confirmation link):

```html
<h2>ברוכים הבאים ל-HeartNote!</h2>

<p>תודה על ההרשמה. אנא לחצו על הקישור הבא לאישור כתובת האימייל שלכם:</p>

<p>
  <a href="https://www.heartnote.co.il/auth/confirm?token_hash={{ .TokenHash }}&type=signup">
    אישור כתובת אימייל
  </a>
</p>

<p>או העתיקו את הקישור הבא לדפדפן:</p>
<p>https://www.heartnote.co.il/auth/confirm?token_hash={{ .TokenHash }}&type=signup</p>

<p>הקישור בתוקף ל-24 שעות.</p>

<p>אם לא נרשמתם ל-HeartNote, אנא התעלמו מהודעה זו.</p>
```

**⚠️ Critical Changes:**
- Change URL from `/auth/callback?code=...` to `/auth/confirm?token_hash={{ .TokenHash }}&type=signup`
- Use `{{ .TokenHash }}` variable (this is Supabase's magic link variable)
- Set `type=signup` parameter
- Update your domain to `https://www.heartnote.co.il`

---

#### 🔹 Reset Password Email Template

**Subject**: `איפוס סיסמה ל-HeartNote`

**Email Body** (Update the reset link):

```html
<h2>בקשה לאיפוס סיסמה</h2>

<p>קיבלנו בקשה לאיפוס הסיסמה עבור חשבון HeartNote שלכם.</p>

<p>אם אתם ביקשתם זאת, לחצו על הקישור הבא להגדיר סיסמה חדשה:</p>

<p>
  <a href="https://www.heartnote.co.il/auth/confirm?token_hash={{ .TokenHash }}&type=recovery">
    איפוס סיסמה
  </a>
</p>

<p>או העתיקו את הקישור הבא לדפדפן:</p>
<p>https://www.heartnote.co.il/auth/confirm?token_hash={{ .TokenHash }}&type=recovery</p>

<p>הקישור בתוקף ל-1 שעה.</p>

<p><strong>אם לא ביקשתם לאפס את הסיסמה, אנא התעלמו מהודעה זו.</strong> הסיסמה שלכם תישאר ללא שינוי.</p>
```

**⚠️ Critical Changes:**
- Change URL from `/auth/callback?code=...&next=...` to `/auth/confirm?token_hash={{ .TokenHash }}&type=recovery`
- Use `{{ .TokenHash }}` variable
- Set `type=recovery` parameter
- Update your domain to `https://www.heartnote.co.il`

---

### Step 4: Verify Email Settings

Ensure **Enable email confirmations** is turned ON:

1. Go to **Authentication** → **Providers** → **Email**
2. Check that **Enable email confirmations** is enabled
3. Set **Confirm email** to `required` (not optional)
4. Save changes

---

### Step 5: Test the Flow

#### Testing Signup Confirmation:

1. Register a new test user on your site
2. Check the confirmation email
3. Verify the link format: `https://www.heartnote.co.il/auth/confirm?token_hash=...&type=signup`
4. Click the link → should redirect to home page (/) with authenticated session

#### Testing Password Recovery:

1. Request password reset for a test user
2. Check the recovery email
3. Verify the link format: `https://www.heartnote.co.il/auth/confirm?token_hash=...&type=recovery`
4. Click the link → should redirect to `/?modal=reset-password`
5. Enter new password → should successfully update and redirect to home

---

## 🔍 Troubleshooting

### Issue: "Invalid token" error
**Solution**: Check that:
- Email template uses `{{ .TokenHash }}` (with correct case and dots)
- URL parameters are exactly `token_hash` (with underscore) and `type`
- Token hasn't expired (24h for signup, 1h for recovery)

### Issue: Redirected to auth-code-error page
**Solution**: Check that:
- Both `token_hash` and `type` parameters are present in the URL
- `type` value is exactly `signup` or `recovery` (lowercase)
- The `/auth/confirm` route is deployed and accessible

### Issue: Old PKCE links still coming through
**Solution**:
- This is expected during transition
- Old `/auth/callback` route is kept for backward compatibility
- Once Supabase email templates are updated, new emails will use Token Hash flow
- Old links (with `code` parameter) will continue working until they expire

### Issue: Cross-device authentication not working
**Solution**:
- Verify Site URL matches exactly: `https://www.heartnote.co.il` (no trailing slash)
- Ensure redirect URLs include the wildcard pattern `https://www.heartnote.co.il/**`
- Clear browser cookies and test again

---

## 📋 Verification Checklist

Before considering the migration complete, verify:

- [ ] Site URL set to `https://www.heartnote.co.il`
- [ ] Redirect URLs include both `/auth/confirm` and wildcard pattern
- [ ] Confirm Signup email template updated with Token Hash URL
- [ ] Reset Password email template updated with Token Hash URL
- [ ] Email confirmations are enabled in provider settings
- [ ] Test signup flow works end-to-end
- [ ] Test password reset flow works end-to-end
- [ ] Cross-device verification tested (send email on mobile, click on desktop)
- [ ] Production domain tested (not just localhost)

---

## 🗑️ Cleanup (After Migration)

Once the migration is complete and all old email links have expired (typically 24-48 hours after email template updates):

1. **Remove deprecated callback route**:
   - Delete `client/src/app/auth/callback/route.ts`

2. **Clean up middleware**:
   - Remove PKCE fallback logic from `client/src/middleware.ts`

3. **Update redirect URLs in Supabase**:
   - Remove `/auth/callback` entries (keep only `/auth/confirm`)

---

## 📚 Additional Resources

- [Supabase Auth Guide: Email OTP](https://supabase.com/docs/guides/auth/auth-email-otp)
- [Supabase Magic Links vs PKCE](https://supabase.com/docs/guides/auth/overview)
- Next.js App Router with Supabase: [Official Guide](https://supabase.com/docs/guides/auth/server-side/nextjs)

---

## 🆘 Support

If you encounter issues during migration:

1. Check Supabase logs: **Authentication** → **Logs**
2. Check application logs for `[auth/confirm]` entries
3. Verify environment variables are correctly set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL`

---

**Migration Date**: March 9, 2026  
**Status**: Code changes complete ✅ | Supabase configuration pending ⏳
