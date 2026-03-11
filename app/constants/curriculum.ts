import {
  AudioWaveformIcon,
  BrainCircuitIcon,
  BookOpenIcon,
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
    slug: 'mechanical-waves-ultrasound',
    title: 'Tuần 1–2',
    subtitle: 'Sóng cơ học, sóng siêu âm & ứng dụng (NDE)',
    icon: WavesIcon,
    category: 'physics',
    progress: 0,
    objective:
      'Tìm hiểu về sóng cơ học, sóng siêu âm và ứng dụng trong kiểm tra không phá huỷ (NDE). Hiểu được sóng, vẽ được dispersion curve.',
    content: [
      'Tổng quan sóng cơ học và sóng siêu âm',
      'Ứng dụng sóng siêu âm trong NDE (Non-Destructive Evaluation)',
      'Buổi đầu: Lập trình bài toán sóng Rayleigh',
      'Giải bài toán dispersion curve',
    ],
    exercise:
      'Lập trình Python mô phỏng sóng Rayleigh và vẽ dispersion curve',
  },
  {
    slug: 'ultrasound-seminar',
    title: 'Tuần 3–4',
    subtitle: 'Seminar sóng siêu âm & ứng dụng',
    icon: AudioWaveformIcon,
    category: 'physics',
    progress: 0,
    objective:
      'Seminar trình bày về sóng siêu âm và ứng dụng, kết hợp với lập trình minh hoạ.',
    content: [
      'Chuẩn bị seminar về sóng siêu âm',
      'Trình bày ứng dụng sóng siêu âm trong thực tế',
      'Kết hợp code minh hoạ trong seminar',
      'Thảo luận và phản biện',
    ],
    exercise:
      'Chuẩn bị và trình bày seminar về sóng siêu âm, kèm code minh hoạ',
  },
  {
    slug: 'wave-propagation-isotropic',
    title: 'Tuần 5–6',
    subtitle: 'Nguyên lý truyền sóng cơ học & Isotropic',
    icon: BookOpenIcon,
    category: 'physics',
    progress: 0,
    objective:
      'Nhập môn nguyên lý truyền sóng cơ học trong vật liệu isotropic. Nắm vững các khái niệm toán-lý nền tảng.',
    content: [
      'Tensor ứng suất và biến dạng',
      'Phương trình đạo hàm riêng (PDE) trong truyền sóng',
      'Vật liệu isotropic và các tính chất cơ học',
      'Mối liên hệ ứng suất–biến dạng (Hooke\'s Law)',
    ],
    exercise:
      'Giải bài tập về tensor, ứng suất biến dạng và đạo hàm riêng áp dụng trong truyền sóng',
  },
  {
    slug: 'intro-ai',
    title: 'Tuần 7–8',
    subtitle: 'Tìm hiểu về AI',
    icon: BrainCircuitIcon,
    category: 'ai',
    progress: 0,
    objective:
      'Bắt đầu tìm hiểu về trí tuệ nhân tạo (AI), làm quen với các khái niệm cơ bản và công cụ Machine Learning.',
    content: [
      'Tổng quan về AI và Machine Learning',
      'Các thuật toán ML cơ bản (regression, classification)',
      'Giới thiệu neural networks',
      'Công cụ: Python, NumPy, PyTorch/TensorFlow cơ bản',
    ],
    exercise:
      'Thực hành các bài toán ML cơ bản với Python',
  },
]

export const RADAR_DATA = {
  labels: ['Sóng cơ học', 'Siêu âm NDE', 'Truyền sóng', 'AI/ML'],
  values: [0, 0, 0, 0],
}

export const CATEGORIES = [
  {
    name: 'Physics',
    description:
      'Sóng cơ học, sóng Rayleigh, dispersion curve, truyền sóng trong vật liệu isotropic, tensor ứng suất biến dạng',
    color: 'text-blue-500',
  },
  {
    name: 'Artificial Intelligence',
    description:
      'Machine Learning cơ bản, neural networks, Python, NumPy, PyTorch',
    color: 'text-purple-500',
  },
  {
    name: 'Tools',
    description: 'Python, NumPy, SciPy, Matplotlib, seminar & trình bày',
    color: 'text-emerald-500',
  },
]
