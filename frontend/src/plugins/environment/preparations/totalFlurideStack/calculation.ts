export interface TotalFluorideStackCalculationInput { ft: unknown; m: unknown; vt: unknown; at: unknown; vd: unknown; vm: unknown; }
export interface TotalFluorideStackCalculationResult { success: boolean; result: number | null; error?: string; }
const n=(v:unknown)=>{const x=Number(v);return Number.isFinite(x)?x:null;};
export function calculateTotalFluorideStack(input: TotalFluorideStackCalculationInput): TotalFluorideStackCalculationResult {
  // Ft is an auto-calculated field in the V2 UI. The Excel sheet derives total
  // fluoride from the calibrated-curve concentration and final distillate: Ft = M × Vd.
  const m=n(input.m), vt=n(input.vt), at=n(input.at), vd=n(input.vd), vm=n(input.vm);
  if ([m,vt,at,vd,vm].some((x)=>x===null)) {
    return {success:false,result:null,error:"Concentration, dilution volumes and gas volume are required and must be numeric."};
  }
  if (m! < 0 || vt! <= 0 || at! <= 0 || vd! <= 0 || vm! <= 0) {
    return {success:false,result:null,error:"Inputs must be within valid numeric ranges."};
  }

  const totalFluoride = m! * vd!;
  const result = (totalFluoride * vt!) / (at! * vm!);
  return Number.isFinite(result)
    ? {success:true,result:Math.round((result+Number.EPSILON)*1000)/1000}
    : {success:false,result:null,error:"Unable to calculate total fluoride concentration."};
}