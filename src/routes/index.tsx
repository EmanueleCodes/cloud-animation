import { createFileRoute } from '@tanstack/react-router'
import { useDialKit } from 'dialkit'
import {
  AnimatedCloud,
  DEFAULT_CLOUD_PARAMS,
  type CloudParams,
} from '#/components/AnimatedCloud'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const dial = useDialKit('Cloud', {
    renderMode: {
      type: 'select',
      options: [
        { value: 'filled', label: 'Filled' },
        { value: 'outline', label: 'Outline' },
        { value: 'outlineFill', label: 'Outline + Fill' },
      ],
      default: DEFAULT_CLOUD_PARAMS.renderMode,
    },
    displayScale: [0.55, 0.2, 1, 0.01],
    blobSize: [DEFAULT_CLOUD_PARAMS.blobSize, 40, 300],
    blobCount: [DEFAULT_CLOUD_PARAMS.blobCount, 4, 10, 1],
    orbitRadius: [DEFAULT_CLOUD_PARAMS.orbitRadius, 20, 180],
    orbitSpeed: [DEFAULT_CLOUD_PARAMS.orbitSpeed, 4, 24],
    scaleAmplitude: [DEFAULT_CLOUD_PARAMS.scaleAmplitude, 0, 0.3],
    color: '#FFFFFF',
    variation: {
      size: [DEFAULT_CLOUD_PARAMS.variation.size, 0, 1],
      radius: [DEFAULT_CLOUD_PARAMS.variation.radius, 0, 40],
      scaleAmplitude: [
        DEFAULT_CLOUD_PARAMS.variation.scaleAmplitude,
        0,
        0.15,
      ],
    },
    radiusOscillation: {
      amplitude: [DEFAULT_CLOUD_PARAMS.radiusOscillation.amplitude, 0, 80],
      speed: [DEFAULT_CLOUD_PARAMS.radiusOscillation.speed, 0.5, 12],
    },
    outline: {
      fillColor: '#ffffff',
      innerColor: '#c8c8c8',
      outerColor: '#ffffff',
      fillOpacity: [0, 0, 1, 0.01],
      innerOpacity: [0.3, 0, 1, 0.01],
      outerOpacity: [1, 0, 1, 0.01],
      innerWidth: [0.7, 0.25, 4],
      outerWidth: [0.7, 0.25, 4],
    },
    tail: {
      blobCount: [DEFAULT_CLOUD_PARAMS.tail.blobCount, 0, 5, 1],
      blobSize: [DEFAULT_CLOUD_PARAMS.tail.blobSize, 8, 120],
      scaleAmplitude: [DEFAULT_CLOUD_PARAMS.tail.scaleAmplitude, 0, 0.3],
      positionAmplitude: [
        DEFAULT_CLOUD_PARAMS.tail.positionAmplitude,
        0,
        24,
      ],
      oscillationSpeed: [
        DEFAULT_CLOUD_PARAMS.tail.oscillationSpeed,
        0.5,
        12,
      ],
    },
  }) as CloudParams & { displayScale: number }

  const params: CloudParams = {
    renderMode: dial.renderMode,
    blobSize: dial.blobSize,
    blobCount: dial.blobCount,
    orbitRadius: dial.orbitRadius,
    orbitSpeed: dial.orbitSpeed,
    scaleAmplitude: dial.scaleAmplitude,
    color: dial.color,
    variation: dial.variation,
    radiusOscillation: dial.radiusOscillation,
    duoMode: DEFAULT_CLOUD_PARAMS.duoMode,
    outline: dial.outline,
    tail: {
      ...DEFAULT_CLOUD_PARAMS.tail,
      blobCount: dial.tail.blobCount,
      blobSize: dial.tail.blobSize,
      scaleAmplitude: dial.tail.scaleAmplitude,
      positionAmplitude: dial.tail.positionAmplitude,
      oscillationSpeed: dial.tail.oscillationSpeed,
    },
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#141414]">
      <AnimatedCloud
        params={params}
        displayScale={dial.displayScale}
        filled={dial.renderMode === 'outlineFill'}
      />
    </div>
  )
}
