import { Rule, SchematicContext, Tree, SchematicsException } from '@angular-devkit/schematics'

export function updatePackageJsonScripts(): Rule {
  return (tree: Tree, _context: SchematicContext): Tree => {
    if (tree.exists('package.json')) {
      const json = JSON.parse(tree.read('package.json')!.toString('utf-8'))
      if (!json.name) throw new SchematicsException('A name is needed in your package.json file')
      const collectionName = json.name
      const scripts = {
        build: 'tsc -p tsconfig.json',
        clean: 'git checkout HEAD -- sandbox && git clean -f -d sandbox',
        launch: `cd sandbox && ng g ${collectionName}:${collectionName}`,
        'clean:launch': 'npm run clean && npm run launch',
        'build:clean:launch': 'npm run build && npm run clean && npm run launch',
        'link:schematics': `npm link && cd sandbox && npm link ${collectionName}`
      }
      if (!json.scripts) json.scripts = {}
      Object.assign(json.scripts, scripts)
      tree.overwrite('package.json', JSON.stringify(json, null, 2))
    }
    return tree
  }
}
