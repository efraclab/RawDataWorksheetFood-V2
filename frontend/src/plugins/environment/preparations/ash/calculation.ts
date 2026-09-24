export interface AshCalculationInput {m2:unknown;m3:unknown;m1:unknown;m4:unknown;}
export interface AshCalculationResult {success:boolean;result:number|null;error?:string;}
const n=(v:unknown)=>{const x=Number(v);return Number.isFinite(x)?x:null;};
export function calculateAsh(input:AshCalculationInput):AshCalculationResult{
 const m2=n(input.m2),m3=n(input.m3),m1=n(input.m1),m4=n(input.m4);
 if([m2,m3,m1,m4].some(x=>x===null))return{success:false,result:null,error:"All calculation inputs are required and must be numeric."};
 if(m2!<=m1!||m3!<m4!)return{success:false,result:null,error:"Mass values are invalid. M2 must be greater than M1 and M3 must be greater than or equal to M4."};
 const result=(100*(m3!-m4!))/(m2!-m1!);
 return Number.isFinite(result)?{success:true,result:Math.round((result+Number.EPSILON)*1000)/1000}:{success:false,result:null,error:"Unable to calculate ash content."};
}