function calculateRisk(event) {
  const severityBands = {
    low: [0, 30],
    moderate: [31, 60],
    high: [61, 80],
    critical: [81, 100]
  };
  const severity = severityBands[event.severity]
    ? event.severity
    : "moderate";
  const [minimum, maximum] = severityBands[severity];
  const confidence = Math.max(
    0,
    Math.min(Number(event.confidence) || 0, 100)
  );
  const typeAdjustment = {
    industrial_emission: 5,
    crop_burning: 5,
    garbage_burning: 5,
    fire_smoke: 5,
    construction_dust: 3,
    dust_storm: 3,
    vehicle_emission: 2
  }[event.type] || 0;
  const score = Math.min(
    maximum,
    minimum + Math.round((maximum - minimum) * confidence / 100) + typeAdjustment
  );
  const riskLevel = severity;

  return {
    riskScore: score,
    riskLevel: riskLevel
  };
}

module.exports = {
  calculateRisk
};