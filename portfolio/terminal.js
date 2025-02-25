/**
 * Terminal Emulator
 * A simulated Linux environment with basic command line functionality
 */

document.addEventListener("DOMContentLoaded", () => {
  // Update last login time
  document.getElementById("last-login-time").textContent =
    new Date().toUTCString();

  // Initialize the terminal environment
  const terminal = new TerminalEmulator("terminal", "term-input");
  terminal.init();
});

class TerminalEmulator {
  constructor(terminalId, inputId) {
    this.terminal = document.getElementById(terminalId);
    this.input = document.getElementById(inputId);
    this.currentDir = "/home/user";
    this.history = [];
    this.historyIndex = -1;
    this.commandsRun = 0;
    this.fileSystem = null;

    // Initialize file system
    this.initFileSystem();
  }

  async initFileSystem() {
    try {
      // Load file system data
      const response = await fetch("data/filesystem.json");
      if (!response.ok) {
        throw new Error(`Failed to load filesystem: ${response.status}`);
      }

      this.fileSystem = await response.json();

      // Initialize command bindings
      this.initCommands();

      // Add welcome message referencing filesystem's motd
      if (this.fileSystem && this.fileSystem.etc && this.fileSystem.etc.motd) {
        this.write(this.fileSystem.etc.motd, "success-text");
      }
    } catch (error) {
      console.error("Error initializing file system:", error);
      this.fileSystem = this.createDefaultFileSystem();
      this.initCommands();
      this.write(
        "Warning: Failed to load custom filesystem. Using default.",
        "error-text"
      );
    }
  }

  createDefaultFileSystem() {
    // Default file system structure if JSON fails to load
    return {
      home: {
        user: {
          documents: {
            "about.txt":
              "This is a simulated Linux terminal environment.\nYou can explore the file system using common commands.",
            "help.txt":
              "Available commands: ls, cd, pwd, cat, echo, help, clear, find, grep, head, tail",
          },
          projects: {},
          blogs: {},
          "README.md":
            "Welcome to the portfolio terminal.\nUse `ls` to list files and directories.\nUse `help` to see available commands.",
        },
      },
      bin: {
        ls: "executable",
        cd: "executable",
        pwd: "executable",
        cat: "executable",
        echo: "executable",
        clear: "executable",
        help: "executable",
        find: "executable",
        grep: "executable",
        head: "executable",
        tail: "executable",
      },
      usr: {
        share: {
          doc: {
            examples: {
              "hello.txt": "Hello, World!",
            },
          },
        },
      },
      etc: {
        motd: "Welcome to the Portfolio Terminal!\nType 'help' to see available commands.\n\nThis terminal emulator allows you to explore the portfolio using Linux-style commands.",
      },
    };
  }

  init() {
    // Set up event listeners
    this.input.addEventListener("keydown", this.handleKeyDown.bind(this));

    // Set focus to input
    this.input.focus();

    // Add click event to focus input when terminal is clicked
    this.terminal.addEventListener("click", () => {
      this.input.focus();
    });
  }

  initCommands() {
    // Define available commands
    this.commands = {
      neofetch: this.cmdNeofetch.bind(this),
      ls: this.cmdLs.bind(this),
      cd: this.cmdCd.bind(this),
      pwd: this.cmdPwd.bind(this),
      cat: this.cmdCat.bind(this),
      echo: this.cmdEcho.bind(this),
      clear: this.cmdClear.bind(this),
      help: this.cmdHelp.bind(this),
      find: this.cmdFind.bind(this),
      grep: this.cmdGrep.bind(this),
      head: this.cmdHead.bind(this),
      tail: this.cmdTail.bind(this),
    };
  }

  handleKeyDown(event) {
    if (event.key === "Enter") {
      // Process command
      const command = this.input.value.trim();
      this.processCommand(command);

      // Reset input
      this.input.value = "";

      // Prevent default behavior
      event.preventDefault();
    } else if (event.key === "ArrowUp") {
      // Navigate command history (previous)
      if (
        this.history.length > 0 &&
        this.historyIndex < this.history.length - 1
      ) {
        this.historyIndex++;
        this.input.value = this.history[this.historyIndex];

        // Move cursor to end of input
        setTimeout(() => {
          this.input.selectionStart = this.input.selectionEnd =
            this.input.value.length;
        }, 0);
      }

      event.preventDefault();
    } else if (event.key === "ArrowDown") {
      // Navigate command history (next)
      if (this.historyIndex > 0) {
        this.historyIndex--;
        this.input.value = this.history[this.historyIndex];
      } else if (this.historyIndex === 0) {
        this.historyIndex = -1;
        this.input.value = "";
      }

      event.preventDefault();
    } else if (event.key === "Tab") {
      // Tab completion
      event.preventDefault();
      this.tabComplete();
    }
  }

  tabComplete() {
    const commandText = this.input.value.trim();
    const parts = this.parseCommand(commandText);
    const cmd = parts.command;
    const args = parts.args;

    // No autocomplete on empty input
    if (!commandText) return;

    // Command completion
    if (!args.length && !commandText.endsWith(" ")) {
      const availableCommands = Object.keys(this.commands);
      const matchingCommands = availableCommands.filter((c) =>
        c.startsWith(cmd)
      );

      if (matchingCommands.length === 1) {
        this.input.value = `${matchingCommands[0]} `;
      } else if (matchingCommands.length > 1) {
        // Show possible completions
        this.write(this.getPrompt() + " " + commandText, "term-command");
        this.write(matchingCommands.join("  "));
      }
      return;
    }

    // Path completion
    if (cmd === "cd" || cmd === "cat" || cmd === "ls" || cmd === "find") {
      const lastArg = args.length > 0 ? args[args.length - 1] : "";
      const directoryPath = this.getParentDir(lastArg || ".");
      const dirObj = this.getFileSystemObject(directoryPath);

      if (!dirObj || typeof dirObj !== "object") return;

      // Get basename for matching
      const basename = this.getFileName(lastArg);
      const matchingItems = Object.keys(dirObj).filter((item) =>
        item.startsWith(basename)
      );

      if (matchingItems.length === 1) {
        // Single match - autocomplete
        const completePath = lastArg.includes("/")
          ? lastArg.substring(0, lastArg.lastIndexOf("/") + 1) +
            matchingItems[0]
          : matchingItems[0];

        // Check if it's a directory, add trailing slash
        if (typeof dirObj[matchingItems[0]] === "object") {
          this.input.value = `${cmd} ${completePath}/`;
        } else {
          this.input.value = `${cmd} ${completePath}`;
        }
      } else if (matchingItems.length > 1) {
        // Multiple matches - show options
        this.write(this.getPrompt() + " " + commandText, "term-command");

        // Format the output to show directories and files differently
        const formattedItems = matchingItems.map((item) => {
          if (typeof dirObj[item] === "object") {
            return `<span class="directory">${item}/</span>`;
          } else if (item.endsWith(".md") || item.endsWith(".txt")) {
            return `<span class="text-file">${item}</span>`;
          } else if (item.endsWith(".exe") || item.endsWith(".sh")) {
            return `<span class="executable">${item}</span>`;
          } else {
            return item;
          }
        });

        this.write(formattedItems.join("  "));
      }
    }
  }

  processCommand(command) {
    if (command.trim() === "") return;

    // Add command to history
    this.history.unshift(command);
    this.historyIndex = -1;
    this.commandsRun++;

    // Display command
    this.write(this.getPrompt() + " " + command, "term-command");

    // Handle special case: !! (repeat last command)
    if (command === "!!") {
      if (this.history.length > 1) {
        command = this.history[1]; // Get the previous command
        this.write(`Executing: ${command}`, "term-info");
      } else {
        this.write("No previous command to execute", "error-text");
        return;
      }
    }

    // Parse command
    const parts = this.parseCommand(command);
    const cmd = parts.command;
    const args = parts.args;

    // Execute command
    if (cmd in this.commands) {
      this.commands[cmd](args);
    } else if (cmd) {
      this.write(`command not found: ${cmd}`, "error-text");
    }

    // Add a new input line
    this.createNewInputLine();
  }

  parseCommand(commandStr) {
    // Advanced command parsing (handles quotes and spaces)
    const parts = [];
    let current = "";
    let inQuotes = false;
    let quoteChar = "";

    for (let i = 0; i < commandStr.length; i++) {
      const char = commandStr[i];

      if ((char === '"' || char === "'") && (!inQuotes || quoteChar === char)) {
        inQuotes = !inQuotes;
        if (inQuotes) quoteChar = char;
        else quoteChar = "";
      } else if (char === " " && !inQuotes) {
        if (current) {
          parts.push(current);
          current = "";
        }
      } else {
        current += char;
      }
    }

    if (current) parts.push(current);

    return {
      command: parts[0],
      args: parts.slice(1),
    };
  }

  getPrompt() {
    const pathDisplay = this.currentDir.replace("/home/user", "~");
    return `<span class="terminal-user">user</span>@<span class="terminal-host">portfolio</span>:<span class="terminal-path">${pathDisplay}</span>$`;
  }

  write(text, className = "") {
    const output = document.createElement("div");
    output.className = "term-output";
    if (className) output.classList.add(className);
    output.innerHTML = text;

    // Insert before the current input line
    const inputLine = this.terminal.querySelector(".term-input-line");
    this.terminal.insertBefore(output, inputLine);

    // Scroll to bottom
    this.terminal.scrollTop = this.terminal.scrollHeight;
  }

  createNewInputLine() {
    // Remove current input line
    const currentInputLine = this.terminal.querySelector(".term-input-line");
    if (currentInputLine) {
      currentInputLine.remove();
    }

    // Create new input line
    const newInputLine = document.createElement("div");
    newInputLine.className = "term-input-line";
    newInputLine.innerHTML = `
        <div class="term-input-prompt">
          ${this.getPrompt()}
        </div>
      `;

    // Create new input element
    const newInput = document.createElement("input");
    newInput.type = "text";
    newInput.className = "term-input";
    newInput.id = "term-input";
    newInput.spellcheck = false;
    newInput.autocomplete = "off";

    // Add event listeners
    newInput.addEventListener("keydown", this.handleKeyDown.bind(this));

    // Append to input line
    newInputLine.appendChild(newInput);

    // Append to terminal
    this.terminal.appendChild(newInputLine);

    // Update input reference
    this.input = newInput;

    // Focus input
    this.input.focus();

    // Scroll to bottom
    this.terminal.scrollTop = this.terminal.scrollHeight;
  }

  // Resolve a path (handling relative paths, .., etc.)
  resolvePath(path) {
    if (!path) return this.currentDir;

    // Handle absolute paths
    if (path.startsWith("/")) {
      // This is already an absolute path
      return this.normalizePath(path);
    }

    // Handle home shortcut
    if (path === "~" || path.startsWith("~/")) {
      return this.normalizePath(path.replace("~", "/home/user"));
    }

    // Handle relative paths
    return this.normalizePath(`${this.currentDir}/${path}`);
  }

  normalizePath(path) {
    // Split path into segments
    const segments = path.split("/").filter((segment) => segment !== "");
    const result = [];

    // Process each segment
    for (const segment of segments) {
      if (segment === ".") {
        // Current directory, do nothing
      } else if (segment === "..") {
        // Parent directory, remove last segment
        if (result.length > 0) result.pop();
      } else {
        // Regular segment, add to result
        result.push(segment);
      }
    }

    // Construct normalized path
    return "/" + result.join("/");
  }

  // Get an object from the file system based on path
  getFileSystemObject(path) {
    const normalizedPath = this.resolvePath(path);
    const segments = normalizedPath
      .split("/")
      .filter((segment) => segment !== "");

    let current = this.fileSystem;

    // Navigate through file system
    for (const segment of segments) {
      if (!current || typeof current !== "object" || !(segment in current)) {
        return null;
      }

      current = current[segment];
    }

    return current;
  }

  // Check if a path exists and is a directory
  isDirectory(path) {
    const obj = this.getFileSystemObject(path);
    return obj !== null && typeof obj === "object";
  }

  // Check if a path exists and is a file
  isFile(path) {
    const obj = this.getFileSystemObject(path);
    return obj !== null && typeof obj !== "object";
  }

  // Get parent directory of a path
  getParentDir(path) {
    const normalizedPath = this.resolvePath(path);
    const segments = normalizedPath
      .split("/")
      .filter((segment) => segment !== "");

    if (segments.length === 0) return "/";

    segments.pop();
    return "/" + segments.join("/");
  }

  // Get filename from a path
  getFileName(path) {
    const normalizedPath = this.resolvePath(path);
    const segments = normalizedPath
      .split("/")
      .filter((segment) => segment !== "");

    if (segments.length === 0) return "";

    return segments[segments.length - 1];
  }

  // Command implementations
  cmdLs(args) {
    // Parse arguments
    let path = ".";
    let showHidden = false;
    let showDetails = false;

    for (const arg of args) {
      if (arg === "-a" || arg === "--all") {
        showHidden = true;
      } else if (arg === "-l") {
        showDetails = true;
      } else if (arg === "-la" || arg === "-al") {
        showHidden = true;
        showDetails = true;
      } else if (!arg.startsWith("-")) {
        path = arg;
      }
    }

    const targetPath = this.resolvePath(path);
    const obj = this.getFileSystemObject(targetPath);

    if (!obj || typeof obj !== "object") {
      this.write(
        `ls: cannot access '${path}': No such file or directory`,
        "error-text"
      );
      return;
    }

    let output = "";

    if (showDetails) {
      // Format similar to ls -l
      output += "total " + Object.keys(obj).length + "\n";

      for (const item in obj) {
        if (!showHidden && item.startsWith(".")) continue;

        const isDir = typeof obj[item] === "object";
        const permissions = isDir ? "drwxr-xr-x" : "-rw-r--r--";
        const owner = "user";
        const group = "portfolio";
        const size = isDir
          ? 4096
          : typeof obj[item] === "string"
          ? obj[item].length
          : 0;
        const date = new Date().toLocaleString("default", {
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });

        if (isDir) {
          output += `${permissions} 2 ${owner} ${group} ${size
            .toString()
            .padStart(5)} ${date} <span class="directory">${item}/</span>\n`;
        } else {
          output += `${permissions} 1 ${owner} ${group} ${size
            .toString()
            .padStart(5)} ${date} ${item}\n`;
        }
      }
    } else {
      // Format as columns
      const items = [];

      for (const item in obj) {
        if (!showHidden && item.startsWith(".")) continue;

        const isDir = typeof obj[item] === "object";
        if (isDir) {
          items.push(`<span class="directory">${item}/</span>`);
        } else if (item.endsWith(".md") || item.endsWith(".txt")) {
          items.push(`<span class="text-file">${item}</span>`);
        } else if (item.endsWith(".exe") || item.endsWith(".sh")) {
          items.push(`<span class="executable">${item}</span>`);
        } else if (
          item.endsWith(".png") ||
          item.endsWith(".jpg") ||
          item.endsWith(".svg")
        ) {
          items.push(`<span class="image-file">${item}</span>`);
        } else {
          items.push(item);
        }
      }

      output = items.join("  ");
    }

    this.write(output || "Directory is empty");
  }

  cmdCd(args) {
    if (args.length === 0 || args[0] === "~") {
      // cd to home directory
      this.currentDir = "/home/user";
      return;
    }

    const targetPath = this.resolvePath(args[0]);

    if (this.isDirectory(targetPath)) {
      this.currentDir = targetPath;
    } else {
      this.write(`cd: ${args[0]}: Not a directory`, "error-text");
    }
  }

  cmdPwd(args) {
    this.write(this.currentDir);
  }

  cmdCat(args) {
    if (args.length === 0) {
      this.write("Usage: cat [file...]", "term-info");
      return;
    }

    for (const arg of args) {
      const targetPath = this.resolvePath(arg);
      const obj = this.getFileSystemObject(targetPath);

      if (obj === null) {
        this.write(`cat: ${arg}: No such file or directory`, "error-text");
      } else if (typeof obj === "object") {
        this.write(`cat: ${arg}: Is a directory`, "error-text");
      } else {
        // Format markdown for better display
        if (arg.endsWith(".md")) {
          const content = obj.toString();
          let formattedContent = content
            .replace(/^# (.+)$/gm, "<h1>$1</h1>")
            .replace(/^## (.+)$/gm, "<h2>$1</h2>")
            .replace(/^### (.+)$/gm, "<h3>$1</h3>")
            .replace(/^- (.+)$/gm, "• $1")
            .replace(/^(\d+)\. (.+)$/gm, "$1. $2");
          this.write(formattedContent);
        } else {
          this.write(obj);
        }
      }
    }
  }

  cmdEcho(args) {
    // Handle special variables
    const text = args
      .join(" ")
      .replace(/\$PWD/g, this.currentDir)
      .replace(/\$HOME/g, "/home/user")
      .replace(/\$USER/g, "user")
      .replace(/\$HOSTNAME/g, "portfolio");
    this.write(text);
  }

  cmdClear(args) {
    // Clear all output
    const outputElements = this.terminal.querySelectorAll(".term-output");
    outputElements.forEach((el) => el.remove());

    // Create new input line
    this.createNewInputLine();
  }

  cmdHelp(args) {
    const commandHelp = {
      neofetch: "Display system information with ASCII art",
      ls: "List directory contents",
      cd: "Change the current directory",
      pwd: "Print current directory",
      cat: "Concatenate and display file contents",
      echo: "Display a line of text",
      clear: "Clear the terminal screen",
      help: "Display this help message",
      find: "Search for files in a directory hierarchy",
      grep: "Search for patterns in files",
      head: "Display first lines of a file",
      tail: "Display last lines of a file",
    };

    if (args.length > 0) {
      const cmd = args[0];
      if (cmd in commandHelp) {
        this.write(
          `<span class="command-name">${cmd}</span>: ${commandHelp[cmd]}`
        );
      } else {
        this.write(`No help available for '${cmd}'`, "error-text");
      }
    } else {
      let output = "Available commands:\n\n";

      for (const cmd in commandHelp) {
        output +=
          `<span class="command-name">${cmd}</span>`.padEnd(15) +
          " - " +
          `${commandHelp[cmd]}\n`;
      }

      output +=
        '\nYou can also use <span class="command-name">!!</span> to repeat the last command.\n';
      output +=
        'Use <span class="command-name">help [command]</span> for more information about a specific command.';

      this.write(output);
    }
  }

  cmdFind(args) {
    if (args.length === 0) {
      this.write("Usage: find [path] [expression]", "term-info");
      this.write('Example: find . -name "*.txt"', "term-info");
      return;
    }

    // Parse arguments
    let startPath = ".";
    let pattern = null;
    let nameFlag = false;
    let typeFlag = null;

    for (let i = 0; i < args.length; i++) {
      if (args[i] === "-name" && i + 1 < args.length) {
        nameFlag = true;
        pattern = args[i + 1].replace(/"/g, "").replace(/\*/g, ".*");
        i++; // Skip the next argument
      } else if (args[i] === "-type" && i + 1 < args.length) {
        if (args[i + 1] === "f") {
          typeFlag = "file";
        } else if (args[i + 1] === "d") {
          typeFlag = "directory";
        }
        i++;
      } else if (!nameFlag && !args[i].startsWith("-")) {
        startPath = args[i];
      }
    }

    const targetPath = this.resolvePath(startPath);
    const results = this.findRecursive(
      targetPath,
      pattern ? new RegExp(pattern) : null,
      typeFlag
    );

    if (results.length === 0) {
      this.write("No matching files found", "term-info");
    } else {
      // Format results with colors based on file type
      const formattedResults = results.map((path) => {
        const obj = this.getFileSystemObject(path);
        if (typeof obj === "object") {
          return `<span class="directory">${path}</span>`;
        } else if (path.endsWith(".md") || path.endsWith(".txt")) {
          return `<span class="text-file">${path}</span>`;
        } else if (path.endsWith(".exe") || path.endsWith(".sh")) {
          return `<span class="executable">${path}</span>`;
        } else {
          return path;
        }
      });

      this.write(formattedResults.join("\n"));
    }
  }

  findRecursive(path, pattern, typeFilter = null, relativeTo = null) {
    if (!relativeTo) relativeTo = path;

    const obj = this.getFileSystemObject(path);
    if (!obj || typeof obj !== "object") return [];

    const results = [];

    for (const item in obj) {
      const itemPath = `${path}/${item}`;
      const relPath = itemPath.replace(relativeTo, ".").replace(/\/\//g, "/");
      const isDir = typeof obj[item] === "object";

      // Apply type filter if specified
      if (
        (typeFilter === "file" && isDir) ||
        (typeFilter === "directory" && !isDir)
      ) {
        // Skip this item as it doesn't match the type filter
      } else if (!pattern || pattern.test(item)) {
        results.push(relPath);
      }

      if (isDir) {
        results.push(
          ...this.findRecursive(itemPath, pattern, typeFilter, relativeTo)
        );
      }
    }

    return results;
  }

  cmdGrep(args) {
    if (args.length < 2) {
      this.write("Usage: grep [pattern] [file...]", "term-info");
      this.write('Example: grep "TODO" *.txt', "term-info");
      return;
    }

    const pattern = args[0];
    const files = args.slice(1);
    const regex = new RegExp(pattern, "gi");
    let matchFound = false;

    for (const file of files) {
      // Handle wildcards in filenames
      if (file.includes("*")) {
        const dir = this.getParentDir(file);
        const filePattern = file.split("/").pop().replace(/\*/g, ".*");
        const dirObj = this.getFileSystemObject(dir);

        if (!dirObj || typeof dirObj !== "object") {
          this.write(`grep: ${dir}: No such directory`, "error-text");
          continue;
        }

        // Find matching files
        const matchingFiles = Object.keys(dirObj).filter((name) =>
          new RegExp(`^${filePattern}$`).test(name)
        );

        for (const match of matchingFiles) {
          if (typeof dirObj[match] !== "object") {
            const filePath = dir === "/" ? `/${match}` : `${dir}/${match}`;
            this.grepFile(filePath, regex);
            matchFound = true;
          }
        }
      } else {
        // Process regular files
        const targetPath = this.resolvePath(file);
        this.grepFile(targetPath, regex);
        matchFound = true;
      }
    }

    if (!matchFound) {
      this.write("No matches found", "term-info");
    }
  }

  grepFile(filePath, regex) {
    const obj = this.getFileSystemObject(filePath);

    if (obj === null) {
      this.write(`grep: ${filePath}: No such file or directory`, "error-text");
      return false;
    } else if (typeof obj === "object") {
      this.write(`grep: ${filePath}: Is a directory`, "error-text");
      return false;
    }

    const content = obj.toString();
    const lines = content.split("\n");
    const matches = [];

    for (let i = 0; i < lines.length; i++) {
      if (regex.test(lines[i])) {
        regex.lastIndex = 0; // Reset regex state
        const highlightedLine = lines[i].replace(
          regex,
          (match) => `<span class="success-text">${match}</span>`
        );
        matches.push(`${filePath}:${i + 1}: ${highlightedLine}`);
      }
    }

    if (matches.length > 0) {
      this.write(matches.join("\n"));
      return true;
    }

    return false;
  }

  cmdHead(args) {
    if (args.length === 0) {
      this.write("Usage: head [options] [file]", "term-info");
      this.write("Example: head -n 5 README.md", "term-info");
      return;
    }

    // Parse arguments
    let lineCount = 10; // Default
    let filePath = args[0];

    if (args[0] === "-n" && args.length > 1) {
      lineCount = parseInt(args[1], 10);
      if (isNaN(lineCount) || lineCount < 1) {
        this.write("head: invalid number of lines", "error-text");
        return;
      }
      filePath = args.length > 2 ? args[2] : null;
    }

    if (!filePath) {
      this.write("head: missing file operand", "error-text");
      return;
    }

    const targetPath = this.resolvePath(filePath);
    const obj = this.getFileSystemObject(targetPath);

    if (obj === null) {
      this.write(`head: ${filePath}: No such file or directory`, "error-text");
    } else if (typeof obj === "object") {
      this.write(`head: ${filePath}: Is a directory`, "error-text");
    } else {
      const content = obj.toString();
      const lines = content.split("\n");
      const result = lines.slice(0, lineCount).join("\n");

      this.write(`==> ${filePath} <==`, "command-name");
      this.write(result);
    }
  }

  cmdTail(args) {
    if (args.length === 0) {
      this.write("Usage: tail [options] [file]", "term-info");
      this.write("Example: tail -n 5 README.md", "term-info");
      return;
    }

    // Parse arguments
    let lineCount = 10; // Default
    let filePath = args[0];

    if (args[0] === "-n" && args.length > 1) {
      lineCount = parseInt(args[1], 10);
      if (isNaN(lineCount) || lineCount < 1) {
        this.write("tail: invalid number of lines", "error-text");
        return;
      }
      filePath = args.length > 2 ? args[2] : null;
    }

    if (!filePath) {
      this.write("tail: missing file operand", "error-text");
      return;
    }

    const targetPath = this.resolvePath(filePath);
    const obj = this.getFileSystemObject(targetPath);

    if (obj === null) {
      this.write(`tail: ${filePath}: No such file or directory`, "error-text");
    } else if (typeof obj === "object") {
      this.write(`tail: ${filePath}: Is a directory`, "error-text");
    } else {
      const content = obj.toString();
      const lines = content.split("\n");
      const result = lines.slice(-lineCount).join("\n");

      this.write(`==> ${filePath} <==`, "command-name");
      this.write(result);
    }
  }

  cmdNeofetch(args) {
    // ASCII art for Linux penguin
    const asciiArt = `
          *nnnn*                      
        dGGGGMMb     ,"""""""""""""".
       @p~qp~~qMb    | Linux Rules! |
       M|@||@) M|   *;..............'
       @,----.JM| -'
      JS^\\*_/  qKL
     dZP        qKRb
    dZP          qKKb
   fZP            SMMb
   HZM            MMMM
   FqM            MMMM
 __| ".        |\\dS"qML
 |    \`.       | \`' \\Zq
*)      \\.*__.,|     .'
\\____   )MMMMMM|   .'
     \`-'       \`--' hjm
`;

    // System information (customized for portfolio)
    const systemInfo = [
      '<span class="terminal-user">user</span>@<span class="terminal-host">portfolio</span>',
      "-------------------------",
      '<span class="command-name">OS:</span> Portfolio Linux 25.02.2',
      '<span class="command-name">Host:</span> Virtual Portfolio Server',
      '<span class="command-name">Kernel:</span> 5.15.0-portfolio',
      '<span class="command-name">Uptime:</span> ' + this.getUptime(),
      '<span class="command-name">Packages:</span> 42 (npm)',
      '<span class="command-name">Shell:</span> portfolio-bash 5.1.16',
      '<span class="command-name">Resolution:</span> Dynamic x Responsive',
      '<span class="command-name">DE:</span> Portfolio-Desktop',
      '<span class="command-name">WM:</span> JavaScript',
      '<span class="command-name">WM Theme:</span> Minimalist-Dark',
      '<span class="command-name">Terminal:</span> portfolio-term',
      '<span class="command-name">CPU:</span> JavaScript V8 @ 60fps',
      '<span class="command-name">GPU:</span> HTML5 Canvas Accelerated',
      '<span class="command-name">Memory:</span> 256MB / 512MB',
    ];

    // Format the output with ASCII art on the left and system info on the right
    const asciiLines = asciiArt.split("\n");
    const maxAsciiWidth = Math.max(...asciiLines.map((line) => line.length));

    let output = "";
    const padding = 2; // Padding between ASCII and info

    for (let i = 0; i < Math.max(asciiLines.length, systemInfo.length); i++) {
      const asciiLine = i < asciiLines.length ? asciiLines[i] : "";
      const infoLine = i < systemInfo.length ? systemInfo[i] : "";

      // Pad the ASCII line to align system info
      const paddedAscii = asciiLine.padEnd(maxAsciiWidth + padding);

      output += paddedAscii + infoLine + "\n";
    }

    this.write(output, "neofetch-output");
  }

  // Helper method to get uptime for neofetch
  getUptime() {
    // Generate a random but realistic uptime
    const hours = Math.floor(Math.random() * 24);
    const mins = Math.floor(Math.random() * 60);
    const days = Math.floor(Math.random() * 5);

    if (days > 0) {
      return `${days} days, ${hours} hours, ${mins} mins`;
    } else {
      return `${hours} hours, ${mins} mins`;
    }
  }
}
