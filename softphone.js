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
}
function loginWithWebex() {
  const client_id = "C88a07f0c268961876422974c5ff4bbe62dc2a21d66c331f606361ffa912f807a";
  const redirect_uri = window.location.origin + window.location.pathname;
  const scopes = "spark:all spark:kms spark:telephony";
  const authUrl = `https://webexapis.com/v1/authorize?client_id=${client_id}&response_type=token&redirect_uri=${encodeURIComponent(redirect_uri)}&scope=${encodeURIComponent(scopes)}&state=12345`;

  window.location.href = authUrl;
};
