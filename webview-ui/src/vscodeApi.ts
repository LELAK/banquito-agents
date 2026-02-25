// Mock VS Code API for standalone webapp
export const vscode = {
  postMessage: (msg: unknown) => {
    console.log('🏦 Banquito API call:', msg)
    // In standalone mode, we can ignore most VS Code-specific messages
    // or simulate responses for demo purposes
  }
}