/**
 * @fileoverview Disallow inherently interactive elements to be assigned
 * non-interactive roles.
 * @author Jesse Beach
 * @flow
 */

// ----------------------------------------------------------------------------
// Rule Definition
// ----------------------------------------------------------------------------

import { dom } from 'aria-query';
import includes from 'array-includes';
import type { JSXIdentifier } from 'ast-types-flow';
import has from 'has';
import {
  getLiteralPropValue, getProp, propName,
} from 'jsx-ast-utils';
import type { ESLintContext, ESLintVisitorSelectorConfig } from '../../flow/eslint';
import type { ESLintJSXAttribute } from '../../flow/eslint-jsx';
import getElementType from '../util/getElementType';

const errorMessage = 'Interactive elements should have either an id or className attribute.';


export default ({
  meta: {
    docs: {
      description: 'Require interactive elements to have either an id or className attribute.',
      url: 'https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/tree/HEAD/docs/rules/no-interactive-element-without-id-classname.md',
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
        .filter(({ name: { name }, value }) => ['id', 'className'].includes(name) && value && value.raw && value.raw.length > 2);

      if (otherAttributes.length === 0) {
        context.report({
          node: attribute,
          message: errorMessage,
        });
      }
    },
  }),
});
