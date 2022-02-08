# Blockchain Business Card

try it out here 
https://block-cards.vercel.app/

This is NEAR chain dApp consisting a relatively simple smart contract written in rust and implemented with a Nextjs front end.

The contract allows you to _"mint"_ a business card for 5 NEAR.
Things you can do with you business card:

- Add a website.
- Display your NEAR account id.
- Claim blockchain development experience.
- Vouch and/or refute other business card holders personal claims.

All Business Cards will display their respective Net Vouches as a public rating.

__To get started with deploying the contract and starting up fronted check the README here in [/frontend/](frontend/README.md)__

Alternatively,

__To learn about the internals and the Rust smart contracts follow the README in [/Contract/](Contract/README.md)__

-----
## Screenshots

![site gif](https://i.imgur.com/kxvtUN5.gif)

----

__WARNING.__ - If you're on Windows please make sure you're using WSL2 (Windows Subsystem for Linux) and that your End of Line settings for files is set to `LF` and not `CRLF` on the, in particular for the  `.sh` script files, otherwise you might have trouble running the shell scripts.

_Note. I have yet to figure out the economics. But it would be interesting to budget the amount of times you can claim experience via time gating and ask the users to pay a small fee if they want to add additional experience within that time period. Or if a cards Net Vouches reaches 0, we could remove that experience from that card and the owner would have to pay to reclaim that experience._ 

---

I have yet to figure out the economics. This was built for the NEARxEncode Bootcamp Jan 2022.
