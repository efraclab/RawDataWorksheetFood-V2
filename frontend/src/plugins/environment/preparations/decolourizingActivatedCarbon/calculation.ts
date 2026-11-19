export interface DecolourizingCalculationInput {v:unknown;m:unknown;}
export interface DecolourizingCalculationResult {success:boolean;result:number|null;error?:string;}
const n=(v:unknown)=>{const x=Number(v);return Number.isFinite(x)?x:null;};
export function calculateDecolourizingActivatedCarbon(input:DecolourizingCalculationInput):DecolourizingCalculationResult{
 const v=n(input.v),m=n(input.m);
 if(v===null||m===null)return{success:false,result:null,error:"All calculation inputs are required and must be numeric."};
 if(v!<0||m!<=0)return{success:false,result:null,error:"Volume cannot be negative and material mass must be greater than zero."};
 const result=(15*v!)/(10*m!);
 return Number.isFinite(result)?{success:true,result:Math.round((result+Number.EPSILON)*1000)/1000}:{success:false,result:null,error:"Unable to calculate decolourizing power."};
}