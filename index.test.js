const simctl = require('./simctl');
const Destination = require('./destination');
const Runtime = require('./runtime');
const Simulator = require('./simulator');
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

test('simulator matches name only', () => {
  const runtime = new Runtime("com.apple.CoreSimulator.SimRuntime.iOS-16-0");
  const simulator = new Simulator({
    udid: "82B24D01-FFB0-4394-9FEE-8AE4D15011D0",
    isAvailable: true,
    state: "Shutdown",
    name: "iPhone 12"
  }, runtime);

  expect(simulator.matchesInputs("", "iPhone 12", "")).toEqual(true);
});

test('simulator matches full action input set', () => {
  const runtime = new Runtime("com.apple.CoreSimulator.SimRuntime.iOS-16-0");
  const simulator = new Simulator({
    udid: "82B24D01-FFB0-4394-9FEE-8AE4D15011D0",
    isAvailable: true,
    state: "Shutdown",
    name: "iPhone 12"
  }, runtime);

  expect(simulator.matchesInputs("iOS", "iPhone 12", "16.0")).toEqual(true);
});

test('simulator matches full action input set without minor OS version', () => {
  const runtime = new Runtime("com.apple.CoreSimulator.SimRuntime.iOS-16-0");
  const simulator = new Simulator({
    udid: "82B24D01-FFB0-4394-9FEE-8AE4D15011D0",
    isAvailable: true,
    state: "Shutdown",
    name: "iPhone 12"
  }, runtime);

  expect(simulator.matchesInputs("iOS", "iPhone 12", "16")).toEqual(true);
});

test('simulator doesn\'t match full action input set with differing OS version', () => {
  const runtime = new Runtime("com.apple.CoreSimulator.SimRuntime.iOS-16-0");
  const simulator = new Simulator({
    udid: "82B24D01-FFB0-4394-9FEE-8AE4D15011D0",
    isAvailable: true,
    state: "Shutdown",
    name: "iPhone 12"
  }, runtime);

  expect(simulator.matchesInputs("iOS", "iPhone 12", "16.2")).toEqual(false);
});
