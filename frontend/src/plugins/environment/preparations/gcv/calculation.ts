export interface GCVCalculationInput {en:unknown;qs:unknown;m1:unknown;m2:unknown;qv2:unknown;qfuse:unknown;qing:unknown;qn:unknown;theta:unknown;}
export interface GCVCalculationResult {success:boolean;result:number|null;error?:string;}
const n=(v:unknown)=>{const x=Number(v);return Number.isFinite(x)?x:null;};
export function calculateGCV(input:GCVCalculationInput):GCVCalculationResult{
 const en=n(input.en),qs=n(input.qs),m1=n(input.m1),m2=n(input.m2),qv2=n(input.qv2),qfuse=n(input.qfuse),qing=n(input.qing),qn=n(input.qn),theta=n(input.theta);
 if([en,qs,m1,m2,qv2,qfuse,qing,qn,theta].some(x=>x===null))return{success:false,result:null,error:"All calculation inputs are required and must be numeric."};
 if(en!<0||m1!<=0||m2!<0||qv2!<0||qfuse!<0||qing!<0||qn!<0||theta!<0||qs!<0)return{success:false,result:null,error:"Inputs must be within valid numeric ranges."};
 const result=((en!*theta!-qfuse!-qing!-qn!-m2!*qv2!)/m1!)-(qs!/m1!);
 return Number.isFinite(result)?{success:true,result:Math.round((result+Number.EPSILON)*1000)/1000}:{success:false,result:null,error:"Unable to calculate GCV."};
}