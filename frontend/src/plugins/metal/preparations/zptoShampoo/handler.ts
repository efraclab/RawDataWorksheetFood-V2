import type { PreparationHandler } from "../../../../core/preparation/runtime/PreparationRuntime";
import { zptoShampooPreparationDefinition } from "./definition";
import type { CalculationZptoShampoo } from "./models/CalculationZptoShampoo";
import type { ZptoShampooModuleDraft } from "./models";
import { calculateZptoShampoo } from "./calculation";

export const ZPTO_SHAMPOO_BACKEND_PREPARATION_TYPE = "zpto_shampoo";
export const ZPTO_SHAMPOO_BACKEND_CALCULATION_TYPE = "zpto_shampoo";
export interface ZptoShampooValidationResult { valid:boolean; errors:string[]; }
export function validateZptoShampooCalculation(c:CalculationZptoShampoo):ZptoShampooValidationResult {
 const errors:string[]=[]; const required:[string,unknown,boolean][]=[
 ["Instrument Concentration (Sample)",c.instrumentConcentrationSample,false],["Instrument Concentration (Blank)",c.instrumentConcentrationBlank,false],["Sample Weight",c.sw1,true],["Volume Makeup",c.v1,true],["V2 factor",c.v2Factor,true],["V2 volume",c.v2Volume,true],["Specific Gravity",c.specificGravity,true],["Molecular Weight 1",c.molecularWeight1,true],["Molecular Weight 2",c.molecularWeight2,true],["Label Claim",c.labelClaim,true]];
 for(const [label,value,positive] of required){if(value===null||value===undefined||String(value).trim()===""){errors.push(`${label} is required`);continue;}const n=Number(value);if(!Number.isFinite(n))errors.push(`${label} must be numeric`);else if(positive&&n<=0)errors.push(`${label} must be greater than 0`);else if(!positive&&n<0)errors.push(`${label} cannot be negative`);}
 return {valid:errors.length===0,errors};
}
export function runZptoShampooCalculation(c:CalculationZptoShampoo){return calculateZptoShampoo({instrumentConcentrationSample:c.instrumentConcentrationSample,instrumentConcentrationSampleUnit:c.instrumentConcentrationSampleUnit,instrumentConcentrationBlank:c.instrumentConcentrationBlank,instrumentConcentrationBlankUnit:c.instrumentConcentrationBlankUnit,sampleWeight:c.sw1,volumeMakeup:c.v1,dilutionFactor1:c.v2Factor,dilutionVolume1:c.v2Volume,weightEmptyPycnometer:c.weightEmptyPycnometer,weightPycnometerSample:c.weightPycnometerSample,weightPycnometerWater:c.weightPycnometerWater,specificGravity:c.specificGravity,molecularWeight1:c.molecularWeight1,molecularWeight2:c.molecularWeight2,labelClaim:c.labelClaim});}
export function mapZptoShampooDraftToPreparations(d:ZptoShampooModuleDraft|undefined){return (d?.samplePreparations??[]).map(p=>({id:p.id,label:p.label,preparationCategory:"sample",preparationType:ZPTO_SHAMPOO_BACKEND_PREPARATION_TYPE,assignedStandardId:null,steps:JSON.stringify(p.steps),content:null,isPreparationCompleted:Boolean(d?.completed),completedAt:d?.completedAt??null}));}
export function mapZptoShampooDraftToCalculations(d:ZptoShampooModuleDraft|undefined){return (d?.calculations??[]).map(c=>({...c,calculationType:ZPTO_SHAMPOO_BACKEND_CALCULATION_TYPE}));}
export function mapZptoShampooDraftToFiles(d:ZptoShampooModuleDraft|undefined){return (d?.files??[]).map(f=>({id:f.id,preparationType:ZPTO_SHAMPOO_BACKEND_PREPARATION_TYPE,label:f.name,fileName:f.name,fileDataBase64:f.fileDataBase64}));}
export function mapZptoShampooDraftToPersistence(d:ZptoShampooModuleDraft|undefined){return {preparationType:ZPTO_SHAMPOO_BACKEND_PREPARATION_TYPE,calculationType:ZPTO_SHAMPOO_BACKEND_CALCULATION_TYPE,activeGroup:"metal.zptoShampoo",preparations:mapZptoShampooDraftToPreparations(d),calculations:mapZptoShampooDraftToCalculations(d),files:mapZptoShampooDraftToFiles(d),completed:Boolean(d?.completed),completedAt:d?.completedAt??null};}
export const zptoShampooPreparationHandler:PreparationHandler={definition:zptoShampooPreparationDefinition,capabilities:{
 collectData:async context=>({success:true,data:context.data,errors:[],warnings:[]}),
 validate:async context=>{const c=context.data.calculation;if(!c||typeof c!=="object")return {success:false,data:context.data,errors:["ZPTO Shampoo calculation data is required."],warnings:[]};const v=validateZptoShampooCalculation(c as CalculationZptoShampoo);return {success:v.valid,data:context.data,errors:v.errors,warnings:[]};},
 calculate:async context=>{const c=context.data.calculation;if(!c||typeof c!=="object")return {success:false,data:context.data,errors:["ZPTO Shampoo calculation data is required."],warnings:[]};const r=runZptoShampooCalculation(c as CalculationZptoShampoo);return {success:r.success,data:{...context.data,calculationResult:r.result,calculationResultUnit:r.success?"% of L.C.":null},errors:r.success?[]:[r.error??"ZPTO Shampoo calculation failed."],warnings:[]};}},execute:async context=>({success:true,data:context.data,errors:[],warnings:[]})};
