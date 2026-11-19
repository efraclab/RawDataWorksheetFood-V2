import React from "react";
import { Calculator } from "lucide-react";

export interface EmptyCalculationProps {
    title?: string;
    description?: string;
}

const EmptyCalculation: React.FC<EmptyCalculationProps> = ({
    title = "Calculation Not Available",
    description = "Complete the required preparation data before calculating the result.",
}) => {
    return (
        <div className="rounded-xl border border-dashed border-emerald-300 bg-emerald-50/40 px-6 py-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                <Calculator className="h-6 w-6 text-emerald-700" />
            </div>

            <h4 className="mt-4 text-base font-semibold text-emerald-900">
                {title}
            </h4>

            <p className="mx-auto mt-1 max-w-md text-sm text-emerald-700">
                {description}
            </p>
        </div>
    );
};

export default EmptyCalculation;