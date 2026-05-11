import type { AlgorithmDefinition } from '../types'

function randomBrackets(length: number): string[] {
  // Generate a valid sequence then shuffle it slightly
  const stack: string[] = []
  const open = ['(', '[', '{']
  const map: Record<string, string> = { '(': ')', '[': ']', '{': '}' }

  let result: string[] = []
  for (let i = 0; i < length; i++) {
    if (Math.random() > 0.5 && stack.length > 0) {
      result.push(map[stack.pop()!])
    } else if (stack.length < length - i) {
      const ch = open[Math.floor(Math.random() * 3)]
      stack.push(ch)
      result.push(ch)
    } else {
      result.push(map[stack.pop()!])
    }
  }
  while (stack.length > 0) {
    result.push(map[stack.pop()!])
  }
  return result.slice(0, length)
}

export const bracketMatch: AlgorithmDefinition = {
  meta: {
    id: 'bracket-match',
    name: '栈 — 括号匹配',
    category: 'list',
    categoryLabel: '线性结构',
    summary: '使用栈检查括号字符串是否合法匹配',
    complexity: { time: 'O(n)', space: 'O(n)' },
  },
  dataShape: { kind: 'array', defaultSize: 12, min: 1, max: 99 },
  visualType: 'stack',

  generateData: () => {
    const chars = randomBrackets(12)
    return chars.map(c => c.charCodeAt(0))
  },

  generator: function* (data: number[]) {
    const arr = [...data]
    const map: Record<number, number> = { 40: 41, 91: 93, 123: 125 }
    const openChars = new Set([40, 91, 123])
    const closeChars = new Set([41, 93, 125])
    const stack: number[] = []

    for (let i = 0; i < arr.length; i++) {
      const ch = arr[i]
      const charStr = String.fromCharCode(ch)

      yield { type: 'compare', targets: [i], description: `扫描第 ${i} 个字符: '${charStr}'`, extra: { stack: [...stack] } }

      if (openChars.has(ch)) {
        stack.push(ch)
        yield { type: 'visit', targets: [i], description: `'${charStr}' 是左括号, 压栈 (栈大小: ${stack.length})`, extra: { stack: [...stack] } }
      } else if (closeChars.has(ch)) {
        if (stack.length === 0) {
          yield { type: 'mark', targets: [i], description: `'${charStr}' 是右括号但栈为空, 不匹配!`, extra: { stack: [...stack] } }
          yield { type: 'done', targets: [], description: `位置 ${i} 的 '${charStr}' 没有匹配的左括号`, extra: { stack: [...stack] } }
          return
        }
        const top = stack[stack.length - 1]
        if (map[top] === ch) {
          stack.pop()
          yield { type: 'mark', targets: [i], description: `'${charStr}' 与栈顶 '${String.fromCharCode(top)}' 匹配, 出栈 (栈大小: ${stack.length})`, extra: { stack: [...stack] } }
        } else {
          yield { type: 'mark', targets: [i], description: `'${charStr}' 与栈顶 '${String.fromCharCode(top)}' 不匹配!`, extra: { stack: [...stack] } }
          yield { type: 'done', targets: [], description: `位置 ${i} 的 '${charStr}' 与期望的 '${String.fromCharCode(map[top])}' 不匹配`, extra: { stack: [...stack] } }
          return
        }
      }
    }

    if (stack.length === 0) {
      yield { type: 'done', targets: [], description: '所有括号匹配成功!', extra: { stack: [...stack] } }
    } else {
      yield { type: 'done', targets: [], description: `栈中剩余 ${stack.length} 个未匹配的左括号`, extra: { stack: [...stack] } }
    }
  },

  pseudoCode: [
    'function isValid(s):',
    '  stack = []',
    '  map = { "(": ")", "[": "]", "{": "}" }',
    '  for c in s:',
    '    if c in map:',
    '      stack.push(c)',
    '    else:',
    '      if stack.empty(): return false',
    '      top = stack.pop()',
    '      if map[top] != c: return false',
    '  return stack.empty()',
  ],
}
