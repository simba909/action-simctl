const simctl = require('./simctl');
const Destination = require('./destination');
const process = require('process');
const cp = require('child_process');
const path = require('path');

test('parses destination specifier', () => {
  const destination = new Destination('platform=iOS,name=iPhone 8,OS=13.4');

  expect(destination.platform).toEqual('iOS');
  expect(destination.name).toEqual('iPhone 8');
  expect(destination.os).toEqual('13.4');
});

test('name only specifier matches different runtimes', () => {
  const destination = new Destination('name=iPhone 8');

  expect(destination.matchesRuntime('com.apple.CoreSimulator.SimRuntime.iOS-12-2')).toEqual(true);
  expect(destination.matchesRuntime('com.apple.CoreSimulator.SimRuntime.iOS-13-4')).toEqual(true);
});

test('specifier with full platform matches runtime', () => {
  const destination = new Destination('platform=iOS Simulator,name=iPhone 8');

  expect(destination.matchesRuntime('com.apple.CoreSimulator.SimRuntime.iOS-12-2')).toEqual(true);
  expect(destination.matchesRuntime('com.apple.CoreSimulator.SimRuntime.iOS-13-4')).toEqual(true);
});

test('specifier with full platform matches runtime and version', () => {
  const destination = new Destination('platform=iOS Simulator,name=iPhone 8,OS=13.4');

  expect(destination.matchesRuntime('com.apple.CoreSimulator.SimRuntime.iOS-12-2')).toEqual(false);
  expect(destination.matchesRuntime('com.apple.CoreSimulator.SimRuntime.iOS-13-4')).toEqual(true);
});
