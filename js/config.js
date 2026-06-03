// JSOW v9 - Config
var USERS=[
{email:'student@jsow.com.au',hash:'703b0a3d6ad75b649a28adde7d83c6251da457549263bc7ff45ec709b0a8448b',role:'student',name:'Wine Enthusiast',initials:'WE'},
{email:'hilary@jsow.com.au',hash:'cde383eee8ee7a4400adf7a15f716f179a2eb97646b37e089eb8d6d04e663416',role:'teacher',name:'Hilary Fordham',initials:'HF'},
{email:'admin@jsow.com.au',hash:'240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',role:'admin',name:'JSOW Admin',initials:'JA'}
];
var MAX_ATTEMPTS=5;
var LOCKOUT_SECONDS=30;
var SESSION_HOURS=24;
var loginAttempts=0;
var lockoutUntil=0;
function hashPassword(pw){var enc=new TextEncoder();return crypto.subtle.digest('SHA-256',enc.encode(pw)).then(function(buf){return Array.from(new Uint8Array(buf)).map(function(b){return b.toString(16).padStart(2,'0')}).join('')})}
function setUserPassword(email,pw){return hashPassword(pw).then(function(h){var u=USERS.find(function(x){return x.email===email});if(u){u.hash=h;return true}return false})}
function generateTempPassword(){var c='ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';var p='';for(var i=0;i<10;i++)p+=c[Math.floor(Math.random()*c.length)];return p}
