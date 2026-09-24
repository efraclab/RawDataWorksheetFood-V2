export interface SoilMoistureCalculationInput {l:unknown;o:unknown;}
export interface SoilMoistureCalculationResult {success:boolean;result:number|null;error?:string;}
const n=(v:unknown)=>{const x=Number(v);return Number.isFinite(x)?x:null;};
export function calculateSoilMoisture(input:SoilMoistureCalculationInput):SoilMoistureCalculationResult{
 const l=n(input.l),o=n(input.o);
 if(l===null||o===null)return{success:false,result:null,error:"All calculation inputs are required and must be numeric."};
 if(l!<0||o!<=0)return{success:false,result:null,error:"Oven dry weight must be greater than zero and loss cannot be negative."};
 const result=(l!/o!)*100;
 return Number.isFinite(result)?{success:true,result:Math.round((result+Number.EPSILON)*1000)/1000}:{success:false,result:null,error:"Unable to calculate soil moisture."};
}