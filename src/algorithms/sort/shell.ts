import type { AlgorithmDefinition } from '../types'
import { randomArray } from '@/utils/array'

export const shellSort: AlgorithmDefinition = {
  meta: {
    id: 'shell-sort',
    name: '希尔排序',
    category: 'sort',
    categoryLabel: '排序',
    summary: '按增量分组进行插入排序，逐步缩小增量',
    complexity: { time: 'O(n log n)', timeBest: 'O(n log n)', timeWorst: 'O(n²)', space: 'O(1)' },
    stable: false,
    inPlace: true,
  },
  dataShape: { kind: 'array', defaultSize: 30, min: 1, max: 99 },
  visualType: 'linear',

  generateData: () => randomArray(30, 1, 99),

  generator: function* (data: number[]) {
    const arr = [...data]
    const n = arr.length
    let gap = Math.floor(n / 2)
    while (gap > 0) {
      yield { type: 'mark', targets: [], description: `增量 gap = ${gap}` }
      for (let i = gap; i < n; i++) {
        const temp = arr[i]
        yield { type: 'mark', targets: [i], description: `取出 arr[${i}] = ${temp}` }
        let j = i
        while (j >= gap) {
          yield { type: 'compare', targets: [j - gap, j], description: `比较 arr[${j - gap}] 和 ${temp}` }
          if (arr[j - gap] > temp) {
            arr[j] = arr[j - gap]
            yield { type: 'set', targets: [j], value: arr[j - gap], description: `arr[${j - gap}] 后移到位置 ${j}` }
            j -= gap
          } else {
            break
          }
        }
        arr[j] = temp
        yield { type: 'set', targets: [j], value: temp, description: `${temp} 插入到位置 ${j}` }
      }
      gap = Math.floor(gap / 2)
    }
    yield { type: 'done', targets: [] }
  },

  pseudoCode: [
    'gap = n // 2',
    'while gap > 0',
    '  for i = gap to n-1',
    '    temp = arr[i]',
    '    j = i',
    '    while j >= gap and arr[j-gap] > temp',
    '      arr[j] = arr[j-gap]',
    '      j -= gap',
    '    arr[j] = temp',
    '  gap //= 2',
  ],
}
