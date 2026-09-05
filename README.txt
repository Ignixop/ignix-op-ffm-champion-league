FREE FIRE MAX CHAMPION LEAGUE KISHTWAR — MANUAL PAYMENT WEBSITE
=================================================================

This version matches your new plan:

PLAYER PAYS ₹200 FIRST
        ↓
YOU CONFIRM THE PAYMENT
        ↓
YOU GIVE THE PLAYER A REGISTRATION CODE / LINK
        ↓
PLAYER OPENS THE WEBSITE
        ↓
PLAYER ENTERS CODE + TEAM/PLAYER NAMES + IN-GAME UIDs
        ↓
REGISTRATION IS SAVED
        ↓
YOU SEE IT IN THE IGNIX OP ADMIN DASHBOARD

WHAT IS INCLUDED
----------------
- Professional Free Fire MAX Champion League Kishtwar website
- 12 teams
- 4 players per team
- ₹200 entry fee
- Manual payment workflow
- Registration-code verification
- Team + captain details
- 4 player names
- 4 in-game UIDs
- 12-slot counter
- Private admin dashboard
- Confirm/reject/disqualify controls
- Final-stage points/kills entry
- Public leaderboard
- Netlify Functions + Netlify Blobs storage
- Mobile responsive design

IMPORTANT: HOW TO CONTROL THE REGISTRATION CODE
------------------------------------------------
In Netlify environment variables, create:

REGISTRATION_CODES=CODE1,CODE2,CODE3,CODE4,...

Only codes listed there can submit a registration.

Example:
REGISTRATION_CODES=IGNIX200A,IGNIX200B,IGNIX200C

After you receive a team's ₹200 payment, give them one unused code.

Do NOT reuse a code. Each code can be used once.

If you have 12 teams, prepare at least 12 unique codes.

For example:
1. IGNIX200A
2. IGNIX200B
3. IGNIX200C
...
12. IGNIX200L

You can generate your own codes. Do not put sensitive payment-account information in the public website.

PAYMENT
-------
This version does NOT take online payment on the website.

You collect ₹200 manually using your chosen payment method (for example UPI).
After you personally confirm that the money was received, give the team its
registration code.

The website records the registration as PAID because the code itself is issued only
after your manual payment confirmation.

ADMIN
-----
Open:
https://YOUR-SITE.netlify.app/admin.html

Use:
ADMIN_PASSWORD=your strong admin password

The dashboard lets you:
- View all registered teams
- View payment/registration code
- Confirm/reject/disqualify teams
- Enter final-stage points and kills
- Save standings

DEPLOYMENT
----------
Netlify is recommended because this project uses Netlify Functions and Netlify Blobs.

Environment variables required:
- ADMIN_PASSWORD
- REGISTRATION_CODES

The following variables from the automatic-payment version are NOT required for this
manual-payment version:
- RAZORPAY_KEY_ID
- RAZORPAY_KEY_SECRET
- RAZORPAY_WEBHOOK_SECRET

REGISTRATION LINK
-----------------
After deployment, your public registration page is simply:

https://YOUR-SITE.netlify.app/

You can send that link only to teams whose ₹200 payment you have confirmed.

For stronger control, the registration code prevents someone without a valid code from
submitting the form.

PUBLIC LEADERBOARD
------------------
https://YOUR-SITE.netlify.app/leaderboard.html

TOURNAMENT DETAILS ALREADY BUILT IN
-----------------------------------
- 12 teams
- 4 players per team
- 5 league matches
- Top 6 qualify
- 3 final matches
- Final-stage points reset
- 1st ₹1,000
- 2nd ₹500
- 3rd ₹300
- Placement + kill scoring
- Published cheating/disqualification rules

SECURITY
--------
Never publish ADMIN_PASSWORD.
Do not use an easily guessable admin password.
Do not put your personal UPI PIN, bank password, OTP, or other financial credentials
anywhere in the website.

BRANDING
--------
Organizer: IGNIX OP
Instagram: @yt.ignixop
Tournament: Free Fire MAX Champion League Kishtwar

The website identifies this as a community tournament and not an official Garena event.

FILES
-----
index.html             Public tournament + registration page
admin.html             Private admin page
admin.js               Admin dashboard logic
leaderboard.html       Public standings page
style.css              Complete visual design
netlify.toml            Netlify configuration
package.json            Netlify Blobs dependency
netlify/functions/     Registration/admin/data functions
assets/                 Tournament poster/background
