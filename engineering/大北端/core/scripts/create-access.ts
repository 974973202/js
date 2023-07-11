import ts, { factory } from 'typescript';
import * as fs from 'fs';

const customFilePath = 'src/access.custom.ts';

export function createAccessFile() {
  const exist = fs.existsSync(customFilePath);
  const sourceFile = ts.createSourceFile('access.ts', '', ts.ScriptTarget.ESNext);

  const importDeclarations = [
    factory.createImportDeclaration(
      undefined,
      undefined,
      factory.createImportClause(false, factory.createIdentifier('defaultAccesses'), undefined),
      factory.createStringLiteral('@/.components/access'),
      undefined,
    ),
    factory.createImportDeclaration(
      undefined,
      undefined,
      factory.createImportClause(
        false,
        undefined,
        factory.createNamedImports([
          factory.createImportSpecifier(false, undefined, factory.createIdentifier('genAccesses')),
        ]),
      ),
      factory.createStringLiteral('@/shared'),
      undefined,
    ),
  ];

  const accessSpreadElements = [factory.createSpreadElement(factory.createIdentifier('defaultAccesses'))];

  if (exist) {
    importDeclarations.push(
      factory.createImportDeclaration(
        undefined,
        undefined,
        factory.createImportClause(false, factory.createIdentifier('customAccesses'), undefined),
        factory.createStringLiteral('./access.custom'),
        undefined,
      ),
    );
    accessSpreadElements.push(factory.createSpreadElement(factory.createIdentifier('customAccesses')));
  }

  const accessArrayStatement = factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        factory.createVariableDeclaration(
          factory.createIdentifier('access'),
          undefined,
          undefined,
          factory.createCallExpression(factory.createIdentifier('genAccesses'), undefined, [
            factory.createArrayLiteralExpression([...accessSpreadElements], false),
          ]),
        ),
      ],
      ts.NodeFlags.Const,
    ),
  );

  const statements = [
    ...importDeclarations,
    accessArrayStatement,
    factory.createExportAssignment(undefined, undefined, undefined, factory.createIdentifier('access')),
  ];
  const updatedSourceFile = factory.updateSourceFile(sourceFile, [...statements]);
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
  const outputText = printer.printFile(updatedSourceFile);

  fs.writeFileSync('src/access.ts', outputText);
}
