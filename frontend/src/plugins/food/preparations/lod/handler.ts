import type {
    PreparationHandler,
} from "../../../../core/preparation/runtime/PreparationRuntime";

import type {
    PreparationContext,
} from "../../../../core/preparation/contracts/PreparationContext";

import type {
    PreparationResult,
} from "../../../../core/preparation/contracts/PreparationResult";

import {
    lodPreparationDefinition,
} from "./definition";

import {
    calculateLod,
} from "./calculation";

export const lodPreparationHandler: PreparationHandler = {

    definition: lodPreparationDefinition,

    capabilities: {

        collectData: async (
            context: PreparationContext
        ): Promise<PreparationResult> => {

            return {
                success: true,
                data: context.data,
                errors: [],
                warnings: [],
            };
        },

        validate: async (
                context: PreparationContext
            ): Promise<PreparationResult> => {

                const data = context.data;

                const errors: string[] = [];

                /*
                * 1. Sample Preparation is required.
                */
                const samplePreparation =
                    data.samplePreparation;

                if (!samplePreparation) {
                    errors.push(
                        "LOD Sample Preparation is required."
                    );
                }

                /*
                * 2. W1, W2 and W3 are required numeric values.
                */
                const w1 = parseFloat(
                    String(data.w1 ?? "")
                );

                const w2 = parseFloat(
                    String(data.w2 ?? "")
                );

                const w3 = parseFloat(
                    String(data.w3 ?? "")
                );

                if (
                    !String(data.w1 ?? "").trim() ||
                    Number.isNaN(w1)
                ) {
                    errors.push(
                        "W1 (Empty Dish) is required and must be a valid number."
                    );
                }

                if (
                    !String(data.w2 ?? "").trim() ||
                    Number.isNaN(w2)
                ) {
                    errors.push(
                        "W2 (Dish With Sample) is required and must be a valid number."
                    );
                }

                if (
                    !String(data.w3 ?? "").trim() ||
                    Number.isNaN(w3)
                ) {
                    errors.push(
                        "W3 (Dish After Ignition) is required and must be a valid number."
                    );
                }

                /*
                * 3. W1, W2 and W3 must not be zero.
                *
                * V1 requires non-zero weighing values
                * before calculation.
                */
                if (!Number.isNaN(w1) && w1 === 0) {
                    errors.push(
                        "W1 (Empty Dish) must be greater than zero."
                    );
                }

                if (!Number.isNaN(w2) && w2 === 0) {
                    errors.push(
                        "W2 (Dish With Sample) must be greater than zero."
                    );
                }

                if (!Number.isNaN(w3) && w3 === 0) {
                    errors.push(
                        "W3 (Dish After Ignition) must be greater than zero."
                    );
                }

                /*
                * Return all validation errors together.
                */
                if (errors.length > 0) {
                    return {
                        success: false,
                        data,
                        errors,
                        warnings: [],
                    };
                }

                return {
                    success: true,
                    data,
                    errors: [],
                    warnings: [],
                };
            },

        calculate: async (
                context: PreparationContext
            ): Promise<PreparationResult> => {

                const data = context.data;

                const result = calculateLod({
                    w1: String(data.w1 ?? ""),
                    w2: String(data.w2 ?? ""),
                    w3: String(data.w3 ?? ""),
                    w1Unit: String(data.w1Unit ?? "g"),
                    w2Unit: String(data.w2Unit ?? "g"),
                    w3Unit: String(data.w3Unit ?? "g"),
                });

                if (!result.success) {
                    return {
                        success: false,
                        data: {
                            ...data,
                            w1: result.w1,
                            w2: result.w2,
                            w3: result.w3,
                            calculationResult: result.result,
                            calculationResultUnit: result.unit,
                        },
                        errors: result.error
                            ? [result.error]
                            : ["LOD calculation failed."],
                        warnings: [],
                    };
                }

                return {
                    success: true,
                    data: {
                        ...data,
                        w1: result.w1,
                        w2: result.w2,
                        w3: result.w3,
                        calculationResult: result.result,
                        calculationResultUnit: result.unit,
                    },
                    errors: [],
                    warnings: [],
                };
            },

    },

    execute: async (
        context: PreparationContext
    ): Promise<PreparationResult> => {

        return {
            success: true,
            data: context.data,
            errors: [],
            warnings: [],
        };
    },
};