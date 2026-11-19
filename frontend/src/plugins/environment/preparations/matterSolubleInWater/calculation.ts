export interface MatterSolubleCalculationInput {m:unknown;m1:unknown;x:unknown;}
export interface MatterSolubleCalculationResult {success:boolean;result:number|null;error?:string;}
const n=(v:unknown)=>{const x=Number(v);return Number.isFinite(x)?x:null;};
export function calculateMatterSolubleInWater(input:MatterSolubleCalculationInput):MatterSolubleCalculationResult{
 const m=n(input.m),m1=n(input.m1),x=n(input.x);
 if(m===null||m1===null||x===null)return{success:false,result:null,error:"All calculation inputs are required and must be numeric."};
 if(m!<0||m1!<=0||x!<0||x!>=100)return{success:false,result:null,error:"Mass and moisture values are invalid; moisture must be below 100%."};
 const result=(20000*m!)/(m1!*(100-x!));
 return Number.isFinite(result)?{success:true,result:Math.round((result+Number.EPSILON)*1000)/1000}:{success:false,result:null,error:"Unable to calculate matter soluble in water."};
}