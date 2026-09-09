import { useEffect, useMemo, useState } from "react";
import WorksheetShell from "./WorksheetShell";
import {
  worksheetService,
  type WorksheetDetail as WorksheetDetailData,
  type FetchWorksheetRequest,
} from "../worksheetService";
import FoodWorksheetHeader from "../../../plugins/food/components/worksheet/FoodWorksheetHeader";
import FoodWorksheetInfo from "../../../plugins/food/components/worksheet/FoodWorksheetInfo";
import FoodParameterManager from "../../../plugins/food/components/worksheet/FoodParameterManager";
import type { ParameterDetail } from "../../../plugins/food/models/ParameterDetail";
import type { SampleData } from "../../../plugins/food/models/SampleData";

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
  // FOOD PARAMETER MANAGEMENT
  // ============================================================

  const [addedParameters, setAddedParameters] =
    useState<ParameterDetail[]>([]);

  const [expandedParameterId, setExpandedParameterId] =
    useState<number | null>(null);

  const [availableParameters, setAvailableParameters] =
    useState<SampleData[]>([]);

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

        // ============================================================
        // LOAD AVAILABLE FOOD PARAMETERS
        //
        // V1 uses a separate /sample-details request to populate
        // the parameter catalogue. Do NOT use worksheet.sample.parameters
        // for this purpose.
        // ============================================================

        const availableSamples =
  await worksheetService.getAvailableParameters({
    regNo:
      worksheetData.sample?.registrationNo ?? "",
    lab: displayLab,
  });

        if (cancelled) {
          return;
        }

        setAvailableParameters(availableSamples);

        // Preserve all parameter data returned by the existing V2 API.
        // The manager receives the V1-compatible ParameterDetail shape.
        const restoredParameters = (worksheetData.parameters ?? []).map(
          (parameter: any, index: number) => ({
            ...parameter,
            id:
              typeof parameter?.id === "number"
                ? parameter.id
                : typeof parameter?.parameterId === "number"
                  ? parameter.parameterId
                  : Date.now() + index,
            preparationCompletedBy:
              parameter?.preparationCompletedBy ?? null,
            preparationCompletedAt:
              parameter?.preparationCompletedAt ?? null,
            remarksByAnalyst:
              parameter?.remarksByAnalyst ?? null,
            paraCode:
              parameter?.paraCode ??
              parameter?.parameterCode ??
              null,
            parameterName:
              parameter?.parameterName ??
              parameter?.name ??
              parameter?.parameter ??
              null,
            methodCode:
              parameter?.methodCode ?? null,
            methodName:
              parameter?.methodName ??
              parameter?.method ??
              null,
            analyzedBy:
              parameter?.analyzedBy ?? null,
            approvedByReviewer:
              parameter?.approvedByReviewer ?? null,
            analyzedByName:
              parameter?.analyzedByName ?? null,
            approvedByReviewerName:
              parameter?.approvedByReviewerName ?? null,
            analysisStartDate:
              parameter?.analysisStartDate ?? null,
            analysisCompletionDate:
              parameter?.analysisCompletionDate ?? null,
            analysisObservationDate:
              parameter?.analysisObservationDate ?? null,
            approvedAtReviewer:
              parameter?.approvedAtReviewer ?? null,
            approvedByQAName:
              parameter?.approvedByQAName ?? null,
            approvedByQA:
              parameter?.approvedByQA ?? null,
            approvedAtQA:
              parameter?.approvedAtQA ?? null,
            remarksByReviewer:
              parameter?.remarksByReviewer ?? null,
            remarksByQA:
              parameter?.remarksByQA ?? null,
            submittedQaByName:
              parameter?.submittedQaByName ?? null,
            submittedQaBy:
              parameter?.submittedQaBy ?? null,
            status:
              parameter?.status ?? "CREATED",
            additional_info:
              parameter?.additional_info ?? null,
            other_info:
              parameter?.other_info ?? null,
            instruments:
              parameter?.instruments ?? [],
            chemicals:
              parameter?.chemicals ?? [],
            standards:
              parameter?.standards ?? [],
            internalStandards:
              parameter?.internalStandards ?? [],
            media:
              parameter?.media ?? [],
            preparations:
              parameter?.preparations ?? [],
            calculations:
              parameter?.calculations ?? [],
            files:
              parameter?.files ?? [],
          })
        ) as ParameterDetail[];

        setAddedParameters(restoredParameters);
        setExpandedParameterId(null);
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

  

  const parameterCount =
    addedParameters.length;

  // V1 filters the separately-loaded /sample-details catalogue
  // so parameters already on this worksheet are not offered again.
  const availableToAdd = useMemo(() => {
    return availableParameters.filter(
      (parameter) =>
        !addedParameters.some(
          (added) =>
            added.paraCode === parameter.paraCode
        )
    );
  }, [availableParameters, addedParameters]);

  const handleAddParameter = (parameter: SampleData) => {
    if (
      addedParameters.some(
        (added) =>
          added.paraCode === parameter.paraCode
      )
    ) {
      return;
    }

    const newParameter: ParameterDetail = {
      preparationCompletedBy: null,
      preparationCompletedAt: null,
      remarksByAnalyst: null,
      id: Date.now(),
      paraCode: parameter.paraCode,
      parameterName: parameter.parameter,
      methodCode: parameter.methodCode,
      methodName: parameter.methodName,
      analyzedBy: null,
      approvedByReviewer: null,
      analyzedByName: null,
      approvedByReviewerName: null,
      analysisStartDate: null,
      analysisCompletionDate: null,
      analysisObservationDate: null,
      approvedAtReviewer: null,
      approvedByQAName: null,
      approvedByQA: null,
      approvedAtQA: null,
      remarksByReviewer: null,
      remarksByQA: null,
      submittedQaByName: null,
      submittedQaBy: null,
      status: "CREATED",
      additional_info: null,
      other_info: null,
      instruments: [],
      chemicals: [],
      standards: [],
      internalStandards: [],
      media: [],
      preparations: [],
      calculations: [],
      files: [],
    };

    setAddedParameters((current) => [
      ...current,
      newParameter,
    ]);
  };

  const handleToggleParameter = (
    parameter: ParameterDetail
  ) => {
    setExpandedParameterId((current) =>
      current === parameter.id
        ? null
        : parameter.id
    );
  };

  const handleDeleteParameter = (
    parameter: ParameterDetail
  ) => {
    setAddedParameters((current) =>
      current.filter(
        (item) => item.id !== parameter.id
      )
    );

    setExpandedParameterId((current) =>
      current === parameter.id
        ? null
        : current
    );
  };

  // ============================================================
  // V1 WORKSHEET INFORMATION
  // ============================================================

  const sampleParticulars =
    sampleName || "—";

  const testsRequired =
    addedParameters
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
    addedParameters
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

        <FoodWorksheetHeader
            worksheetId={displayWorksheetId}
            registrationNo={registrationNo}
            sampleName={sampleName}
            parameterCount={parameterCount}
            dueDate={dueDate}
            displayStatus={worksheetStatus}
        />

          {/* ====================================================
              V1 WORKSHEET INFORMATION
             ==================================================== */}

          <FoodWorksheetInfo
            sampleName={sampleParticulars}
            parameterName={testsRequired}
            methodName={methodsRequired}
          />

          {/* ====================================================
              FOOD PARAMETER MANAGEMENT

              V1 parameter-management behavior is now handled by
              the Food plugin component. Preparation Management is
              intentionally excluded from this migration phase.
             ==================================================== */}

          <FoodParameterManager
            parameterCount={parameterCount}
            addedParameters={addedParameters}
            availableParameters={availableToAdd}
            expandedParameterId={expandedParameterId}
            worksheetStatus={worksheetStatus}
            role={localStorage.getItem("Role") ?? ""}
            onAddParameter={handleAddParameter}
            onToggleParameter={handleToggleParameter}
            onDeleteParameter={handleDeleteParameter}
          />


        </div>
      </div>
    </WorksheetShell>
  );
}