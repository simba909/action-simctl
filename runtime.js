class Runtime {
  constructor(rawRuntime) {
    const parts = rawRuntime.split('.');
    const [platform, ...osParts] = parts[parts.length - 1].split('-');

    this.platform = platform;
    this.os = osParts.join('.');
  }
}

module.exports = Runtime;
