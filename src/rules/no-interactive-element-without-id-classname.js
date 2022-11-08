/**
 * @fileoverview Disallow inherently interactive elements to be assigned
 * non-interactive roles.
 * @author Jesse Beach
 * @flow
 */

// ----------------------------------------------------------------------------
// Rule Definition
// ----------------------------------------------------------------------------

import type { JSXIdentifier } from 'ast-types-flow';
import { propName } from 'jsx-ast-utils';
import type { ESLintContext, ESLintVisitorSelectorConfig } from '../../flow/eslint';
import type { ESLintJSXAttribute } from '../../flow/eslint-jsx';

const errorMessage = 'Interactive elements should have either an id or className attribute.';

export default ({
  meta: {
    docs: {
      description: 'Require interactive elements to have either an id or className attribute.',
      url: 'https://github.com/jsx-eslint/eslint-plugin-mea/tree/HEAD/docs/rules/no-interactive-element-without-id-classname.md',
    },
    schema: [{
      type: 'object',
      additionalProperties: {
        type: 'array',
        items: {
          type: 'string',
        },
        uniqueItems: true,
      },
    }],
  },

  create: (context: ESLintContext): ESLintVisitorSelectorConfig => ({
    JSXAttribute: (attribute: ESLintJSXAttribute) => {
      const attributeName: JSXIdentifier = propName(attribute);
      // $FlowFixMe: [TODO] Mark propName as a JSXIdentifier, not a string.
      if (attributeName !== 'onClick') {
        return;
      }

      const otherAttributes = attribute.parent.attributes
        .filter((attr: any) => {
          if (attr.type === 'JSXSpreadAttribute') {
            return true;
          }
          const { name: { name }, value } = attr;

          if (!['id', 'className'].includes(name)) {
            return false;
          }

          if (!value) {
            return false;
          }

          const [start, end] = value.range;
          return end - start > 2;
        });

      if (otherAttributes.length === 0) {
        context.report({
          node: attribute,
          message: errorMessage,
        });
      }
    },
  }),
});
