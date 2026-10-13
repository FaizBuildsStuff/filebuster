const { app } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');

class ConfigStore {
  constructor() {
    this.configPath = path.join(app.getPath('userData'), 'filebuster-config.json');
    this.defaultConfig = {
      windowPosition: null, // { x, y }
      watchedPaths: [
        path.join(os.homedir(), 'Desktop'),
        path.join(os.homedir(), 'Downloads'),
        path.join(os.homedir(), 'Documents'),
        path.join(os.homedir(), 'Pictures'),
        path.join(os.homedir(), 'Videos'),
        path.join(os.homedir(), 'Music')
      ],
      filterTempFiles: true
    };
    this.data = this.load();
  }

  load() {
    try {
      if (fs.existsSync(this.configPath)) {
        const raw = fs.readFileSync(this.configPath, 'utf8');
        return Object.assign({}, this.defaultConfig, JSON.parse(raw));
      }
    } catch (err) {
      console.error('[Config] Failed to read config, fallback to default:', err);
    }
    return Object.assign({}, this.defaultConfig);
  }

  save() {
    try {
      fs.writeFileSync(this.configPath, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.error('[Config] Failed to save config:', err);
    }
  }

  get(key) {
    return this.data[key];
  }

  set(key, value) {
    this.data[key] = value;
    this.save();
  }
}

let instance = null;
function getConfig() {
  if (!instance) {
    instance = new ConfigStore();
  }
  return instance;
}

module.exports = { getConfig };
