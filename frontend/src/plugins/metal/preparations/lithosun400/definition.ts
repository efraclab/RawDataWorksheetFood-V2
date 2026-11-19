import type { PreparationDefinition } from '../../../../core/preparation/contracts/PreparationDefinition';
import Lithosun400PreparationModule from './components/Lithosun400PreparationModule';

export const lithosun400PreparationDefinition: PreparationDefinition = {
  id: 'metal.lithosun400', name: 'Lithosun 400', pluginId: 'metal', laboratory: 'Metal', description: 'Lithosun 400 tablet dissolution calculation.', version: '1.0.0',
  metadata: { ui: { title: 'Lithosun 400', component: Lithosun400PreparationModule }, persistence: { preparationType: 'lithosun400', calculationType: 'lithosun400' } },
};
