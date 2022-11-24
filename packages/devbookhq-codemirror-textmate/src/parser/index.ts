import {
  IGrammar,
  INITIAL,
  IToken,
  StateStack,
} from 'vscode-textmate'
import {
  StreamLanguage,
  StreamParser,
  StringStream,
} from '@codemirror/language'
import { TokenMatcher } from './tokenMapping'
import type { parseRawGrammar } from 'vscode-textmate'

export type IRawGrammar = ReturnType<typeof parseRawGrammar>

export interface ParserState {
  ruleStack: StateStack
  tokensCache: IToken[]
}

function createTokenizer(grammar: IGrammar) {
  const tokenMatcher = new TokenMatcher()

  return (stream: StringStream, state: ParserState): string => {
    const {
      pos,
      string: str,
    } = stream

    if (pos === 0) {
      const {
        ruleStack,
        tokens,
      } = grammar.tokenizeLine(str, state.ruleStack)
      state.tokensCache = tokens.slice()
      state.ruleStack = ruleStack
    }

    const { tokensCache } = state
    const nextToken = tokensCache.shift()

    if (!nextToken) {
      stream.skipToEnd()
      return ''
    }

    const {
      endIndex,
      scopes,
    } = nextToken
    stream.eatWhile(() => stream.pos < endIndex)

    return tokenMatcher.firstCMToken(scopes) || ''
  }
}

function createStreamParser(scopeName: string, grammar: IGrammar): StreamParser<ParserState> {
  const tokenizer = createTokenizer(grammar)
  return {
    name: scopeName,
    copyState: (state) => ({
      ruleStack: state.ruleStack.clone(),
      tokensCache: [...state.tokensCache],
    }),
    startState: () => ({
      ruleStack: INITIAL,
      tokensCache: [],
    }),
    token: tokenizer,
  }
}

export function createLanguage(scopeName: string, grammar: IGrammar) {
  const streamParser = createStreamParser(scopeName, grammar)
  return StreamLanguage.define(streamParser)
}
