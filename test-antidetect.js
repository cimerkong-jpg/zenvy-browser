#!/usr/bin/env node

/**
 * Test Suite cho Zenvy Browser Antidetect
 * Kiểm tra tất cả các tính năng đã implement
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Zenvy Browser Antidetect Test Suite\n');
console.log('=' .repeat(60));

let passCount = 0;
let failCount = 0;
const results = [];

function test(name, fn) {
  try {
    fn();
    passCount++;
    results.push({ name, status: '✅ PASS' });
    console.log(`✅ PASS: ${name}`);
  } catch (error) {
    failCount++;
    results.push({ name, status: '❌ FAIL', error: error.message });
    console.log(`❌ FAIL: ${name}`);
    console.log(`   Error: ${error.message}`);
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

console.log('\n📁 Test 1: File Structure\n');

test('resources/fingerprint-test.html exists', () => {
  const filePath = path.join(__dirname, 'resources', 'fingerprint-test.html');
  assert(fs.existsSync(filePath), 'Fingerprint test page not found');
  const content = fs.readFileSync(filePath, 'utf-8');
  assert(content.includes('Kiểm tra Fingerprint'), 'Invalid test page content');
  assert(content.includes('WebDriver Detection'), 'Missing WebDriver detection');
  assert(content.includes('Canvas Fingerprint'), 'Missing Canvas test');
  assert(content.includes('WebGL Info'), 'Missing WebGL test');
});

test('ANTIDETECT-GUIDE.md exists', () => {
  const filePath = path.join(__dirname, 'ANTIDETECT-GUIDE.md');
  assert(fs.existsSync(filePath), 'Guide not found');
  const content = fs.readFileSync(filePath, 'utf-8');
  assert(content.includes('Hướng dẫn Kiểm tra Profile'), 'Invalid guide content');
  assert(content.includes('Best Practices'), 'Missing best practices');
});

console.log('\n🔧 Test 2: Source Code\n');

test('src/main/browser.ts uses ES modules', () => {
  const filePath = path.join(__dirname, 'src', 'main', 'browser.ts');
  const content = fs.readFileSync(filePath, 'utf-8');
  assert(!content.includes('require(\'electron\')'), 'Still using CommonJS require');
  assert(content.includes('import { app }'), 'Not using ES import');
});

test('src/main/browser.ts has antidetect flags', () => {
  const filePath = path.join(__dirname, 'src', 'main', 'browser.ts');
  const content = fs.readFileSync(filePath, 'utf-8');
  
  const requiredFlags = [
    '--disable-blink-features=AutomationControlled',
    '--exclude-switches=enable-automation',
    '--disable-webrtc',
    '--user-agent=',
    '--lang='
  ];
  
  requiredFlags.forEach(flag => {
    assert(content.includes(flag), `Missing flag: ${flag}`);
  });
});

test('src/main/browser.ts opens test page', () => {
  const filePath = path.join(__dirname, 'src', 'main', 'browser.ts');
  const content = fs.readFileSync(filePath, 'utf-8');
  assert(content.includes('fingerprint-test.html'), 'Not opening test page');
  assert(content.includes('testPagePath'), 'Missing testPagePath variable');
});

test('src/main/db.ts uses ES modules', () => {
  const filePath = path.join(__dirname, 'src', 'main', 'db.ts');
  const content = fs.readFileSync(filePath, 'utf-8');
  assert(!content.includes('require(\'electron\')'), 'Still using CommonJS require');
  assert(content.includes('import { app }'), 'Not using ES import');
});

test('src/main/index.ts uses ES modules', () => {
  const filePath = path.join(__dirname, 'src', 'main', 'index.ts');
  const content = fs.readFileSync(filePath, 'utf-8');
  assert(!content.includes('require(\'electron\')'), 'Still using CommonJS require');
  assert(content.includes('import { app'), 'Not using ES import');
});

test('src/main/index.ts has single instance lock', () => {
  const filePath = path.join(__dirname, 'src', 'main', 'index.ts');
  const content = fs.readFileSync(filePath, 'utf-8');
  assert(content.includes('requestSingleInstanceLock'), 'Missing single instance lock');
  assert(content.includes('second-instance'), 'Missing second-instance handler');
});

test('src/main/index.ts has retry logic', () => {
  const filePath = path.join(__dirname, 'src', 'main', 'index.ts');
  const content = fs.readFileSync(filePath, 'utf-8');
  assert(content.includes('loadWithRetry'), 'Missing retry logic');
  assert(content.includes('retries'), 'Missing retries parameter');
});

test('src/main/index.ts uses correct preload path', () => {
  const filePath = path.join(__dirname, 'src', 'main', 'index.ts');
  const content = fs.readFileSync(filePath, 'utf-8');
  assert(content.includes('preload.js'), 'Missing preload.js reference');
  assert(content.includes('contextIsolation: true'), 'Missing contextIsolation');
});

console.log('\n⚙️  Test 3: Configuration\n');

test('package.json has main field', () => {
  const filePath = path.join(__dirname, 'package.json');
  const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  assert(content.main, 'Missing main field');
  assert(content.main.includes('.vite/build'), 'Invalid main path');
});

test('vite.preload.config.ts has outDir', () => {
  const filePath = path.join(__dirname, 'vite.preload.config.ts');
  const content = fs.readFileSync(filePath, 'utf-8');
  assert(content.includes('outDir'), 'Missing outDir');
  assert(content.includes('preload.js'), 'Missing preload.js output name');
});

test('forge.config.ts has preload entry', () => {
  const filePath = path.join(__dirname, 'forge.config.ts');
  const content = fs.readFileSync(filePath, 'utf-8');
  assert(content.includes('src/preload/index.ts'), 'Missing preload entry');
  assert(content.includes('target: \'preload\''), 'Missing preload target');
});

console.log('\n🎨 Test 4: UI Components\n');

test('ProfileModal has error handling', () => {
  const filePath = path.join(__dirname, 'src', 'renderer', 'src', 'components', 'ProfileModal.tsx');
  const content = fs.readFileSync(filePath, 'utf-8');
  assert(content.includes('try'), 'Missing try-catch');
  assert(content.includes('catch'), 'Missing catch block');
  assert(content.includes('console.log'), 'Missing logging');
});

test('ProfileModal has fingerprint options', () => {
  const filePath = path.join(__dirname, 'src', 'renderer', 'src', 'components', 'ProfileModal.tsx');
  const content = fs.readFileSync(filePath, 'utf-8');
  assert(content.includes('webRTC'), 'Missing WebRTC option');
  assert(content.includes('canvas'), 'Missing Canvas option');
  assert(content.includes('webGL'), 'Missing WebGL option');
  assert(content.includes('userAgent'), 'Missing User Agent');
});

console.log('\n📊 Test 5: Fingerprint Test Page\n');

test('Test page has all detection checks', () => {
  const filePath = path.join(__dirname, 'resources', 'fingerprint-test.html');
  const content = fs.readFileSync(filePath, 'utf-8');
  
  const checks = [
    'navigator.webdriver',
    'navigator.hardwareConcurrency',
    'navigator.language',
    'RTCPeerConnection',
    'canvas.toDataURL',
    'WEBGL_debug_renderer_info',
    'navigator.plugins'
  ];
  
  checks.forEach(check => {
    assert(content.includes(check), `Missing check: ${check}`);
  });
});

test('Test page calculates score', () => {
  const filePath = path.join(__dirname, 'resources', 'fingerprint-test.html');
  const content = fs.readFileSync(filePath, 'utf-8');
  assert(content.includes('score'), 'Missing score calculation');
  assert(content.includes('Điểm Antidetect'), 'Missing score display');
});

test('Test page has visual design', () => {
  const filePath = path.join(__dirname, 'resources', 'fingerprint-test.html');
  const content = fs.readFileSync(filePath, 'utf-8');
  assert(content.includes('<style>'), 'Missing styles');
  assert(content.includes('gradient'), 'Missing gradient design');
  assert(content.includes('.card'), 'Missing card component');
});

console.log('\n📖 Test 6: Documentation\n');

test('Guide has usage instructions', () => {
  const filePath = path.join(__dirname, 'ANTIDETECT-GUIDE.md');
  const content = fs.readFileSync(filePath, 'utf-8');
  assert(content.includes('Cách sử dụng'), 'Missing usage section');
  assert(content.includes('Tạo Profile mới'), 'Missing profile creation');
});

test('Guide has score interpretation', () => {
  const filePath = path.join(__dirname, 'ANTIDETECT-GUIDE.md');
  const content = fs.readFileSync(filePath, 'utf-8');
  assert(content.includes('90-100'), 'Missing score ranges');
  assert(content.includes('Excellent'), 'Missing score labels');
});

test('Guide has best practices', () => {
  const filePath = path.join(__dirname, 'ANTIDETECT-GUIDE.md');
  const content = fs.readFileSync(filePath, 'utf-8');
  assert(content.includes('Facebook'), 'Missing Facebook example');
  assert(content.includes('Google'), 'Missing Google example');
  assert(content.includes('Amazon'), 'Missing Amazon example');
});

test('Guide has external test links', () => {
  const filePath = path.join(__dirname, 'ANTIDETECT-GUIDE.md');
  const content = fs.readFileSync(filePath, 'utf-8');
  assert(content.includes('browserleaks.com'), 'Missing browserleaks link');
  assert(content.includes('bot.sannysoft.com'), 'Missing sannysoft link');
  assert(content.includes('pixelscan.net'), 'Missing pixelscan link');
});

console.log('\n' + '='.repeat(60));
console.log('\n📊 Test Summary\n');
console.log(`Total Tests: ${passCount + failCount}`);
console.log(`✅ Passed: ${passCount}`);
console.log(`❌ Failed: ${failCount}`);
console.log(`Success Rate: ${((passCount / (passCount + failCount)) * 100).toFixed(1)}%`);

if (failCount > 0) {
  console.log('\n❌ Failed Tests:');
  results.filter(r => r.status.includes('FAIL')).forEach(r => {
    console.log(`  - ${r.name}`);
    if (r.error) console.log(`    ${r.error}`);
  });
}

console.log('\n' + '='.repeat(60));

if (failCount === 0) {
  console.log('\n🎉 All tests passed! Zenvy Browser is ready for antidetect testing.\n');
  process.exit(0);
} else {
  console.log('\n⚠️  Some tests failed. Please fix the issues above.\n');
  process.exit(1);
}
