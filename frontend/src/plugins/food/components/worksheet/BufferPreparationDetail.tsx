import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Target, Trash } from "lucide-react";
import CustomDropdown from "../../../../shared/CustomDropdown";
import type { BufferPreparation } from "../../models/BufferPreparation";
import type { BufferPreparationStep } from "../../models/BufferPreparationStep";

const weightVolUnitOptions = [
  { value: "mg", label: "mg" },
  { value: "g", label: "g" },
  { value: "kg", label: "kg" },
  { value: "ml", label: "ml" },
  { value: "L", label: "L" },
  { value: "µL", label: "µL" },
];

interface BufferPreparationDetailProps {
  buffer: BufferPreparation;

  onStepChange: (
    bufferId: number,
    stepName: BufferPreparationStep["name"],
    field:
      | "value1"
      | "logBookID"
      | "unit1"
      | "solventChemical",
    newValue: string
  ) => void;

  onRemove: () => void;

  isLocked: boolean;
}

const BufferPreparationDetail: React.FC<
  BufferPreparationDetailProps
> = ({
  buffer,
  onStepChange,
  onRemove,
  isLocked,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const headerRoundingClass = isExpanded
    ? "rounded-t-lg"
    : "rounded-lg";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative group z-20"
    >
      {/* ============================================================
          OUTER GLOW
      ============================================================ */}
      <div
        className="
          absolute
          inset-0
          bg-gradient-to-r
          from-emerald-700/20
          to-slate-900/20
          rounded-xl
          blur-xl
          opacity-70
          pointer-events-none
        "
      />

      {/* ============================================================
          CARD
      ============================================================ */}
      <div
        className="
          relative
          bg-white
          rounded-lg
          border
          border-slate-300
          overflow-visible
          mb-4
          shadow-sm
        "
      >
        {/* ============================================================
            HEADER
        ============================================================ */}
        <div
          className={`
            relative
            bg-gradient-to-r
            from-emerald-700
            via-emerald-800
            to-slate-900
            ${headerRoundingClass}
          `}
        >
          <div
            className="
              relative
              flex
              items-center
              justify-between
              px-4
              py-3
            "
          >
            {/* LEFT */}
            <div
              className="
                flex
                items-center
                gap-3
                flex-1
                cursor-pointer
                select-none
                min-w-0
              "
              onClick={() => setIsExpanded((current) => !current)}
            >
              <motion.div
                animate={{
                  rotate: isExpanded ? 0 : 360,
                }}
                transition={{ duration: 0.5 }}
                className="relative shrink-0"
              >
                <div
                  className="
                    absolute
                    inset-0
                    bg-white/30
                    rounded-lg
                    blur-md
                  "
                />

                <div
                  className="
                    relative
                    p-2
                    bg-white/20
                    rounded-lg
                    backdrop-blur-md
                    border
                    border-white/30
                  "
                >
                  <Target className="w-5 h-5 text-white" />
                </div>
              </motion.div>

              <div className="min-w-0">
                <h4
                  className="
                    text-sm
                    font-semibold
                    text-white
                    tracking-wide
                    truncate
                  "
                >
                  {buffer.label}
                </h4>

                <p className="text-xs text-emerald-100">
                  Buffer Phase Preparation Details
                </p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-2 shrink-0">
              <motion.button
                type="button"
                onClick={() =>
                  setIsExpanded((current) => !current)
                }
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="
                  p-2
                  hover:bg-white/20
                  rounded-lg
                  transition-colors
                "
                aria-label={
                  isExpanded
                    ? "Collapse buffer preparation"
                    : "Expand buffer preparation"
                }
              >
                <motion.div
                  animate={{
                    rotate: isExpanded ? 180 : 0,
                  }}
                  transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                  }}
                >
                  <ChevronDown className="w-5 h-5 text-white" />
                </motion.div>
              </motion.button>

              <motion.button
                type="button"
                disabled={isLocked}
                onClick={(event) => {
                  event.stopPropagation();
                  onRemove();
                }}
                whileHover={
                  !isLocked
                    ? {
                        scale: 1.05,
                        rotate: 3,
                      }
                    : undefined
                }
                whileTap={
                  !isLocked
                    ? {
                        scale: 0.95,
                      }
                    : undefined
                }
                className="
                  p-2
                  bg-white/20
                  rounded-lg
                  transition-all
                  duration-200
                  border
                  border-white/30
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
                title={`Remove ${buffer.label}`}
                aria-label={`Remove ${buffer.label}`}
              >
                <Trash className="w-4 h-4 text-white" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* ============================================================
            CONTENT
        ============================================================ */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{
                height: 0,
                opacity: 0,
              }}
              animate={{
                height: "auto",
                opacity: 1,
              }}
              exit={{
                height: 0,
                opacity: 0,
              }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
            >
              <div
                className="
                  p-5
                  space-y-3
                  bg-gradient-to-br
                  from-emerald-50/50
                  to-slate-50/30
                "
              >
                {buffer.steps.map((step, index) => {
                  const isWeighing =
                    step.name === "Weighing/Measuring";

                  const isPH = step.name === "PH";

                  return (
                    <motion.div
                      key={`${buffer.id}-${step.name}`}
                      initial={{
                        opacity: 0,
                        x: -20,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        delay: index * 0.1,
                      }}
                      className="group/item relative"
                    >
                      {/* Hover glow */}
                      <div
                        className="
                          absolute
                          inset-0
                          bg-gradient-to-r
                          from-emerald-400/0
                          via-emerald-400/5
                          to-slate-400/0
                          rounded-xl
                          opacity-0
                          group-hover/item:opacity-100
                          transition-opacity
                          pointer-events-none
                        "
                      />

                      {/* Step card */}
                      <div
                        className="
                          relative
                          bg-white
                          rounded-xl
                          border
                          border-slate-200
                          shadow-sm
                          hover:shadow-md
                          hover:border-emerald-300
                          transition-all
                          duration-200
                          p-4
                        "
                      >
                        <div
                          className="
                            flex
                            items-start
                            gap-3
                            min-w-0
                          "
                        >
                          {/* STEP NUMBER */}
                          <div
                            className="
                              flex-shrink-0
                              w-7
                              h-7
                              bg-gradient-to-br
                              from-emerald-700
                              to-slate-800
                              rounded-full
                              flex
                              items-center
                              justify-center
                              shadow-md
                            "
                          >
                            <span className="text-white text-xs font-bold">
                              {index + 1}
                            </span>
                          </div>

                          {/* STEP CONTENT */}
                          <div className="flex-1 min-w-0">
                            {/* STEP TITLE */}
                            <div
                              className="
                                flex
                                items-center
                                gap-2
                                mb-3
                              "
                            >
                              <div
                                className="
                                  font-bold
                                  text-slate-900
                                  text-sm
                                  whitespace-nowrap
                                "
                              >
                                {isWeighing
                                  ? "Weighing / Measuring"
                                  : step.name}
                              </div>

                              <div
                                className="
                                  h-px
                                  flex-1
                                  bg-gradient-to-r
                                  from-slate-300
                                  to-transparent
                                "
                              />
                            </div>

                            {/* ====================================================
                                WEIGHING / MEASURING
                            ==================================================== */}
                            {isWeighing && (
                              <div className="w-full">
                                <div
                                  className="
                                    flex
                                    items-center
                                    gap-2
                                    text-xs
                                    w-full
                                    flex-nowrap
                                  "
                                >
                                  {/* LABEL */}
                                  <span
                                    className="
                                      text-gray-600
                                      font-medium
                                      whitespace-nowrap
                                      shrink-0
                                      w-[92px]
                                    "
                                  >
                                    {[
                                      "ml",
                                      "L",
                                      "µL",
                                    ].includes(step.unit1!)
                                      ? "Measure accurately"
                                      : "Weigh accurately"}
                                  </span>

                                  {/* VALUE */}
                                  <input
                                    type="number"
                                    disabled={isLocked}
                                    min="0"
                                    step="0.01"
                                    inputMode="decimal"
                                    value={step.value1}
                                    onChange={(event) =>
                                      onStepChange(
                                        buffer.id,
                                        step.name,
                                        "value1",
                                        event.target.value
                                      )
                                    }
                                    onKeyDown={(event) => {
                                      if (
                                        event.key ===
                                          "ArrowUp" ||
                                        event.key ===
                                          "ArrowDown"
                                      ) {
                                        event.preventDefault();
                                      }
                                    }}
                                    onWheel={(event) =>
                                      event.currentTarget.blur()
                                    }
                                    placeholder="Enter Weight"
                                    className="
                                      w-[120px]
                                      h-[32px]
                                      shrink-0
                                      px-2.5
                                      py-1.5
                                      border
                                      border-slate-300
                                      rounded-lg
                                      text-xs
                                      bg-white
                                      focus:outline-none
                                      focus:ring-2
                                      focus:ring-emerald-500
                                      focus:border-emerald-500
                                      transition-all
                                      disabled:bg-slate-100
                                      disabled:cursor-not-allowed
                                    "
                                  />

                                  {/* UNIT
                                      IMPORTANT:
                                      CustomDropdown internally uses w-full.
                                      The wrapper fixes its width so it does
                                      NOT consume the complete row.
                                  */}
                                  <div
                                    className="
                                      w-[62px]
                                      shrink-0
                                      [&>div]:w-full
                                    "
                                  >
                                    <CustomDropdown
                                      options={
                                        weightVolUnitOptions
                                      }
                                      value={
                                        step.unit1
                                      }
                                      onChange={(
                                        newValue
                                      ) =>
                                        onStepChange(
                                          buffer.id,
                                          step.name,
                                          "unit1",
                                          newValue
                                        )
                                      }
                                      placeholder="Unit"
                                      colorScheme="emerald"
                                      disabled={isLocked}
                                    />
                                  </div>

                                  {/* OF */}
                                  <span
                                    className="
                                      text-gray-600
                                      font-medium
                                      whitespace-nowrap
                                      shrink-0
                                    "
                                  >
                                    of
                                  </span>

                                  {/* SOLVENT / CHEMICAL */}
                                  <input
                                    type="text"
                                    disabled={isLocked}
                                    value={
                                      step.solventChemical ||
                                      ""
                                    }
                                    onChange={(event) =>
                                      onStepChange(
                                        buffer.id,
                                        step.name,
                                        "solventChemical",
                                        event.target.value
                                      )
                                    }
                                    placeholder="Solvent/Chemical"
                                    className="
                                      flex-1
                                      min-w-0
                                      h-[32px]
                                      px-2.5
                                      py-1.5
                                      border
                                      border-slate-300
                                      rounded-lg
                                      text-xs
                                      bg-white
                                      focus:outline-none
                                      focus:ring-2
                                      focus:ring-emerald-500
                                      focus:border-emerald-500
                                      transition-all
                                      disabled:bg-slate-100
                                      disabled:cursor-not-allowed
                                    "
                                  />

                                  {/* LOG ID LABEL */}
                                  <span
                                    className="
                                      text-gray-500
                                      text-xs
                                      whitespace-nowrap
                                      shrink-0
                                    "
                                  >
                                    (Log ID:
                                  </span>

                                  {/* LOG ID */}
                                  <input
                                    type="text"
                                    disabled={isLocked}
                                    value={
                                      step.logBookID || ""
                                    }
                                    onChange={(event) =>
                                      onStepChange(
                                        buffer.id,
                                        step.name,
                                        "logBookID",
                                        event.target.value
                                      )
                                    }
                                    placeholder="Enter ID"
                                    className="
                                      w-[110px]
                                      h-[32px]
                                      shrink-0
                                      px-2.5
                                      py-1.5
                                      border
                                      border-slate-300
                                      rounded-lg
                                      text-xs
                                      bg-white
                                      focus:outline-none
                                      focus:ring-2
                                      focus:ring-emerald-500
                                      focus:border-emerald-500
                                      transition-all
                                      disabled:bg-slate-100
                                      disabled:cursor-not-allowed
                                    "
                                  />

                                  {/* CLOSING BRACKET */}
                                  <span
                                    className="
                                      text-gray-500
                                      text-xs
                                      whitespace-nowrap
                                      shrink-0
                                    "
                                  >
                                    )
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* ====================================================
                                PH
                            ==================================================== */}
                            {isPH && (
                              <div className="w-full">
                                <div
                                  className="
                                    flex
                                    items-center
                                    gap-2
                                    text-xs
                                    w-full
                                    flex-nowrap
                                  "
                                >
                                  {/* LABEL */}
                                  <span
                                    className="
                                      text-gray-600
                                      font-medium
                                      whitespace-nowrap
                                      shrink-0
                                    "
                                  >
                                    Adjust pH to
                                  </span>

                                  {/* PH VALUE */}
                                  <input
                                    type="number"
                                    disabled={isLocked}
                                    min="0"
                                    step="0.01"
                                    inputMode="decimal"
                                    value={step.value1}
                                    onChange={(event) =>
                                      onStepChange(
                                        buffer.id,
                                        step.name,
                                        "value1",
                                        event.target.value
                                      )
                                    }
                                    onKeyDown={(event) => {
                                      if (
                                        event.key ===
                                          "ArrowUp" ||
                                        event.key ===
                                          "ArrowDown"
                                      ) {
                                        event.preventDefault();
                                      }
                                    }}
                                    onWheel={(event) =>
                                      event.currentTarget.blur()
                                    }
                                    placeholder="Enter pH value"
                                    className="
                                      w-[160px]
                                      h-[32px]
                                      shrink-0
                                      px-2.5
                                      py-1.5
                                      border
                                      border-slate-300
                                      rounded-lg
                                      text-xs
                                      bg-white
                                      focus:outline-none
                                      focus:ring-2
                                      focus:ring-emerald-500
                                      focus:border-emerald-500
                                      transition-all
                                      disabled:bg-slate-100
                                      disabled:cursor-not-allowed
                                    "
                                  />

                                  {/* LOG ID LABEL */}
                                  <span
                                    className="
                                      text-gray-500
                                      text-xs
                                      whitespace-nowrap
                                      shrink-0
                                    "
                                  >
                                    (Log ID:
                                  </span>

                                  {/* LOG ID */}
                                  <input
                                    type="text"
                                    disabled={isLocked}
                                    value={
                                      step.logBookID || ""
                                    }
                                    onChange={(event) =>
                                      onStepChange(
                                        buffer.id,
                                        step.name,
                                        "logBookID",
                                        event.target.value
                                      )
                                    }
                                    placeholder="Enter ID"
                                    className="
                                      flex-1
                                      min-w-0
                                      h-[32px]
                                      px-2.5
                                      py-1.5
                                      border
                                      border-slate-300
                                      rounded-lg
                                      text-xs
                                      bg-white
                                      focus:outline-none
                                      focus:ring-2
                                      focus:ring-emerald-500
                                      focus:border-emerald-500
                                      transition-all
                                      disabled:bg-slate-100
                                      disabled:cursor-not-allowed
                                    "
                                  />

                                  {/* CLOSING BRACKET */}
                                  <span
                                    className="
                                      text-gray-500
                                      text-xs
                                      whitespace-nowrap
                                      shrink-0
                                    "
                                  >
                                    )
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default BufferPreparationDetail;