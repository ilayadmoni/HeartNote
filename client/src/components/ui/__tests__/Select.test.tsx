import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Select } from "../Select";

const OPTIONS = [
  { value: "3", label: "3" },
  { value: "5", label: "5" },
  { value: "7", label: "7" },
];

function renderSelect(value = "3", onChange = vi.fn()) {
  render(
    <Select options={OPTIONS} value={value} onChange={onChange} label="מספר נגיעות נדרשות" />,
  );
  return { onChange, trigger: screen.getByRole("combobox") };
}

describe("Select", () => {
  beforeEach(() => {
    document.dir = "rtl";
  });

  it("shows the selected option's label on the closed trigger", () => {
    const { trigger } = renderSelect("5");
    expect(trigger).toHaveTextContent("5");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("falls back to the placeholder when the value matches no option", () => {
    render(
      <Select options={OPTIONS} value="" onChange={vi.fn()} placeholder="בחרו" aria-label="בחירה" />,
    );
    expect(screen.getByRole("combobox")).toHaveTextContent("בחרו");
  });

  it("opens on click and marks only the selected option as selected", async () => {
    const user = userEvent.setup();
    const { trigger } = renderSelect("5");

    await user.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(3);
    expect(options.map((o) => o.getAttribute("aria-selected"))).toEqual(["false", "true", "false"]);
  });

  it("commits the clicked option and closes", async () => {
    const user = userEvent.setup();
    const { trigger, onChange } = renderSelect("3");

    await user.click(trigger);
    await user.click(screen.getByRole("option", { name: "7" }));

    expect(onChange).toHaveBeenCalledWith("7");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("opens with ArrowDown and commits with Enter", async () => {
    const user = userEvent.setup();
    const { trigger, onChange } = renderSelect("3");

    trigger.focus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await user.keyboard("{ArrowDown}{Enter}");
    expect(onChange).toHaveBeenCalledWith("5");
  });

  it("jumps to the last option with End and the first with Home", async () => {
    const user = userEvent.setup();
    const { trigger, onChange } = renderSelect("3");

    trigger.focus();
    await user.keyboard("{Enter}{End}{Enter}");
    expect(onChange).toHaveBeenLastCalledWith("7");

    await user.keyboard("{Enter}{Home}{Enter}");
    expect(onChange).toHaveBeenLastCalledWith("3");
  });

  it("does not step past either end of the list", async () => {
    const user = userEvent.setup();
    const { trigger, onChange } = renderSelect("3");

    trigger.focus();
    await user.keyboard("{Enter}{ArrowUp}{ArrowUp}{Enter}");
    expect(onChange).toHaveBeenLastCalledWith("3");

    await user.keyboard("{Enter}{ArrowDown}{ArrowDown}{ArrowDown}{ArrowDown}{Enter}");
    expect(onChange).toHaveBeenLastCalledWith("7");
  });

  it("closes on Escape without committing, and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    const { trigger, onChange } = renderSelect("3");

    trigger.focus();
    await user.keyboard("{ArrowDown}{ArrowDown}{Escape}");

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("closes when pointing outside the trigger and the menu", async () => {
    const user = userEvent.setup();
    const { trigger } = renderSelect();

    await user.click(trigger);
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await user.click(document.body);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("wires the combobox to its listbox and active option for screen readers", async () => {
    const user = userEvent.setup();
    const { trigger } = renderSelect("3");

    expect(trigger).toHaveAttribute("aria-haspopup", "listbox");
    expect(trigger).not.toHaveAttribute("aria-controls");

    await user.click(trigger);

    const listbox = screen.getByRole("listbox");
    expect(trigger).toHaveAttribute("aria-controls", listbox.id);
    expect(trigger.getAttribute("aria-activedescendant")).toBe(
      screen.getAllByRole("option")[0].id,
    );
  });

  it("stays closed and reports the error when disabled or invalid", async () => {
    const user = userEvent.setup();
    render(
      <Select
        options={OPTIONS}
        value="3"
        onChange={vi.fn()}
        aria-label="בחירה"
        disabled
        error="שדה חובה"
      />,
    );
    const trigger = screen.getByRole("combobox");

    expect(trigger).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("שדה חובה");

    await user.click(trigger);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});
