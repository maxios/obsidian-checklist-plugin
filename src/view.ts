import {ItemView, WorkspaceLeaf} from 'obsidian'

import {TODO_VIEW_TYPE} from './constants'
import App from './svelte/App.svelte'

import type { TodoSettings } from "./settings"
export default class TodoListView extends ItemView {
  private settings: TodoSettings
  private _app: App

  constructor(leaf: WorkspaceLeaf, settings: TodoSettings) {
    super(leaf)

    this.settings = settings
  }

  getViewType(): string {
    return TODO_VIEW_TYPE
  }

  getDisplayText(): string {
    return "Todo List"
  }

  getIcon(): string {
    return "checkmark"
  }

  async onClose() {
    this._app.$destroy()
  }

  private getProps() {
    return {
      todoTag: this.settings.todoPageName,
      showChecked: this.settings.showChecked,
      groupBy: this.settings.groupBy,
      sortDirection: this.settings.sortDirection,
      ignoreFiles: this.settings.ignoreFiles,
      lookAndFeel: this.settings.lookAndFeel,
      rerenderKey: Symbol("[rerender]"),
    }
  }

  async onOpen(): Promise<void> {
    this._app = new App({
      target: (this as any).contentEl,
      props: this.getProps(),
    })
    this.registerEvent(this.app.metadataCache.on("resolve", () => this.rerender()))
  }

  rerender() {
    this._app.$set(this.getProps())
  }
}
