/**
 * @fileoverview Disallow inherently interactive elements to be assigned
 * non-interactive roles.
 * @author Jesse Beach
 */

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

import { RuleTester } from 'eslint';
import { configs } from '../../../src/index';
import parserOptionsMapper from '../../__util__/parserOptionsMapper';
import rule from '../../../src/rules/no-interactive-element-without-id-classname';
import ruleOptionsMapperFactory from '../../__util__/ruleOptionsMapperFactory';

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------
const ruleTester = new RuleTester();

const ruleName = 'mea/no-interactive-element-without-id-classname';
const expectedError = 'Interactive elements should have either an id or className attribute.';

const alwaysValid = [
  { code: '<TestComponent id="id-value" onClick={doFoo} />' },
  { code: '<TestComponent id="id" onClick={doFoo} />' },
  { code: '<TestComponent className="classNameValue" onClick={doFoo} />' },
];

const neverValid = [
  { code: '<TestComponent id="" onClick={doFoo} />', errors: [expectedError] },
  { code: '<TestComponent className="" onClick={doFoo} />', errors: [expectedError] },
  { code: '<TestComponent id onClick={doFoo} />', errors: [expectedError] },
  { code: '<TestComponent className onClick={doFoo} />', errors: [expectedError] },
  { code: '<TestComponent onClick={doFoo} />', errors: [expectedError] },
];

const recommendedOptions = (configs.recommended.rules[ruleName][1] || {});
ruleTester.run(`${ruleName}:recommended`, rule, {
  valid: [
    ...alwaysValid,
  ]
    .map(ruleOptionsMapperFactory(recommendedOptions))
    .map(parserOptionsMapper),
  invalid: [
    ...neverValid,
  ]
    .map(ruleOptionsMapperFactory(recommendedOptions))
    .map(parserOptionsMapper),
});

ruleTester.run(`${ruleName}:strict`, rule, {
  valid: [
    ...alwaysValid,
  ].map(parserOptionsMapper),
  invalid: [
    ...neverValid,
  ].map(parserOptionsMapper),
});
