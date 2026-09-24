export interface CS2StackCalculationInput { a2: unknown; b2: unknown; v: unknown; f: unknown; pb: unknown; aq: unknown; }
export interface CS2StackCalculationResult { success: boolean; result: number | null; error?: string; }
const n = (v: unknown) => { const x = Number(v); return Number.isFinite(x) ? x : null; };
export function calculateCS2Stack(input: CS2StackCalculationInput): CS2StackCalculationResult {
  const a2=n(input.a2), b2=n(input.b2), v=n(input.v), f=n(input.f), pb=n(input.pb), aq=n(input.aq);
  if ([a2,b2,v,f,pb,aq].some((x)=>x===null)) return {success:false,result:null,error:"All calculation inputs are required and must be numeric."};
  if (a2! < 0 || b2! < 0 || v! <= 0 || pb! <= 0 || aq! < 0) return {success:false,result:null,error:"Inputs must be within valid numeric ranges."};
  const dryness=(pb!-aq!)/pb!;
  if (dryness<=0) return {success:false,result:null,error:"Barometric pressure must be greater than aqueous tension."};
  // F is displayed as the calculated dryness factor; use the pressure/tension inputs as the source of truth.
  const calculatedF = dryness;
  const result=(24800*a2!*b2!)/(v!*calculatedF);
  return Number.isFinite(result)?{success:true,result:Math.round((result+Number.EPSILON)*1000)/1000}:{success:false,result:null,error:"Unable to calculate CS2 concentration."};
}