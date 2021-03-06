'use strict';

const FieldEditor = require('./FieldEditor');

/**
 * A simple string editor
 *
 * @description Example:
 * <pre>
 * {
 *     "myString": {
 *         "label": "My string",
 *         "tabId": "content",
 *         "schemaId": "string"
 *     }
 * }
 * </pre>
 *
 * @memberof HashBrown.Client.Views.Editors.FieldEditors
 */
class StringEditor extends FieldEditor {
    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        this.fetch();
    }
    
    /**
     * Render this editor
     */
    template() {
        return _.div({class: 'editor__field__value'},
            new HashBrown.Views.Widgets.Input({
                type: 'text',
                value: this.value,
                tooltip: this.description || '',
                onChange: (newValue) => {
                    this.value = newValue;

                    this.trigger('change', this.value);
                }
            })
        );
    }
}

module.exports = StringEditor;
