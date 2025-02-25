/**
 * Terminal-themed component system for portfolio site
 * Creates realistic Linux terminal windows
 */

// Components registry
const Components = {
  // Navbar component - Updated to include Terminal link
  Navbar: (activePage = "") => {
    return `
      <nav>
        <div class="nav-title">PORTFOLIO_</div>
        <ul class="nav-links">
          <li class="${activePage === "home" ? "active" : ""}"><a href="index.html">$ HOME</a></li>
          <li class="${activePage === "projects" ? "active" : ""}"><a href="projects.html">$ PROJECTS</a></li>
          <li class="${activePage === "blogs" ? "active" : ""}"><a href="blogs.html">$ BLOGS</a></li>
          <li class="${activePage === "interface" ? "active" : ""}"><a href="interface.html">$ TERMINAL</a></li>
          <li class="${activePage === "contact" ? "active" : ""}"><a href="contact.html">$ CONTACT</a></li>
          <li><a href="../">$ DASHBOARD</a></li>
        </ul>
      </nav>
    `;
  },
  
  // Footer component
  Footer: () => {
    const currentYear = new Date().getFullYear();
    return `
      <p>&copy; ${currentYear} NAME_ | $ echo "Built with HTML, CSS, JS"</p>
    `;
  },
  
  // Terminal window component - Linux style
  TerminalWindow: ({ title = "user@server: ~", commands = [], content = "" }) => {
    return `
      <div class="terminal-window">
        <div class="terminal-header">
          <div class="terminal-title">${title}</div>
        </div>
        <div class="terminal-body">
          ${commands.map(cmd => Components.TerminalLine(cmd)).join('')}
          ${content}
        </div>
      </div>
    `;
  },
  
  // Terminal line with prompt - Linux style
  TerminalLine: ({ user = "user", host = "portfolio", path = "~", command = "", output = "" }) => {
    return `
      <div class="terminal-line">
        <div class="terminal-prompt">
          <span class="terminal-user">${user}</span>
          <span>@</span>
          <span class="terminal-host">${host}</span>
          <span>:</span>
          <span class="terminal-path">${path}</span>
          <span>$</span>
        </div>
        <div class="terminal-command">${command}</div>
      </div>
      ${output ? `<div class="terminal-output">${output}</div>` : ''}
    `;
  },
  
  // SSH connection animation - Linux style
  SSHConnection: (host, content) => {
    return `
      <div class="ssh-loading">
        <div class="terminal-line">
          <div class="terminal-prompt">
            <span class="terminal-user">user</span>
            <span>@</span>
            <span class="terminal-host">local</span>
            <span>:</span>
            <span class="terminal-path">~</span>
            <span>$</span>
          </div>
          <div class="terminal-command">ssh ${host}</div>
        </div>
        <p>The authenticity of host '${host}' can't be established.</p>
        <p>ECDSA key fingerprint is SHA256:dGhpciBpcyBhIGZha2Uga2V5IGZpbmdlcnByaW50</p>
        <p>Are you sure you want to continue connecting (yes/no/[fingerprint])? yes</p>
        <p>Warning: Permanently added '${host}' (ECDSA) to the list of known hosts.</p>
        <p>${host}'s password: ********</p>
        <p>Last login: ${new Date().toUTCString()} from 192.168.1.42</p>
      </div>
      ${content}
    `;
  },
  
  // Project card component - Linux file listing style
  ProjectCard: (project) => {
    const date = new Date().toISOString().split('T')[0];
    return `
      <div class="project-card">
        <div class="project-listing">
          <span class="directory">drwxr-xr-x</span> 2 user portfolio 4096 ${date} <span class="directory">${project.id}/</span>
        </div>
        <h3 class="project-title">${project.title}</h3>
        <p>${project.description}</p>
        <div class="project-tags">
          ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join("")}
        </div>
        <a href="project.html?id=${project.id}" class="read-more">$ cd ${project.id} && cat README.md</a>
      </div>
    `;
  },
  
  // Projects list in terminal style - Linux ls output
  ProjectsList: (projects) => {
    const commands = [
      { user: "user", host: "portfolio", path: "~/projects", command: "ls -la" }
    ];
    
    let output = "<p>total " + projects.length + "</p>";
    output += projects.map(project => Components.ProjectCard(project)).join('');
    
    return Components.TerminalWindow({
      title: "user@portfolio: ~/projects",
      commands: commands,
      content: output
    });
  },
  
  // Blog post item component - Linux file view style
  BlogPostItem: (post) => {
    const fileDate = post.date.replace(/\s/g, '_').toLowerCase();
    return `
      <div class="post-item">
        <div class="post-listing">
          <span class="text-file">-rw-r--r--</span> 1 blogs portfolio 4096 ${fileDate} <span class="text-file">${post.id}.md</span>
        </div>
        <div class="post-date">${post.date}</div>
        <h3 class="post-title">${post.title}</h3>
        <p class="post-excerpt">${post.excerpt}</p>
        <a href="blog.html?id=${post.id}" class="read-more">$ less ${post.id}.md</a>
      </div>
    `;
  },
  
  // Blog posts list in terminal style - Linux find output
  BlogsList: (posts) => {
    const commands = [
      { user: "user", host: "portfolio", path: "~/blogs", command: "find . -name \"*.md\" -type f | sort -r" }
    ];
    
    const output = posts.map(post => Components.BlogPostItem(post)).join('');
    
    return Components.TerminalWindow({
      title: "user@portfolio: ~/blogs",
      commands: commands,
      content: output
    });
  },
  
  // Loading indicator - Linux style
  Loading: () => {
    return `
      <div class="terminal-window">
        <div class="terminal-header">
          <div class="terminal-title">user@portfolio: ~</div>
        </div>
        <div class="terminal-body">
          <div class="terminal-line">
            <div class="terminal-prompt">
              <span class="terminal-user">user</span>
              <span>@</span>
              <span class="terminal-host">portfolio</span>
              <span>:</span>
              <span class="terminal-path">~</span>
              <span>$</span>
            </div>
            <div class="terminal-command">fetching data<span class="blink-cursor"></span></div>
          </div>
        </div>
      </div>
    `;
  }
};

// Component renderer
function renderComponent(selector, component) {
  const container = document.querySelector(selector);
  if (container) {
    container.innerHTML = component;
  }
}

// Export components to global scope
window.Components = Components;
window.renderComponent = renderComponent;