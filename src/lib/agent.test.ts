import assert from "node:assert/strict";
import {
  composeAfterSafety,
  composeOpening,
  composeReport,
  composeSceneReply,
  composeTalk,
  parseSafetyReply,
} from "./agent";
import { looksLikeEncounter } from "./talk";
import { areaForLocation, areaForReport, briefForSpecies } from "./areas";
import { demoEncounters } from "./encounters";
import { insightForAnalysis } from "./graph";

assert.equal(looksLikeEncounter("hi"), false);
assert.equal(looksLikeEncounter("I see a mountain lion"), true);
const hello = composeTalk("hi");
assert.equal(hello.followUp.phase, "talk");
assert.doesNotMatch(hello.messages[0], /^Next move/i);
assert.match(hello.messages[0], /wild signal|Pacific Heights|desk/i);
assert.match(composeTalk("who do I call").messages[0], /Fish & Wildlife|SFACC|911/i);

const lion = composeOpening(demoEncounters[0].analysis);
assert.equal(lion.guidance.riskLevel, "orange");
assert.match(lion.messages[0], /Next move/i);
assert.doesNotMatch(lion.messages[0], /^1\./m);
assert.equal(lion.followUp.phase, "scene");
assert.ok((lion.sceneTaps?.length ?? 0) >= 2);
assert.equal(lion.photon.poll?.title, "Are you currently safe?");
assert.equal(lion.photon.effect, "gentle");
assert.equal(lion.photon.tapback, "emphasized");
assert.ok(lion.analysis.visualEvidence.length >= 3);
assert.equal(parseSafetyReply("YES — I am safe"), true);
assert.equal(parseSafetyReply("NO — I need help now"), false);

const afterYes = composeAfterSafety(demoEncounters[0].analysis, true);
assert.equal(afterYes.photon.poll, undefined);
assert.equal(afterYes.followUp.phase, "details");

const report = composeReport(demoEncounters[0].analysis, {
  neighborhood: "44th & Ulloa",
  notes: "It walked into the street",
  witnessSafe: true,
});
assert.ok(report.report);
assert.match(report.report.publicDisplay, /Do not search for the animal/);
assert.ok(report.report.agency.url?.includes("wildlife.ca.gov"));
assert.equal(report.photon.appCard?.live, true);
assert.ok(report.photon.contact?.name.includes("Fish and Wildlife"));
assert.equal(report.photon.richLink?.url, "/map");
assert.match(report.messages[0], /neighborhood circle/i);
assert.equal(areaForLocation("44th & Ulloa")?.id, "outer-sunset");
assert.equal(areaForLocation("East Cut / Rincon Hill")?.id, "east-cut");
assert.equal(areaForLocation("Pacific Heights")?.id, "pacific-heights");
assert.equal(areaForLocation("Fell & Baker")?.id, "panhandle");
assert.equal(areaForLocation("Park Trail, Presidio")?.id, "presidio");
assert.equal(areaForLocation("Kearny Street steps")?.id, "telegraph-hill");
assert.equal(areaForReport("somewhere in the city", "coyote")?.id, "presidio");
assert.match(briefForSpecies("parrot")?.name ?? "", /conure/i);
assert.match(briefForSpecies("mountain_lion")?.name ?? "", /puma|cougar/i);
assert.match(briefForSpecies("mountain_lion")?.about ?? "", /2026|Pacific Heights|Panhandle/i);
assert.equal(areaForLocation("Fort Point dolphins")?.id, "fort-point");
assert.match(briefForSpecies("harbor_porpoise")?.about ?? "", /2008/);
assert.match(briefForSpecies("raccoon")?.about ?? "", /favorite/i);

const coyote = composeOpening(demoEncounters[1].analysis);
assert.equal(coyote.guidance.id, "coyote-with-dog");
assert.match(coyote.messages[0], /Next move/i);
const noDog = composeSceneReply(demoEncounters[1].analysis, "Not that: A dog is with me");
assert.equal(noDog.guidance.id, "coyote-observe");
assert.match(noDog.messages[0], /Next move/i);
const coyoteGraph = insightForAnalysis(demoEncounters[1].analysis);
assert.ok(coyoteGraph.similarCount >= 2);
assert.match(coyoteGraph.pattern, /escort/i);
assert.equal(coyoteGraph.area, "Presidio");

const parrot = composeOpening(demoEncounters[2].analysis);
assert.equal(parrot.guidance.id, "parrot-injured");
assert.match(parrot.guidance.agency.phone ?? "", /554-9400/);

console.log("agent tests passed");
