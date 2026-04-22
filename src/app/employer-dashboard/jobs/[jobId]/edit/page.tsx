import { JobForm } from "@/src/features/employers/components/employer-job-form";
import { getJobByIdAction } from "@/src/features/server/jobs.actions";
import { redirect } from "next/navigation";

interface EditJobPageProps {
  params: { jobId: string };
}

export const EditJobPage = async ({ params }: EditJobPageProps) => {
  const jobId = Number(params.jobId);

  if (Number.isNaN(jobId)) redirect("/employer-dashboard/jobs");

  const { status, data: job } = await getJobByIdAction(jobId);
  console.log("Job Data after ID: ", job);

  if (status === "ERROR" || !job) {
    redirect("/employer-dashboard/jobs");
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Edit Job: {job.title}</h1>
      </div>

      {/* 3. Pass the fetched data to the form */}
      <JobForm initialData={job} isEditMode={true} />
    </div>
  );
};

export default EditJobPage;
