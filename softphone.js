let webex;

function log(msg) {
  document.getElementById("log").innerHTML += "<p>" + msg + "</p>";
}

function initializeWebex(token) {
  webex = Webex.init({ credentials: { access_token: token } });
  webex.meetings.register().then(() => {
    log("Webex Ready");

    webex.meetings.on('meeting:added', event => {
      const meeting = event.meeting;
      meeting.on('ringing', () => {
        log("Incoming call detected");
        // Future: screen pop here
      });
    });
  });
}

function makeCall() {
  const number = document.getElementById("phoneNumber").value;
  webex.meetings.create(number).then(meeting => {
    meeting.join().then(() => log("Call started to " + number));
  });
}

// Get Webex token from URL (OAuth2 login)
window.onload = function () {
  const token = new URLSearchParams(window.location.hash.slice(1)).get("access_token");
  if (token) {
    initializeWebex(token);
  } else {
    log("Please log in with Webex");
  }
};