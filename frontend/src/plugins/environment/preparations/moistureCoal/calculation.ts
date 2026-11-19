export interface MoistureCoalCalculationInput {m2:unknown;m3:unknown;m1:unknown;}
export interface MoistureCoalCalculationResult {success:boolean;result:number|null;error?:string;}
const n=(v:unknown)=>{const x=Number(v);return Number.isFinite(x)?x:null;};
export function calculateMoistureCoal(input:MoistureCoalCalculationInput):MoistureCoalCalculationResult{
 const m2=n(input.m2),m3=n(input.m3),m1=n(input.m1);
 if([m2,m3,m1].some(x=>x===null))return{success:false,result:null,error:"All calculation inputs are required and must be numeric."};
 if(m2!<=m1!||m2!<m3!)return{success:false,result:null,error:"Mass values must produce a positive sample mass and non-negative loss."};
 const den=m2!-m1!; const result=((m2!-m3!)/den)*100;
 return Number.isFinite(result)?{success:true,result:Math.round((result+Number.EPSILON)*1000)/1000}:{success:false,result:null,error:"Unable to calculate coal moisture."};
}