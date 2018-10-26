import { chain, Rule, Tree } from '@angular-devkit/schematics';

import { addReducerToParentReducer } from '../../ast/add-reducer-to-parent-reducer/add-reducer-to-parent-reducer';
import { addStateMemberToParentState } from '../../ast/add-state-member-to-parent-state/add-state-member-to-parent-state';
import { modifySourceFile } from '../../rules/modify-source-file.rule';
import { processTemplates } from '../../rules/process-templates.rule';
import { Folders } from '../../types/folders/folders.enum';
import {
  getContainingFolderPath,
  validateRegularSchema
} from '../../types/schema-options/schema-options.functions';
import { SchemaOptions } from '../../types/schema-options/schema-options.interface';

function findParentReducerFile(tree: Tree, name: string, path: string): string {
  const directory = tree.getDir(path);
  const storePath = directory.subdirs.find(dir => dir === 'store');

  if (storePath) {
    const storeDirEntry = directory.dir(storePath);

    const reducerPath = storeDirEntry.subfiles.find(
      file => file.includes('.reducer.ts') && file !== `${name}.reducer.ts`
    );

    if (reducerPath) {
      return storeDirEntry.file(reducerPath).path;
    }
  }

  return directory.parent ? findParentReducerFile(tree, name, directory.parent.path) : null;
}

function findParentStateInterfaceFile(tree: Tree, name: string, path: string): string {
  const directory = tree.getDir(path);
  const typesPath = directory.subdirs.find(dir => dir === 'types');

  if (typesPath) {
    const typesDirEntry = directory.dir(typesPath);

    const statePath = typesDirEntry.subdirs.find(dir => dir.includes('-state'));

    if (statePath) {
      const stateDirEntry = typesDirEntry.dir(statePath);

      const stateInterfacePath = stateDirEntry.subfiles.find(
        file => file.includes('-state.interface.ts') && file !== `${name}-state.interface.ts`
      );

      if (stateInterfacePath) {
        return stateDirEntry.file(stateInterfacePath).path;
      }
    }
  }

  return directory.parent ? findParentStateInterfaceFile(tree, name, directory.parent.path) : null;
}

export default function(options: SchemaOptions): Rule {
  validateRegularSchema(options);

  options.path = getContainingFolderPath(options.path, Folders.Store);

  return chain([
    processTemplates(options, options.path),
    modifySourceFile(
      tree => findParentReducerFile(tree, options.name, options.path),
      sourceFile => addReducerToParentReducer(sourceFile, options.name)
    ),
    modifySourceFile(
      tree => findParentStateInterfaceFile(tree, options.name, options.path),
      sourceFile => addStateMemberToParentState(sourceFile, options.name)
    )
  ]);
}
