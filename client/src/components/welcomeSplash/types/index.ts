/**
 * WelcomeSplash Types
 * Type definitions for the welcome splash screen components
 */

export interface WelcomeSplashProps {
  className?: string;
}

export interface SplashLogoProps {
  className?: string;
}

export interface GreetingTextProps {
  firstName: string;
  lastName: string;
}

export interface SplashProgressBarProps {
  /** Called when the bar reaches 100% */
  onComplete: () => void;
}
