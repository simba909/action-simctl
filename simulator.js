const semver = require('semver');

class Simulator {
  constructor(rawSimulator, runtime) {
    this.udid = rawSimulator.udid;
    this.isAvailable = rawSimulator.isAvailable;
    this.state = rawSimulator.state;
    this.name = rawSimulator.name;
    this.runtime = runtime;
  }

  get isBooted() {
    return this.state == 'Booted';
  }

  get destinationString() {
    let parts = new Array();

    if (this.runtime.platform.length > 0) {
      parts.push('platform=' + this.runtime.platform);
    }

    parts.push('name=' + this.name);

    if (this.runtime.os.length > 0) {
      parts.push('OS=' + this.runtime.os);
    }

    return parts.join(',');
  }

  matchesInputs(platform, name, os) {
    if (this.name != name) {
      return false;
    }

    if (platform.length > 0 && this.runtime.platform != platform) {
      return false;
    }

    const osSemver = semver.coerce(os);

    if (osSemver != undefined) {
      const runtimeSemver = semver.coerce(this.runtime.os);

      if (osSemver.compare(runtimeSemver) != 0) {
        return false;
      }
    }

    return true;
  }
}

module.exports = Simulator
