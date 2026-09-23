import { advertisingHub } from "./advertising";
import { socialMediaHub } from "./social-media";
import { villasRealEstateHub } from "./villas-real-estate";
import { foodRestaurantsHub } from "./food-restaurants";
import { businessLocalPresenceHub } from "./business-local-presence";
import { websitesDigitalHub } from "./websites-digital";
import { videoProductionHub } from "./video-production";
import { brandingCreativeHub } from "./branding-creative";
import type { HubPage } from "@/content/types";

/** English master content. Pages read localized hubs via getHubs/getHub/getService in `@/content/translations`. */
export const HUBS: HubPage[] = [
  advertisingHub,
  socialMediaHub,
  villasRealEstateHub,
  foodRestaurantsHub,
  businessLocalPresenceHub,
  websitesDigitalHub,
  videoProductionHub,
  brandingCreativeHub,
].sort((a, b) => a.order - b.order);

export function allHubParams() {
  return HUBS.map((hub) => ({ hub: hub.slug }));
}

export function allServiceParams() {
  return HUBS.flatMap((hub) =>
    hub.services.map((service) => ({ hub: hub.slug, service: service.slug }))
  );
}
