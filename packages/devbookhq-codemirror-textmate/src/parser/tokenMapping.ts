import { LRUCache } from 'vscode-languageserver-protocol'

// We may want to use lezer tags from here
// https://lezer.codemirror.net/docs/ref/#highlight.Tag
export enum CMToken {
  Atom = 'atom',
  Attribute = 'attribute',
  Bracket = 'bracket',
  Builtin = 'builtin',
  Comment = 'comment',
  Def = 'def',
  Error = 'error',
  Header = 'header',
  HR = 'hr',
  Keyword = 'keyword',
  Link = 'link',
  Meta = 'meta',
  Number = 'number',
  Operator = 'operator',
  Property = 'property',
  Qualifier = 'qualifier',
  Quote = 'quote',
  String = 'string',
  String2 = 'string-2',
  Tag = 'tag',
  Type = 'type',
  Variable = 'variable',
  Variable2 = 'variable-2',
  // TODO: Find a proper distinct token for variable 3
  Variable3 = 'variable-2',
}

interface ScopeSegment {
  $?: CMToken
  [scope: string]: ScopeSegment | CMToken | undefined
}

// The naming conventions are under the 'Naming Conventions' heading at
// https://macromates.com/manual/en/language_grammars
const tmToCm: ScopeSegment = {
  comment: { $: CMToken.Comment },

  constant: {
    // TODO: Revision
    $: CMToken.Def,
    character: { escape: { $: CMToken.String2 } },
    language: { $: CMToken.Atom },
    numeric: { $: CMToken.Number },
    other: {
      email: { link: { $: CMToken.Link } },
      symbol: {
        // TODO: Revision
        $: CMToken.Def,
      },
    },
  },

  entity: {
    name: {
      class: { $: CMToken.Def },
      function: { $: CMToken.Def },
      tag: { $: CMToken.Tag },
      type: {
        $: CMToken.Variable2,
        class: { $: CMToken.Variable },
      },
    },
    other: {
      'attribute-name': { $: CMToken.Attribute },
      'inherited-class': {
        // TODO: Revision
        $: CMToken.Def,
      },
    },
    support: {
      function: {
        // TODO: Revision
        $: CMToken.Def,
      },
    },
  },

  keyword: {
    $: CMToken.Keyword,
    operator: { $: CMToken.Operator },
    other: { 'special-method': CMToken.Def },
  },
  punctuation: {
    $: CMToken.Operator,
    definition: {
      comment: { $: CMToken.Comment },
      tag: { $: CMToken.Bracket },
      // 'template-expression': {
      //     $: CodeMirrorToken.Operator,
      // },
    },
    // terminator: {
    //     $: CodeMirrorToken.Operator,
    // },
  },

  storage: { $: CMToken.Keyword },

  string: {
    $: CMToken.String,
    regexp: { $: CMToken.String2 },
  },

  support: {
    class: { $: CMToken.Def },
    constant: { $: CMToken.Variable2 },
    function: { $: CMToken.Def },
    type: { $: CMToken.Type },
    variable: {
      $: CMToken.Variable2,
      property: { $: CMToken.Property },
    },
  },

  variable: {
    $: CMToken.Def,
    language: {
      // TODO: Revision
      $: CMToken.Variable3,
    },
    other: {
      object: {
        $: CMToken.Variable,
        property: { $: CMToken.Property },
      },
      property: { $: CMToken.Property },
    },
    parameter: { $: CMToken.Def },
  },
} as const

export class TokenMatcher {
  private readonly cache = new LRUCache<string, CMToken>(2000)
  private static readonly dotRE = /\./

  firstCMToken(scopes: string[]) {
    let i = scopes.length - 1
    let cmToken = null
    do {
      cmToken = this.toCMToken(scopes[i--])
    } while (!cmToken && i >= 0)

    return cmToken
  }

  private toCMToken(scope: string) {
    if (!this.cache.has(scope)) {
      const subtree = TokenMatcher.walk(scope.split(TokenMatcher.dotRE))
      if (subtree) {
        this.cache.set(scope, subtree)
      }
    }
    return this.cache.get(scope)
  }

  private static walk(scopeSegments: string[], tree = tmToCm): CMToken | null {
    const first = scopeSegments.shift()
    if (first === undefined) return null

    const node = tree[first]

    if (node && typeof node === 'object') {
      return TokenMatcher.walk(scopeSegments, node) || node.$ || null
    }
    return null
  }
}
