import type { PreparationHandler } from "../../../core/preparation/runtime/PreparationRuntime";

// Plate count (shared engine: preparations/plateCount)
import { tpcPreparationHandler } from "../preparations/tpc/handler";
import { coliformCountPreparationHandler } from "../preparations/coliformCount/handler";
import { hpcPreparationHandler } from "../preparations/hpc/handler";
import { totalMesophilicPreparationHandler } from "../preparations/totalMesophilic/handler";
import { proteolyticPreparationHandler } from "../preparations/proteolytic/handler";
import { psychrophilicPreparationHandler } from "../preparations/psychrophilic/handler";
import { thermophilicPreparationHandler } from "../preparations/thermophilic/handler";
import { acidProducingPreparationHandler } from "../preparations/acidProducing/handler";
import { thermophilicSporePreparationHandler } from "../preparations/thermophilicSpore/handler";
import { coliformEcoliPreparationHandler } from "../preparations/coliformEcoli/handler";
import { eColiPreparationHandler } from "../preparations/eColi/handler";
import { faecalStreptoPreparationHandler } from "../preparations/faecalStrepto/handler";
import { acidophilicPreparationHandler } from "../preparations/acidophilic/handler";
import { sulphiteReducingPreparationHandler } from "../preparations/sulphiteReducing/handler";
import { sAureusPreparationHandler } from "../preparations/sAureus/handler";
import { bCereusPreparationHandler } from "../preparations/bCereus/handler";
import { tymPreparationHandler } from "../preparations/tym/handler";
import { cPerfringensPreparationHandler } from "../preparations/cPerfringens/handler";
import { cBotulinumPreparationHandler } from "../preparations/cBotulinum/handler";
import { pseudomonasPreparationHandler } from "../preparations/pseudomonas/handler";
import { enterobacteriaceaePreparationHandler } from "../preparations/enterobacteriaceae/handler";
import { thermoduricPreparationHandler } from "../preparations/thermoduric/handler";
import { lipolyticPreparationHandler } from "../preparations/lipolytic/handler";
import { flatSourPreparationHandler } from "../preparations/flatSour/handler";
import { totalBacterialSporePreparationHandler } from "../preparations/totalBacterialSpore/handler";
import { butyricPreparationHandler } from "../preparations/butyric/handler";
import { ayushTamcPreparationHandler } from "../preparations/ayushTamc/handler";
import { ayushTymcPreparationHandler } from "../preparations/ayushTymc/handler";
import { ipTamcPreparationHandler } from "../preparations/ipTamc/handler";
import { ipTymcPreparationHandler } from "../preparations/ipTymc/handler";
import { guaiacolPreparationHandler } from "../preparations/guaiacol/handler";
import { guaiacolYsgPreparationHandler } from "../preparations/guaiacolYsg/handler";

// Detection, Present / Absent (shared engine: preparations/detection)
import { eColiDetectionPreparationHandler } from "../preparations/eColiDetection/handler";
import { sAureusDetectionPreparationHandler } from "../preparations/sAureusDetection/handler";
import { sAureusDetectionIsoPreparationHandler } from "../preparations/sAureusDetectionIso/handler";
import { salmonellaIsPreparationHandler } from "../preparations/salmonellaIs/handler";
import { salmonellaIsoPreparationHandler } from "../preparations/salmonellaIso/handler";
import { vibrioPreparationHandler } from "../preparations/vibrio/handler";
import { vibrioIsoPreparationHandler } from "../preparations/vibrioIso/handler";
import { vParahaemolyticusPreparationHandler } from "../preparations/vParahaemolyticus/handler";
import { vCholeraePreparationHandler } from "../preparations/vCholerae/handler";
import { listeriaIsPreparationHandler } from "../preparations/listeriaIs/handler";
import { listeriaBamPreparationHandler } from "../preparations/listeriaBam/handler";
import { listeriaAphaPreparationHandler } from "../preparations/listeriaApha/handler";
import { listeriaIsoPreparationHandler } from "../preparations/listeriaIso/handler";
import { enterobacteriaceaeDetectionPreparationHandler } from "../preparations/enterobacteriaceaeDetection/handler";
import { ayushEColiPreparationHandler } from "../preparations/ayushEColi/handler";
import { ayushSalmonellaPreparationHandler } from "../preparations/ayushSalmonella/handler";
import { ayushPseudomonasPreparationHandler } from "../preparations/ayushPseudomonas/handler";
import { ayushSAureusPreparationHandler } from "../preparations/ayushSAureus/handler";
import { ipEColiPreparationHandler } from "../preparations/ipEColi/handler";
import { ipSalmonellaPreparationHandler } from "../preparations/ipSalmonella/handler";
import { ipPseudomonasPreparationHandler } from "../preparations/ipPseudomonas/handler";
import { ipSAureusPreparationHandler } from "../preparations/ipSAureus/handler";
import { mouldPresencePreparationHandler } from "../preparations/mouldPresence/handler";
import { coliformMfCocaPreparationHandler } from "../preparations/coliformMfCoca/handler";
import { eColiMfCocaPreparationHandler } from "../preparations/eColiMfCoca/handler";
import { eColiCcaCocaPreparationHandler } from "../preparations/eColiCcaCoca/handler";
import { tymMfCocaPreparationHandler } from "../preparations/tymMfCoca/handler";
import { salmonellaElisaPreparationHandler } from "../preparations/salmonellaElisa/handler";
import { eColiO157PreparationHandler } from "../preparations/eColiO157/handler";
import { shigellaAphaPreparationHandler } from "../preparations/shigellaApha/handler";
import { shigellaIsPreparationHandler } from "../preparations/shigellaIs/handler";
import { legionellaPreparationHandler } from "../preparations/legionella/handler";
import { alicyclobacillusPreparationHandler } from "../preparations/alicyclobacillus/handler";
import { coliformEcoliMfPreparationHandler } from "../preparations/coliformEcoliMf/handler";

// Multiple tube / MPN (shared engine: preparations/mpn)
import { coliformPresencePreparationHandler } from "../preparations/coliformPresence/handler";
import { eColiMpnPreparationHandler } from "../preparations/eColiMpn/handler";
import { faecalColiformMpnPreparationHandler } from "../preparations/faecalColiformMpn/handler";
import { salmonellaMpnPreparationHandler } from "../preparations/salmonellaMpn/handler";

// Sheet formula (shared engine: preparations/formula)
import { hrmAphaPreparationHandler } from "../preparations/hrmApha/handler";
import { hrmSmprPreparationHandler } from "../preparations/hrmSmpr/handler";
import { ropeSporePreparationHandler } from "../preparations/ropeSpore/handler";
import { planktonPreparationHandler } from "../preparations/plankton/handler";
import { coliphagePreparationHandler } from "../preparations/coliphage/handler";

// Packaged Drinking Water, sheet 47 (formula + detection engines)
import { pdwAmcPreparationHandler } from "../preparations/pdwAmc/handler";
import { pdwColiformPreparationHandler } from "../preparations/pdwColiform/handler";
import { pdwColiformVrblPreparationHandler } from "../preparations/pdwColiformVrbl/handler";
import { pdwEColiPreparationHandler } from "../preparations/pdwEColi/handler";
import { pdwSAureusPreparationHandler } from "../preparations/pdwSAureus/handler";
import { pdwFaecalStrepPreparationHandler } from "../preparations/pdwFaecalStrep/handler";
import { pdwFaecalStrepSbPreparationHandler } from "../preparations/pdwFaecalStrepSb/handler";
import { pdwPseudomonasPreparationHandler } from "../preparations/pdwPseudomonas/handler";
import { pdwSraPreparationHandler } from "../preparations/pdwSra/handler";
import { pdwSalmonellaPreparationHandler } from "../preparations/pdwSalmonella/handler";
import { pdwShigellaPreparationHandler } from "../preparations/pdwShigella/handler";
import { pdwVCholeraePreparationHandler } from "../preparations/pdwVCholerae/handler";
import { pdwVParahaemolyticusPreparationHandler } from "../preparations/pdwVParahaemolyticus/handler";
import { pdwYeastMouldPreparationHandler } from "../preparations/pdwYeastMould/handler";

/**
 * All Micro laboratory preparation handlers.
 * Add each new test here. The Micro UI registry derives its dropdown entries from this list.
 */
export const microPreparationRegistry: readonly PreparationHandler[] = [
  // Plate count
  tpcPreparationHandler,
  coliformCountPreparationHandler,
  hpcPreparationHandler,
  totalMesophilicPreparationHandler,
  proteolyticPreparationHandler,
  psychrophilicPreparationHandler,
  thermophilicPreparationHandler,
  acidProducingPreparationHandler,
  thermophilicSporePreparationHandler,
  coliformEcoliPreparationHandler,
  eColiPreparationHandler,
  faecalStreptoPreparationHandler,
  acidophilicPreparationHandler,
  sulphiteReducingPreparationHandler,
  sAureusPreparationHandler,
  bCereusPreparationHandler,
  tymPreparationHandler,
  cPerfringensPreparationHandler,
  cBotulinumPreparationHandler,
  pseudomonasPreparationHandler,
  enterobacteriaceaePreparationHandler,
  thermoduricPreparationHandler,
  lipolyticPreparationHandler,
  flatSourPreparationHandler,
  totalBacterialSporePreparationHandler,
  butyricPreparationHandler,
  ayushTamcPreparationHandler,
  ayushTymcPreparationHandler,
  ipTamcPreparationHandler,
  ipTymcPreparationHandler,
  guaiacolPreparationHandler,
  guaiacolYsgPreparationHandler,
  // Detection, Present / Absent
  eColiDetectionPreparationHandler,
  sAureusDetectionPreparationHandler,
  sAureusDetectionIsoPreparationHandler,
  salmonellaIsPreparationHandler,
  salmonellaIsoPreparationHandler,
  vibrioPreparationHandler,
  vibrioIsoPreparationHandler,
  vParahaemolyticusPreparationHandler,
  vCholeraePreparationHandler,
  listeriaIsPreparationHandler,
  listeriaBamPreparationHandler,
  listeriaAphaPreparationHandler,
  listeriaIsoPreparationHandler,
  enterobacteriaceaeDetectionPreparationHandler,
  ayushEColiPreparationHandler,
  ayushSalmonellaPreparationHandler,
  ayushPseudomonasPreparationHandler,
  ayushSAureusPreparationHandler,
  ipEColiPreparationHandler,
  ipSalmonellaPreparationHandler,
  ipPseudomonasPreparationHandler,
  ipSAureusPreparationHandler,
  mouldPresencePreparationHandler,
  coliformMfCocaPreparationHandler,
  eColiMfCocaPreparationHandler,
  eColiCcaCocaPreparationHandler,
  tymMfCocaPreparationHandler,
  salmonellaElisaPreparationHandler,
  eColiO157PreparationHandler,
  shigellaAphaPreparationHandler,
  shigellaIsPreparationHandler,
  legionellaPreparationHandler,
  alicyclobacillusPreparationHandler,
  coliformEcoliMfPreparationHandler,
  // Multiple tube / MPN
  coliformPresencePreparationHandler,
  eColiMpnPreparationHandler,
  faecalColiformMpnPreparationHandler,
  salmonellaMpnPreparationHandler,
  // Sheet formula
  hrmAphaPreparationHandler,
  hrmSmprPreparationHandler,
  ropeSporePreparationHandler,
  planktonPreparationHandler,
  coliphagePreparationHandler,
  // Packaged Drinking Water
  pdwAmcPreparationHandler,
  pdwColiformPreparationHandler,
  pdwColiformVrblPreparationHandler,
  pdwEColiPreparationHandler,
  pdwSAureusPreparationHandler,
  pdwFaecalStrepPreparationHandler,
  pdwFaecalStrepSbPreparationHandler,
  pdwPseudomonasPreparationHandler,
  pdwSraPreparationHandler,
  pdwSalmonellaPreparationHandler,
  pdwShigellaPreparationHandler,
  pdwVCholeraePreparationHandler,
  pdwVParahaemolyticusPreparationHandler,
  pdwYeastMouldPreparationHandler,
];
