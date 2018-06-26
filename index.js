/*
Copyright 2018 Rodney McNew

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
 */

const {Builder, By, Key, until} = require('selenium-webdriver');

module.exports.Rp1 = class Rp1 {
    /**
     * A helper that makes using the selenium-webdriver node package simple and reliable in Javascript.
     *
     * @param {object} driver The driver from the selenium-webdriver package
     * @param {object} [config] Optional config overrides
     */
    constructor(driver, config) {
        this._driver = driver;
        this._config = Object.assign({}, {
            logFunction: console.log,
            retrySleepTime: 1000,
            retryCount: 60
        }, config);
    }

    async _retry(asyncFunctionToTry) {
        let tryNumber = 0;
        while (true) {
            tryNumber++;
            try {
                await asyncFunctionToTry();
                return;
            }
            catch (e) {
                if (tryNumber > this._config.retryCount) {
                    throw e;
                }
                await this.sleep(this._config.retrySleepTime);
                this._config.logFunction('Retrying (' + tryNumber + '/' + this._config.retryCount + ')...');
            }
        }
    }

    async click(cssSelector) {
        const log = (message) => {
            this._config.logFunction('click("' + cssSelector + '") - ' + message);
        };
        let element;

        log('Finding element...');
        await this._retry(async () => {
            element = await this._driver.findElement(By.css(cssSelector));
        });

        log('Waiting until element is visible...');
        await this._retry(async () => {
            await this._driver.wait(until.elementIsVisible(element));
        });

        log('Clicking element...');
        await this._retry(async () => {
            await element.click();
        });

        log('Done.');
    }

    async waitForElement(cssSelector) {
        const log = (message) => {
            this._config.logFunction('waitForElement("' + cssSelector + '") - ' + message);
        };
        let element;

        log('Finding element...');
        await this._retry(async () => {
            element = await this._driver.findElement(By.css(cssSelector));
        });

        log('Waiting until element is visible...');
        await this._retry(async () => {
            await this._driver.wait(until.elementIsVisible(element));
        });

        log('Done.');
    }

    /**
     * Waits for the element to be in the dom and visible. Then waits for it's value to pass
     * the user-defined passed in test function.
     *
     * @param {string} cssSelector
     * @param {function} testFunction(value) user defined function returns true if passes test, false if not
     * @return {Promise<void>}
     */
    async waitForElementValueToPassTest(cssSelector, testFunction) {
        const log = (message) => {
            this._config.logFunction('waitForElement("' + cssSelector + '") - ' + message);
        };
        let element;

        log('Finding element...');
        await this._retry(async () => {
            element = await this._driver.findElement(By.css(cssSelector));
        });

        log('Waiting until element is visible...');
        await this._retry(async () => {
            await this._driver.wait(until.elementIsVisible(element));
        });

        log('Waiting until element value passes user defined test function...');
        await this._retry(async () => {
            const elementValue = await element.getAttribute('value');
            if (testFunction(elementValue)) {
                log('The element\'s value has passed the user defined test function.');
                return;
            } else {
                throw 'The element\'s value did NOT pass the user defined test function.';
            }
        });

        log('Done.');
    }

    /**
     * @param {string} cssSelector
     * @return {Promise<void>}
     */
    async getElementValue(cssSelector) {
        const log = (message) => {
            this._config.logFunction('waitForElement("' + cssSelector + '") - ' + message);
        };
        let element;

        log('Finding element...');
        await this._retry(async () => {
            element = await this._driver.findElement(By.css(cssSelector));
        });

        log('Waiting until element is visible...');
        await this._retry(async () => {
            await this._driver.wait(until.elementIsVisible(element));
        });

        log('Getting value from element...');
        return element.getAttribute("value")
    }

    async sendKeys(cssSelector, keys) {
        const log = (message) => {
            this._config.logFunction('sendKeys("' + cssSelector + '", "' + keys + '") - ' + message);
        };
        let element;

        log('Finding element...');
        await this._retry(async () => {
            element = await this._driver.findElement(By.css(cssSelector));
        });

        log('Waiting until element is visible...');
        await this._retry(async () => {
            await this._driver.wait(until.elementIsVisible(element));
        });

        log('Sending keys...');
        await element.sendKeys(keys);

        log('Done.');
    }

    async sleep(ms) {
        const log = (message) => {
            this._config.logFunction('sleep(' + ms + ') - ' + message);
        };
        log('Sleeping...');
        await new Promise(resolve => setTimeout(resolve, ms));
        log('Done.');
    }
};
