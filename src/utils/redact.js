const redactSensitiveData = (input) => {
  if (typeof input === "string") {
    return input
      .replace(/("password":"[^"]*")/g, '"password":"[REDACTED]"')
      .replace(/("apiKey":"[^"]*")/g, '"apiKey":"[REDACTED]"')
      .replace(/("email":"[^"]*")/g, '"email":"[REDACTED]"')
      .replace(
        /("email"|'email'|email)\s*:\s*["']?[^"']*["']?/g,
        '$1: "[REDACTED]"'
      )
      .replace(/("phoneNumber":"[^"]*")/g, '"phoneNumber":"[REDACTED]"')
      .replace(/("secret":"[^"]*")/g, '"secret":"[REDACTED]"');
  }
  if (typeof input === "object") {
    return JSON.parse(
      JSON.stringify(input, (key, value) => {
        if (typeof value === "string") {
          return redactSensitiveData(value);
        }
        return value;
      })
    );
  }
  return input;
};

module.exports = redactSensitiveData;
