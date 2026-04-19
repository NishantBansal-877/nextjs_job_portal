import { logoutUserAction } from "@/features/auth/server/auth.actions";

const EmployerDashboard = () => {
  return (
    <div>
      <div>EmployerDashboard</div>
      <button onClick={logoutUserAction}>Logout</button>
    </div>
  );
};

export default EmployerDashboard;
