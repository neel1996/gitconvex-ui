# gitconvex react project
This is the front end react source for the [gitconvex](https://github.com/neel1996/gitconvex-package) project.

![gitconvex-react](https://user-images.githubusercontent.com/47709856/87220396-e72df380-c380-11ea-9b2b-e156402842bb.png)

## Dependencies

The depedency packages used by this project can be found [here](https://github.com/neel1996/gitconvex/network/dependencies)

- **Styling** - For styling, the project used [tailwind]() css framework 
- **Syntax Highlighting** - [prismjs](https://github.com/PrismJS/prism) is used for syntax highlighting within the *Git Difference* section
- **Icon set** - [FontAweomse for react](https://github.com/FortAwesome/Font-Awesome)

```
## Project directory tree

├── LICENSE
├── README.md
├── package.json
├── public
│   ├── favicon.ico
│   ├── gitconvex.png
│   ├── index.html
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   ├── prism.css
│   └── robots.txt
└── src
    ├── App.css
    ├── App.js
    ├── Components
    │   ├── DashBoard
    │   │   ├── Dashboard.js
    │   │   ├── DashboardPaneComponents
    │   │   │   ├── LeftPane.js
    │   │   │   └── RightPane.js
    │   │   ├── Help
    │   │   │   └── Help.js
    │   │   ├── Repository
    │   │   │   ├── GitComponents
    │   │   │   │   ├── GitDiffViewComponent.js
    │   │   │   │   ├── GitOperation
    │   │   │   │   │   ├── CommitComponent.js
    │   │   │   │   │   ├── GitOperationComponent.js
    │   │   │   │   │   ├── PushComponent.js
    │   │   │   │   │   └── StageComponent.js
    │   │   │   │   └── GitTrackedComponent.js
    │   │   │   └── RepoComponents
    │   │   │       ├── AddRepoForm.js
    │   │   │       ├── RepoCard.js
    │   │   │       ├── RepoComponent.js
    │   │   │       ├── RepoDetailBackdrop
    │   │   │       │   ├── AddBranchComponent.js
    │   │   │       │   ├── AddRemoteRepoComponent.js
    │   │   │       │   ├── BranchListComponent.js
    │   │   │       │   ├── FetchPullActionComponent.js
    │   │   │       │   └── SwitchBranchComponent.js
    │   │   │       ├── RepositoryAction.js
    │   │   │       ├── RepositoryCommitLogComponent.js
    │   │   │       └── RepositoryDetails.js
    │   │   └── Settings
    │   │       └── Settings.js
    │   ├── SplashScreen.css
    │   └── SplashScreen.js
    ├── actionStore.js
    ├── assets
    │   └── gitconvex.png
    ├── context.js
    ├── index.css
    ├── index.js
    ├── logo.svg
    ├── prism.css
    ├── reducer.js
    ├── serviceWorker.js
    ├── setupTests.js
    ├── tailwind-config.css
    ├── tests
    │   ├── App.test.js
    │   └── Dashboard.test.js
    └── util
        ├── apiURLSupplier.js
        └── env_config.js


```
## Contribute!

If you are interested in contributing to the project, fork the repo, submit a PR. Currently its just a insgle dev working on the project. Hopefully will get couple more on board to maintain the repo
