import { getDecoratorMetadata } from '@schematics/angular/utility/ast-utils';
import { Change, InsertChange } from '@schematics/angular/utility/change';
import * as typescript from 'typescript';

export function getNgModuleNode(
  sourceFile: typescript.SourceFile
): typescript.ObjectLiteralExpression {
  const nodes = getDecoratorMetadata(sourceFile, 'NgModule', '@angular/core');

  return nodes.length === 1 && nodes[0].kind === typescript.SyntaxKind.ObjectLiteralExpression
    ? (nodes[0] as typescript.ObjectLiteralExpression)
    : null;
}

export function getNgModuleNodeProperty(
  ngModuleNode: typescript.ObjectLiteralExpression,
  propertyName: string
): typescript.PropertyAssignment {
  const properties = ngModuleNode.properties
    .filter(property => property.kind === typescript.SyntaxKind.PropertyAssignment)
    .filter(property => property.name.kind === typescript.SyntaxKind.Identifier)
    .filter(property => (property.name as typescript.Identifier).text === propertyName);

  return properties.length === 1 ? (properties[0] as typescript.PropertyAssignment) : null;
}

export function getArrayElements(expression: typescript.ArrayLiteralExpression): typescript.Node[] {
  return (expression.elements as {}) as typescript.Node[];
}

export function insertIntoArray(
  modulePath: string,
  array: typescript.Node[],
  symbolToInsert: string
): Change {
  return new InsertChange(
    modulePath,
    array.length >= 1 ? array[array.length - 1].end : ((array as {}) as typescript.TextRange).end,
    array.length >= 1 ? `, ${symbolToInsert}` : symbolToInsert
  );
}