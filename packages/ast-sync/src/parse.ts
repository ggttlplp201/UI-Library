import { parse as babelParse } from '@babel/parser'
import * as recast from 'recast'

/**
 * recast + @babel/parser plumbing shared by every transform. recast reprints
 * only the AST nodes a transform actually touched, so untouched user code
 * keeps its original formatting — export diffs stay minimal (plan §5.7).
 */
export type ModuleAst = ReturnType<typeof recast.parse>

export function parseModule(source: string): ModuleAst {
  return recast.parse(source, {
    parser: {
      parse: (src: string) =>
        babelParse(src, {
          sourceType: 'module',
          plugins: ['typescript', 'jsx'],
          // recast needs the token stream to reuse original formatting
          tokens: true,
        }),
    },
  })
}

export function printModule(ast: ModuleAst): string {
  // Default (double) quoting: new nodes are JSX attributes / style objects,
  // where double quotes are the convention.
  return recast.print(ast).code
}
