import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UpdatePasswordForm } from "../UpdatePasswordForm";

const mockGetSession = vi.fn();
const mockUpdateUser = vi.fn();

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      getSession: (...args: unknown[]) => mockGetSession(...args),
      updateUser: (...args: unknown[]) => mockUpdateUser(...args),
    },
  }),
}));

// ── Mock next/navigation ────────────────────────────────────────────
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

// ── Mock sonner toast ───────────────────────────────────────────────
vi.mock("sonner", () => ({
  toast: { success: vi.fn() },
}));

describe("UpdatePasswordForm", () => {
  const onComplete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetSession.mockResolvedValue({
      data: { session: { user: { id: "user-1" } } },
    });
  });

  async function fillAndSubmit(password: string) {
    const user = userEvent.setup();

    // The form has two password fields with these exact placeholders
    const passwordInput = await screen.findByPlaceholderText("הכניסו סיסמה");
    const confirmInput = await screen.findByPlaceholderText("הכניסו סיסמה שוב");

    await user.type(passwordInput, password);
    await user.type(confirmInput, password);

    // Button text from constants: UPDATE_PASSWORD_BUTTON = "עדכון סיסמה"
    const submitButton = screen.getByRole("button", { name: "עדכון סיסמה" });
    await user.click(submitButton);
  }

  it("displays the Hebrew 'same password' error when backend returns that specific error", async () => {
    const SAME_PASSWORD_ERROR = "סיסמא ישנה, אנא הכנס סיסמא חדשה";

    mockUpdateUser.mockResolvedValueOnce({
      error: { message: SAME_PASSWORD_ERROR },
    });

    render(<UpdatePasswordForm onComplete={onComplete} />);
    await fillAndSubmit("MyOldPassword123");

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText(SAME_PASSWORD_ERROR)).toBeInTheDocument();
    });

    // Ensure onComplete was NOT called (password update failed)
    expect(onComplete).not.toHaveBeenCalled();
  });

  it("shows generic error for other server errors", async () => {
    const GENERIC_ERROR =
      "שגיאה בתהליך איפוס הסיסמה. ייתכן שהקישור פג תוקף.";

    mockUpdateUser.mockResolvedValueOnce({
      error: { message: GENERIC_ERROR },
    });

    render(<UpdatePasswordForm onComplete={onComplete} />);
    await fillAndSubmit("SomeNewPassword123");

    await waitFor(() => {
      expect(screen.getByText(GENERIC_ERROR)).toBeInTheDocument();
    });
  });

  it("shows success state when password update succeeds", async () => {
    mockUpdateUser.mockResolvedValueOnce({
      error: null,
    });

    render(<UpdatePasswordForm onComplete={onComplete} />);
    await fillAndSubmit("BrandNewPassword123");

    // UPDATE_PASSWORD_SUCCESS = "הסיסמה שונתה בהצלחה!"
    await waitFor(() => {
      expect(screen.getByText("הסיסמה שונתה בהצלחה!")).toBeInTheDocument();
    });
  });
});
