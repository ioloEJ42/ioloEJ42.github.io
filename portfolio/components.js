/**
 * Terminal-themed component system for portfolio site
 * Creates realistic Linux terminal windows with simulated SSH sessions
 */

// Components registry
const Components = {
  // Navbar component
  Navbar: (activePage = "") => {
    return `
      <nav>
        <div class="nav-title">PORTFOLIO_</div>
        <ul class="nav-links">
          <li class="${activePage === "home" ? "active" : ""}"><a href="index.html">$ HOME</a></li>
          <li class="${activePage === "projects" ? "active" : ""}"><a href="projects.html">$ PROJECTS</a></li>
          <li class="${activePage === "blogs" ? "active" : ""}"><a href="blogs.html">$ BLOGS</a></li>
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
  
  // Terminal window component
  TerminalWindow: ({ title = "Terminal", commands = [], content = "" }) => {
    return `
      <div class="terminal-window">
        <div class="terminal-header">
          <div class="terminal-buttons">
            <div class="terminal-button close"></div>
            <div class="terminal-button minimize"></div>
            <div class="terminal-button maximize"></div>
          </div>
          <div class="terminal-title">${title}</div>
        </div>
        <div class="terminal-body">
          ${commands.map(cmd => Components.TerminalLine(cmd)).join('')}
          ${content}
        </div>
      </div>
    `;
  },
  
  // Terminal line with prompt
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
  
  // SSH connection animation
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
        <p>Connecting to ${host}...</p>
        <p>The authenticity of host '${host}' can't be established.</p>
        <p>ECDSA key fingerprint is SHA256:dGhpciBpcyBhIGZha2Uga2V5IGZpbmdlcnByaW50</p>
        <p>Are you sure you want to continue connecting (yes/no/[fingerprint])? yes</p>
        <p>Warning: Permanently added '${host}' (ECDSA) to the list of known hosts.</p>
        <p>Password: ********</p>
        <p>Last login: ${new Date().toLocaleString()}</p>
      </div>
      ${content}
    `;
  },
  
  // Project card component styled as terminal output
  ProjectCard: (project) => {
    return `
      <div class="project-card">
        <h3 class="project-title">${project.title}</h3>
        <p>${project.description}</p>
        <div class="project-tags">
          ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join("")}
        </div>
        <a href="project.html?id=${project.id}" class="read-more">$ cat README.md</a>
      </div>
    `;
  },
  
  // Projects list in terminal style
  ProjectsList: (projects) => {
    const commands = [
      { user: "user", host: "portfolio", path: "~/projects", command: "ls -la" }
    ];
    
    const output = projects.map(project => Components.ProjectCard(project)).join('');
    
    return Components.TerminalWindow({
      title: "projects@portfolio: ~/projects",
      commands: commands,
      content: output
    });
  },
  
  // Blog post item component
  BlogPostItem: (post) => {
    return `
      <div class="post-item">
        <div class="post-date">${post.date}</div>
        <h3 class="post-title">${post.title}</h3>
        <p class="post-excerpt">${post.excerpt}</p>
        <a href="blog.html?id=${post.id}" class="read-more">$ less post.md</a>
      </div>
    `;
  },
  
  // Blog posts list in terminal style
  BlogsList: (posts) => {
    const commands = [
      { user: "user", host: "portfolio", path: "~/blogs", command: "find . -name \"*.md\" -type f | sort -r" }
    ];
    
    const output = posts.map(post => Components.BlogPostItem(post)).join('');
    
    return Components.TerminalWindow({
      title: "blogs@portfolio: ~/blogs",
      commands: commands,
      content: output
    });
  },
  
  // Loading indicator
  Loading: () => {
    return `
      <div class="terminal-window">
        <div class="terminal-header">
          <div class="terminal-buttons">
            <div class="terminal-button close"></div>
            <div class="terminal-button minimize"></div>
            <div class="terminal-button maximize"></div>
          </div>
          <div class="terminal-title">terminal</div>
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