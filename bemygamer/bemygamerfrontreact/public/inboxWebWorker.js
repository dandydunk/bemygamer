this.timeoutMs = 10;
this.lastIndex = 0;
this.memberId = 0;
this.apiServer = null;
this.getMessages = (loop)=>{
    if(!this.memberId) {
        throw new Error("the member id is missing, can't start the worker thread");
    }
    fetch(`${this.apiServer}members/getMessages/${this.memberId}/${this.lastIndex}/`, {
        credentials: "include"
    })
    .then(r => r.json())
    .then(r => {
        if(r && r.length) {
            this.lastIndex = r[r.length-1].id;
            //console.log("r::", r);
            this.postMessage(r);
            //this.timeoutMs = 100;
        }
        else {
            //this.timeoutMs += (this.timeoutMs * 2);
            if(this.timeoutMs > (1000*60)) {
                this.timeoutMs = 100;
            }
        }

        if(loop) {
            setTimeout(()=>{this.getMessages(loop)}, this.timeoutMs);
        }
    })
}

this.onmessage = e=> {
    if(e.data.memberId) {
        this.memberId = e.data.memberId;
        this.apiServer = e.data.apiServer;
    }
    
    if(e.data.loop) {
        console.log("starting the inbox event loop...")
        getMessages(true);
    }
    else {
        console.log("getting one message section...");
        getMessages();
    }
}



/*
this.s = (system, chatMemberId) => {
    this.postMessage("app version["+system.version+"]");
    if(!this.indexMessageStartId) {
        this.indexMessageStartId = 0;
    }

    system.getChatMessages(chatMemberId, this.indexMessageStartId, messages => {
        if (messages.length) {
            this.postMessage(messages);
        }
    })
}*/
