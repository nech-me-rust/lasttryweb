# Návod na zprovoznění webu Nech mě růst na Forpsi hostingu

## Obsah
1. [Přehled webu](#přehled-webu)
2. [Požadavky](#požadavky)
3. [Příprava souborů](#příprava-souborů)
4. [Nastavení hostingu na Forpsi](#nastavení-hostingu-na-forpsi)
5. [Nahrání souborů](#nahrání-souborů)
6. [Nastavení domény](#nastavení-domény)
7. [Konfigurace Google Calendar](#konfigurace-google-calendar)
8. [Testování webu](#testování-webu)
9. [Údržba a aktualizace](#údržba-a-aktualizace)
10. [Řešení problémů](#řešení-problémů)

---

## Přehled webu

Tento web byl vytvořen pro organizaci **Nech mě růst z.s.** a obsahuje následující funkce:

### Hlavní funkce
- **Responzivní design** - web se přizpůsobí všem zařízením (desktop, tablet, mobil)
- **Dvojjazyčnost** - český a anglický jazyk s přepínačem
- **Stránka událostí** - kalendář s možností registrace na události
- **Virtuální adopce** - prezentace zvířat s možností adopce
- **Kontaktní formuláře** - propojené s emailem info@nechmerust.org

### Struktura webu
```
nechmerust-website/
├── index.html              # Hlavní stránka
├── zvirecí-obyvatele.html   # Stránka zvířat
├── virtualni-adopce.html    # Virtuální adopce
├── udalosti.html           # Události a kalendář
├── kontakt.html            # Kontaktní stránka
├── styles.css              # Hlavní CSS styly
├── script.js               # Hlavní JavaScript
├── events.js               # JavaScript pro události
├── translations.json       # Překlady pro jazyky
└── assets/                 # Obrázky a média
    ├── logo.png
    ├── logo-circle.png
    ├── hero-image.jpg
    └── další obrázky...
```

---

## Požadavky

### Hosting požadavky
- **Webhosting** s podporou HTML, CSS, JavaScript
- **PHP podpora** (volitelné, pro pokročilé funkce)
- **SSL certifikát** (doporučeno pro HTTPS)
- **Dostatečný prostor** - minimálně 100 MB pro všechny soubory

### Doména
- Registrovaná doména (již máte na Forpsi)
- DNS správa pro nastavení subdomén (volitelné)

---

## Příprava souborů

### 1. Kontrola souborů
Ujistěte se, že máte všechny tyto soubory:

**HTML soubory:**
- `index.html` - hlavní stránka
- `zvirecí-obyvatele.html` - zvířata
- `virtualni-adopce.html` - adopce
- `udalosti.html` - události
- `kontakt.html` - kontakt

**CSS a JavaScript:**
- `styles.css` - styly
- `script.js` - hlavní skripty
- `events.js` - funkce událostí
- `translations.json` - překlady

**Složka assets:**
- Všechny obrázky (.jpg, .png)
- Logo a ikony

### 2. Komprese souborů
Pro rychlejší nahrávání doporučujeme vytvořit ZIP archiv:
```bash
# V terminálu nebo příkazové řádce
zip -r nechmerust-website.zip nechmerust-website/
```

---

## Nastavení hostingu na Forpsi

### 1. Přihlášení do Forpsi
1. Jděte na [www.forpsi.com](https://www.forpsi.com)
2. Přihlaste se do svého účtu
3. Přejděte do sekce **"Správa služeb"**

### 2. Objednání webhostingu
Pokud ještě nemáte webhosting:

1. V administraci klikněte na **"Objednat službu"**
2. Vyberte **"Webhosting"**
3. Doporučujeme **"Webhosting Start"** nebo vyšší
4. Vyberte vaši doménu
5. Dokončete objednávku

### 3. Aktivace hostingu
Po objednání:
1. Počkejte na aktivační email (obvykle do 24 hodin)
2. V emailu najdete přístupové údaje pro FTP
3. Poznamenejte si:
   - **FTP server** (např. ftp.vasedomena.cz)
   - **Uživatelské jméno**
   - **Heslo**

---

## Nahrání souborů

### Metoda 1: Správce souborů Forpsi (doporučeno)

1. **Přihlášení do administrace:**
   - Jděte na [admin.forpsi.com](https://admin.forpsi.com)
   - Přihlaste se svými údaji

2. **Otevření správce souborů:**
   - Klikněte na vaši doménu
   - Vyberte **"Webhosting"**
   - Klikněte na **"Správce souborů"**

3. **Nahrání souborů:**
   - Přejděte do složky **"www"** nebo **"public_html"**
   - Klikněte na **"Nahrát soubory"**
   - Vyberte všechny soubory webu nebo ZIP archiv
   - Počkejte na dokončení nahrávání

4. **Rozbalení archivu (pokud jste nahrávali ZIP):**
   - Klikněte pravým tlačítkem na ZIP soubor
   - Vyberte **"Rozbalit"**
   - Potvrďte rozbalení

### Metoda 2: FTP klient

Pokud preferujete FTP klient (FileZilla, WinSCP):

1. **Nastavení FTP:**
   - Server: ftp.vasedomena.cz
   - Uživatel: váš FTP uživatel
   - Heslo: vaše FTP heslo
   - Port: 21

2. **Nahrání:**
   - Připojte se k FTP
   - Přejděte do složky `www` nebo `public_html`
   - Nahrajte všechny soubory webu

---

## Nastavení domény

### 1. DNS nastavení
Pokud je doména registrovaná u Forpsi:
1. V administraci jděte na **"DNS správa"**
2. Ujistěte se, že A záznam směřuje na IP adresu hostingu
3. Forpsi obvykle nastaví automaticky

### 2. SSL certifikát (HTTPS)
Pro zabezpečení webu:
1. V administraci webhostingu najděte **"SSL certifikáty"**
2. Aktivujte **"Let's Encrypt"** (zdarma)
3. Počkejte na aktivaci (do 24 hodin)

### 3. Přesměrování na HTTPS
Vytvořte soubor `.htaccess` v kořenovém adresáři:
```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

---

## Konfigurace Google Calendar

### 1. Vytvoření Google Calendar API klíče

1. **Google Cloud Console:**
   - Jděte na [console.cloud.google.com](https://console.cloud.google.com)
   - Vytvořte nový projekt nebo vyberte existující

2. **Aktivace Calendar API:**
   - V nabídce vyberte **"APIs & Services" > "Library"**
   - Vyhledejte **"Google Calendar API"**
   - Klikněte **"Enable"**

3. **Vytvoření API klíče:**
   - Jděte na **"APIs & Services" > "Credentials"**
   - Klikněte **"Create Credentials" > "API Key"**
   - Zkopírujte vygenerovaný klíč

### 2. Nastavení kalendáře

1. **Vytvoření veřejného kalendáře:**
   - Otevřete [calendar.google.com](https://calendar.google.com)
   - Vytvořte nový kalendář pro události
   - V nastavení kalendáře povolte **"Veřejný přístup"**

2. **Získání Calendar ID:**
   - V nastavení kalendáře najděte **"Calendar ID"**
   - Zkopírujte ID (např. `abc123@group.calendar.google.com`)

### 3. Aktualizace webu

Upravte soubor `events.js`:
```javascript
// Najděte tuto sekci a nahraďte hodnoty
class GoogleCalendarIntegration {
    constructor(calendarId) {
        this.calendarId = 'VÁŠ_CALENDAR_ID'; // Zde vložte Calendar ID
        this.apiKey = 'VÁŠ_API_KLÍČ'; // Zde vložte API klíč
    }
    // ... zbytek kódu
}

// Na konci souboru odkomentujte a upravte:
document.addEventListener('DOMContentLoaded', () => {
    const googleCalendar = new GoogleCalendarIntegration('VÁŠ_CALENDAR_ID');
    googleCalendar.syncEvents();
});
```

---

## Testování webu

### 1. Základní funkčnost
Po nahrání otestujte:

- ✅ **Načítání stránek** - všechny stránky se načítají bez chyb
- ✅ **Navigace** - menu funguje na všech stránkách
- ✅ **Responzivita** - web vypadá dobře na mobilu i desktopu
- ✅ **Jazykové přepínání** - přepínač CS/EN funguje
- ✅ **Formuláře** - registrace na události otevírá email

### 2. Mobilní testování
Otestujte na různých zařízeních:
- Smartphone (Android/iPhone)
- Tablet
- Desktop počítač

### 3. Prohlížeče
Ověřte kompatibilitu:
- Chrome
- Firefox
- Safari
- Edge

### 4. Rychlost načítání
Použijte nástroje:
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)

---

## Údržba a aktualizace

### 1. Pravidelná údržba

**Měsíčně:**
- Kontrola funkčnosti všech odkazů
- Aktualizace událostí v kalendáři
- Zálohování souborů webu

**Čtvrtletně:**
- Kontrola rychlosti webu
- Aktualizace kontaktních informací
- Přidání nových fotografií zvířat

### 2. Aktualizace obsahu

**Přidání nové události:**
1. Přidejte událost do Google Calendar
2. Web se automaticky aktualizuje (pokud je API nakonfigurované)

**Přidání nového zvířete:**
1. Nahrajte fotografii do složky `assets/`
2. Upravte soubor `zvirecí-obyvatele.html`
3. Přidejte informace o zvířeti

**Změna kontaktních údajů:**
1. Upravte soubor `kontakt.html`
2. Aktualizujte také `translations.json` pro anglickou verzi

### 3. Zálohování

**Automatické zálohování Forpsi:**
- Forpsi automaticky zálohuje data
- Zálohy jsou dostupné v administraci

**Ruční záloha:**
1. Stáhněte všechny soubory přes FTP
2. Uložte na bezpečné místo
3. Doporučená frekvence: měsíčně

---

## Řešení problémů

### Časté problémy a řešení

#### 1. Web se nenačítá
**Možné příčiny:**
- DNS ještě není propagované (počkejte 24-48 hodin)
- Špatné nastavení domény

**Řešení:**
- Zkontrolujte DNS nastavení v administraci Forpsi
- Kontaktujte podporu Forpsi

#### 2. Obrázky se nezobrazují
**Možné příčiny:**
- Chybí soubory v složce `assets/`
- Špatné cesty k obrázkům

**Řešení:**
- Zkontrolujte, že jsou všechny obrázky nahrané
- Ověřte názvy souborů (pozor na diakritiku)

#### 3. Jazykové přepínání nefunguje
**Možné příčiny:**
- Chybí soubor `translations.json`
- JavaScript chyby

**Řešení:**
- Zkontrolujte, že je `translations.json` nahraný
- Otevřete Developer Tools v prohlížeči a zkontrolujte chyby

#### 4. Formuláře nefungují
**Možné příčiny:**
- Email klient není nakonfigurovaný
- JavaScript chyby

**Řešení:**
- Formuláře otevírají výchozí email klient
- Ujistěte se, že máte nakonfigurovaný email

#### 5. Google Calendar se nezobrazuje
**Možné příčiny:**
- Chybí API klíč
- Kalendář není veřejný

**Řešení:**
- Zkontrolujte nastavení API klíče v `events.js`
- Ověřte, že je kalendář nastaven jako veřejný

### Kontakt na podporu

**Forpsi podpora:**
- Email: podpora@forpsi.com
- Telefon: +420 225 999 999
- Online chat na webu Forpsi

**Technická podpora webu:**
- Pro technické problémy s webem kontaktujte vývojáře
- Dokumentace je k dispozici v souborech webu

---

## Dodatečné informace

### Bezpečnost
- Pravidelně aktualizujte hesla
- Používejte silná hesla pro FTP a administraci
- Sledujte podezřelou aktivitu

### Výkon
- Optimalizujte obrázky před nahráním
- Používejte komprimované formáty (WebP, JPEG)
- Sledujte rychlost načítání webu

### SEO optimalizace
- Web obsahuje základní SEO optimalizaci
- Pro lepší výsledky zvažte přidání Google Analytics
- Pravidelně aktualizujte obsah

---

*Tento návod byl vytvořen pro web organizace Nech mě růst z.s. v roce 2025. Pro aktuální informace o službách Forpsi navštivte jejich oficiální dokumentaci.*

