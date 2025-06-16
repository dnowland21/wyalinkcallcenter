let webex;

function log(msg) {
  const logDiv = document.getElementById("log");
  logDiv.innerHTML += "<p>" + msg + "</p>";
}

function loginWithWebex() {
  const client_id = "C88a07f0c268961876422974c5ff4bbe62dc2a21d66c331f606361ffa912f807a"; // 🔁 Replace with your Webex Client ID
  const redirect_uri = window.location.origin + window.location.pathname;
  const scopes = "spark:all spark:kms spark:telephony";
  const authUrl = `https://webexapis.com/v1/authorize?client_id=${client_id}&response_type=token&redirect_uri=${encodeURIComponent(redirect_uri)}&scope=${encodeURIComponent(scopes)}&state=12345`;
  window.location.href = authUrl;
}

function initializeWebex(token) {
  webex = Webex.init({ credentials: { access_token: token } });

  webex.meetings.register().then(() => {
    log("✅ Webex SDK registered");

    webex.meetings.on('meeting:added', (event) => {
      const meeting = event.meeting;

      meeting.on('ringing', () => {
        log("📲 Incoming call detected");
        // 🚀 Optional: Add screen pop logic here using sforce.interaction.searchAndScreenPop
      });

      meeting.on('ended', () => {
        log("📞 Call ended");
        // 📥 Optional: Add call logging to Salesforce here
      });
    });
  });
}

function makeCall() {
  const number = document.getElementById("phoneNumber").value;
  if (!webex) {
    log("⚠️ Webex not initialized. Please log in first.");
    return;
  }

  webex.meetings.create(number).then(meeting => {
    meeting.join().then(() => {
      log("📞 Call started to " + number);
      // 📝 Optional: Create Salesforce Task with sforce.interaction.saveLog
    });
  });
}

window.onload = function () {
  const token = new URLSearchParams(window.location.hash.slice(1)).get("access_token");

  if (token) {
    initializeWebex(token);
    log("✅ Logged into Webex");
  } else {
    log("🔒 Not logged in. Please click 'Log In with Webex'.");
  }

  // 📞 Salesforce Open CTI: Enable click-to-dial
  if (typeof sforce !== "undefined" && sforce.interaction) {
    sforce.interaction.cti.enableClickToDial(true);
    sforce.interaction.onClickToDial(function(payload) {
      document.getElementById("phoneNumber").value = payload.number;
      makeCall();
    });
  }
};