const core = require('@actions/core');
const simctl = require('./simctl');


// most @actions toolkit packages have async methods
async function run() {
  try {
    const platform = core.getInput('platform');
    const name = core.getInput('name', { required: true });
    const os = core.getInput('os');

    const simulator = await core.group('Find suitable simulator', async () => {
      const simulator = await simctl.findMatchingSimulator(platform, name, os);
      core.info('Found suitable simulator: ' + simulator.destinationString);
      return simulator;
    });

    if (simulator != undefined && simulator.isAvailable && !simulator.isBooted) {
      core.info('Booting simulator: ' + simulator.destinationString);
      await simctl.boot(simulator);
    }
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
