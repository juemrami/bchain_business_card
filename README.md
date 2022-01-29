# Blockchain Business Card

This is a relatively simple smart contract implemented with a front end.

The contract allows you to _"mint"_ a business card for 5 NEAR.
Things you can do with you business card:

- Add a website.
- Display your NEAR account id.
- Claim blockchain development experience.
- Vouch and/or refute other business card holders personal claims.

All Business Cards will display your Net Vouches as a public rating.

I have yet to figure out the economics. This was built for the NEARxEncode Bootcamp Jan 2022.

To learn about the internals follow the README in [/Contract/](Contract/README.md)

To get started with deploying a contract and starting the fronted check the README [here in /frontend/](frontend/README.md).

__WARNING.__ - if you're on Windows please make you're on WSL (Windows Subsystem for Linux) and make that your End of Line settings for files is set to LF and not CRLF on the .sh script files, otherwise you might have trouble running the shell scripts.
