export interface SoilGypsumRequirementCalculationInput {a:unknown;b:unknown;n:unknown;}
export interface SoilGypsumRequirementCalculationResult {success:boolean;result:number|null;error?:string;}
const num=(v:unknown)=>{const x=Number(v);return Number.isFinite(x)?x:null;};
export function calculateSoilGypsumRequirement(input:SoilGypsumRequirementCalculationInput):SoilGypsumRequirementCalculationResult{
 const a=num(input.a),b=num(input.b),n=num(input.n);
 if([a,b,n].some(x=>x===null))return{success:false,result:null,error:"All calculation inputs are required and must be numeric."};
 if(a!<0||b!<0||n!<0)return{success:false,result:null,error:"Inputs cannot be negative."};
 const result=(a!-b!)*n!*382;
 return Number.isFinite(result)?{success:true,result:Math.round((result+Number.EPSILON)*1000)/1000}:{success:false,result:null,error:"Unable to calculate gypsum requirement."};
}