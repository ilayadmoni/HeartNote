/**
 * LoveCoupons Types
 * Re-exports shared types + local component props
 */

export type {
  LoveCouponsData,
  LoveCoupon,
  TemplateComponentProps,
} from "@/components/templates/types";

export interface CouponsViewProps {
  data: import("@/components/templates/types").LoveCouponsData;
}
