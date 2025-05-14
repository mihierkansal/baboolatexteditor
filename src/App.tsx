import { basicSetup, EditorView, minimalSetup } from "codemirror";
import {
  createEffect,
  createMemo,
  createSignal,
  on,
  onMount,
  Show,
} from "solid-js";
import "./index.css";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { markdown } from "@codemirror/lang-markdown";
import { json } from "@codemirror/lang-json";
import { python } from "@codemirror/lang-python";
import { xml } from "@codemirror/lang-xml";
import { java } from "@codemirror/lang-java";
import { rust } from "@codemirror/lang-rust";
import { cpp } from "@codemirror/lang-cpp";
import { sql } from "@codemirror/lang-sql";
import { php } from "@codemirror/lang-php";
import { csharp } from "@replit/codemirror-lang-csharp";
import "baboolastyles/public/plastic.css";

// import { oneDark } from '@codemirror/theme-one-dark';

function App() {
  const filename = createSignal("Untitled.txt");
  const contents = createSignal("");

  const ext = createMemo(() => {
    return filename[0]().split(".").at(-1);
  });

  let editor: any;

  onMount(() => {
    createEffect(
      on(ext, () => {
        let ls: any = undefined;
        let isCode = true;

        switch (ext()) {
          case "js":
            ls = javascript();
            break;
          case "jsx":
            ls = javascript({
              jsx: true,
            });
            break;
          case "ts":
            ls = javascript({
              typescript: true,
            });
            break;
          case "tsx":
            ls = javascript({
              typescript: true,
              jsx: true,
            });
            break;
          case "html":
          case "htm":
            ls = html();
            break;
          case "css":
            ls = css();
            break;
          case "md":
          case "mdx":
            ls = markdown();
            break;
          case "json":
            ls = json();
            break;
          case "py":
            ls = python();
            break;
          case "xml":
            ls = xml();
            break;
          case "java":
            ls = java();
            break;
          case "rust":
            ls = rust();
            break;
          case "cpp":
            ls = cpp();
            break;
          case "sql":
            ls = sql();
            break;
          case "php":
            ls = php();
            break;
          case "cs":
            ls = csharp();
            break;
          case "txt":
          case "text":
            isCode = false;
            break;
        }

        const initialText = contents[0](); //editor?.state.doc.toString();
        const targetElement = document.querySelector(".editor")!;
        targetElement.innerHTML = "";

        const _editor = new EditorView({
          doc: initialText,
          extensions: [
            ...(ls ? [ls] : []),
            isCode ? basicSetup : minimalSetup,
            EditorView.lineWrapping,
            EditorView.updateListener.of(() => {
              console.log("chng");
              contents[1](_editor.state.doc.toString());
            }),
          ],
          parent: targetElement,
        });

        editor = _editor;
      })
    );
  });

  function download() {
    if (filename[0]().includes(".")) {
      downloadTextFile(filename[0](), contents[0]());
    } else {
      downloadTextFile(filename[0]() + ".txt", contents[0]());
    }
  }

  const fileHandle = createSignal<FileSystemHandle>();

  window.addEventListener("keydown", (e) => {
    if (e.key === "s" && e.ctrlKey) {
      e.preventDefault();
      //@ts-ignore
      if (!!window.showSaveFilePicker) {
        if (fileHandle[0]() && !e.shiftKey) {
          writeToFile(fileHandle[0]()!, contents[0]());
        } else {
          saveAs();
        }
      } else {
        download();
      }
    }
  });

  return (
    <>
      <div class="toolbar">
        <button
          onClick={async () => {
            //@ts-ignore
            if (window.showOpenFilePicker) {
              const _fileHandle = await openFile();
              fileHandle[1](_fileHandle);
              const file = await _fileHandle.getFile();
              setEditorContents(file);
            } else {
              const inp = document.createElement("input");
              inp.type = "file";
              inp.onchange = (e) => {
                const f = (e.target as HTMLInputElement).files?.[0];
                if (f) {
                  setEditorContents(f);
                }
              };
              inp.hidden = true;
              document.body.appendChild(inp);
              inp.click();
            }
          }}
        >
          <span>Open From PC</span>
        </button>

        <Show
          fallback={
            <button
              onClick={() => {
                download();
              }}
            >
              <span>Download</span>
            </button>
          }
          /* @ts-ignore */
          when={!!window.showSaveFilePicker}
        >
          <button
            onClick={async () => {
              saveAs();
            }}
          >
            <span>Save As</span>
          </button>
          <button
            disabled={!fileHandle[0]()}
            onClick={async () => {
              await writeToFile(fileHandle[0]()!, contents[0]());
            }}
          >
            <span>Save</span>
          </button>
        </Show>
        <input
          readOnly={!!fileHandle[0]()}
          value={filename[0]()}
          onInput={(e) => {
            filename[1](e.target.value);
          }}
        />
      </div>
      <div
        class="editor"
        onClick={() => {
          editor.focus();
        }}
      ></div>
    </>
  );

  function setEditorContents(file: File) {
    const r = new FileReader();
    r.onload = (e) => {
      filename[1]("");
      const d = e.target!.result as string;
      contents[1](d);

      filename[1](file.name);
    };
    r.readAsText(file);
  }

  async function saveAs() {
    const _fileHandle = await saveFile(filename[0]());
    fileHandle[1](_fileHandle);
    filename[1](_fileHandle.name);
    await writeToFile(_fileHandle, contents[0]());
  }
}

function downloadTextFile(filename: string, content: string) {
  const element = document.createElement("a");
  const blob = new Blob([content], { type: "text/plain" });
  element.href = URL.createObjectURL(blob);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

async function writeToFile(fileHandle: FileSystemHandle, content: string) {
  const writableStream =
    //@ts-ignore
    (await fileHandle.createWritable()) as FileSystemWritableFileStream;
  await writableStream.write(content);
  await writableStream.close();
}

async function openFile() {
  const options = {};

  // @ts-ignore
  const [fileHandle] = await window.showOpenFilePicker(options);
  return fileHandle;
}

async function saveFile(name: string) {
  const options = {
    suggestedName: name,
  };

  // @ts-ignore
  const fileHandle = await window.showSaveFilePicker(options);
  return fileHandle as FileSystemHandle;
}

export default App;
