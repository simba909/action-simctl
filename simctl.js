const core = require('@actions/core');
const exec = require('@actions/exec');
const Runtime = require('./runtime');
const Simulator = require('./simulator');

exports.listSimulators = async() => {
  let output = '';
  let error = '';

  const options = {};
  options.listeners = {
    stdout: (data) => {
      output += data.toString();
    },
    stderr: (data) => {
      error += data.toString();
    }
  };

  if (core.isDebug()) {
    options.silent = false;
  } else {
    options.silent = true;
  }

  await exec.exec('xcrun simctl list devices', ['--json'], options);

  if (error.length > 0) {
    throw error;
  }

  const rawDeviceObject = JSON.parse(output).devices;

  return Object.entries(rawDeviceObject).flatMap(([rawRuntime, rawSimulators]) => {
    const runtime = new Runtime(rawRuntime);

    return rawSimulators.map(rawSimulator => new Simulator(rawSimulator, runtime));
  });
};

exports.findMatchingSimulator = async(platform, name, os) => {
  const simulators = await exports.listSimulators();
  const matchingSimulators = simulators.filter(simulator => {
    return simulator.matchesInputs(platform, name, os);
  })
  .sort((a, b) => {
    if (a.runtime.os > b.runtime.os) {
      return -1;
    }

    if (a.runtime.os < b.runtime.os) {
      return 1;
    }

    return 0;
  });

  return matchingSimulators[0];
};

exports.boot = async(simulator) => {
  let error = '';

  const options = {};
  options.listeners = {
    stderr: (data) => {
      error += data.toString();
    }
  };

  if (core.isDebug()) {
    options.silent = false;
  } else {
    options.silent = true;
  }

  await exec.exec('xcrun simctl boot', [simulator.udid], options);

  if (error.length > 0) {
    throw error;
  }
};
