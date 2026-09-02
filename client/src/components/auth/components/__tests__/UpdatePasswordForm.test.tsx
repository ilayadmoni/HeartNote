import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { UpdatePasswordForm } from "../UpdatePasswordForm";
import authMessages from "@/messages/he/auth.json";

const mockUpdatePassword = vi.fn();

vi.mock("@/actions/password", () => ({
  updatePassword: (...args: unknown[]) => mockUpdatePassword(...args),
}));

// ── Mock next/navigation ────────────────────────────────────────────
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams({ token: "valid-token" }),
}));

// ── Mock @/i18n/navigation (used for router.push after redirect) ────
vi.mock("@/i18n/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

// ── Mock sonner toast ───────────────────────────────────────────────
vi.mock("sonner", () => ({
  toast: { success: vi.fn() },
}));

function renderForm(onComplete: () => void) {
  return render(
    <NextIntlClientProvider locale="he" messages={{ auth: authMessages }}>
      <UpdatePasswordForm onComplete={onComplete} />
    </NextIntlClientProvider>,
  );
}

describe("UpdatePasswordForm", () => {
  const onComplete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  async function fillAndSubmit(password: string) {
    const user = userEvent.setup();

    const passwordInput = await screen.findByPlaceholderText(authMessages.placeholders.password);
    const confirmInput = await screen.findByPlaceholderText(authMessages.placeholders.confirmPassword);

    await user.type(passwordInput, password);
    await user.type(confirmInput, password);

    const submitButton = screen.getByRole("button", { name: authMessages.updatePassword.button });
    await user.click(submitButton);
  }

  it("displays a server-returned error (e.g. same-password rejection)", async () => {
    const SERVER_ERROR = "סיסמא ישנה, אנא הכנס סיסמא חדשה";
    mockUpdatePassword.mockResolvedValueOnce({ error: SERVER_ERROR });

    renderForm(onComplete);
    await fillAndSubmit("MyOldPassword123");

    await waitFor(() => {
      expect(screen.getByText(SERVER_ERROR)).toBeInTheDocument();
    });

    // Ensure onComplete was NOT called (password update failed)
    expect(onComplete).not.toHaveBeenCalled();
  });

  it("shows the translated generic error for other server errors", async () => {
    mockUpdatePassword.mockResolvedValueOnce({ error: authMessages.updatePassword.expiredMessage });

    renderForm(onComplete);
    await fillAndSubmit("SomeNewPassword123");

    await waitFor(() => {
      expect(screen.getByText(authMessages.updatePassword.expiredMessage)).toBeInTheDocument();
    });
  });

  it("shows the translated success state when password update succeeds", async () => {
    mockUpdatePassword.mockResolvedValueOnce({ success: authMessages.updatePassword.success });

    renderForm(onComplete);
    await fillAndSubmit("BrandNewPassword123");

    await waitFor(() => {
      expect(screen.getByText(authMessages.updatePassword.success)).toBeInTheDocument();
    });
  });
});
