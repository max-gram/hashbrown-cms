'use strict';

const NavbarPane = require('./NavbarPane');
const NavbarMain = require('./NavbarMain');

class FormsPane extends NavbarPane {
    /**
     * Event: Click create new form
     */
    static onClickNewForm() {
        apiCall('post', 'forms/new')
        .then((newFormId) => {
            reloadResource('forms')
            .then(() => {
                NavbarMain.reload();
                
                location.hash = '/forms/' + newFormId;
            });
        })
        .catch(UI.errorModal);
    }
    
    /**
     * Event: On click remove
     */
    static onClickRemoveForm() {
        let view = this;
        let $element = $('.cr-context-menu__target-element'); 
        let id = $element.data('id');
        let form = resources.forms.filter((form) => { return form.id == id; })[0];

        function onSuccess() {
            debug.log('Removed Form with id "' + form.id + '"', view); 
            
            return reloadResource('forms')
            .then(function() {
                NavbarMain.reload();
                
                // Cancel the FormEditor view
                location.hash = '/forms/';
            });
        }

        function onError(err) {
            new HashBrown.Views.Modals.MessageModal({
                model: {
                    title: 'Error',
                    body: err.message
                }
            });
        }

        new HashBrown.Views.Modals.MessageModal({
            model: {
                title: 'Delete form',
                body: 'Are you sure you want to delete the form "' + form.title + '"?'
            },
            buttons: [
                {
                    label: 'Cancel',
                    class: 'btn-default',
                    callback: () => {
                    }
                },
                {
                    label: 'Delete',
                    class: 'btn-danger',
                    callback: () => {
                        apiCall('delete', 'forms/' + form.id)
                        .then(onSuccess)
                        .catch(onError);
                    }
                }
            ]
        });
    }
    
    /**
     * Event: Click pull Form
     */
    static onClickPullForm() {
        let pullId = $('.cr-context-menu__target-element').data('id');

        // API call to pull the Form by id
        apiCall('post', 'forms/pull/' + pullId, {})
        
        // Upon success, reload all Form models    
        .then(() => {
            return reloadResource('forms');
        })

        // Reload the UI
        .then(() => {
            NavbarMain.reload();

			location.hash = '/forms/' + pullId;
		
			let editor = ViewHelper.get('FormEditor');

			if(editor && editor.model.id == pullId) {
                editor.model = null;
				editor.fetch();
			}
        }) 
        .catch(UI.errorModal);
    }
    
    /**
     * Event: Click push Form
     */
    static onClickPushForm() {
		let $element = $('.cr-context-menu__target-element');
        let pushId = $element.data('id');

		$element.parent().addClass('loading');

        apiCall('post', 'forms/push/' + pushId)
        .then(() => {
            return reloadResource('forms');
        })
        .then(() => {
            NavbarMain.reload();
        }) 
        .catch(UI.errorModal);
    }

    /**
     * Init
     */
    static init() {
        NavbarMain.addTabPane('/forms/', 'Forms', 'wpforms', {
            getItems: () => { return resources.forms; },

            // Hierarchy logic
            hierarchy: function(item, queueItem) {
                queueItem.$element.attr('data-form-id', item.id);
               
                if(item.folder) {
                    queueItem.createDir = true;
                    queueItem.parentDirAttr = {'data-form-folder': item.folder };
                }
            },
            
            // Item context menu
            getItemContextMenu: (item) => {
                let menu = {};
                let isSyncEnabled = HashBrown.Client.Helpers.SettingsHelper.getCachedSettings(ProjectHelper.currentProject, null, 'sync').enabled;
                
                menu['This form'] = '---';
                menu['Copy id'] = () => { this.onClickCopyItemId(); };

                if(!item.local && !item.remote && !item.locked) {
                    menu['Remove'] = () => { this.onClickRemoveForm(); };
                }
                
                if(item.locked && !item.remote) { isSyncEnabled = false; }

                if(isSyncEnabled) {
                    menu['Sync'] = '---';

                    if(!item.remote) {
                        menu['Push to remote'] = () => { this.onClickPushForm(); };
                    }

                    if(item.local) {
                        menu['Remove local copy'] = () => { this.onClickRemoveForm(); };
                    }
                    
                    if(item.remote) {
                        menu['Pull from remote'] = () => { this.onClickPullForm(); };
                    }
                }

                return menu;
            },
            
            // General context menu
            paneContextMenu: {
                'Forms': '---',
                'New form': () => { this.onClickNewForm(); }
            }
        });
    }
}

module.exports = FormsPane;
