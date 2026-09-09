import React from "react";
import { Beaker } from "lucide-react";

export interface PreparationHeaderProps {
    title?: string;
    description?: string;
}

const PreparationHeader: React.FC<PreparationHeaderProps> = ({
    title = "Preparation Management",
    description = "Configure analysis preparations for this parameter",
}) => {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-700 to-slate-900 flex items-center justify-center shadow-lg">
                    <Beaker className="w-6 h-6 text-white" />
                </div>

                <div>
                    <h2 className="text-3xl font-bold text-emerald-900">
                        {title}
                    </h2>

                    <p className="text-emerald-600">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PreparationHeader;