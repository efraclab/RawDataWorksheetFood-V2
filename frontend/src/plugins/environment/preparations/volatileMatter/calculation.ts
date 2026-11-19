export interface VolatileMatterCalculationInput {m2:unknown;m3:unknown;m1:unknown;mo:unknown;}
export interface VolatileMatterCalculationResult {success:boolean;result:number|null;error?:string;}
const n=(v:unknown)=>{const x=Number(v);return Number.isFinite(x)?x:null;};
export function calculateVolatileMatter(input:VolatileMatterCalculationInput):VolatileMatterCalculationResult{
 const m2=n(input.m2),m3=n(input.m3),m1=n(input.m1),mo=n(input.mo);
 if([m2,m3,m1,mo].some(x=>x===null))return{success:false,result:null,error:"All calculation inputs are required and must be numeric."};
 if(m2!<=m1!||m3!<m1!||mo!<0)return{success:false,result:null,error:"Mass and moisture values are invalid."};
 const result=(100*(m2!-m3!)/(m2!-m1!))-mo!;
 return Number.isFinite(result)?{success:true,result:Math.round((result+Number.EPSILON)*1000)/1000}:{success:false,result:null,error:"Unable to calculate volatile matter."};
}