class CustomHttpReponseHeaders:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        response['Access-Control-Allow-Credentials'] = "true"
        return response

class CreateAnnoSession:
    def __init__(self, get_response):
        self.get_response = get_response
        # One-time configuration and initialization.

    def __call__(self, request):
        if not "memberId" in request.session:
            request.session.set_expiry(0)
            request.session["memberId"] = "anno"
            request.session["likes"] = {}

        response = self.get_response(request)
        return response