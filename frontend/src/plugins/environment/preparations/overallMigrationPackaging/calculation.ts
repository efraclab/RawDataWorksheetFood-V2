export interface OverallMigrationCalculationInput {m:unknown;a:unknown;}
export interface OverallMigrationCalculationResult {success:boolean;result:number|null;error?:string;}
const n=(v:unknown)=>{const x=Number(v);return Number.isFinite(x)?x:null;};
export function calculateOverallMigrationPackaging(input:OverallMigrationCalculationInput):OverallMigrationCalculationResult{
 const m=n(input.m),a=n(input.a);
 if(m===null||a===null)return{success:false,result:null,error:"All calculation inputs are required and must be numeric."};
 if(m!<0||a!<=0)return{success:false,result:null,error:"Mass cannot be negative and exposed surface area must be greater than zero."};
 const result=(m!/a!)*100;
 return Number.isFinite(result)?{success:true,result:Math.round((result+Number.EPSILON)*1000)/1000}:{success:false,result:null,error:"Unable to calculate overall migration."};
}