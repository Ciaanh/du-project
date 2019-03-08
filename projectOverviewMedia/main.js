// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
    const vscode = acquireVsCodeApi();

    // const oldState = vscode.getState();
    // let currentCount = (oldState && oldState.count) || 0;

    // vscode.postMessage({
    //     command: 'alert',
    //     text: '🐛  on line ' + currentCount
    // });

    // // Update state
    // vscode.setState({ count: currentCount });

    // // Handle messages sent from the extension to the webview
    // window.addEventListener('message', event => {
    //     const message = event.data; // The json data that the extension sent
    //     switch (message.command) {
    //         case 'refactor':
    //             currentCount = Math.ceil(currentCount * 0.5);
    //             counter.textContent = currentCount;
    //             break;
    //     }
    // });
}());