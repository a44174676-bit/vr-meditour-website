const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname,'../..');
test('public output matches allowlist byte-for-byte and excludes internal paths',()=>{
  require('../../scripts/build-public.cjs');
  const manifest = require('../../scripts/public-files.json');
  for(const file of manifest) assert.deepEqual(fs.readFileSync(path.join(root,'dist',file)),fs.readFileSync(path.join(root,file)),file);
  for(const file of ['docs','tests','dev-tools','netlify','server','scripts','.git','.env','settlement-ai-system/backend','skin-body-ai-mvp/backend']) assert.equal(fs.existsSync(path.join(root,'dist',file)),false,file);
  const walk = directory => fs.readdirSync(directory,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(path.join(directory,entry.name)):[path.relative(path.join(root,'dist'),path.join(directory,entry.name))]);
  assert.deepEqual(walk(path.join(root,'dist')).sort(),[...manifest].sort());
  for(const file of ['index.html','study-korea/index.html','ai-skin/index.html','ai-interpreter/index.html','public/medical-mydata-ai/index.html','public/medi-hana/index.html','public/store/index.html','public/tours/index.html','public/amis-travel-lounge/index.html','omniball-ski/index.html','_redirects']) assert(manifest.includes(file),file);
});
