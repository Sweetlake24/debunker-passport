const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('./app.js','utf8');
const block=source.match(/async function sha256[\s\S]*?(?=async function downloadIntegrity)/);
assert.ok(block,'hashfuncties niet gevonden');
const context={TextEncoder,Uint8Array,Math,globalThis:{crypto:null}};
vm.createContext(context);vm.runInContext(block[0],context);
assert.equal(context.sha256Fallback('abc'),'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
console.log('OK — SHA-256 fallback geeft bekende testvector');
