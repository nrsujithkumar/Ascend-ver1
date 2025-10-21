import { AvatarStellar } from './AvatarSteller';
import { AvatarGeo } from './AvatarGeo';
import { AvatarPulse } from './AvatarPulse';
import { AvatarNova } from './AvatarNova';
import { AvatarSpire } from './AvatarSpire';
import { AvatarLotus } from './AvatarLotus';
import { AvatarOrbit } from './AvatarOrbit';
import { AvatarSpikes } from './AvatarSpikes';
import { AvatarWeave } from './AvatarWeave';
import { AvatarCrystal } from './AvatarCrystal';

// We export them as a map to easily look them up by name
export const AVATAR_MAP = {
    'Stellar': AvatarStellar,
    'Geo': AvatarGeo,
    'Pulse': AvatarPulse,
    'Nova': AvatarNova,
    'Spire': AvatarSpire,
    'Lotus': AvatarLotus,
    'Orbit': AvatarOrbit,
    'Spikes': AvatarSpikes,
    'Weave': AvatarWeave,
    'Crystal': AvatarCrystal,
};