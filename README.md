# Selenium Webdriver Rp1

This isn't highly refined kerosene. This is a helper for the selenium-webdriver 
node package. This package provides these features:
- Retries commands a number of times to allow apps time to load but still run through your tests as quickly as possible
- Automatically waits for elements to both be in the dom and become visible before acting upon them
- Only speaks in CSS selectors to simplify your tests
- Detailed logging

# Installation
```bash
npm install selenium-webdriver-rp1
```

# Example Usage
```javascript
const {Builder} = require('selenium-webdriver');
const {Rp1} = require('selenium-webdriver-rp1');
require('geckodriver');

(async function example() {
    let driver = await new Builder().forBrowser('firefox').build();
    try {
        const rp1 = new Rp1(driver);

        await driver.get('https://google.com');

        await rp1.sendKeys('input[type=text]', 'rocket propellant 1');

        await rp1.click('input[type=submit]');

        await rp1.waitForElement('div#top_nav');

        await rp1.sleep(10000); //10 seconds
    } finally {
        await driver.quit();
    }
})();

```

# Open Source ISC License
Copyright 2020 Reliv International

Permission to use, copy, modify, and/or distribute this software for any 
purpose with or without fee is hereby granted, provided that the above 
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES 
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF 
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR 
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES 
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN 
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF 
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
