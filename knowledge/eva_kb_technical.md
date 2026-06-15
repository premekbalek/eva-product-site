# EVA – Technical Knowledge Base

## 1) Koncepce: Intent → Use Case → Data → Resolution
EVA pracuje jako orchestrátor:
- rozpozná záměr (intent)
- ověří kontext (kdo volá, čeho se dotaz týká)
- ověří autorizaci
- zavolá potřebná data z backend služeb
- provede logiku use case a vrátí výsledek

## 2) Datové vrstvy a entity (Input Model – příklady)
EVA typicky pracuje s vrstvami vstupů:
A. Základní identifikace (ANI/ID zákazníka)
B. Segmentace zákazníka (VIP/SMB apod.)
C. Typ služby / produktu
D. Subjekt hovoru (účet/služba/faktura/zařízení)
E. Historie a metadata (poslední kontakt, otevřený ticket)
F. Záměr (intent)
G. Autorizace / oprávnění (PIN, heslo, token)

## 3) Stavový a procesní model (typické kroky)
1. Přivítání
2. Identifikace
3. Segmentace
4. Zjištění subjektu hovoru
5. Určení záměru (intent)
6. Kontrola oprávnění / autorizace
7. Use case execution
8. Změna subjektu / změna tématu (pokud nastane)

## 4) On-demand volání dat (optimalizace zátěže a latency)
Architektonický princip: integrační data se nemají volat preventivně při úvodní interakci.
Cílový stav: agent si volá potřebná data sám – pouze v případě potřeby.
Používají se existující REST/BF/BSL služby; MCP standard může být řešen separátně.

## 5) Omnichannel požadavky (channel-agnostic logika)
- Orchestrace (porozumění, delegace, řízení konverzace), data a kontext jsou sdílené napříč kanály.
- Frontend agenti sdílí stejné instrukce a backend agenty; liší se jen channel-specific I/O (např. STT/TTS pro voice).
- Přidání nového kanálu má být přes nový adaptér bez změny business logiky.
- Cross-channel handoff: případ může pokračovat mezi kanály bez ztráty kontextu.

## 6) Discovery → PI proces pro implementaci datových přístupů
Pokud se ND dostane do PI, implementace typicky zahrnuje přípravu datových endpointů (BFF/BSL REST) pro EVA. V procesu mohou vystupovat více týmů (na stejné úrovni) pro přípravu datových přístupů.

## 7) Doporučení pro backend implementaci chatu (pro tento web)
- Backend /api/chat:
  - vezme messages
  - vybere relevantní pasáže z KB (business+technical)
  - vloží je jako “Grounding Context” do promptu
  - zavolá LLM
  - vrátí answer + citations (KB headings)

## 8) Když se uživatel ptá na detaily integrací / infrastruktury
Odpovědi musí vycházet pouze z KB. Pokud KB neobsahuje konkrétní systém nebo detail, asistent to přizná a navrhne, jaké podklady doplnit (např. arch diagram, seznam systémů, API katalog).
