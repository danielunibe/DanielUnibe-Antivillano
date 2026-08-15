const origin = process.env.PORTFOLIO_ORIGIN?.replace(/\/$/, '');
const secret = process.env.UNIBELANDS_OWNER_CONNECT_SECRET;

if (!origin || !secret) {
  throw new Error('Set PORTFOLIO_ORIGIN and UNIBELANDS_OWNER_CONNECT_SECRET before running this command.');
}

const response = await fetch(`${origin}/api/auth/linkedin`, {
  method: 'POST',
  headers: { authorization: `Bearer ${secret}` },
});

if (!response.ok) {
  throw new Error(`The private LinkedIn connection endpoint returned ${response.status}. Check the production environment configuration.`);
}

const payload = await response.json();
if (!payload || typeof payload.authorizationUrl !== 'string') {
  throw new Error('The private LinkedIn connection endpoint did not return an authorization URL.');
}

console.log('Open this one-time LinkedIn authorization URL in the owner browser:');
console.log(payload.authorizationUrl);
