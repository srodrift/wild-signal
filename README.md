# WildSignal

**See it. Understand it. Keep it wild.**

An iMessage wildlife-coexistence agent for San Francisco, built for Hack for Humanity (Gemini + Photon). Residents send a photo of what they just saw. Gemini interprets the species, behavior, and scene. WildSignal replies with reviewed instructions from the California Department of Fish and Wildlife, the Presidio Trust, the National Park Service, and San Francisco Animal Care & Control — then prepares a report for the desk that actually needs it.

This is not a disability-assist app and not a general “ask me anything about SF” chatbot. It exists because the city has an **encounter-interpretation** problem: people must tell ordinary wildlife from preventable conflict, an injured animal, and a genuine emergency, often in one minute on a sidewalk.

## Why this problem

- **2026 in the City:** a 77-pound male in Pacific Heights (January 27), a lion in a Panhandle tree at Fell and Baker (September 5, left overnight), and a juvenile male at 44th and Ulloa in the Outer Sunset (September 18). ([SFGate](https://www.sfgate.com/bayarea/article/mountain-lion-san-francisco-21317850.php), [The Standard](https://sfstandard.com/2026/09/06/sf-panhandle-mountain-lion-sighting/), [KTVU](https://www.ktvu.com/news/mountain-lion-tranquilized-captured-outer-sunset))
- **Most sightings are not attacks.** CDFW says mountain lions generally avoid people; official guidance is not to run, not to crouch, to face the animal, and to give it an escape route. ([CDFW](https://wildlife.ca.gov/HWC/Mountain-Lions))
- **Coyotes are residents.** They returned to the Presidio in 2002. Through early October 2026, two Presidio trails are closed to dogs for pupping season. A coyote following a person with a dog is often *escorting*, not hunting. ([Presidio Trust](https://presidio.gov/about/press/presidio-trails-close-to-dogs-for-coyote-pupping-season), [SFACC](https://www.sfanimalcare.org/living-with-urban-wildlife/coyote-sightings/))
- **Road collisions** are a primary cause of Bay Area coyote death. ([NPS](https://www.nps.gov/goga/learn/nature/coyotes.htm))
- **Wild parrots** are San Francisco’s official animal (Ordinance 124-23, 2023). ([File 230451](https://sfgov.legistar.com/LegislationDetail.aspx?GUID=25610515-C59C-488E-BB3D-EE911ADFB293&ID=6177115))

The evidence table — claim, source, and the product decision it forced — lives at `/evidence`.

## Submit this (MLH)

Use `/pitch` for the paste-ready submission and the 90-second demo script.

- **Best Use of Gemini:** multimodal visual evidence on a bad photograph, structured JSON, no invented safety advice.
- **Best Use of Photon:** the agent lives in iMessage and uses tapbacks, effects, polls, rich links, contact cards, a live App card, and a private response group.

## What you can do in the demo

1. Open `/signal`. Press **Play 90-second walkthrough**, or tap the **Outer Sunset** card (keys `1` / `2` / `3` also switch lion, coyote, parrot).
2. You get **one next move**, not a pamphlet. Tap what you actually see — the move changes. Then YES, then share a block.
3. Reply **YES**.
4. Send an intersection. WildSignal prepares a CDFW / SFACC packet, a *blurred* public line, and a neighborhood circle on `/map`.
5. Repeat for the Presidio coyote (dog on the Park Trail) and the Telegraph Hill parrot.

Exact locations never become a live public pin. Dens, roosts, and coordinates stay off the internet. `/map` has notes on mountain lions, coyotes, and cherry-headed conures.

Judge slides live at `/slides` (arrow keys, `F` fullscreen, print to PDF). The header is the mark plus the public number. Extra pages live under **More**, and again in the footer. Optional sound is off until you click **Sound**. **Read last reply** uses the browser voice. Nothing autoplays.

The mark is the San Francisco peninsula in International Orange, with **wild / signal** typed the way a city paper would stamp it.

## Sponsored tools only

| Tool | Job |
| --- | --- |
| **Google Gemini** | Multimodal scene analysis. Structured JSON only. No safety prose. |
| **Photon Spectrum** | iMessage (and this web surface, which runs the same agent loop). |

Guidance is a curated rule file, not a prompt. No OpenAI, Anthropic, iNaturalist, Google Maps, or database. OpenStreetMap tiles are used only for delayed neighborhood circles.

## Run it

```bash
npm install
cp .env.example .env.local   # add GEMINI_API_KEY for live photos
npm run dev
```

Create the Gemini key in [Google AI Studio](https://aistudio.google.com/apikey): **Create API key** (top right) → new or existing project → copy once → paste into `.env.local` as `GEMINI_API_KEY=...` → restart `npm run dev`. Do not commit the key.

FalkorDB is optional. The pattern graph runs in memory for the demo. To write the same Cypher into a live instance:

```bash
docker run -p 6379:6379 --rm falkordb/falkordb:latest
```

Then set `FALKORDB_HOST=127.0.0.1` in `.env.local`.

The app listens on **http://127.0.0.1:43217**.

- Without `GEMINI_API_KEY`, the three demo encounters still run on curated analysis so you can walk the full conversation.
- With a key, Gemini reads uploaded photos and the demo images.
- With Photon credentials, `POST /api/photon/webhook` is the inbound iMessage seam. The agent code does not change.
- **Demo on `/signal`.** Photon’s shared 628 line only hears phones already listed as project users. A stranger — or a judge who just texts the number — gets a bounce. Do not put that on the projector. The walkthrough in the browser is the same agent loop. `/text` is optional, later.

## Safety

WildSignal is **not** an emergency service and cannot confirm a species from an image. If a person is in danger, call **911**. Mountain lion reports go to [CDFW WIR](https://apps.wildlife.ca.gov/wir/). Injured wildlife in the city goes to SFACC dispatch: **(415) 554-9400** (6 a.m.–midnight).

Demo photographs are public Wikimedia images used as reconstructions. They are not live sightings and are not the September 18 Outer Sunset animal.
