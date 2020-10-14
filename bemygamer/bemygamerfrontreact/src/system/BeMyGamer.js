import BeMyGamerMember from "./BeMyGamerMember";

export default class BeMyGamer {
    constructor() {
        this.apiUrl = null;
        this.member = null;
        this.db = null;
        this.events = [];
        this.version = "1.012";
    }

    initDb(cb) {
        //get the db
        fetch("/db.json")
            .then(i => i.json())
            .then(i => {
                this.db = i;
                if(cb) cb();
            })
    }

    restrict() {
        if (!this.member.isLoggedIn) {
            window.location = "/";
            return;
        }
    }

    addEventListener(type, cb) {
        this.events.push({type:type, cb:cb})
    }

    removeEventListener(type, cb) {
        for(let i = 0; i < this.events.length; i++) {
            if(this.events[i].type == type && this.events[i].cb == cb) {
                this.events.splice(i, 1);
                return;
            }
        }
    }

    triggerEvent(type) {
        this.events.map(e=>{
            if(e.type == type) {
                if(e.cb()) {
                    e.cb();
                }
            }
        })
    }


    checkAuth() {
        if (!this.member.isLoggedIn) {
            window.location = "/";
            return false;
        }

        if (!this.member.profile) {
            window.location = "/members/interview/";
            return false;
        }

        return true;
    }

    getDb() {
        if (!this.db) throw new Error("The database has not be inited...");

        return this.db;
    }

    saveChatMessage(message, chatMemberId, cb, err) {
        message = encodeURIComponent(message);
        this.get(`members/saveChatMessage/${chatMemberId}/${message}/`,
            cb, err)
    }

    publishChatMessage(chatMemberId, cb, err) {
        this.get(`members/publishChatMessage/${chatMemberId}/`,
            cb, err)
    }

    getLocationFromZipCode(zipCode, cb, err) {
        this.get(`data/getLocationFromZipCode/${zipCode}/`,
            cb, err)
    }

    getMember() {
        if (!this.member) {
            this.member = new BeMyGamerMember();
            this.member.system = this;
        }

        return this.member;
    }

    getChatMessages(chatMemberId, indexStartId, cb, err) {
        this.get(`members/getMessages/${chatMemberId}/${indexStartId}/`,
            cb, err)
    }

    getNextMatch(cb, errcb) {
        this.get(`data/getNextMatch/`, cb, errcb)
    }

    getMemberProfileById(memberId, cb, errcb) {
        this.get(`members/getProfileById/${memberId}/`, cb, errcb)
    }

    setApiUrl(url) {
        if (!url.endsWith("/")) {
            url += "/";
        }

        this.apiUrl = url;
    }

    get(path, cb, errorcb) {
        if (!this.apiUrl) {
            throw new Error("The API URL is not set.");
        }

        let url = `${this.apiUrl}${path}`;
        fetch(url, {
            credentials: "include"
        })
            .then(r => {
                if (!r.ok) {
                    throw Error("The HTTP request failed.");
                }

                return r.json();
            })
            .then(r => {
                if (cb) {
                    cb(r);
                }
            }).catch(error => {
                if (!errorcb) return;
                errorcb(error);
            })
    }

    post(path, fd, cb, errorcb) {
        if (!this.apiUrl) {
            throw new Error("The API URL is not set.");
        }

        let url = `${this.apiUrl}${path}`;
        console.log("url = ", url);
        fetch(url, {
            credentials: "include",
            method: 'POST',
            body: fd
        })
            .then(r => {
                console.log("r = ", r);
                if (!r.ok) {
                    throw Error("The HTTP request failed.");
                }

                return r.json();
            })
            .then(r => {
                if (cb) {
                    cb(r);
                }
            }).catch(error => {
                console.log("error =", error);
                if (!errorcb) return;
                errorcb(error);
            })
    }

}