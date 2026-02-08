/**
 * Timeline Types
 */

import type { TimelineData } from "../../types";

export interface TimelineBaseProps {
  data: TimelineData;
}

export type TimelineDesktopProps = TimelineBaseProps;
export type TimelineMobileProps = TimelineBaseProps;
