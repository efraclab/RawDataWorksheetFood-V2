import type { PreparationDefinition } from '../../../../core/preparation/contracts/PreparationDefinition';
import Lithosun300PreparationModule from './components/Lithosun300PreparationModule';

export const lithosun300PreparationDefinition: PreparationDefinition = {
  id: 'metal.lithosun300', name: 'Lithosun 300', pluginId: 'metal', laboratory: 'Metal', description: 'Lithosun 300 tablet dissolution calculation.', version: '1.0.0',
  metadata: { ui: { title: 'Lithosun 300', component: Lithosun300PreparationModule }, persistence: { preparationType: 'lithosun300', calculationType: 'lithosun300' } },
};
