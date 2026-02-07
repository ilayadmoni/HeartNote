/**
 * useSupabase Hook
 * Supabase client hooks for data fetching
 */

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

// =============================================================================
// TYPES
// =============================================================================

export interface Template {
  id: string;
  name: string;
  name_he: string | null;
  description: string | null;
  description_he: string | null;
  component_key: string;
  config_schema: Record<string, unknown>;
  example_data: Record<string, unknown>;
  category: string;
  tags: string[];
  is_premium: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface UserPage {
  id: string;
  user_id: string;
  template_id: string;
  route_slug: string;
  title: string | null;
  custom_settings: Record<string, unknown>;
  is_published: boolean;
  is_deleted: boolean;
  expires_at: string | null;
  view_count: number;
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
          .order("sort_order");

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

export function useTemplate(id: string) {
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchTemplate() {
      try {
        const { data, error } = await supabase
          .from("templates")
          .select("*")
          .eq("id", id)
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
  }, [id]);

  return { template, loading, error };
}

// =============================================================================
// USER PAGES HOOKS
// =============================================================================

export function useUserPages() {
  const [pages, setPages] = useState<UserPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPages = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_pages")
        .select(`*, template:templates(*)`)
        .eq("is_deleted", false)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPages(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה בטעינת הדפים");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  return { pages, loading, error, refetch: fetchPages };
}

export function usePublicPage(slug: string) {
  const [page, setPage] = useState<UserPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    async function fetchPage() {
      try {
        // Use the RPC function for public page access
        const { data, error } = await supabase.rpc("get_public_page", {
          page_slug: slug,
        });

        if (error) throw error;
        if (!data || data.length === 0) {
          throw new Error("הדף לא נמצא או שפג תוקפו");
        }

        // Increment view count
        await supabase.rpc("increment_page_view", { page_slug: slug });

        setPage({
          id: data[0].id,
          template_id: data[0].template_id,
          custom_settings: data[0].custom_settings,
          title: data[0].title,
          route_slug: slug,
          template: {
            component_key: data[0].template_component_key,
            config_schema: data[0].template_config_schema,
          } as Template,
        } as UserPage);
      } catch (err) {
        setError(err instanceof Error ? err.message : "שגיאה בטעינת הדף");
      } finally {
        setLoading(false);
      }
    }

    fetchPage();
  }, [slug]);

  return { page, loading, error };
}
