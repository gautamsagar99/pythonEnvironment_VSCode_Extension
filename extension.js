// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const { exec } = require("child_process");
const fs = require("fs");

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "pythonenvironment" is now active!'
  );

  let disposable = vscode.commands.registerCommand(
    "pythonenvironment.createEnvironment",
    function () {
      if (
        vscode.workspace.workspaceFolders &&
        vscode.workspace.workspaceFolders.length > 0
      ) {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (workspaceFolders) {
          const workspaceDirectory = workspaceFolders[0].uri.fsPath;
          console.log(workspaceDirectory);

          vscode.window
            .showInputBox({ prompt: "Enter the name of the environment" })
            .then((envName) => {
              if (envName) {
                const environmentPath = `${workspaceDirectory}/${envName}`;
                const pythonInterpreterPath = `${environmentPath}/Scripts/python.exe`;

                // Check if the environment already exists
                if (
                  fs.existsSync(environmentPath) &&
                  fs.existsSync(pythonInterpreterPath)
                ) {
                  return vscode.window.showErrorMessage(
                    `The environment '${envName}' already exists.`
                  );
                }

                const command = `python -m venv ${envName}`;
                exec(
                  command,
                  { cwd: workspaceDirectory },
                  (error, stdout, stderr) => {
                    if (error) {
                      console.error(error);
                      return vscode.window.showErrorMessage(
                        "Failed to execute the command."
                      );
                    } else {
                      console.log(stdout);
                      console.log(stderr);
                      return vscode.window.showInformationMessage(
                        "Command executed successfully."
                      );
                    }
                  }
                );
              }
            });
        }
      } else {
        vscode.window.showErrorMessage("No workspace folders found.");
      }
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
