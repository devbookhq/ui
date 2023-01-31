import { LanguageSetup } from '@devbookhq/code-editor'
// import { StreamLanguage } from '@codemirror/language'
import { javascript } from '@codemirror/lang-javascript'
import { json } from '@codemirror/lang-json'
// import { java } from '@codemirror/lang-java'
// import { php } from '@codemirror/lang-php'
// import { python } from '@codemirror/lang-python'
// import { rust } from '@codemirror/lang-rust'

// import { go as goMode } from '@codemirror/legacy-modes/mode/go'
// import { perl as perlMode } from '@codemirror/legacy-modes/mode/perl'
// import { shell as shellMode } from '@codemirror/legacy-modes/mode/shell'
// import { toml as tomlMode } from '@codemirror/legacy-modes/mode/toml'
// import { vb as vbMode } from '@codemirror/legacy-modes/mode/vb'

// const go = StreamLanguage.define(goMode)
// const shell = StreamLanguage.define(shellMode)
// const perl = StreamLanguage.define(perlMode)
// const toml = StreamLanguage.define(tomlMode)
// const vb = StreamLanguage.define(vbMode)

export enum LanguageID {
  // Shell = 'shell',
  TypeScript = 'typescript',
  // Python = 'python',
  // Php = 'php',
  // Golang = 'go',
  // Rust = 'rust',
  // Perl = 'perl',
  // Java = 'java',
  // VisualBasic = 'visualBasic',
  // Toml = 'toml',
  Json = 'json',
}

export const supportedLanguages: LanguageSetup[] = [
  // {
  //   languageID: LanguageID.Shell,
  //   fileExtensions: ['.sh'],
  //   languageExtensions: shell,
  // },
  {
    languageID: LanguageID.TypeScript,
    fileExtensions: ['.js', '.ts'],
    languageExtensions: javascript({ typescript: true }),
  },
  // {
  //   languageID: LanguageID.Python,
  //   fileExtensions: ['.py'],
  //   languageExtensions: python(),
  // },
  // {
  //   languageID: LanguageID.Php,
  //   fileExtensions: ['.php'],
  //   languageExtensions: php(),
  // },
  // {
  //   languageID: LanguageID.Golang,
  //   fileExtensions: ['.go'],
  //   languageExtensions: go,
  // },
  // {
  //   languageID: LanguageID.Rust,
  //   fileExtensions: ['.rs'],
  //   languageExtensions: rust(),
  // },
  // {
  //   languageID: LanguageID.Perl,
  //   fileExtensions: ['.pl'],
  //   languageExtensions: perl,
  // },
  // {
  //   languageID: LanguageID.Java,
  //   fileExtensions: ['.java'],
  //   languageExtensions: java(),
  // },
  // {
  //   languageID: LanguageID.VisualBasic,
  //   fileExtensions: ['.vb'],
  //   languageExtensions: vb,
  // },
  // {
  //   languageID: LanguageID.Toml,
  //   fileExtensions: ['.toml'],
  //   languageExtensions: toml,
  // },
  {
    languageID: LanguageID.Json,
    fileExtensions: ['.json'],
    languageExtensions: json(),
  },
]
