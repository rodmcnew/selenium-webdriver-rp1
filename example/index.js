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
