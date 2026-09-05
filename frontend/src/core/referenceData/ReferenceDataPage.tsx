import { useNavigate } from "react-router-dom";

import ReferenceDataManagement from "./ReferenceDataManagement";

export default function ReferenceDataPage() {
  const navigate = useNavigate();

  return (
    <ReferenceDataManagement
      onBack={() => navigate("/dashboard")}
    />
  );
}