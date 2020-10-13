this.onmessage = e => {
    if(e.system) {
        this.s(e.data.system);
    }
}

this.s = (system) => {
    this.postMessage("app version["+system.version+"]");
}
