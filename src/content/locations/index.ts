import { kohPhanganLocation } from "./koh-phangan";
import { kohSamuiLocation } from "./koh-samui";
import { kohTaoLocation } from "./koh-tao";
import type { LocationPage } from "@/content/types";

/** /locations/<slug> (proposal §14 — each unique, not a template swap). English master content. */
export const LOCATIONS: LocationPage[] = [
  kohPhanganLocation, kohSamuiLocation, kohTaoLocation,
].sort((a, b) => a.order - b.order);
