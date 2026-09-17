export interface ZptoShampooCalculationInput {
 instrumentConcentrationSample: number|string|null|undefined; instrumentConcentrationSampleUnit?: string|null;
 instrumentConcentrationBlank: number|string|null|undefined; instrumentConcentrationBlankUnit?: string|null;
 sampleWeight: number|string|null|undefined; volumeMakeup: number|string|null|undefined;
 dilutionFactor1: number|string|null|undefined; dilutionVolume1: number|string|null|undefined;
 specificGravity?: number|string|null|undefined; weightEmptyPycnometer: number|string|null|undefined; weightPycnometerSample: number|string|null|undefined; weightPycnometerWater: number|string|null|undefined; molecularWeight1: number|string|null|undefined; molecularWeight2: number|string|null|undefined; labelClaim: number|string|null|undefined;
}
export interface ZptoShampooCalculationResult { success:boolean; result:number|null; error?:string; }
const n=(v:unknown):number|null=>{ if(v===null||v===undefined||String(v).trim()==="") return null; const x=Number(v); return Number.isFinite(x)?x:null; };
const ppm=(v:number,u?:string|null)=>String(u??"ppm").toLowerCase()==="ppb"?v/1000:v;
const ml=(v:number,u?:string)=>{const s=String(u??"ml").toLowerCase(); return s==="l"||s==="liter"||s==="litre"?v*1000:s==="ul"||s==="µl"?v/1000:v;};
const g=(v:number,u?:string)=>{const s=String(u??"g").toLowerCase(); return s==="mg"?v/1000:s==="kg"?v*1000:v;};
/** ZPTO Shampoo Excel calculation: percentage of label claim. */
export function calculateZptoShampoo(i:ZptoShampooCalculationInput):ZptoShampooCalculationResult {
 const sample=n(i.instrumentConcentrationSample), blank=n(i.instrumentConcentrationBlank), sw=n(i.sampleWeight), v1=n(i.volumeMakeup), f=n(i.dilutionFactor1), v2=n(i.dilutionVolume1), w1=n(i.weightEmptyPycnometer), w2=n(i.weightPycnometerSample), w3=n(i.weightPycnometerWater), sgFromPycnometer=(w1!==null&&w2!==null&&w3!==null&&w1!==w3)?((w1-w2)/(w1-w3))*0.998:null, sg=sgFromPycnometer??n(i.specificGravity), mw1=n(i.molecularWeight1), mw2=n(i.molecularWeight2), lc=n(i.labelClaim);
 if(sample===null||blank===null) return {success:false,result:null,error:"Instrument concentration sample and blank are required"};
 if(sw===null||sw<=0||v1===null||v1<=0||f===null||f<=0||v2===null||v2<=0||w1===null||w1<=0||w2===null||w2<=0||w3===null||w3<=0||sg===null||sg<=0||mw1===null||mw1<=0||mw2===null||mw2<=0||lc===null||lc<=0) return {success:false,result:null,error:"All ZPTO Shampoo calculation values are required and must be greater than 0"};
 const result=((ppm(sample,i.instrumentConcentrationSampleUnit)-ppm(blank,i.instrumentConcentrationBlankUnit))*ml(v1,"ml")*ml(v2,"ml")*sg*mw1*100)/(g(sw,"g")*10000*f*mw2*lc);
 return Number.isFinite(result)?{success:true,result:Number(result.toFixed(3))}:{success:false,result:null,error:"Unable to calculate ZPTO Shampoo result"};
}
