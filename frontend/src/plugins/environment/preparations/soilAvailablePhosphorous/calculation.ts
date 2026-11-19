export interface SoilAvailablePhosphorousCalculationInput {a:unknown;v:unknown;va:unknown;w:unknown;wt:unknown;}
export interface SoilAvailablePhosphorousCalculationResult {success:boolean;result:number|null;error?:string;}
const n=(v:unknown)=>{const x=Number(v);return Number.isFinite(x)?x:null;};
export function calculateSoilAvailablePhosphorous(input:SoilAvailablePhosphorousCalculationInput):SoilAvailablePhosphorousCalculationResult{
 const a=n(input.a),v=n(input.v),va=n(input.va),w=n(input.w),wt=n(input.wt);
 if([a,v,va,w,wt].some(x=>x===null))return{success:false,result:null,error:"All calculation inputs are required and must be numeric."};
 if(a!<0||v!<=0||va!<=0||w!<=0||wt!<=0)return{success:false,result:null,error:"Inputs must be within valid numeric ranges."};
 const result=(a!*v!*wt!)/(1000000*w!*va!);
 return Number.isFinite(result)?{success:true,result:Math.round((result+Number.EPSILON)*1000)/1000}:{success:false,result:null,error:"Unable to calculate available phosphorous."};
}