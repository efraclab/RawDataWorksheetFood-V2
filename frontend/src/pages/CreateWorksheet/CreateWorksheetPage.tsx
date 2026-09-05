import { useNavigate } from "react-router-dom";

import CreateWorksheet from "./CreateWorksheet";

export default function CreateWorksheetPage() {
  const navigate = useNavigate();

  const employeeId = localStorage.getItem("EmployeeId") ?? "";

  const department = localStorage.getItem("Department") ?? "";

  const role = localStorage.getItem("Role") ?? "";

  return (
    <CreateWorksheet
      employeeId={employeeId}
      department={department}
      role={role}
      onWorksheetCreated={(worksheetId) => {
        navigate(`/worksheet?worksheetId=${encodeURIComponent(worksheetId)}`);
      }}
      onCancel={() => {
        navigate("/dashboard");
      }}
    />
  );
}
