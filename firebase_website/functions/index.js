// Export functions from separate files
const visitcounter = require('./visitcounter');

// Re-export named exports so Firebase can find them from the default entry file
exports.incrementVisitCount = visitcounter.incrementVisitCount;
