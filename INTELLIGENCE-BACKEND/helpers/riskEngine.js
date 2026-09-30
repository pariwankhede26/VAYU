function calculateRisk(event) {
  let score = 0;

  // ------------------------------------
  // PM2.5 CONTRIBUTION
  // ------------------------------------
  if (event.pm25 >= 200) {
    score += 50;
  } else if (event.pm25 >= 150) {
    score += 40;
  } else if (event.pm25 >= 100) {
    score += 30;
  } else if (event.pm25 >= 50) {
    score += 20;
  } else {
    score += 10;
  }

  // ------------------------------------
  // CITIZEN REPORT CONTRIBUTION
  // ------------------------------------
  score += Math.min(event.reports * 2, 30);

  // ------------------------------------
  // POLLUTION TYPE CONTRIBUTION
  // ------------------------------------
  if (
    event.type === "industrial_emission" ||
    event.type === "garbage_burning"
  ) {
    score += 20;
  } else if (
    event.type === "vehicle_emission" ||
    event.type === "construction_dust"
  ) {
    score += 10;
  }

  // ------------------------------------
  // KEEP SCORE BETWEEN 0 AND 100
  // ------------------------------------
  score = Math.min(score, 100);

  // ------------------------------------
  // DETERMINE RISK LEVEL
  // ------------------------------------
  let riskLevel;

  if (score >= 80) {
    riskLevel = "critical";
  } else if (score >= 60) {
    riskLevel = "high";
  } else if (score >= 40) {
    riskLevel = "moderate";
  } else {
    riskLevel = "low";
  }

  return {
    riskScore: score,
    riskLevel: riskLevel
  };
}

module.exports = {
  calculateRisk
};