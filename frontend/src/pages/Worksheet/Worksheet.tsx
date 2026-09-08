import { useSearchParams } from "react-router-dom";

import WorksheetDetails from "../../core/worksheet/components/WorksheetDetails";

export default function Worksheet() {
    const [searchParams] = useSearchParams();

    const worksheetId =
        searchParams.get("worksheetId");

    const lab =
        searchParams.get("lab");

    if (!worksheetId) {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold">
                    Worksheets
                </h1>

                <p className="mt-2 text-slate-600">
                    Worksheet ID is required.
                </p>
            </div>
        );
    }

    return (
        <WorksheetDetails
            worksheetId={worksheetId}
            lab={lab ?? undefined}
        />
    );
}