import type { AlgorithmDefinition, StepEvent } from '../types'
import { randomArray } from '@/utils/array'

export const radixSort: AlgorithmDefinition = {
  meta: {
    id: 'radix-sort',
    name: '基数排序',
    category: 'sort',
    categoryLabel: '排序',
    summary: '按位数从低到高（或从高到低）进行稳定排序',
    complexity: { time: 'O(d*(n+k))', timeBest: 'O(d*(n+k))', timeWorst: 'O(d*(n+k))', space: 'O(n+k)' },
    stable: true,
    inPlace: false,
  },
  dataShape: { kind: 'array', defaultSize: 30, min: 1, max: 999 },
  visualType: 'linear',

  generateData: () => randomArray(30, 1, 999),

  generator: function* (data: number[]) {
    const arr = [...data]
    const n = arr.length
    const max = arr.length > 0 ? Math.max(...arr) : 0

    function* countingSortForDigit(exp: number): Generator<StepEvent> {
      const output = new Array(n).fill(0)
      const count = new Array(10).fill(0)

      for (let i = 0; i < n; i++) {
        const digit = Math.floor(arr[i] / exp) % 10
        count[digit]++
        yield { type: 'mark', targets: [i], description: `arr[${i}] = ${arr[i]} 的第 ${exp} 位是 ${digit}` }
      }

      for (let i = 1; i < 10; i++) count[i] += count[i - 1]

      for (let i = n - 1; i >= 0; i--) {
        const digit = Math.floor(arr[i] / exp) % 10
        output[count[digit] - 1] = arr[i]
        count[digit]--
      }

      for (let i = 0; i < n; i++) {
        arr[i] = output[i]
        yield { type: 'set', targets: [i], value: output[i], description: `arr[${i}] = ${output[i]}` }
      }
    }

    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
      yield { type: 'mark', targets: [], description: `按第 ${exp} 位排序` }
      yield* countingSortForDigit(exp)
    }
    yield { type: 'done', targets: [] }
  },

  pseudoCode: [
    'max = max(arr)',
    'for exp = 1; max//exp > 0; exp *= 10',
    '  count = array of size 10 filled with 0',
    '  for i = 0 to n-1',
    '    digit = (arr[i] // exp) % 10',
    '    count[digit]++',
    '  for i = 1 to 9',
    '    count[i] += count[i-1]',
    '  for i = n-1 down to 0',
    '    digit = (arr[i] // exp) % 10',
    '    output[count[digit]-1] = arr[i]',
    '    count[digit]--',
    '  for i = 0 to n-1',
    '    arr[i] = output[i]',
  ],
}
