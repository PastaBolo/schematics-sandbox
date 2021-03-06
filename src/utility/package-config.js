"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
function schematicsSandboxScripts(collectionName, sandboxName) {
    return {
        build: 'tsc -p tsconfig.json',
        clean: `git checkout HEAD -- ${sandboxName} && git clean -f -d ${sandboxName}`,
        launch: `cd ${sandboxName} && ng g ${collectionName}:${collectionName}`,
        'clean:launch': 'npm run clean && npm run launch',
        'build:clean:launch': 'npm run build && npm run clean && npm run launch',
        'link:schematics': `npm link && cd ${sandboxName} && npm link ${collectionName}`
    };
}
function updatePackageJsonScripts(options) {
    return (tree, _context) => {
        if (tree.exists('package.json')) {
            const json = JSON.parse(tree.read('package.json').toString('utf-8'));
            if (!json.name)
                throw new schematics_1.SchematicsException('A name is needed in your package.json file');
            if (!json.scripts)
                json.scripts = {};
            Object.assign(json.scripts, schematicsSandboxScripts(json.name, options.name));
            tree.overwrite('package.json', JSON.stringify(json, null, 2));
        }
        return tree;
    };
}
exports.updatePackageJsonScripts = updatePackageJsonScripts;
