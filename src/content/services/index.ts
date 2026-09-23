import { advertisingService } from "./advertising";
import { socialMediaManagementService } from "./social-media-management";
import { contentCreationService } from "./content-creation";
import { commercialPhotographyService } from "./commercial-photography";
import { commercialVideoService } from "./commercial-video";
import { digitalMarketingService } from "./digital-marketing";
import { googleAdsService } from "./google-ads";
import { metaAdsService } from "./meta-ads";
import { seoService } from "./seo";
import { webDesignService } from "./web-design";
import { brandingService } from "./branding";
import { villasRealEstateService } from "./villas-real-estate";
import { restaurantMarketingService } from "./restaurant-marketing";
import type { ServicePage } from "@/content/types";

/**
 * /services/<slug> — the proposal's flat P0 service pages (§4). Pages with a
 * `canonicalPath` overlap an existing hub/service page and point search
 * engines at it (client decision 2026-09-22: "both live, canonical to hub");
 * the rest are the only page for their topic. English master content.
 */
export const SERVICE_LANDINGS: ServicePage[] = [
  advertisingService, socialMediaManagementService, contentCreationService, commercialPhotographyService, commercialVideoService, digitalMarketingService, googleAdsService, metaAdsService, seoService, webDesignService, brandingService, villasRealEstateService, restaurantMarketingService,
];
