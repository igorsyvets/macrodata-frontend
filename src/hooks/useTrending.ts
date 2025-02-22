import { useQuery } from '@tanstack/react-query'
import { Topic } from '../types/types'

const useTranding = () => {
  const getData = () => {
    return sampleData
  }

  const request = useQuery<Topic[]>({
    queryKey: ['trending'],
    queryFn: async () => {
      return sampleData
    },
  })

  return { ...request, data: request.data ?? [] }
}

export default useTranding

const sampleData: Topic[] = [
  {
    id: '1',
    topic: 'iPhone 16e Launch',
    count: 125000,
  },
  {
    id: '2',
    topic: 'Apple Intelligence in China',
    count: 98000,
  },
  {
    id: '3',
    topic: 'AI Partnerships (Alibaba/Baidu)',
    count: 87000,
  },
  {
    id: '4',
    topic: 'iPhone SE Update',
    count: 65000,
  },
  {
    id: '5',
    topic: 'Stock Valuation Concerns',
    count: 52000,
  },
  {
    id: '6',
    topic: 'New Low-Cost iPhone Strategy',
    count: 48000,
  },
  {
    id: '7',
    topic: 'Apple’s 5G Modem Debut',
    count: 39000,
  },
  {
    id: '8',
    topic: 'Innovation Pace Debate',
    count: 34000,
  },
]
