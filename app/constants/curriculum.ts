import {
  AudioWaveformIcon,
  BrainCircuitIcon,
  CpuIcon,
  NetworkIcon,
  SignalIcon,
  WavesIcon,
} from 'lucide-vue-next'
import type { Component } from 'vue'

export interface CurriculumModule {
  slug: string
  title: string
  subtitle: string
  icon: Component
  category: 'physics' | 'ai' | 'tools'
  progress: number
  objective: string
  content: string[]
  exercise: string
}

export const CURRICULUM: CurriculumModule[] = [
  {
    slug: 'lamb-waves',
    title: 'Tháng 1–2',
    subtitle: 'Lamb Waves',
    icon: WavesIcon,
    category: 'physics',
    progress: 80,
    objective: 'Hiểu propagation của sóng Lamb trong tấm kim loại.',
    content: [
      'Rayleigh-Lamb equation',
      'Mode S0 và A0',
      'Dispersion curves',
    ],
    exercise: 'Viết code Python vẽ dispersion curves cho tấm nhôm 2mm',
  },
  {
    slug: 'wave-scattering',
    title: 'Tháng 3',
    subtitle: 'Wave Scattering',
    icon: SignalIcon,
    category: 'physics',
    progress: 70,
    objective: 'Hiểu tán xạ khi sóng gặp khuyết tật.',
    content: [
      'Circular cavity scattering',
      'Angular scattering pattern A(θ)',
      'Reciprocity theorem',
    ],
    exercise: 'Mô phỏng tán xạ lỗ hổng 3mm',
  },
  {
    slug: 'signal-processing',
    title: 'Tháng 4',
    subtitle: 'Signal Processing',
    icon: AudioWaveformIcon,
    category: 'tools',
    progress: 60,
    objective: 'Trích xuất đặc trưng tín hiệu ultrasonic.',
    content: [
      'FFT',
      'Noise filtering',
      'Feature extraction',
    ],
    exercise: 'Xây dataset 1000 scattering samples',
  },
  {
    slug: 'cnn',
    title: 'Tháng 5',
    subtitle: 'Deep Learning – CNN',
    icon: CpuIcon,
    category: 'ai',
    progress: 50,
    objective: 'Dùng CNN nhận diện khuyết tật.',
    content: [
      '1D CNN architecture',
      'Input: Raw ultrasonic signals',
      'Output: Defect position và defect size',
    ],
    exercise: 'Huấn luyện CNN trên dataset tín hiệu ultrasonic',
  },
  {
    slug: 'lstm',
    title: 'Tháng 6',
    subtitle: 'LSTM Wave Prediction',
    icon: NetworkIcon,
    category: 'ai',
    progress: 40,
    objective: 'Phân tích propagation theo thời gian.',
    content: [
      'LSTM architecture',
      'Sequence-to-sequence prediction',
      'Time-series wave data',
    ],
    exercise: 'Dự đoán attenuation của sóng',
  },
  {
    slug: 'pinns',
    title: 'Capstone',
    subtitle: 'Physics Informed Neural Networks',
    icon: BrainCircuitIcon,
    category: 'ai',
    progress: 30,
    objective: 'Kết hợp physics vào neural network.',
    content: [
      'Data Loss + Physics Loss',
      'PDE-constrained optimization',
      'UMI LAB defect prediction system',
    ],
    exercise: 'Xây UMI LAB defect prediction system hoàn chỉnh',
  },
]

export const RADAR_DATA = {
  labels: ['Physics', 'DSP', 'ML', 'CNN', 'LSTM', 'PINNs'],
  values: [80, 70, 60, 50, 40, 30],
}

export const CATEGORIES = [
  {
    name: 'Physics',
    description: 'Elastic waves, Lamb waves, Wave scattering, Reciprocity theorem',
    color: 'text-blue-500',
  },
  {
    name: 'Artificial Intelligence',
    description: 'CNN, LSTM, Physics Informed Neural Networks',
    color: 'text-purple-500',
  },
  {
    name: 'Tools',
    description: 'Python, NumPy, SciPy, Matplotlib, PyTorch',
    color: 'text-emerald-500',
  },
]
