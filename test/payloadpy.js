async function main() {
  try {
    postMessageWithContentHeight();
    delayShowChallengeData();

    const challengeValue = document.getElementById('challenge')?.value;
    const incidentValue = document.getElementById('incident')?.value;
    setRunStatus("⧗");

    const result = await runChallenge();

    const token = result.token;
    const candidateData = {
      ...result,
      error: ""
    };

    const response = await sendCandidate(candidateData);

    const isMobile = new URLSearchParams(document.location.search).get(MODE_PARAM) === MOBILE_MODE;
    if (isMobile) {
      handleMobile(response);
    } else {
      handleWeb(response, token);
    }
    setRunStatus("✔");
  } catch (error) {
    console.error("Ошибка:", error);
    setRunStatus("✖");
  }
}