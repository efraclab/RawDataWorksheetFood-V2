import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import ZptoShampooPreparationModule from "./components/ZptoShampooPreparationModule";
export const zptoShampooPreparationDefinition: PreparationDefinition = {
 id:"metal.zptoShampoo", name:"ZPTO Shampoo", pluginId:"metal", laboratory:"Metal",
 description:"Metal laboratory ZPTO Shampoo preparation and calculation.", version:"1.0.0",
 metadata:{ui:{title:"ZPTO Shampoo",component:ZptoShampooPreparationModule},persistence:{preparationType:"zpto_shampoo",calculationType:"zpto_shampoo"}}
};
