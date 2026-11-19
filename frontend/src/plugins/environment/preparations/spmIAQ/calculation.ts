export interface SPMCalculationInput {m1:unknown;m2:unknown;v:unknown;}
export interface SPMCalculationResult {success:boolean;result:number|null;error?:string;}
const n=(v:unknown)=>{const x=Number(v);return Number.isFinite(x)?x:null;};
export function calculateSPMIAQ(input:SPMCalculationInput):SPMCalculationResult{
 const m1=n(input.m1),m2=n(input.m2),v=n(input.v);
 if(m1===null||m2===null||v===null)return{success:false,result:null,error:"All calculation inputs are required and must be numeric."};
 if(m2!<m1!||v!<=0)return{success:false,result:null,error:"Final filter mass must not be below initial mass and air volume must be greater than zero."};
 const result=((m2!-m1!)*1000000)/v!;
 return Number.isFinite(result)?{success:true,result:Math.round((result+Number.EPSILON)*1000)/1000}:{success:false,result:null,error:"Unable to calculate SPM."};
}