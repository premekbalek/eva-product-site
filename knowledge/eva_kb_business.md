# EVA – Business Knowledge Base

## 1) Co je EVA (definice)
EVA je AI-driven orchestration vrstva pro zákaznické interakce. EVA není “jen chatbot”: cílem je řešit zákaznické požadavky end-to-end (poskytnout informace i provést akce), a to konzistentně napříč kanály (chat/voice/app/web).

## 2) Proč EVA (business problémy, které řeší)
- Vysoká zátěž kontaktního centra kvůli opakovaným dotazům.
- Fragmentace kanálů (jiná logika a data pro voice vs chat vs app).
- Potřeba rychle zavádět nové use cases a měřit dopad.
- Potřeba jednotného pohledu na zákaznické interakce a dohled nad kvalitou.

## 3) Jak EVA vytváří hodnotu
- Offloading: část kontaktů vyřeší bez operátora (samoobsluha).
- Zrychlení: agent volá data jen když je potřeba (on-demand), což snižuje zátěž a latenci.
- Lepší CX: zákazník nemusí opakovat informace, systém pracuje s kontextem.
- Standardizace: jednotný postup od identifikace přes autorizaci po vyřešení.

## 4) Typický “end-to-end” proces (high-level)
EVA řeší interakci jako postup:
1. Přivítání a jazyk
2. Identifikace volajícího / zákazníka
3. Segmentace
4. Zjištění “subjektu” hovoru (čeho se dotaz týká – účet, služba, produkt)
5. Určení záměru (intent)
6. Autorizace (pokud je potřeba)
7. Spuštění use case a vyřešení požadavku

## 5) Příklady use cases (business view)
- Informace o účtu / faktuře / platbě (částka, splatnost, VS)
- Stav objednávky nebo požadavku (ticket/case)
- Proaktivní “doptání” pro upřesnění problému a navedení zákazníka do správného kanálu (offloading)
- Předání na operátora, když EVA nedokáže vyřešit (s předáním kontextu)

## 6) Jak se nové use cases dostávají do EVA (delivery proces)
Zjednodušený lifecycle:
- Zadání ve formě use case (často Excel)
- Přetavení do ND (New Delivery / feature/enabler)
- Discovery (business + architektura): potvrzení hodnoty, datové toky, integrační body, odhady
- Implementace v PI: vytvoření datových endpointů a napojení EVA na data

Delivery model:
- Společný produktový stream O2 + klient: O2 dodává platformu, orchestration know-how, implementaci a delivery governance; klient vlastní business výsledky, dostupnost zdrojových systémů, bezpečnostní schválení a operační převzetí.
- Typické fáze: discovery a framing -> solution design -> build a validace -> pilot, scale a governance.
- Orientační milníky: Week 0 kick-off; Weeks 1-2 prioritizace use cases a KPI baseline; Weeks 3-4 solution blueprint; Weeks 5-8 MVP flows a integrace pro UAT; Weeks 9-10 UAT, security validation a runbooks; Weeks 11-12 controlled pilot; Weeks 13-14 pilot review a scale decision.

## 7) Metriky (co typicky měřit)
- Míra automatického vyřešení (containment / resolution)
- Přepojení na operátora a důvody
- Latence odpovědi / počet backend volání
- NPS / spokojenost po interakci (pokud dostupné)
