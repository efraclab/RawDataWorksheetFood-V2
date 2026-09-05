import AppLayout from "../../shared/layouts/AppLayout";

const Dashboard = () => {
  return (
    <AppLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <p className="mt-2 text-slate-600">
          RawDataFoods V2 Dashboard
        </p>
      </div>
    </AppLayout>
  );
};

export default Dashboard;