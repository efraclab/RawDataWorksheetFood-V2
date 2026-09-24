export interface FixedCarbonCalculationInput {a:unknown;v:unknown;m:unknown;}
export interface FixedCarbonCalculationResult {success:boolean;result:number|null;error?:string;}
const n=(v:unknown)=>{const x=Number(v);return Number.isFinite(x)?x:null;};
export function calculateFixedCarbon(input:FixedCarbonCalculationInput):FixedCarbonCalculationResult{
 const a=n(input.a),v=n(input.v),m=n(input.m);
 if([a,v,m].some(x=>x===null))return{success:false,result:null,error:"All calculation inputs are required and must be numeric."};
 if(a!<0||v!<0||m!<0)return{success:false,result:null,error:"Inputs cannot be negative."};
 const result=100-(a!+v!+m!);
 return Number.isFinite(result)?{success:true,result:Math.round((result+Number.EPSILON)*1000)/1000}:{success:false,result:null,error:"Unable to calculate fixed carbon."};
}