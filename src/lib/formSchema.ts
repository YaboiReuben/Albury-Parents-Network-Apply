import { z } from "zod";

export const applicationSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  facebookProfile: z.string().url("Please enter a valid Facebook URL").refine(
    (url) => url.includes("facebook.com") || url.includes("fb.com"),
    "Please enter a valid Facebook profile URL"
  ),
  email: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  suburb: z.string().min(1, "Please select your suburb"),
  otherSuburb: z.string().optional(),
  timeInArea: z.string().optional(),
  parentType: z.string().min(1, "Please select your parent/guardian type"),
  childAgeRange: z.array(z.string()).optional(),
  whyJoin: z.string().min(10, "Please tell us more about why you want to join (at least 10 characters)").max(1000, "Please keep your response under 1000 characters"),
  goals: z.string().max(500, "Please keep your response under 500 characters").optional(),
  agreeToRules: z.boolean().refine((val) => val === true, "You must agree to the group rules"),
  antiBotAnswer: z.string().refine((val) => val.trim() === "7", "Please answer the math question correctly"),
});

export type ApplicationFormData = z.infer<typeof applicationSchema>;

export const SUBURBS = [
  "Albury",
  "Lavington",
  "Thurgoona",
  "Wodonga",
  "Other",
] as const;

export const TIME_IN_AREA = [
  "Less than 1 year",
  "1–5 years",
  "5+ years",
] as const;

export const PARENT_TYPES = [
  "Parent",
  "Guardian",
  "Expecting parent",
  "Carer",
] as const;

export const CHILD_AGE_RANGES = [
  "0–2",
  "3–5",
  "6–12",
  "Teen",
] as const;
