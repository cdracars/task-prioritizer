const fs = require('node:fs/promises');
const path = require('node:path');
const Module = require('node:module');
const { createRequire } = require('node:module');

const projectRoot = path.resolve(__dirname, '..');
const requireFromProject = createRequire(path.join(projectRoot, 'package.json'));
const ts = requireFromProject('typescript');
const React = requireFromProject('react');
const { renderToString } = requireFromProject('react-dom/server');

const transpile = (module, filename) => {
  const source = require('node:fs').readFileSync(filename, 'utf8');
  const { outputText, diagnostics } = ts.transpileModule(source, {
    fileName: filename,
    compilerOptions: {
      esModuleInterop: true,
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
    reportDiagnostics: true,
  });

  const errors = (diagnostics ?? []).filter(
    (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error
  );
  if (errors.length) {
    throw new Error(
      errors
        .map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'))
        .join('\n')
    );
  }

  module._compile(outputText, filename);
};

Module._extensions['.ts'] = transpile;
Module._extensions['.tsx'] = transpile;
Module._extensions['.css'] = () => {};

async function main() {
  const App = requireFromProject('./src/App.tsx').default;
  const ErrorBoundary = requireFromProject('./src/components/ErrorBoundary.tsx').default;
  const app = React.createElement(
    React.StrictMode,
    null,
    React.createElement(ErrorBoundary, null, React.createElement(App))
  );
  const markup = renderToString(app);
  const htmlPath = path.join(projectRoot, 'build', 'index.html');
  const html = await fs.readFile(htmlPath, 'utf8');
  const emptyRoot = '<div id="root"></div>';

  if (!html.includes(emptyRoot)) {
    throw new Error('Could not find the empty React root in build/index.html');
  }

  await fs.writeFile(htmlPath, html.replace(emptyRoot, `<div id="root">${markup}</div>`));
  console.log('Prerendered Task Prioritizer into build/index.html');
}

main().catch((error) => {
  console.error('Task Prioritizer prerendering failed:', error);
  process.exitCode = 1;
});
