class Logger {
  constructor(name) {
    this._name = name;
  }

  log(...messages) {
    console.log(`[${this.getTime()}][${this._name}]:`, ...messages);
  }

  getTime() {
    let date = new Date();

    let hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    let seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

    return `${hours}:${minutes}:${seconds}`;
  }
}

export default Logger;