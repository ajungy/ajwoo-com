const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const source = fs.readFileSync('lib/analytics/core.ts', 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const moduleValue = { exports: {} };
let settings;
let initializations = 0;
const sent = [];
const sdk = {
  init: (_key, options) => { initializations++; settings = options; },
  capture: (event, properties) => {
    const value = settings.before_send({ event, properties: { ...properties, '$initial_current_url': 'https://draw.ajwoo.com/#private-drawing', '$set': { email: 'secret@example.com' } } });
    if (value) sent.push(value);
  },
  opt_in_capturing: () => {}, opt_out_capturing: () => {}, reset: () => {},
};
const documentMock = { cookie: '', referrer: 'https://search.example/search?q=private' };
const navigatorMock = { doNotTrack: '0', globalPrivacyControl: false };
const locationMock = { href: 'https://draw.ajwoo.com/?secret=private&utm_source=newsletter#private-drawing', hostname: 'draw.ajwoo.com', origin: 'https://draw.ajwoo.com', pathname: '/', protocol: 'https:', search: '?secret=private&utm_source=newsletter' };
vm.runInNewContext(js, { exports: moduleValue.exports, require: () => ({ default: sdk }),
  URL, URLSearchParams, document: documentMock, navigator: navigatorMock, location: locationMock,
  window: { dispatchEvent: () => {} }, Event: class {}, Element: class {} });
const a = moduleValue.exports;
(async () => {
  assert.equal(a.configureAnalytics({ key: '', host: 'https://us.i.posthog.com', app: 'draw', enabled: true }), false);
  await a.startAnalytics(); assert.equal(initializations, 0);
  assert.equal(a.configureAnalytics({ key: 'phc_test', host: 'https://attacker.example', app: 'draw', enabled: true }), false);
  assert.equal(a.configureAnalytics({ key: 'phc_test', host: 'https://us.i.posthog.com', app: 'draw', enabled: true }), true);
  await a.startAnalytics(); assert.equal(initializations, 0, 'No SDK before consent');
  a.setConsent('no'); await a.startAnalytics(); assert.equal(initializations, 0);
  a.setConsent('yes'); await a.startAnalytics(); assert.equal(initializations, 1);
  assert.equal(settings.autocapture, false); assert.equal(settings.disable_session_recording, true);
  a.trackPage(); a.trackPage(); assert.equal(sent.length, 1, 'One pageview per route');
  assert.equal(sent[0].properties.$current_url, 'https://draw.ajwoo.com/');
  assert.equal(sent[0].properties.$referring_domain, 'search.example');
  assert.equal(sent[0].properties.utm_source, 'newsletter');
  assert.equal(sent[0].properties.token, 'phc_test', 'Preserve required ingestion token');
  assert.equal(sent[0].properties.$set, undefined);
  assert.equal(sent[0].properties.$initial_current_url, undefined);
  a.track('conversion_succeeded', { filename: 'private.png', content: 'secret', count: 1 });
  assert.equal(sent[1].properties.filename, undefined); assert.equal(sent[1].properties.content, undefined);
  assert.equal(sent[1].properties.count, 1);
  a.track('unapproved_event', { count: 1 }); assert.equal(sent.length, 2);
  locationMock.pathname = '/another/'; locationMock.href = 'https://draw.ajwoo.com/another/?token=secret';
  a.trackPage(); assert.equal(sent.length, 3);
  a.setConsent('no'); a.track('conversion_failed'); assert.equal(sent.length, 3, 'Withdrawal stops capture');
  a.setConsent('yes'); navigatorMock.globalPrivacyControl = true;
  a.track('conversion_failed'); assert.equal(sent.length, 3, 'GPC overrides saved opt-in');
  assert.equal(a.consent(), 'no');
  navigatorMock.globalPrivacyControl = false; navigatorMock.doNotTrack = '1';
  assert.equal(a.consent(), 'no');
  assert.equal(a.cleanUrl('javascript:alert(1)'), undefined);
  assert.equal(a.cleanUrl('https://draw.ajwoo.com/#drawing'), 'https://draw.ajwoo.com/');
  console.log('Analytics checks passed: default off, consent, withdrawal, GPC/DNT, URL/property filtering, event allowlist, route deduplication.');
})().catch(error => { console.error(error); process.exitCode = 1; });
