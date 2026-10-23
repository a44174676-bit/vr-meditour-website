'use strict';
// Explicit file allowlist: adding a public file requires a reviewed manifest change.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'dist');
const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'public-files.json'), 'utf8'));
const denied = /(^|\/)(\.|docs(?:\/|$)|tests(?:\/|$)|scripts(?:\/|$)|dev-tools(?:\/|$)|netlify(?:\/|$)|backend(?:\/|$)|node_modules(?:\/|$))|\.(?:sql|py|md|toml|env|pem|key)$/i;
if (!Array.isArray(manifest) || !manifest.length || new Set(manifest).size !== manifest.length) throw new Error('Invalid public manifest');
for (const file of manifest) {
  if (typeof file !== 'string' || file.includes('\\') || path.isAbsolute(file) || file.split('/').includes('..') || denied.test(file)) throw new Error(`Disallowed public path: ${file}`);
  const source = path.join(root, file);
  // Do not follow links to private files, including symlinked parent directories.
  let cursor = root;
  for (const segment of file.split('/')) { cursor = path.join(cursor,segment); if (fs.lstatSync(cursor).isSymbolicLink()) throw new Error(`Symlink: ${file}`); }
  if (!fs.statSync(source).isFile()) throw new Error(`Missing public file: ${file}`);
  if (/\.(?:html|css|js|json|xml|txt|webmanifest)$/.test(file)) {
    const content = fs.readFileSync(source, 'utf8');
    const secrets = [/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/, /gh[pousr]_[A-Za-z0-9]{30,}/, /github_pat_[A-Za-z0-9_]{30,}/, /AKIA[A-Z0-9]{16}/, /sk_live_[A-Za-z0-9]{20,}/];
    if (secrets.some(pattern => pattern.test(content))) throw new Error(`Possible credential in public file: ${file}`);
  }
}
if (fs.existsSync(output) && fs.lstatSync(output).isSymbolicLink()) throw new Error('Output must not be a symlink');
fs.rmSync(output, {recursive:true, force:true});
fs.mkdirSync(output);
for (const file of manifest) {
  const target = path.join(output,file); fs.mkdirSync(path.dirname(target),{recursive:true}); fs.copyFileSync(path.join(root,file),target);
}
console.log(`Built ${manifest.length} explicitly allowed files into dist/. No deployment performed.`);
