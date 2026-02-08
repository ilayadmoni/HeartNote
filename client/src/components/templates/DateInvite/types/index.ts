/**
 * DateInvite Types
 */

export interface DateInviteBaseProps {
  data: {
    question: string;
    yesText: string;
    noText: string;
    successMessage: string;
    backgroundImage?: string;
  };
  answered: boolean;
  noPosition: { x: number; y: number };
  onYes: () => void;
  onReset: () => void;
  onNoHover: () => void;
}

export type DateInviteDesktopProps = DateInviteBaseProps;
export type DateInviteMobileProps = DateInviteBaseProps;
