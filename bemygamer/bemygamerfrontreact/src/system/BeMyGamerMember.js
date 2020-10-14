export default class BeMyGamerMember {
    constructor() {
        this.id = 0;
        this.apiUrl = null;
        this.system = null;
        this.email = "";
        this.password = "";
        this.name = "";
        this.status = {};
    }

    hasProfile() {
        return this.status.hasProfile;
    }

    likeMemberAndGetNextMatch(memberId, cb, networkerrcb) {
        this.system.get(`members/likeMemberAndGetNextMatch/${memberId}/`, cb, networkerrcb)
    }

    skipMemberAndGetNextMatch(memberId, cb, networkerrcb) {
        this.system.get(`members/skipMemberAndGetNextMatch/${memberId}/`, cb, networkerrcb)
    }

    getLatestInboxMessages(cb, networkerrcb) {
        this.system.get(`members/getLatestInboxMessages/`, cb, networkerrcb)
    }

    getLatestLikedMembers(cb, networkerrcb) {
        this.system.get(`members/getLatestLikedMembers/`, cb, networkerrcb)
    }

    saveProfile(profileData, cb, networkerrcb) {
        // profileData = escape(profileData);
        this.system.get(`members/saveProfile/${profileData}/`, ()=>{
            this.init(()=>{
                this.system.triggerEvent("profile");
                 if(cb)cb();
            })
            
        }, networkerrcb);
    }

    getNextMatch(cb, networkerrcb) {
        // profileData = escape(profileData);
        this.system.get(`members/getNextMatch/`, cb, networkerrcb)
    }

    getPhotos(cb, networkerrcb) {
        // profileData = escape(profileData);
        this.system.get(`members/getSessionMemberPhotos/`, cb, networkerrcb)
    }

    savePhotos(photos, cb) {
        let fd = new FormData();
        for (let photo of photos) {
            fd.append("photos", photo);
        }
        console.log("POSTING");
        this.system.post("members/savePhotos/", fd, cb);
    }

    init(cb) {
        this.system.get("members/status/", status => {
            this.isLoggedIn = status.isLoggedIn;
            this.profile = status.profile;
            console.log("member profile: ", status);
            if (cb) cb();
        });
    }

    login(token, cb) {
        this.system.get(`members/login/${token}/`, cb);
    }

    logout(token, cb, networkerrcb) {
        //console.log("WTD!!!")
        this.system.get(`members/logout/`, cb, networkerrcb);
    }

    register(cb, ecb) {
        this.system.get(`members/register/?email=${this.email}&password=${this.password}&name=${this.name}`,
            cb, ecb);
    }
}