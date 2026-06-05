import type { CloudParams } from './types'

/** Sensible defaults for the cloud animation demo. */
export const DEFAULT_CLOUD_PARAMS: CloudParams = {
    renderMode: 'filled',
    blobSize: 190,
    blobCount: 6,
    orbitRadius: 70,
    orbitSpeed: 12,
    scaleAmplitude: 0.05,
    color: '#E8F4FC',
    variation: {
        size: 0.04,
        radius: 3,
        scaleAmplitude: 0.01,
    },
    radiusOscillation: {
        amplitude: 14,
        speed: 2,
    },
    duoMode: false,
    outline: {
        fillColor: '#E8F4FC',
        innerColor: '#1F1F1F',
        outerColor: '#FFFFFF',
        fillOpacity: 1,
        innerOpacity: 1,
        outerOpacity: 1,
        innerWidth: 1.2,
        outerWidth: 1,
    },
    tail: {
        blobCount: 2,
        blobSize: 47,
        scaleAmplitude: 0.08,
        positionAmplitude: 5,
        oscillationSpeed: 2,
        bigBlob: { x: -150, y: 150 },
        smallBlob: { x: -130, y: 210 },
        handle1: { x: -170, y: 190 },
        handle2: { x: -130, y: 208 },
    },
}
