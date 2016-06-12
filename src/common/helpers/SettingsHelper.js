'use strict';

class SettingsHelper {
    /**
     * Gets all settings
     *
     * @param {String} section
     *
     * @return {Promise} promise
     */
    static getSettings(section) {
        return new Promise((callback) => {
            callback({});
        });
    }
    
    /**
     * Sets all settings
     *
     * @param {String} section
     * @param {Object} settings
     *
     * @return {Promise} promise
     */
    static setSettings(section, settings) {
        return new Promise((callback) => {
            callback({});
        });
    }
}

module.exports = SettingsHelper;