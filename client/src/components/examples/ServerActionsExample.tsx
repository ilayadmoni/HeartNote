/**
 * Example: Using Server Actions from Client Components with useTransition
 *
 * Demonstrates how to invoke every migrated Server Action from the client
 * using React 19 `useTransition` for non-blocking UI updates.
 */

"use client";

import { useTransition, useState } from "react";
import {
  getMyProfile,
  updateMyProfile,
  deleteMyAccount,
  createCreation,
  getMyCreations,
  getCreation,
  deleteCreation,
  getTemplates,
  getTemplateBySlug,
  getDashboard,
} from "@/actions";
import type { ProfileResponse, DashboardResponse, CreationListItem } from "@/lib/validations";

// ---------------------------------------------------------------------------
// 1. Profile Example
// ---------------------------------------------------------------------------

export function ProfileCard() {
  const [isPending, startTransition] = useTransition();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleLoad() {
    startTransition(async () => {
      const result = await getMyProfile();
      if ("error" in result) {
        setError(result.error);
      } else {
        setProfile(result.data);
        setError(null);
      }
    });
  }

  function handleUpdate() {
    startTransition(async () => {
      const result = await updateMyProfile({
        first_name: "Jane",
        last_name: "Doe",
      });
      if ("error" in result) {
        setError(result.error);
      } else {
        setProfile(result.data);
        setError(null);
      }
    });
  }

  return (
    <div>
      <h2>Profile</h2>
      <button onClick={handleLoad} disabled={isPending}>
        {isPending ? "Loading…" : "Load Profile"}
      </button>
      <button onClick={handleUpdate} disabled={isPending}>
        {isPending ? "Saving…" : "Update Name"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {profile && (
        <pre>{JSON.stringify(profile, null, 2)}</pre>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 2. Create Creation Example
// ---------------------------------------------------------------------------

export function CreateCreationForm({
  templateId,
}: {
  templateId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ id: string; expires_at: string | null } | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    const recipientName = formData.get("recipientName") as string;

    startTransition(async () => {
      const res = await createCreation({
        template_id: templateId,
        metadata: { recipientName },
      });
      if ("error" in res) {
        setError(res.error);
      } else {
        setResult(res.data);
        setError(null);
      }
    });
  }

  return (
    <form action={handleSubmit}>
      <input name="recipientName" placeholder="Recipient name" required />
      <button type="submit" disabled={isPending}>
        {isPending ? "Creating…" : "Create Card"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {result && <p>Created! ID: {result.id}</p>}
    </form>
  );
}

// ---------------------------------------------------------------------------
// 3. Dashboard Example
// ---------------------------------------------------------------------------

export function DashboardView() {
  const [isPending, startTransition] = useTransition();
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleLoad() {
    startTransition(async () => {
      const res = await getDashboard();
      if ("error" in res) {
        setError(res.error);
      } else {
        setDashboard(res.data);
        setError(null);
      }
    });
  }

  return (
    <div>
      <h2>Dashboard</h2>
      <button onClick={handleLoad} disabled={isPending}>
        {isPending ? "Loading…" : "Load Dashboard"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {dashboard && (
        <>
          <p>Tier: {dashboard.stats.subscription_tier}</p>
          <p>Total creations: {dashboard.stats.creations_count}</p>
          <p>Free remaining: {dashboard.stats.creations_left_free}</p>
          <ul>
            {dashboard.creations.map((c) => (
              <li key={c.id}>
                {c.template_name} – {c.is_expired ? "Expired" : "Active"}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 4. Delete Creation Example
// ---------------------------------------------------------------------------

export function CreationsList() {
  const [isPending, startTransition] = useTransition();
  const [items, setItems] = useState<CreationListItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  function handleLoad() {
    startTransition(async () => {
      const res = await getMyCreations();
      if ("error" in res) {
        setError(res.error);
      } else {
        setItems(res.data);
        setError(null);
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const res = await deleteCreation(id);
      if ("error" in res) {
        setError(res.error);
      } else {
        // Refresh list after successful delete
        setItems((prev) => prev.filter((c) => c.id !== id));
        setError(null);
      }
    });
  }

  return (
    <div>
      <h2>My Creations</h2>
      <button onClick={handleLoad} disabled={isPending}>
        {isPending ? "Loading…" : "Refresh"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {items.map((c) => (
          <li key={c.id}>
            {c.template_name} ({c.created_at})
            <button onClick={() => handleDelete(c.id)} disabled={isPending}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
