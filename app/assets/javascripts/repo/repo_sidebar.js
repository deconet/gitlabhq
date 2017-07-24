import Vue from 'vue';
import Service from './repo_service';
import Helper from './repo_helper';
import Store from './repo_store';
import RepoPreviousDirectory from './repo_prev_directory.vue';
import RepoFileOptions from './repo_file_options.vue';
import RepoFile from './repo_file.vue';
import RepoLoadingFile from './repo_loading_file.vue';
import RepoTabs from './repo_tabs.vue';
import RepoFileButtons from './repo_file_buttons.vue';
import RepoBinaryViewer from './repo_binary_viewer.vue';
import RepoEditor from './repo_editor.vue';
import RepoMiniMixin from './repo_mini_mixin';

export default class RepoSidebar {
  constructor(el) {
    this.initVue(el);
  }

  initVue(el) {
    this.vue = new Vue({
      el,
      mixins: [RepoMiniMixin],
      components: {
        'repo-file-options': RepoFileOptions,
        'repo-previous-directory': RepoPreviousDirectory,
        'repo-file': RepoFile,
        'repo-loading-file': RepoLoadingFile,
        'repo-tabs': RepoTabs,
        'repo-file-buttons': RepoFileButtons,
        'repo-binary-viewer': RepoBinaryViewer,
        'repo-editor': RepoEditor,
      },

      created() {
        this.addPopEventListener();
      },

      data: () => Store,

      methods: {
        addPopEventListener() {
          window.addEventListener('popstate', () => {
            if (location.href.indexOf('#') > -1) return;
            this.linkClicked({
              url: location.href,
            });
          });
        },

        linkClicked(clickedFile) {
          let url = '';
          let file = clickedFile;
          if (typeof file === 'object') {
            file.loading = true;
            if (file.type === 'tree' && file.opened) {
              file = Store.removeChildFilesOfTree(file);
              file.loading = false;
            } else {
              url = file.url;
              Service.url = url;
              // I need to refactor this to do the `then` here.
              // Not a callback. For now this is good enough.
              // it works.
              Helper.getContent(file, () => {
                file.loading = false;
                Helper.scrollTabsRight();
              });
            }
          } else if (typeof file === 'string') {
            // go back
            url = file;
            Service.url = url;
            Helper.getContent(null, () => {
              Helper.scrollTabsRight();
            });
          }
        },
      },
    });
  }
}
