import React from "react";
import { motion } from "framer-motion";

interface FoodWorksheetHeaderProps {
  worksheetId: string;
  registrationNo: string;
  sampleName: string;
  parameterCount: number | undefined;
  dueDate?: string | null;
  displayStatus?: string | null;
}

function formatDate(date?: string | null): string {
  if (!date) {
    return "---";
  }

  const d = new Date(date);

  if (Number.isNaN(d.getTime())) {
    return date;
  }

  return d.toLocaleDateString("en-GB");
}

const FoodWorksheetHeader: React.FC<FoodWorksheetHeaderProps> = ({
  worksheetId,
  registrationNo,
  sampleName,
  parameterCount,
  dueDate,
  displayStatus,
}) => {
  return (
    <>
      {/* ============================================================
          EFRAC LOGO
         ============================================================ */}

      <div className="flex justify-end mb-6 pb-4 border-b border-slate-200">
        <img
          src="/ic_efrac.png"
          alt="EFRAC"
          className="h-12"
        />
      </div>

      {/* ============================================================
          WORKSHEET HEADER
         ============================================================ */}

      <div className="my-4 mb-6 overflow-hidden rounded-xl border border-emerald-900/40 shadow-xl">
        <div className="relative flex items-center justify-between overflow-hidden bg-gradient-to-r from-emerald-700 via-emerald-800 to-slate-900 px-6 py-5">

          {/* Dotted background */}

          <div
            className="pointer-events-none absolute inset-0 opacity-[0.045]"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,.9) 1px, transparent 1px)",
              backgroundSize: "18px 18px",
            }}
          />

          {/* Top-right glow */}

          <div className="pointer-events-none absolute -top-8 -right-8 h-40 w-40 rounded-full bg-emerald-400/15 blur-3xl" />

          {/* Bottom-left glow */}

          <div className="pointer-events-none absolute bottom-0 left-12 h-28 w-28 rounded-full bg-teal-300/10 blur-2xl" />

          {/* Worksheet ID + Status */}

          <div className="relative flex items-center gap-4">

            <h1 className="flex items-baseline gap-3 tracking-wide text-white">
              <span className="text-sm font-semibold">
                Worksheet ID:
              </span>

              <span className="text-2xl font-extrabold">
                {worksheetId}
              </span>
            </h1>

            {/* Status */}

            {displayStatus && (
              <motion.div
                initial={{
                  scale: 0,
                  opacity: 0,
                }}
                animate={{
                  scale: 1,
                  opacity: 1,
                }}
                transition={{
                  type: "spring",
                  duration: 0.6,
                }}
                className="ml-4"
              >
                <div className="relative flex items-center gap-2 rounded-lg border border-white/30 bg-white/20 px-3 py-1.5 backdrop-blur-sm">

                  {/* Animated status icon */}

                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [1, 0.7, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                    }}
                  >
                    <svg
                      className="h-4 w-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2"
                      />
                    </svg>
                  </motion.div>

                  <span className="text-xs font-bold uppercase text-white">
                    {displayStatus}
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================
          INFORMATION CARD
         ============================================================ */}

      <div className="my-4 overflow-hidden rounded-xl border border-emerald-900/30 shadow-md">

        {/* ==========================================================
            TOP ROW
            Registration No / Sample Name
           ========================================================== */}

        <div className="relative grid grid-cols-2 overflow-hidden border-b border-white/10 bg-gradient-to-br from-emerald-700 via-emerald-800 to-slate-900 text-sm">

          {/* Dotted background */}

          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,.9) 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
          />

          {/* Registration No */}

          <div className="relative flex items-center border-r border-white/10 px-4 py-3">
            <span className="mr-2 text-xs font-bold uppercase tracking-wider text-emerald-300">
              Registration No:
            </span>

            <span className="text-sm font-semibold text-white">
              {registrationNo || "---"}
            </span>
          </div>

          {/* Sample Name */}

          <div className="relative flex items-center px-4 py-3">
            <span className="mr-2 text-xs font-bold uppercase tracking-wider text-emerald-300">
              Sample Name:
            </span>

            <span className="text-sm font-semibold text-white">
              {sampleName || "---"}
            </span>
          </div>
        </div>

        {/* ==========================================================
            BOTTOM ROW
            Number of Parameters / Due Date
           ========================================================== */}

        <div className="grid grid-cols-2 bg-white text-sm">

          {/* Number of Parameters */}

          <div className="flex items-center border-r border-emerald-100 px-4 py-3">
            <span className="mr-2 font-bold text-emerald-800">
              Number of Parameters:
            </span>

            <span className="font-semibold text-slate-700">
              {parameterCount}
            </span>
          </div>

          {/* Due Date */}

          <div className="flex items-center px-4 py-3">
            <span className="mr-2 font-bold text-emerald-800">
              Due Date:
            </span>

            <span className="font-semibold text-slate-700">
              {formatDate(dueDate)}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default FoodWorksheetHeader;