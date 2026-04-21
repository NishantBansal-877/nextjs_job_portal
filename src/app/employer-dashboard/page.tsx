import { logoutUserAction } from "@/src/features/auth/server/auth.actions";
import { getCurrentUser } from "@/src/features/auth/server/auth.queries";
import { EmployerProfileCompletionStatus } from "@/src/features/employers/components/employer-profile-status";
import { StatsCards } from "@/src/features/employers/components/employer-stats";
import { redirect } from "next/navigation";

const EmployerDashboard = async () => {
  const user = await getCurrentUser();

  if (!user) return redirect("/login");
  return (
    <div className="space-y-6">
      {/* header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Hello, <span className="capitalize">{user?.name.toLowerCase()}</span>
        </h1>
        <p className="text-muted-foreground">
          Here is your daily activities and applications
        </p>

        {/* stats card */}
        <StatsCards />

        <EmployerProfileCompletionStatus />
      </div>
    </div>
  );
};

export default EmployerDashboard;
