/**
 * useSupabase Hook
 * Supabase client hooks for data fetching.
 * Aligned with new DB schema (templates with slug/category[], creations table).
 */

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

// =============================================================================
// TYPES
// =============================================================================

export interface Template {
  id: string;
  slug: string;
  name: string;
  category: string[] | null;
  tags: string | null;
  config_schema: Record<string, unknown>;
  is_premium: boolean;
  is_active: boolean;
  expiration_policy: Record<string, unknown> | null;
  created_at: string;
}

export interface Creation {
  id: string;
  user_id: string;
  template_id: string;
  metadata: Record<string, unknown>;
  is_paid: boolean | null;
  is_deleted: boolean;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  template?: Template;
}

// =============================================================================
// TEMPLATES HOOKS
// =============================================================================

export function useTemplates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const { data, error } = await supabase
          .from("templates")
          .select("*")
          .eq("is_active", true)
          .order("name");

        if (error) throw error;
        setTemplates(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "שגיאה בטעינת התבניות");
      } finally {
        setLoading(false);
      }
    }

    fetchTemplates();
  }, []);

  return { templates, loading, error };
}

export function useTemplate(idOrSlug: string) {
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!idOrSlug) return;

    async function fetchTemplate() {
      try {
        // Detect whether we got a UUID or a slug
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
        const column = isUUID ? "id" : "slug";

        const { data, error } = await supabase
          .from("templates")
          .select("*")
          .eq(column, idOrSlug)
          .single();

        if (error) throw error;
        setTemplate(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "תבנית לא נמצאה");
      } finally {
        setLoading(false);
      }
    }

    fetchTemplate();
  }, [idOrSlug]);

  return { template, loading, error };
}

// =============================================================================
// CREATIONS HOOKS (replaces user_pages)
// =============================================================================

export function useCreations() {
  const [creations, setCreations] = useState<Creation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCreations = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("creations")
        .select(`*, template:templates(*)`)
        .eq("is_deleted", false)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCreations(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה בטעינת היצירות");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCreations();
  }, [fetchCreations]);

  return { creations, loading, error, refetch: fetchCreations };
}

export function usePublicCreation(id: string) {
  const [creation, setCreation] = useState<Creation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchCreation() {
      try {
        const { data, error } = await supabase
          .from("creations")
          .select(`*, template:templates(slug, name, config_schema)`)
          .eq("id", id)
          .eq("is_deleted", false)
          .single();

        if (error) throw error;
        if (!data) {
          throw new Error("היצירה לא נמצאה או שפג תוקפה");
        }

        // Check expiry
        if (data.expires_at && new Date(data.expires_at) < new Date()) {
          throw new Error("פג תוקף היצירה");
        }

        setCreation(data as Creation);
      } catch (err) {
        setError(err instanceof Error ? err.message : "שגיאה בטעינת היצירה");
      } finally {
        setLoading(false);
      }
    }

    fetchCreation();
  }, [id]);

  return { creation, loading, error };
}
