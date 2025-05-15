_Not highly recommended. It's not developer friendly per se, and is mainly there to integrate with Baboola OS Emulator._

# Installation as component: npm i baboolatexteditor

# Usage (as component)

Basically a text editor, with save, open, etc. Know that it won't work in an iframe. Its styles may cascade to your page; prevent this by adding class="nobaboolastyles" on the >html tag, and wrapping the <TextEditor in a <div class="baboolastyles".  
  
import TextEditor from "baboolatexteditor/src/App.tsx"


# Usage (as website)


```bash
$ npm install # or pnpm install or yarn install
```

 
## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.<br>
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### `npm run build`

Builds the app for production to the `dist` folder.<br>
It correctly bundles Solid in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

## Deployment

Learn more about deploying your application with the [documentations](https://vite.dev/guide/static-deploy.html)
