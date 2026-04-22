import { db } from "@/src/config/db";
import { jobs, employers, users } from "@/src/drizzle/schema";
import { eq, and, isNull, desc, or, gte, SQL, like, sql } from "drizzle-orm";

export interface JobFilterParams {
  search?: string;
  jobType?: string;
  jobLevel?: string;
  workType?: string;
  page?: number;
  limit?: number;
}

export async function getAllJobs(filters: JobFilterParams) {
  const page = filters.page || 1;
  const limit = filters.limit || 9;
  const offset = (page - 1) * limit;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const conditions: (SQL | undefined)[] = [
    isNull(jobs.deletedAt),
    or(isNull(jobs.expiresAt), gte(jobs.expiresAt, today)),
  ];

  if (filters?.search) {
    const searchTerm = `%${filters.search}%`;

    conditions.push(
      or(
        like(jobs.title, searchTerm),
        like(employers.name, searchTerm),
        like(jobs.tags, searchTerm),
      ),
    );
  }

  if (filters?.jobType && filters.jobType !== "all") {
    conditions.push(eq(jobs.jobType, filters.jobType as any));
  }

  if (filters?.jobLevel && filters.jobLevel !== "all") {
    conditions.push(eq(jobs.jobLevel, filters.jobLevel as any));
  }

  if (filters?.workType && filters.workType !== "all") {
    conditions.push(eq(jobs.workType, filters.workType as any));
  }

  const jobsData = await db
    .select({
      id: jobs.id,
      title: jobs.title,
      description: jobs.description,
      minSalary: jobs.minSalary,
      maxSalary: jobs.maxSalary,
      salaryCurrency: jobs.salaryCurrency,
      salaryPeriod: jobs.salaryPeriod,
      location: jobs.location,
      jobType: jobs.jobType,
      workType: jobs.workType,
      createdAt: jobs.createdAt,
      companyName: employers.name,
      companyLogo: users.avatarUrl,
    })
    .from(jobs)
    .innerJoin(employers, eq(jobs.employerId, employers.id))
    .innerJoin(users, eq(employers.id, users.id)) // Join users to get avatar

    .where(and(...conditions))
    .orderBy(desc(jobs.createdAt))
    .limit(limit)
    .offset(offset);

  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(jobs)
    .innerJoin(employers, eq(jobs.employerId, employers.id))
    .innerJoin(users, eq(employers.id, users.id))
    .where(and(...conditions));

  const totalCount = Number(countResult[0]?.count || 0);

  return { jobs: jobsData, totalCount };
}

export type JobCardType = Awaited<
  ReturnType<typeof getAllJobs>
>["jobs"][number];

export async function getJobById(jobId: number) {
  const job = await db
    .select({
      id: jobs.id,
      title: jobs.title,
      description: jobs.description,
      tags: jobs.tags,

      minSalary: jobs.minSalary,
      maxSalary: jobs.maxSalary,
      salaryCurrency: jobs.salaryCurrency,
      salaryPeriod: jobs.salaryPeriod,

      location: jobs.location,
      jobType: jobs.jobType,
      workType: jobs.workType,
      jobLevel: jobs.jobLevel,
      experience: jobs.experience,
      minEducation: jobs.minEducation,

      createdAt: jobs.createdAt,
      expiresAt: jobs.expiresAt,

      companyLogo: users.avatarUrl,
      companyName: employers.name,
      companyBio: employers.description,
      companyWebsite: employers.websiteUrl,
      companyLocation: employers.location,
    })
    .from(jobs)
    .innerJoin(employers, eq(jobs.employerId, employers.id))
    .innerJoin(users, eq(employers.id, users.id))
    .where(eq(jobs.id, jobId))
    .limit(1);

  return job[0];
}

export type JobDetailsType = Awaited<ReturnType<typeof getJobById>>;
