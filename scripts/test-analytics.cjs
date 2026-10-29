const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const source = fs.readFileSync('lib/analytics/core.ts', 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const moduleValue = { exports: {} };
let settings;
let initializations = 0;
let stopped = 0;
let started = 0;
const sent = [];
const sdk = {
  init: (_key, options) => { initializations++; settings = options; },
  capture: (event, properties) => {
    const value = settings.before_send({ event, properties: { ...properties, '$initial_current_url': 'https://draw.ajwoo.com/#private-drawing', '$set': { email: 'secret@example.com' } } });
    if (value) sent.push(value);
  },
  stopSessionRecording: () => { stopped++; }, startSessionRecording: () => { started++; },
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
  documentMock.cookie = 'ajwoo_analytics_consent_v1=yes';
  await a.startAnalytics(); assert.equal(initializations, 0, 'Old analytics consent cannot enable replay');
  documentMock.cookie = 'ajwoo_analytics_consent_v1=no';
  assert.equal(a.consent(), 'no', 'Respect previous declines');
  a.setConsent('no'); await a.startAnalytics(); assert.equal(initializations, 0);
  a.setConsent('yes'); await a.startAnalytics(); assert.equal(initializations, 1);
  assert.equal(settings.autocapture.dom_event_allowlist.join(','), 'click');
  assert.equal(settings.disable_session_recording, false);
  assert.equal(settings.advanced_disable_flags, false, 'Replay remote config must load');
  assert.equal(settings.disable_external_dependency_loading, true, 'Replay ships in the bundled SDK');
  assert.equal(settings.session_recording.maskAllInputs, true);
  assert.equal(settings.session_recording.captureCanvas.recordCanvas, false);
  assert.equal(settings.get_current_url(), 'https://draw.ajwoo.com/');
  const maskedRequest = settings.session_recording.maskCapturedNetworkRequestFn({ name: locationMock.href, duration: 1, entryType: 'fetch', startTime: 0, requestBody: 'secret', requestHeaders: { Authorization: 'secret' }, responseBody: 'secret' });
  assert.equal(maskedRequest.name, 'https://draw.ajwoo.com/');
  assert.equal(maskedRequest.requestBody, undefined);
  assert.equal(maskedRequest.requestHeaders, undefined);
  assert.equal(maskedRequest.responseBody, undefined);
  assert.equal(settings.session_recording.maskAttributeFn('href', '/?token=secret#private'), 'https://draw.ajwoo.com/');
  assert.equal(settings.session_recording.maskAttributeFn('value', 'secret'), '');
  const snapshot = { event: '$snapshot', properties: { $snapshot_data: [{ type: 2, data: { masked: true } }], $session_id: 'test-session' } };
  assert.equal(settings.before_send(snapshot), snapshot, 'Preserve replay payload after recorder masking');
  const click = settings.before_send({ event: '$autocapture', properties: { $event_type: 'click', $elements: [{ tag_name: 'button', nth_child: 2, $el_text: 'private', 'attr__value': 'secret' }] } });
  assert.equal(click.properties.$elements[0].tag_name, 'button');
  assert.equal(click.properties.$elements[0].$el_text, undefined);
  assert.equal(click.properties.$elements[0].attr__value, undefined);
  assert.equal(click.properties.app, 'draw');
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
  assert.ok(stopped > 0, 'Withdrawal stops recording');
  assert.equal(settings.before_send({ event: '$snapshot', properties: {} }), null, 'No replay after decline');
  a.setConsent('yes'); await a.startAnalytics();
  assert.equal(started, 1, 'Opting in again resumes recording');
  navigatorMock.globalPrivacyControl = true;
  a.track('conversion_failed'); assert.equal(sent.length, 3, 'GPC overrides saved opt-in');
  assert.equal(a.consent(), 'no');
  navigatorMock.globalPrivacyControl = false; navigatorMock.doNotTrack = '1';
  assert.equal(a.consent(), 'no');
  assert.equal(a.cleanUrl('javascript:alert(1)'), undefined);
  assert.equal(a.cleanUrl('https://draw.ajwoo.com/#drawing'), 'https://draw.ajwoo.com/');
  console.log('Analytics checks passed: default off, consent, withdrawal, GPC/DNT, URL/property filtering, event allowlist, route deduplication.');
})().catch(error => { console.error(error); process.exitCode = 1; });
