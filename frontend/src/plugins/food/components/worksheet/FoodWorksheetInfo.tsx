import React from "react";

interface FoodWorksheetInfoProps {
    sampleName: string;
    parameterName?: string;
    methodName?: string;
}

const FoodWorksheetInfo: React.FC<FoodWorksheetInfoProps> = ({
    sampleName,
    parameterName,
    methodName,
}) => {
    return (
        <div className="p-0 my-8">
            <div className="my-4 mb-6 overflow-hidden rounded-xl border border-emerald-900/30 shadow-md">
                <table className="w-full border-collapse overflow-hidden rounded-xl text-sm shadow-md">
                    <tbody>

                        {/* Sample Particulars */}
                        <tr className="border-b border-emerald-900/20 transition-colors hover:bg-emerald-50">
                            <td className="w-10 border-r border-emerald-900/20 bg-gradient-to-br from-emerald-700 to-emerald-900 px-4 py-4 text-center font-bold text-emerald-200">
                                1
                            </td>

                            <td className="w-1/3 border-r border-emerald-100 bg-gradient-to-r from-emerald-50 to-white px-4 py-4 font-bold text-emerald-800">
                                Sample Particulars (All relevant information received with sample to be entered):
                            </td>

                            <td className="px-3 py-3 font-medium">
                                {sampleName || "---"}
                            </td>
                        </tr>

                        {/* Tests Required */}
                        <tr className="border-b border-emerald-900/20 transition-colors hover:bg-emerald-50">
                            <td className="w-10 border-r border-emerald-900/20 bg-gradient-to-br from-emerald-700 to-emerald-900 px-4 py-4 text-center font-bold text-emerald-200">
                                2
                            </td>

                            <td className="w-1/3 border-r border-emerald-100 bg-gradient-to-r from-emerald-50 to-white px-4 py-4 font-bold text-emerald-800">
                                Test(s) required (all tests and condition to be entered):
                            </td>

                            <td className="px-3 py-3 font-medium">
                                {parameterName || "No parameters added"}
                            </td>
                        </tr>

                        {/* Method of Analysis */}
                        <tr className="transition-colors hover:bg-emerald-50">
                            <td className="w-10 border-r border-emerald-900/20 bg-gradient-to-br from-emerald-700 to-emerald-900 px-4 py-4 text-center font-bold text-emerald-200">
                                3
                            </td>

                            <td className="w-1/3 border-r border-emerald-100 bg-gradient-to-r from-emerald-50 to-white px-4 py-4 font-bold text-emerald-800">
                                Method(s) of Analysis / Testing
                            </td>

                            <td className="h-16 px-3 py-3 font-medium">
                                {methodName || "No methods"}
                            </td>
                        </tr>

                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FoodWorksheetInfo;