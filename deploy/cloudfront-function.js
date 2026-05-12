// CloudFront Function: viewer-request.
// Redirects www.spry-leverton.com → james.spry-leverton.com (301).
// Attach to the default cache behaviour of the distribution.
function handler(event) {
    var req = event.request;
    var hostHeader = req.headers.host;
    var host = hostHeader && hostHeader.value;

    if (host === "www.spry-leverton.com") {
        var qs = req.querystring && Object.keys(req.querystring).length
            ? "?" + Object.keys(req.querystring)
                .map(function (k) {
                    return k + "=" + req.querystring[k].value;
                })
                .join("&")
            : "";
        return {
            statusCode: 301,
            statusDescription: "Moved Permanently",
            headers: {
                location: {
                    value: "https://james.spry-leverton.com" + req.uri + qs,
                },
            },
        };
    }
    return req;
}
