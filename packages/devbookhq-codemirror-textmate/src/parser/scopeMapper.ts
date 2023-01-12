import { LRUCache } from 'vscode-languageserver-protocol'

export interface ScopeSegment<T extends string> {
  $?: T
  [scope: string]: ScopeSegment<T> | T | undefined
}

export class ScopeMapper<T extends string> {
  private readonly cache = new LRUCache<string, T>(2000)
  private static readonly dotRE = /\./

  constructor(private readonly scopeMap: ScopeSegment<T>) { }

  firstMatchingToken(scopes: string[]) {
    let i = scopes.length - 1
    let cmToken = null
    do {
      cmToken = this.toToken(scopes[i--])
    } while (!cmToken && i >= 0)

    return cmToken
  }

  private toToken(scope: string) {
    if (!this.cache.has(scope)) {
      const subtree = this.walk(scope.split(ScopeMapper.dotRE))
      if (subtree) {
        this.cache.set(scope, subtree)
      }
    }
    return this.cache.get(scope)
  }

  private walk(scopeSegments: string[], mapping = this.scopeMap): T | null {
    const first = scopeSegments.shift()
    if (first === undefined) return null

    const node = mapping[first]

    if (node && typeof node === 'object') {
      return this.walk(scopeSegments, node) || node.$ || null
    }
    return null
  }
}
