export interface TreeNode {
  id: number
  value: number
  left: number | null
  right: number | null
}

export interface TreeData {
  nodes: TreeNode[]
  rootId: number
}

export function randomBST(nodeCount: number, min: number, max: number): TreeData {
  const values = Array.from({ length: nodeCount }, () =>
    Math.floor(Math.random() * (max - min + 1)) + min
  ).sort((a, b) => a - b)

  const nodes: TreeNode[] = []

  function build(l: number, r: number): number | null {
    if (l > r) return null
    const mid = Math.floor((l + r) / 2)
    const id = nodes.length
    nodes.push({ id, value: values[mid], left: null, right: null })
    nodes[id].left = build(l, mid - 1)
    nodes[id].right = build(mid + 1, r)
    return id
  }

  const rootId = build(0, values.length - 1)
  return { nodes, rootId: rootId ?? 0 }
}

export function treeFromArray(arr: number[]): TreeData {
  const nodes: TreeNode[] = arr.map((val, i) => ({
    id: i,
    value: val,
    left: 2 * i + 1 < arr.length ? 2 * i + 1 : null,
    right: 2 * i + 2 < arr.length ? 2 * i + 2 : null,
  }))
  return { nodes, rootId: 0 }
}
