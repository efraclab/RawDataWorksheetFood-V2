export interface MoistureSolventCalculationInput {v:unknown;w:unknown;s:unknown;}
export interface MoistureSolventCalculationResult {success:boolean;result:number|null;error?:string;}
const n=(v:unknown)=>{const x=Number(v);return Number.isFinite(x)?x:null;};
export function calculateMoistureVolatileSolvent(input:MoistureSolventCalculationInput):MoistureSolventCalculationResult{
 const v=n(input.v),w=n(input.w),s=n(input.s);
 if(v===null||w===null||s===null)return{success:false,result:null,error:"All calculation inputs are required and must be numeric."};
 if(v!<0||w!<0||s!<=0)return{success:false,result:null,error:"Inputs must be within valid numeric ranges."};
 const result=(v!*w!)/(10*s!);
 return Number.isFinite(result)?{success:true,result:Math.round((result+Number.EPSILON)*1000)/1000}:{success:false,result:null,error:"Unable to calculate moisture of volatile solvent."};
}