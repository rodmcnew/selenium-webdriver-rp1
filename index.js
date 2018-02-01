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

module.exports.default = class Rp1 {
    constructor(driver, logger) {
        this._driver = driver;
        this._logger = logger;
        this._config = {retrySleepTime: 1000, retryCount: 60};
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
                this._logger('Retrying (' + tryNumber + '/' + this._config.retryCount + ')...');
            }
        }
    }

    async click(cssSelector) {
        const log = (message) => {
            this._logger('click("' + cssSelector + '") - ' + message);
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
            this._logger('waitForElement("' + cssSelector + '") - ' + message);
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

    async sendKeys(cssSelector, keys) {
        const log = (message) => {
            this._logger('sendKeys("' + cssSelector + '", "' + keys + '") - ' + message);
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
            this._logger('sleep(' + ms + ') - ' + message);
        };
        log('Sleeping...');
        await new Promise(resolve => setTimeout(resolve, ms));
        log('Done.');
    }
};
