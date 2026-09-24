export interface SoilAvailableSulphurCalculationInput { w:unknown;soilWeight:unknown;extractant:unknown;aliquot:unknown; }
export interface SoilAvailableSulphurCalculationResult {success:boolean;result:number|null;error?:string;}
const n=(v:unknown)=>{const x=Number(v);return Number.isFinite(x)?x:null;};
export function calculateSoilAvailableSulphur(input:SoilAvailableSulphurCalculationInput):SoilAvailableSulphurCalculationResult{
 const w=n(input.w),soilWeight=n(input.soilWeight),extractant=n(input.extractant),aliquot=n(input.aliquot);
 if([w,soilWeight,extractant,aliquot].some(x=>x===null))return{success:false,result:null,error:"All calculation inputs are required and must be numeric."};
 if(w!<0||soilWeight!<=0||extractant!<=0||aliquot!<=0)return{success:false,result:null,error:"Inputs must be within valid numeric ranges."};
 const result=(w!*extractant!)/(aliquot!*soilWeight!);
 return Number.isFinite(result)?{success:true,result:Math.round((result+Number.EPSILON)*1000)/1000}:{success:false,result:null,error:"Unable to calculate available sulphur."};
}