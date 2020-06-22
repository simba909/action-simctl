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
}

module.exports = Simulator
