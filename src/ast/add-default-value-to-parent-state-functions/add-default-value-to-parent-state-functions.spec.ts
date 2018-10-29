import * as typescript from 'typescript';

import { openSourceFileFromFileSystem } from '../ast-helpers';

import { addDefaultValueToParentStateFunctions } from './add-default-value-to-parent-state-functions';

describe('addDefaultValueToParentStateFunctions()', () => {
  let sourceFile: typescript.SourceFile;

  it('add default child state value to the empty parent state create function', () => {
    sourceFile = openSourceFileFromFileSystem(__dirname + '/app-state.functions.empty.txt');

    const modifications = addDefaultValueToParentStateFunctions(sourceFile, 'stuff');

    expect(modifications.length).toEqual(2);
    expect(modifications[0].index).toEqual(49);
    expect(modifications[0].toAdd).toEqual(
      `import { createStuffState } from '../../features/stuff/types/stuff-state/stuff-state.functions';\r\n`
    );
    expect(modifications[1].index).toEqual(109);
    expect(modifications[1].toAdd).toEqual(`stuffState: createStuffState(),\r\n`);
  });

  it('add default child state value to the existing parent state create function', () => {
    sourceFile = openSourceFileFromFileSystem(__dirname + '/app-state.functions.existing.txt');

    const modifications = addDefaultValueToParentStateFunctions(sourceFile, 'stuff');

    expect(modifications.length).toEqual(2);
    expect(modifications[0].index).toEqual(140);
    expect(modifications[0].toAdd).toEqual(
      `import { createStuffState } from '../../features/stuff/types/stuff-state/stuff-state.functions';\r\n`
    );
    expect(modifications[1].index).toEqual(200);
    expect(modifications[1].toAdd).toEqual(`stuffState: createStuffState(),\r\n`);
  });
});