import { villasRealEstateIndustry } from "./villas-real-estate";
import { hotelsResortsIndustry } from "./hotels-resorts";
import { restaurantsFoodIndustry } from "./restaurants-food";
import { wellnessRetreatsIndustry } from "./wellness-retreats";
import { tourismHospitalityIndustry } from "./tourism-hospitality";
import { eventsIndustry } from "./events";
import { brandsLifestyleIndustry } from "./brands-lifestyle";
import type { IndustryPage } from "@/content/types";

/** /industries/<slug> (proposal §2 INDUSTRIES). English master content. */
export const INDUSTRIES: IndustryPage[] = [
  villasRealEstateIndustry, hotelsResortsIndustry, restaurantsFoodIndustry, wellnessRetreatsIndustry, tourismHospitalityIndustry, eventsIndustry, brandsLifestyleIndustry,
].sort((a, b) => a.order - b.order);
