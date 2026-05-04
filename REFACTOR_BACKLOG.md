# Refactor Backlog

Files exceeding the 150-line limit. **Do not refactor proactively.** Apply the Refactor-on-Touch policy below.

---

## Policy: Refactor-on-Touch

When you open a file **for any reason** (bug fix, feature work, copy change):

1. Check whether the file is on this list.
2. If yes, modularize it as part of your PR — not as a separate "cleanup" PR.
3. Mark it done in this list after the PR merges.

**Do not** open a file solely to split it. Refactor only when you already have a reason to be in the file.

---

## Standard Criteria

Every split must satisfy all three:

| Rule | What it means |
|---|---|
| **≤ 150 lines per file** | New files must not exceed this limit. Split again if needed. |
| **Extract logic to hooks** | Any `useState`/`useEffect`/`useCallback` cluster with a coherent purpose becomes a `use*.ts` file alongside the component. |
| **Extract sub-components** | Any JSX block over ~40 lines that represents a self-contained visual unit gets its own file in the same directory. |
| **No new files over 150 lines** | All new files created anywhere in the project must start under this limit. |

Pure data files (arrays of constants, type-only files, SVG-only components) are exempt from the line limit.

---

## Backlog

### Actions (server-side)

| File | Lines | Suggested split |
|---|---|---|
| `actions/creations/submit.ts` | 281 | Extract validation logic → `helpers/validateSubmit.ts`; extract DB write → `helpers/persistCreation.ts` |
| `actions/password.ts` | 278 | Extract rate-limit check → `helpers/passwordRateLimit.ts`; split reset-request and reset-confirm into separate files |
| `actions/registration.ts` | 273 | Extract ban check → `helpers/banCheck.ts`; extract email dispatch → `helpers/registrationEmail.ts` |
| `actions/creations/create.ts` | 249 | Extract tier/quota guard → `helpers/tierGuard.ts` |
| `actions/creations/read.ts` | 155 | Extract query builders into `helpers/readQueries.ts` |

### Auth Components

| File | Lines | Suggested split |
|---|---|---|
| `components/auth/components/RegisterForm.tsx` | 406 | Extract field groups → `RegisterFields.tsx`; extract submit handler → `useRegisterForm.ts` |
| `components/auth/completeProfile/CompleteProfileForm.tsx` | 340 | Extract step components → `StepOne.tsx`, `StepTwo.tsx`; extract state → `useCompleteProfile.ts` |
| `components/auth/components/UpdatePasswordForm.tsx` | 318 | Extract password strength UI → `PasswordStrengthIndicator.tsx`; extract logic → `useUpdatePassword.ts` |
| `components/auth/hooks/useAuthModalState.ts` | 317 | Extract OAuth flow → `useOAuthFlow.ts`; extract modal routing → `useModalRouter.ts` |
| `app/(main)/auth/reset-password/page.tsx` | 279 | Extract form → `ResetPasswordForm.tsx`; extract success state → `ResetPasswordSuccess.tsx` |
| `components/auth/components/ForgotPasswordForm.tsx` | 205 | Extract cooldown timer UI → `CooldownBanner.tsx`; extract logic → `useForgotPassword.ts` |
| `components/auth/components/LoginModal.tsx` | 156 | Extract tab content → `LoginTabContent.tsx`, `RegisterTabContent.tsx` |

### Editor Components

| File | Lines | Suggested split |
|---|---|---|
| `components/editor/hooks/useEditorState.ts` | 268 | Extract draft management → `useDraftState.ts`; extract validation → `useEditorValidation.ts` |
| `components/editor/components/QuestionsEditor.tsx` | 254 | Extract single question row → `QuestionRow.tsx`; extract add/remove logic → `useQuestionsEditor.ts` |
| `components/editor/components/SuccessModal.tsx` | 250 | Extract share panel → `SharePanel.tsx`; extract expiry panel → `ExpiryPanel.tsx` |
| `components/editor/components/ImageUploader.tsx` | 237 | Extract preview strip → `UploadPreviewStrip.tsx`; extract upload logic → `useImageUpload.ts` |
| `components/editor/components/EditorField.tsx` | 170 | Extract each field type → individual `*Field.tsx` files |
| `components/editor/components/TimelineEventsEditor.tsx` | 158 | Extract event row → `TimelineEventRow.tsx` |
| `components/editor/components/QuotaModal.tsx` | 157 | Extract tier comparison table → `TierTable.tsx` |
| `components/editor/components/PaidQuotaModal.tsx` | 188 | Extract upgrade CTA section → `UpgradeSection.tsx` |
| `components/editor/components/CouponsEditor.tsx` | 174 | Extract single coupon editor → `CouponEditorRow.tsx` |

### Profile Components

| File | Lines | Suggested split |
|---|---|---|
| `app/(main)/profile/page.tsx` | 242 | Extract server data fetching logic; move sections to sub-components |
| `components/profile/components/SubscriptionCard.tsx` | 238 | Extract tier status display → `TierBadge.tsx`; extract action row → `SubscriptionActions.tsx` |
| `components/profile/ProfileClient.tsx` | 230 | Extract data wiring to `useProfileClient.ts`; split mobile/desktop conditionals |
| `components/profile/Desktop/ProfileDesktop.tsx` | 226 | Extract sidebar → `ProfileSidebar.tsx`; extract main content → `ProfileContent.tsx` |
| `components/profile/Mobile/ProfileMobile.tsx` | 220 | Extract section sheets → individual sheet components |
| `components/profile/components/DeleteAccountCard.tsx` | 200 | Extract confirmation flow → `useDeleteAccount.ts` |
| `components/profile/components/EditProfileCard.tsx` | 169 | Extract avatar section → `AvatarSection.tsx`; extract form fields → `ProfileFields.tsx` |

### Gallery Components

| File | Lines | Suggested split |
|---|---|---|
| `components/galleryTemplate/components/TemplatePreview.tsx` | 237 | Extract preview header → `PreviewHeader.tsx`; extract media section → `PreviewMedia.tsx` |
| `components/galleryTemplate/components/TemplateCard.tsx` | 156 | Extract card footer → `TemplateCardFooter.tsx` |

### Template Components

| File | Lines | Suggested split |
|---|---|---|
| `components/templates/SteamyWindow/components/SteamyWindowCropModal.tsx` | 473 | Extract crop area → `CropArea.tsx`; extract controls → `CropControls.tsx`; extract logic → `useSteamyCrop.ts` |
| `components/templates/SteamyWindow/components/CreateCardPage.tsx` | 286 | Extract step components; extract stepper logic → `useCreateCardStepper.ts` |
| `components/templates/SteamyWindow/components/SteamCanvas.tsx` | 249 | Extract drawing primitives → `steamDrawing.ts`; extract animation → `useSteamAnimation.ts` |
| `components/templates/SteamyWindow/components/ConfirmationModal.tsx` | 246 | Extract preview section → `ConfirmationPreview.tsx`; extract actions row → `ConfirmationActions.tsx` |
| `components/templates/SteamyWindow/components/SteamyWindowPreview.tsx` | 206 | Extract canvas layer → standalone component; extract overlay → `PreviewOverlay.tsx` |
| `components/templates/ScratchCard/Mobile/ScratchCardMobile.tsx` | 277 | Extract scratch canvas → `ScratchCanvas.tsx`; extract logic → `useScratchCard.ts` |
| `components/templates/ScratchCard/Desktop/ScratchCardDesktop.tsx` | 272 | Same pattern as mobile counterpart |
| `components/templates/OpenWhen/components/EnvelopeCard.tsx` | 233 | Extract envelope animation → `EnvelopeAnimation.tsx`; extract letter reveal → `LetterReveal.tsx` |
| `components/templates/LoveCoupons/components/CouponRedeemModal.tsx` | 179 | Extract redeem form → `RedeemForm.tsx`; extract logic → `useCouponRedeem.ts` |
| `components/templates/DateInvite/Desktop/DateInviteDesktop.tsx` | 191 | Extract invitation card → `InvitationCard.tsx`; extract RSVP row → `RSVPRow.tsx` |
| `components/templates/DateInvite/Mobile/DateInviteMobile.tsx` | 168 | Same pattern as desktop counterpart |
| `components/templates/DecisionWheel/components/wheelDrawing.ts` | 190 | Extract text measurement helpers → `textMeasure.ts` if it grows further |
| `components/templates/HolidayCard/holidays/Shavuot.tsx` | 199 | Extract scene layers into sub-components |
| `components/templates/ExcuseGenerator/Mobile/ExcuseGeneratorMobile.tsx` | 172 | Extract result card → `ExcuseResultCard.tsx`; extract logic → `useExcuseGenerator.ts` |
| `components/templates/ExcuseGenerator/Desktop/ExcuseGeneratorDesktop.tsx` | 169 | Same pattern as mobile counterpart |
| `components/templates/SurpriseGift/Mobile/SurpriseGiftMobile.tsx` | 173 | Extract gift reveal animation → `GiftReveal.tsx` |
| `components/templates/SurpriseGift/Desktop/SurpriseGiftDesktop.tsx` | 172 | Same pattern as mobile counterpart |
| `components/templates/PunchingBag/Desktop/PunchingBagDesktop.tsx` | 172 | Extract bag animation → `BagAnimation.tsx`; extract logic → `usePunchingBag.ts` |
| `components/templates/PunchingBag/Mobile/PunchingBagMobile.tsx` | 164 | Same pattern as desktop counterpart |
| `components/templates/ApologySearch/Desktop/ApologySearchDesktop.tsx` | 166 | Extract search input row → `ApologySearchInput.tsx`; extract results list → `ApologyResults.tsx` |
| `components/templates/ApologySearch/Mobile/ApologySearchMobile.tsx` | 162 | Same pattern as desktop counterpart |
| `components/templates/BarBatMitzvah/Desktop/BarBatMitzvahDesktop.tsx` | 158 | Extract scene layers into sub-components |

### UI / Shared Components

| File | Lines | Suggested split |
|---|---|---|
| `components/ui/UpgradeSlideOver.tsx` | 319 | Extract tier comparison grid → `TierGrid.tsx`; extract CTA section → `UpgradeCTA.tsx`; extract logic → `useUpgradeSlideOver.ts` |
| `components/ui/BottomSheet.tsx` | 230 | Extract drag handle + gesture logic → `useBottomSheetGesture.ts`; extract backdrop → `BottomSheetBackdrop.tsx` |
| `components/ui/useBrandCalendar.ts` | 165 | Extract holiday lookup → `holidayLookup.ts`; extract date range helpers → `calendarRange.ts` |

### Other

| File | Lines | Suggested split |
|---|---|---|
| `components/initialLoader/InitialLoader.tsx` | 277 | Extract progress animation → `LoaderAnimation.tsx`; extract logic → `useInitialLoader.ts` |
| `components/demo/components/Step4Animation.tsx` | 409 | Extract each animation phase into a sub-component |
| `components/demo/StoryDemo.tsx` | 211 | Extract step orchestration → `useStoryDemo.ts`; extract step renderer → `StepRenderer.tsx` |
| `components/demo/components/Step1Animation.tsx` | 170 | Extract animation keyframes into constants; split scene layers |
| `components/contact/components/ContactForm.tsx` | 211 | Extract field group → `ContactFields.tsx`; extract logic → `useContactForm.ts` |
| `components/pricing/components/PricingCard.tsx` | 174 | Extract feature list → `PricingFeatureList.tsx`; extract CTA → `PricingCTA.tsx` |
| `components/accessibility/AccessibilityProvider.tsx` | 200 | Extract keyboard trap logic → `useKeyboardAccessibility.ts`; extract font-size logic → `useFontSizeControl.ts` |
| `lib/utils/rate-limiter.ts` | 191 | Extract factory builder → `rateLimiterFactory.ts`; extract preset configs → `rateLimiterPresets.ts` |
| `lib/utils/image-utils.ts` | 185 | Extract resize logic → `imageResize.ts`; extract format conversion → `imageFormat.ts` |
| `app/(main)/preview/page.tsx` | 199 | Extract preview shell → `PreviewShell.tsx`; extract share section → `PreviewShareSection.tsx` |
| `contexts/AuthContext.tsx` | 175 | Extract session refresh logic → `useSessionRefresh.ts` |
| `app/auth/callback/route.ts` | 226 | Extract provider-specific handlers → `helpers/` directory |
| `components/home/components/GalleryTeaser.tsx` | 173 | Extract card strip → `TeaserCardStrip.tsx` |

---

## Exempt Files

These exceed 150 lines but are exempt (pure data, types, or SVG markup):

- `components/galleryTemplate/data/templates.ts` — template config data
- `components/templates/types.ts` — union type definitions
- `components/faq/constants/data.tsx` — FAQ content array
- `types/index.ts` — global interface definitions
- `profile/types/index.ts` — profile type definitions
- `components/templates/BarBatMitzvah/components/BarFigure.tsx` — SVG figure
- `components/templates/BarBatMitzvah/components/BatFigure.tsx` — SVG figure
- `app/sitemap.ts` — generated sitemap, not application logic
