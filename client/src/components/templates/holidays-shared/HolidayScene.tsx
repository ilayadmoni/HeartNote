"use client";

import { HanukkahScene } from "./scenes/HanukkahScene";
import { PassoverScene } from "./scenes/PassoverScene";
import { PurimScene } from "./scenes/PurimScene";
import { RoshHashanahScene } from "./scenes/RoshHashanahScene";
import { ShavuotScene } from "./scenes/ShavuotScene";
import { SukkotScene } from "./scenes/SukkotScene";
import type { HolidayInteractiveConfig } from "../types";
import type { HolidaySceneProps } from "./holiday-scene-types";

interface HolidaySceneRouterProps extends HolidaySceneProps {
  config: HolidayInteractiveConfig;
}

export function HolidayScene({ config, ...props }: HolidaySceneRouterProps) {
  switch (config.interaction) {
    case "honey":
      return <RoshHashanahScene {...props} />;
    case "matzah":
      return <PassoverScene {...props} />;
    case "mask":
      return <PurimScene {...props} />;
    case "bloom":
      return <ShavuotScene {...props} />;
    case "sukkah":
      return <SukkotScene {...props} />;
    case "hanukkah":
      return <HanukkahScene {...props} />;
    default:
      return <RoshHashanahScene {...props} />;
  }
}
