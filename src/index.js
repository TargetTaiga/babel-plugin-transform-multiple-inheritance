export default function (babel) {
    const { types: t } = babel;

    return {
        name: "multiple-inheritance",
        visitor: {
            ClassDeclaration(path) {
                if (path.get('superClass').isSequenceExpression()) {
                    path.get('superClass').replaceWith(t.callExpression(
                        t.parenthesizedExpression(t.functionExpression(null, [],
                            t.blockStatement([
                                t.functionDeclaration(t.identifier('ProxySuperClass'), [],
                                    t.blockStatement([
                                        t.expressionStatement(t.callExpression(
                                            t.memberExpression(t.identifier('Object'), t.identifier('assign')), [
                                                t.thisExpression(),
                                                ...path.get('superClass').get('expressions')
                                                    .slice().reverse()
                                                    .map((path) => t.newExpression(path.node, []))
                                            ]))
                                    ])),
                                t.expressionStatement(
                                    t.assignmentExpression(
                                        '=',
                                        t.memberExpression(t.identifier('ProxySuperClass'),
                                            t.identifier('prototype')),
                                        t.newExpression(
                                            t.identifier('Proxy'), [
                                                t.objectExpression([]),
                                                t.objectExpression([
                                                    t.objectMethod(
                                                        'method',
                                                        t.identifier('get'),
                                                        [t.identifier('target'), t.identifier('prop')],
                                                        t.blockStatement([
                                                            t.returnStatement(
                                                                path.get('superClass').get('expressions').slice()
                                                                    .reverse().reduceRight(
                                                                    (acc, curr) => t.logicalExpression('||', acc,
                                                                        t.memberExpression(
                                                                            t.memberExpression(curr.node,
                                                                                t.identifier('prototype')),
                                                                            t.identifier('prop'), true)),
                                                                    t.memberExpression(t.identifier('target'),
                                                                        t.identifier('prop'), true))
                                                            )
                                                        ])),
                                                    t.objectMethod(
                                                        'method',
                                                        t.identifier('getPrototypeOf'),
                                                        [],
                                                        t.blockStatement([
                                                            t.returnStatement(
                                                                t.memberExpression(path.get('superClass').get('expressions')[0].node,
                                                                    t.identifier('prototype'))
                                                            )
                                                        ])),
                                                ])
                                            ]
                                        )
                                    )),
                                t.returnStatement(t.identifier('ProxySuperClass'))
                            ]))), []));
                }
            }
        }
    };
}
