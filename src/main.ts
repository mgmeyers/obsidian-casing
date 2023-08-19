import { Editor, MarkdownFileInfo, Menu, Plugin } from 'obsidian';
import { sentenceCase, titleCase } from './casing';
import { lower, upper } from './util';

// Remember to rename these classes and interfaces!

// interface MyPluginSettings {
//   mySetting: string;
// }

// const DEFAULT_SETTINGS: MyPluginSettings = {
//   mySetting: 'default',
// };

function applyToHeadings(
  editor: Editor,
  ctx: MarkdownFileInfo,
  fn: (str: string) => string
) {
  if (ctx.file) {
    const cache = ctx.app.metadataCache.getFileCache(ctx.file);

    if (cache?.headings) {
      for (const heading of cache.headings) {
        const lineNum = heading.position.start.line;
        const line = editor.getLine(lineNum);
        editor.setLine(lineNum, fn(line));
      }
    }
  }
}

function applyToCurrentLine(editor: Editor, fn: (str: string) => string) {
  const cursor = editor.getCursor('from');
  const line = editor.getLine(cursor.line);
  editor.setLine(cursor.line, fn(line));
}

function applyToCurrentSelection(editor: Editor, fn: (str: string) => string) {
  editor.transaction({
    changes: editor.listSelections().map((sel) => {
      const from =
        sel.head.line < sel.anchor.line && sel.head.ch < sel.anchor.ch
          ? sel.head
          : sel.anchor;
      const to = from === sel.anchor ? sel.head : sel.anchor;

      const range = editor.getRange(from, to);

      return {
        from,
        to,
        text: fn(range),
      };
    }),
  });
}

export default class MyPlugin extends Plugin {
  //   settings: MyPluginSettings;

  async onload() {
    // await this.loadSettings();
    this.addCommand({
      id: 'heading-title-case',
      name: 'Convert headings to title case',
      editorCallback(editor, ctx) {
        applyToHeadings(editor, ctx, titleCase);
      },
    });

    this.addCommand({
      id: 'heading-sentence-case',
      name: 'Convert headings to sentence case',
      editorCallback(editor, ctx) {
        applyToHeadings(editor, ctx, sentenceCase);
      },
    });

    this.addCommand({
      id: 'line-title-case',
      name: 'Convert current line to title case',
      editorCallback(editor) {
        applyToCurrentLine(editor, titleCase);
      },
    });

    this.addCommand({
      id: 'line-sentence-case',
      name: 'Convert current line to sentence case',
      editorCallback(editor) {
        applyToCurrentLine(editor, sentenceCase);
      },
    });

    this.addCommand({
      id: 'line-upper-case',
      name: 'Uppercase line',
      editorCheckCallback(checking, editor) {
        if (checking) return editor.somethingSelected();
        applyToCurrentLine(editor, upper);
      },
    });

    this.addCommand({
      id: 'line-lower-case',
      name: 'Lowercase line',
      editorCheckCallback(checking, editor) {
        if (checking) return editor.somethingSelected();
        applyToCurrentLine(editor, lower);
      },
    });

    this.addCommand({
      id: 'selection-title-case',
      name: 'Convert selection to title case',
      editorCheckCallback(checking, editor) {
        if (checking) return editor.somethingSelected();
        applyToCurrentSelection(editor, titleCase);
      },
    });

    this.addCommand({
      id: 'selection-sentence-case',
      name: 'Convert selection to sentence case',
      editorCheckCallback(checking, editor) {
        if (checking) return editor.somethingSelected();
        applyToCurrentSelection(editor, sentenceCase);
      },
    });

    this.addCommand({
      id: 'selection-upper-case',
      name: 'Uppercase selection',
      editorCheckCallback(checking, editor) {
        if (checking) return editor.somethingSelected();
        applyToCurrentSelection(editor, upper);
      },
    });

    this.addCommand({
      id: 'selection-lower-case',
      name: 'Lowercase selection',
      editorCheckCallback(checking, editor) {
        if (checking) return editor.somethingSelected();
        applyToCurrentSelection(editor, lower);
      },
    });

    this.registerEvent(
      this.app.workspace.on('editor-menu', (menu, editor) => {
        menu.addItem((item) => {
          const submenu = (
            item
              .setSection('action')
              .setIcon('lucide-case-sensitive')
              .setTitle('Casing') as any
          ).setSubmenu() as Menu;

          if (editor.somethingSelected()) {
            submenu
              .addItem((item) =>
                item
                  .setSection('selection')
                  .setIcon('lucide-text-cursor-input')
                  .setTitle('Selection to title case')
                  .onClick(() => {
                    applyToCurrentSelection(editor, titleCase);
                  })
              )
              .addItem((item) =>
                item
                  .setSection('selection')
                  .setIcon('lucide-text-cursor-input')
                  .setTitle('Selection to sentence case')
                  .onClick(() => {
                    applyToCurrentSelection(editor, sentenceCase);
                  })
              );
          }

          submenu
            .addItem((item) =>
              item
                .setSection('heading')
                .setIcon('lucide-hash')
                .setTitle('Line to title case')
                .onClick(() => {
                  applyToCurrentLine(editor, titleCase);
                })
            )

            .addItem((item) =>
              item
                .setSection('heading')
                .setIcon('lucide-hash')
                .setTitle('Line to sentence case')
                .onClick(() => {
                  applyToCurrentLine(editor, sentenceCase);
                })
            );
        });
      })
    );
  }

  //   onunload() {}

  //   async loadSettings() {
  //     this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  //   }

  //   async saveSettings() {
  //     await this.saveData(this.settings);
  //   }
}
