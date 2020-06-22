class Destination {
  constructor(rawDestination) {
    for (const keyValuePair of rawDestination.split(',')) {
      const pair = keyValuePair.split('=');
      this[pair[0].toLowerCase()] = pair[1];
    }
  }

  matchesRuntime(specifier) {
    const parts = specifier.split('.');
    const [platform, ...osParts] = parts[parts.length - 1].split('-');
    const os = osParts.join('.');

    if (this.platform != undefined && this.platform.split(' ')[0] != platform) {
      return false;
    }

    if (this.os != undefined && this.os != os) {
      return false;
    }

    return true;
  }

  matchesDevice(device) {
    if (this.uuid != undefined && this.uuid != device.uuid) {
      return false;
    }

    if (this.name != undefined && this.name != device.name) {
      return false;
    }

    return false;
  }
}

module.exports = Destination
