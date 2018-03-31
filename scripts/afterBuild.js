#!/usr/bin/env node

// Copy Browser Code To Docs for Github Pages
// v1.0
// Automatically copies the platform/browser/www/ contents to /docs so that
// the repository can automatically be hosted with Github pages

var shell = require('child_process').execSync;
var fs = require('fs');
var path = require('path');

const src= 'platforms/browser/www';
const dist= 'docs';

if(process.env.IONIC_PLATFORM == "browser"){
  shell('mkdir -p '+dist);
  shell('cp -r '+src+'/* '+dist);
}