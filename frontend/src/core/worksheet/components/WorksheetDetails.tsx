import { useEffect, useMemo, useState } from "react";

import WorksheetShell from "./WorksheetShell";

import {
  worksheetService,
  type WorksheetDetail as WorksheetDetailData,
  type FetchWorksheetRequest,
} from "../worksheetService";

interface WorksheetDetailsProps {
  worksheetId: string;
  lab?: string;
}

export default function WorksheetDetails({
  worksheetId,
  lab,
}: WorksheetDetailsProps) {
  // ============================================================
  // STATE
  // ============================================================

  const [worksheet, setWorksheet] =
    useState<WorksheetDetailData | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  // ============================================================
  // LOAD WORKSHEET
  // ============================================================

  useEffect(() => {
    let cancelled = false;

    const loadWorksheet = async () => {
      if (!worksheetId) {
        setError("No worksheet ID provided.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const request: FetchWorksheetRequest = {
          employeeId:
            localStorage.getItem("EmployeeId") ?? "",

          role:
            localStorage.getItem("Role") ?? "",
        };

        const worksheetData =
          await worksheetService.getById(
            worksheetId,
            request
          );

        if (cancelled) {
          return;
        }

        if (!worksheetData) {
          setWorksheet(null);
          setError("Worksheet not found.");
          return;
        }

        setWorksheet(worksheetData);
      } catch (err: any) {
        if (cancelled) {
          return;
        }

        console.error(
          "Error loading worksheet:",
          err
        );

        setError(
          err?.message ??
            "Failed to load worksheet."
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadWorksheet();

    return () => {
      cancelled = true;
    };
  }, [worksheetId]);

  // ============================================================
  // BASIC WORKSHEET DATA
  // ============================================================

  const sample = worksheet?.sample;
  const sampleData = sample as any;

  const displayWorksheetId =
    typeof sample?.worksheetId === "string"
      ? sample.worksheetId
      : worksheetId;

  const displayLab =
    typeof sample?.lab === "string"
      ? sample.lab
      : lab ?? "Food Lab";

  const registrationNo =
    typeof sample?.registrationNo === "string"
      ? sample.registrationNo
      : "";

  const sampleName =
    typeof sample?.sampleName === "string"
      ? sample.sampleName
      : "";

  const worksheetStatus =
    typeof sample?.status === "string"
      ? sample.status
      : "Draft";

  const dueDate =
    typeof sampleData?.dueDate === "string"
      ? sampleData.dueDate
      : typeof sampleData?.due_date === "string"
        ? sampleData.due_date
        : "—";

  // ============================================================
  // PARAMETERS
  // ============================================================

  const parameters = useMemo(
    () => worksheet?.parameters ?? [],
    [worksheet]
  );

  const parameterCount =
    parameters.length;

  // ============================================================
  // V1 WORKSHEET INFORMATION
  // ============================================================

  const sampleParticulars =
    sampleName || "—";

  const testsRequired =
    parameters
      .map((parameter: any) => {
        return (
          parameter?.parameterName ||
          parameter?.name ||
          parameter?.parameter ||
          parameter?.parameterCode ||
          ""
        );
      })
      .filter(
        (value: string) =>
          String(value).trim().length > 0
      )
      .join(", ") || "—";

  const methodsRequired =
    parameters
      .map((parameter: any) => {
        return (
          parameter?.method ||
          parameter?.methodName ||
          parameter?.methodCode ||
          ""
        );
      })
      .filter(
        (value: string) =>
          String(value).trim().length > 0
      )
      .join(", ") || "No methods";

  // ============================================================
  // ACTIONS
  // ============================================================

  const handleBack = () => {
    window.history.back();
  };

  /*
   * Real Save Draft persistence will be connected in the
   * workflow/persistence phase.
   *
   * No fake API call is performed here.
   */
  const handleSaveDraft = () => {
    console.log(
      "Save Draft requested:",
      displayWorksheetId
    );
  };

  // ============================================================
  // SHELL
  // ============================================================

  const shellProps = {
    worksheetId: displayWorksheetId,
    status: worksheetStatus,
    role:
      localStorage.getItem("Role") ?? "",
    registrationNo,
    sampleName,
    onBack: handleBack,
    onSaveDraft: handleSaveDraft,
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (isLoading) {
    return (
      <WorksheetShell {...shellProps}>
        <div
          className="
            min-h-full
            bg-[#10182d]
            px-4
            py-8
            md:px-6
          "
        >
          <div
            className="
              mx-auto
              max-w-[1000px]
              rounded-[14px]
              bg-white
              p-10
              text-center
              shadow-[0_4px_16px_rgba(15,23,42,0.20)]
            "
          >
            <div
              className="
                text-[14px]
                font-semibold
                text-slate-700
              "
            >
              Loading worksheet...
            </div>
          </div>
        </div>
      </WorksheetShell>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error || !worksheet) {
    return (
      <WorksheetShell {...shellProps}>
        <div
          className="
            min-h-full
            bg-[#10182d]
            px-4
            py-8
            md:px-6
          "
        >
          <div
            className="
              mx-auto
              max-w-[1000px]
              rounded-[14px]
              bg-white
              p-8
              shadow-[0_4px_16px_rgba(15,23,42,0.20)]
            "
          >
            <h1
              className="
                text-[21px]
                font-bold
                text-red-700
              "
            >
              Unable to load worksheet
            </h1>

            <p
              className="
                mt-3
                text-[13px]
                text-slate-600
              "
            >
              {error ?? "Worksheet not found."}
            </p>
          </div>
        </div>
      </WorksheetShell>
    );
  }

  // ============================================================
  // MAIN
  // ============================================================

  return (
    <WorksheetShell {...shellProps}>
      <div
        className="
          min-h-full
          bg-[#10182d]
          px-4
          py-6
          md:px-6
          md:py-8
        "
      >
        {/* ======================================================
            V1 MAIN WHITE WORKSHEET CARD
           ====================================================== */}

        <div
          className="
            mx-auto
            max-w-[1000px]
            rounded-[14px]
            bg-white
            px-7
            pb-10
            pt-7
            shadow-[0_4px_16px_rgba(15,23,42,0.20)]
            md:px-8
          "
        >

          {/* ====================================================
              EFRAC LOGO AREA
             ==================================================== */}

          <div
            className="
              flex
              min-h-[72px]
              items-start
              justify-end
            "
          >
            <div className="text-right">
              <div
                className="
                  text-[36px]
                  font-medium
                  leading-[34px]
                  tracking-[0.08em]
                  text-[#00865f]
                "
              >
                EFRAC
              </div>

              <div
                className="
                  mt-[3px]
                  text-[9px]
                  font-medium
                  uppercase
                  leading-[9px]
                  tracking-[0.19em]
                  text-[#777f89]
                "
              >
                A{" "}
                <span className="text-[#ef4050]">
                  QIMA
                </span>{" "}
                COMPANY
              </div>
            </div>
          </div>

          {/* ====================================================
              V1 HORIZONTAL BAR
             ==================================================== */}

          <div
            className="
              h-px
              w-full
              bg-[#d9e1e5]
            "
          />

          {/* ====================================================
              WORKSHEET ID BLOCK

              IMPORTANT:
              This is a SEPARATE block from the
              Registration/Sample block below.
             ==================================================== */}

          <section
            className="
              mt-[24px]
              overflow-hidden
              rounded-[11px]
              border
              border-[#b7d6cb]
              shadow-[0_3px_7px_rgba(15,23,42,0.14)]
            "
          >
            <div
              className="
                flex
                min-h-[73px]
                items-center
                justify-between
                bg-gradient-to-r
                from-[#008d67]
                via-[#00745a]
                to-[#142f3b]
                px-[24px]
              "
            >
              {/* WORKSHEET ID */}

              <div
                className="
                  flex
                  items-center
                  gap-[13px]
                "
              >
                <span
                  className="
                    text-[13px]
                    font-semibold
                    text-white
                  "
                >
                  Worksheet ID:
                </span>

                <span
                  className="
                    text-[21px]
                    font-extrabold
                    leading-none
                    tracking-[0.01em]
                    text-white
                  "
                >
                  {displayWorksheetId}
                </span>
              </div>

              {/* STATUS */}

              <div
                className="
                  inline-flex
                  min-h-[32px]
                  items-center
                  gap-[7px]
                  rounded-[8px]
                  border
                  border-white/30
                  bg-white/[0.10]
                  px-[13px]
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-[0.01em]
                  text-white
                "
              >
                {/* V1 uses a small document/status icon area */}

                <span
                  className="
                    flex
                    h-[15px]
                    w-[15px]
                    items-center
                    justify-center
                    rounded-[2px]
                    border
                    border-white/70
                  "
                >
                  <span
                    className="
                      h-[6px]
                      w-[6px]
                      rounded-[1px]
                      border
                      border-white/70
                    "
                  />
                </span>

                <span>
                  {worksheetStatus}
                </span>
              </div>
            </div>
          </section>

        {/* ====================================================
    REGISTRATION / SAMPLE / PARAMETERS / DUE DATE
   ==================================================== */}

<section
  className="
    mt-[24px]
    overflow-hidden
    rounded-[10px]
    border
    border-[#9fcfc0]
    shadow-[0_2px_5px_rgba(15,23,42,0.10)]
  "
>
  {/* ==================================================
      TOP ROW
      REGISTRATION NO / SAMPLE NAME
     ================================================== */}

  <div
    className="
      grid
      min-h-[45px]
      grid-cols-2
      bg-gradient-to-r
      from-[#008b66]
      via-[#00775b]
      to-[#102f39]
    "
  >

    {/* ================================================
        REGISTRATION NO
       ================================================ */}

    <div
      className="
        flex
        min-w-0
        items-center
        border-r
        border-white/20
        px-[16px]
      "
    >
      <span
        className="
          mr-[9px]
          shrink-0
          whitespace-nowrap
          text-[11px]
          font-bold
          uppercase
          leading-none
          tracking-[0.02em]
          text-[#b9f0df]
        "
      >
        REGISTRATION NO:
      </span>

      <span
        className="
          min-w-0
          truncate
          whitespace-nowrap
          text-[13px]
          font-bold
          leading-none
          text-white
        "
      >
        {registrationNo || "—"}
      </span>
    </div>


    {/* ================================================
        SAMPLE NAME
       ================================================ */}

    <div
      className="
        flex
        min-w-0
        items-center
        px-[16px]
      "
    >
      <span
        className="
          mr-[9px]
          shrink-0
          whitespace-nowrap
          text-[11px]
          font-bold
          uppercase
          leading-none
          tracking-[0.02em]
          text-[#b9f0df]
        "
      >
        SAMPLE NAME:
      </span>

      <span
        className="
          min-w-0
          truncate
          whitespace-nowrap
          text-[13px]
          font-bold
          leading-none
          text-white
        "
      >
        {sampleName || "—"}
      </span>
    </div>
  </div>


  {/* ==================================================
      BOTTOM ROW
      NUMBER OF PARAMETERS / DUE DATE
     ================================================== */}

  <div
    className="
      grid
      min-h-[45px]
      grid-cols-2
      bg-white
    "
  >

    {/* ================================================
        NUMBER OF PARAMETERS
       ================================================ */}

    <div
      className="
        flex
        min-w-0
        items-center
        border-r
        border-[#cfe2dc]
        px-[16px]
      "
    >
      <span
        className="
          mr-[9px]
          shrink-0
          whitespace-nowrap
          text-[11px]
          font-bold
          uppercase
          leading-none
          tracking-[0.02em]
          text-[#006d52]
        "
      >
        NUMBER OF PARAMETERS:
      </span>

      <span
        className="
          text-[13px]
          font-medium
          leading-none
          text-[#15202b]
        "
      >
        {parameterCount}
      </span>
    </div>


    {/* ================================================
        DUE DATE
       ================================================ */}

    <div
      className="
        flex
        min-w-0
        items-center
        px-[16px]
      "
    >
      <span
        className="
          mr-[9px]
          shrink-0
          whitespace-nowrap
          text-[11px]
          font-bold
          uppercase
          leading-none
          tracking-[0.02em]
          text-[#006d52]
        "
      >
        DUE DATE:
      </span>

      <span
        className="
          text-[13px]
          font-medium
          leading-none
          text-[#15202b]
        "
      >
        {dueDate}
      </span>
    </div>

  </div>
</section>

          {/* ====================================================
              WORKSHEET DETAILS TABLE
             ==================================================== */}

          <section
            className="
              mt-[32px]
              overflow-hidden
              rounded-[12px]
              border
              border-[#b9d8cd]
              bg-white
              shadow-[0_2px_5px_rgba(15,23,42,0.10)]
            "
          >

            {/* ==================================================
                ROW 1
               ================================================== */}

            <div
              className="
                grid
                min-h-[94px]
                grid-cols-[42px_310px_minmax(0,1fr)]
              "
            >

              {/* NUMBER */}

              <div
                className="
                  flex
                  items-start
                  justify-center
                  bg-[#007052]
                  px-2
                  pt-[20px]
                  text-[13px]
                  font-bold
                  text-white
                "
              >
                1
              </div>

              {/* LABEL */}

              <div
                className="
                  border-r
                  border-[#c9e3d9]
                  bg-[#effaf5]
                  px-[16px]
                  py-[17px]
                "
              >
                <div
                  className="
                    text-[13px]
                    font-bold
                    leading-[19px]
                    text-[#006d52]
                  "
                >
                  Sample Particulars
                </div>

                <div
                  className="
                    text-[12px]
                    font-medium
                    leading-[18px]
                    text-[#006d52]
                  "
                >
                  (All relevant information received with sample to be entered):
                </div>
              </div>

              {/* VALUE */}

              <div
                className="
                  bg-white
                  px-[13px]
                  py-[17px]
                "
              >
                <div
                  className="
                    break-words
                    text-[13px]
                    font-medium
                    leading-[20px]
                    text-slate-800
                  "
                >
                  {sampleParticulars}
                </div>
              </div>
            </div>

            {/* ==================================================
                ROW 2
               ================================================== */}

            <div
              className="
                grid
                min-h-[104px]
                grid-cols-[42px_310px_minmax(0,1fr)]
                border-t
                border-[#c9e3d9]
              "
            >

              {/* NUMBER */}

              <div
                className="
                  flex
                  items-start
                  justify-center
                  bg-[#007052]
                  px-2
                  pt-[20px]
                  text-[13px]
                  font-bold
                  text-white
                "
              >
                2
              </div>

              {/* LABEL */}

              <div
                className="
                  border-r
                  border-[#c9e3d9]
                  bg-[#effaf5]
                  px-[16px]
                  py-[17px]
                "
              >
                <div
                  className="
                    text-[13px]
                    font-bold
                    leading-[19px]
                    text-[#006d52]
                  "
                >
                  Test(s) required
                </div>

                <div
                  className="
                    text-[12px]
                    font-medium
                    leading-[18px]
                    text-[#006d52]
                  "
                >
                  (all tests and condition to be entered):
                </div>
              </div>

              {/* VALUE */}

              <div
                className="
                  bg-white
                  px-[13px]
                  py-[17px]
                "
              >
                <div
                  className="
                    break-words
                    text-[13px]
                    font-medium
                    leading-[19px]
                    text-slate-800
                  "
                >
                  {testsRequired}
                </div>
              </div>
            </div>

            {/* ==================================================
                ROW 3
               ================================================== */}

            <div
              className="
                grid
                min-h-[74px]
                grid-cols-[42px_310px_minmax(0,1fr)]
                border-t
                border-[#c9e3d9]
              "
            >

              {/* NUMBER */}

              <div
                className="
                  flex
                  items-start
                  justify-center
                  bg-[#007052]
                  px-2
                  pt-[20px]
                  text-[13px]
                  font-bold
                  text-white
                "
              >
                3
              </div>

              {/* LABEL */}

              <div
                className="
                  border-r
                  border-[#c9e3d9]
                  bg-[#effaf5]
                  px-[16px]
                  py-[17px]
                "
              >
                <div
                  className="
                    text-[13px]
                    font-bold
                    leading-[19px]
                    text-[#006d52]
                  "
                >
                  Method(s) of Analysis / Testing
                </div>
              </div>

              {/* VALUE */}

              <div
                className="
                  bg-white
                  px-[13px]
                  py-[17px]
                "
              >
                <div
                  className="
                    break-words
                    text-[13px]
                    font-medium
                    leading-[20px]
                    text-slate-800
                  "
                >
                  {methodsRequired}
                </div>
              </div>
            </div>
          </section>

          {/* ====================================================
              PARAMETERS

              Temporary generic parameter area.
              Food/LOD rendering will replace/extend this through
              the plugin preparation architecture.
             ==================================================== */}

          <section
            className="
              mt-[30px]
              overflow-hidden
              rounded-[12px]
              border
              border-[#d6e4df]
              bg-white
              shadow-[0_2px_5px_rgba(15,23,42,0.08)]
            "
          >
            <div
              className="
                border-b
                border-[#c9e3d9]
                bg-[#effaf5]
                px-5
                py-4
              "
            >
              <h2
                className="
                  text-[16px]
                  font-bold
                  text-[#006d52]
                "
              >
                Parameters
              </h2>
            </div>

            <div className="bg-white p-5">

              {parameters.length === 0 ? (
                <div
                  className="
                    rounded-[10px]
                    border
                    border-dashed
                    border-[#b9d8cd]
                    bg-[#f8fcfa]
                    px-6
                    py-8
                    text-center
                  "
                >
                  <div
                    className="
                      text-[13px]
                      font-semibold
                      text-[#006d52]
                    "
                  >
                    No parameters added
                  </div>

                  <div
                    className="
                      mt-1
                      text-[12px]
                      text-slate-500
                    "
                  >
                    No worksheet parameters are currently available.
                  </div>
                </div>
              ) : (
                <div className="space-y-3">

                  {parameters.map(
                    (
                      parameter: any,
                      index: number
                    ) => {
                      const parameterName =
                        parameter?.parameterName ||
                        parameter?.name ||
                        parameter?.parameter ||
                        `Parameter ${index + 1}`;

                      const parameterCode =
                        parameter?.parameterCode ||
                        parameter?.paraCode ||
                        "";

                      const parameterStatus =
                        parameter?.status ||
                        "CREATED";

                      return (
                        <div
                          key={
                            parameter?.id ??
                            parameter?.parameterId ??
                            index
                          }
                          className="
                            rounded-[10px]
                            border
                            border-slate-200
                            bg-white
                            p-4
                            shadow-sm
                          "
                        >
                          <div
                            className="
                              flex
                              flex-col
                              gap-3
                              md:flex-row
                              md:items-center
                              md:justify-between
                            "
                          >
                            <div>

                              <div
                                className="
                                  flex
                                  flex-wrap
                                  items-center
                                  gap-3
                                "
                              >
                                <h3
                                  className="
                                    text-[14px]
                                    font-bold
                                    text-slate-800
                                  "
                                >
                                  {parameterName}
                                </h3>

                                <span
                                  className="
                                    rounded-full
                                    bg-amber-50
                                    px-2.5
                                    py-1
                                    text-[9px]
                                    font-bold
                                    uppercase
                                    tracking-wide
                                    text-amber-700
                                  "
                                >
                                  {parameterStatus}
                                </span>
                              </div>

                              {parameterCode && (
                                <div
                                  className="
                                    mt-1.5
                                    text-[11px]
                                    text-slate-500
                                  "
                                >
                                  Code:{" "}
                                  <span
                                    className="
                                      font-semibold
                                      text-slate-700
                                    "
                                  >
                                    {parameterCode}
                                  </span>
                                </div>
                              )}

                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}

                </div>
              )}

            </div>
          </section>

          {/* ====================================================
              LAB
             ==================================================== */}

          <section
            className="
              mt-[24px]
              rounded-[10px]
              border
              border-[#d6e4df]
              bg-[#f8fcfa]
              px-5
              py-4
            "
          >
            <div
              className="
                text-[11px]
                font-bold
                uppercase
                tracking-[0.08em]
                text-[#006d52]
              "
            >
              Laboratory
            </div>

            <div
              className="
                mt-1
                text-[13px]
                font-medium
                text-slate-700
              "
            >
              {displayLab}
            </div>
          </section>

        </div>
      </div>
    </WorksheetShell>
  );
}