---
title: "UPS External Bypass Switch does not mean Zero Downtime"
date: 2026-03-01
featureimage: "/images/upsextthum.png"
draft: true
tags: ["Focus Mindset"]
---

<span class="tag-focus-mindset">Focus Mindset</span>

Focus Mindset - Technical

The misconception that keeps causing outages
Many facility teams assume that installing an External Maintenance Bypass Switch (MBS) automatically guarantees zero downtime during UPS maintenance. In reality, the bypass switch is only as good as its transfer philosophy. Unless the switch is engineered as make before break (MBB), the load will experience an interruption.
“An external bypass is not a magic shield. Only a make before break design can deliver true zero downtime UPS maintenance.”
This misunderstanding shows up repeatedly in data centers, hospitals, and industrial plants — often discovered only after a real outage.
How bypass switching actually works
The external bypass is designed to route power around the UPS so maintenance can be performed safely. But the method of switching determines whether the load stays energized.
Make Before Break (MBB) — the only path to zero downtime
This design closes the bypass path before opening the UPS path. For a short overlap period, both sources are paralleled and synchronized.
•  Sequence:
o	Bypass closes
o	UPS output still connected
o	UPS opens
o	Load never loses power
•	Outcome:
No interruption. The waveform remains continuous.
•	Engineering requirements:
•	UPS inverter must synchronize with bypass source
•	Mechanical and electrical interlocks to prevent backfeed
•	Overlap timing must be verified under load
•	Typically larger, more expensive, and more complex
“If your bypass switch doesn’t synchronize and overlap, it cannot claim zero downtime — full stop.”
Break Before Make (BBM) — guaranteed interruption
This design opens the UPS path before closing the bypass path. The load is momentarily floating.
•	Sequence:
o	UPS opens
o	Load disconnected
o	Bypass closes
•	Outcome:
A measurable power drop, typically 4–20 ms.
Enough to drop servers, PLCs, BMS controllers, and sensitive electronics.
•	Where it’s used:
Commercial buildings, non critical loads, low tier systems.
•	Why it fails:
No synchronization, no overlap, no continuity.
Why FM teams often get this wrong
Most bypass panels look identical from the outside. Labels like UPS, Bypass, and Isolate don’t reveal the switching philosophy. Unless someone checks the wiring diagram or the manufacturer’s spec sheet, the assumption becomes dangerous.
Common failure points include:
•	Assuming “external bypass” = “zero downtime”
•	Confusing internal static bypass with external maintenance bypass
•	Not verifying synchronization capability
•	Never performing a live transfer test
•	Relying on vendor sales language instead of engineering drawings
“Zero downtime is not a feature — it’s a design decision.”
How to verify your bypass type
A competent electrical engineer should confirm:
•	SLD and wiring diagram — look for overlap contacts
•	Switch mechanism — MBB systems have interlocked, overlapping poles
•	UPS specifications — must support synchronized transfer
•	Live test — controlled, monitored, and documented
•	Manufacturer confirmation — explicitly ask: “Is this MBB or BBM?”
If the answer is BBM, your system cannot support zero downtime UPS maintenance.
An external bypass switch is not a guarantee.
A UPS is not a guarantee.
A maintenance plan is not a guarantee.
Only a Make Before Break bypass design provides true zero downtime capability.
Everything else is a controlled outage waiting to happen.
