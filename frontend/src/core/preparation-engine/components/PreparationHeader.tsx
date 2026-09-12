import React from "react";
import { BiTestTube } from "react-icons/bi";

const PreparationHeader: React.FC = () => {
    return (
        <div className="flex items-center gap-4 ">
            <div
                className="
                    w-12
                    h-12
                    bg-gradient-to-br
                    from-emerald-700
                    to-emerald-900
                    rounded-2xl
                    flex
                    items-center
                    justify-center
                    shadow-lg
                    
                "
            >
                <BiTestTube className="w-6 h-6 text-white" />
            </div>

            <div >
                <h3 className="text-xl font-bold text-emerald-900 tracking-tight">
                    Preparation Management
                </h3>

                <p className="text-xs text-emerald-600 font-medium">
                    Configure analysis preparations for this parameter
                </p>
            </div>
        </div>
    );
};

export default PreparationHeader;
