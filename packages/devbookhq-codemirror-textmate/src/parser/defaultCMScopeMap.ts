import { ScopeSegment } from './scopeMapper'

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

// The naming conventions are under the 'Naming Conventions' heading at
// https://macromates.com/manual/en/language_grammars
export const defaultCMScopeMap: ScopeSegment<CMToken> = {
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
