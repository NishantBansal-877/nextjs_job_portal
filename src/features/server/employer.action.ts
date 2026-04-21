"use server";

import { db } from "@/src/config/db";
import { getCurrentUser } from "../auth/server/auth.queries";
import { employers } from "@/src/drizzle/schema";
import { eq } from "drizzle-orm";
import { EmployerProfileData } from "../employers/employers.schema";

const organizationTypeOptions = ["development", "business", "design"] as const;
type OrganizationType = (typeof organizationTypeOptions)[number];

const teamSizeOptions = ["1-5", "6-20", "21-50"] as const;
type TeamSizeType = (typeof teamSizeOptions)[number];

export const updateEmployerProfileAction = async (
  data: EmployerProfileData,
) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== "employer") {
      return { status: "ERROR", message: "Unauthorized" };
    }

    const {
      name,
      description,
      yearOfEstablishment,
      location,
      websiteUrl,
      organizationType,
      teamSize,
    } = data;

    await db
      .update(employers)
      .set({
        name,
        description,
        location,
        websiteUrl,
        organizationType,
        teamSize,
        yearOfEstablishment: yearOfEstablishment
          ? parseInt(yearOfEstablishment)
          : null,
      })
      .where(eq(employers.id, currentUser.id));

    return { status: "SUCCESS", message: "Profile updated successfully" };
  } catch (error) {
    return {
      status: "ERROR",
      message: "Something went wrong, please try again",
    };
  }
};
