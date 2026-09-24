export interface SoilTotalNitrogenCalculationInput { v1:unknown;v2:unknown;v3:unknown;v4:unknown;m1:unknown;m2:unknown;w:unknown;df:unknown; }
export interface SoilTotalNitrogenCalculationResult { success:boolean;result:number|null;error?:string; }
const n=(v:unknown)=>{const x=Number(v);return Number.isFinite(x)?x:null;};
export function calculateSoilTotalNitrogen(input: SoilTotalNitrogenCalculationInput): SoilTotalNitrogenCalculationResult {
 const v1=n(input.v1),v2=n(input.v2),v3=n(input.v3),v4=n(input.v4),m1=n(input.m1),m2=n(input.m2),w=n(input.w),df=n(input.df);
 if([v1,v2,v3,v4,m1,m2,w,df].some(x=>x===null))return{success:false,result:null,error:"All calculation inputs are required and must be numeric."};
 if(w!<=0||df!<=0||m1!<0||m2!<0||v1!<0||v2!<0||v3!<0||v4!<0)return{success:false,result:null,error:"Inputs must be within valid numeric ranges."};
 const result=(1.401*((v1!*m1!-v2!*m2!)-(v3!*m1!-v4!*m2!))*df!)/w!;
 return Number.isFinite(result)?{success:true,result:Math.round((result+Number.EPSILON)*1000)/1000}:{success:false,result:null,error:"Unable to calculate total nitrogen."};
}