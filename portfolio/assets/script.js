/**
 * Main script for portfolio site
 * Handles data loading, page routing, and component rendering
 * Enhanced with terminal-style interactions
 */

// Preload components as early as possible
// We define an inline component system for navigation and footer as fallback
// This ensures something displays even before components.js loads
(function preloadBasicComponents() {
  // Minimal component system for immediate rendering
  window.BasicComponents = {
    Navbar: (activePage = "") => {
      return `
        <nav>
          <div class="nav-container">
            <div class="nav-title">PORTFOLIO_</div>
            <div class="hamburger-menu">
              <div class="bar1"></div>
              <div class="bar2"></div>
              <div class="bar3"></div>
            </div>
          </div>
          <ul class="nav-links">
            <li class="${
              activePage === "home" ? "active" : ""
            }"><a href="index.html">$ HOME</a></li>
            <li class="${
              activePage === "projects" ? "active" : ""
            }"><a href="projects.html">$ PROJECTS</a></li>
            <li class="${
              activePage === "blogs" ? "active" : ""
            }"><a href="blogs.html">$ BLOGS</a></li>
            <li class="${
              activePage === "series" ? "active" : ""
            }"><a href="series.html">$ SERIES</a></li>
            <li class="${
              activePage === "interface" ? "active" : ""
            }"><a href="interface.html">$ TERMINAL</a></li>
            <li class="${
              activePage === "contact" ? "active" : ""
            }"><a href="contact.html">$ CONTACT</a></li>
          </ul>
        </nav>
      `;
    },

    Footer: () => {
      const currentYear = new Date().getFullYear();
      return `
        <p>&copy; ${currentYear} Iolo Evans Jones | $ echo "Built with HTML, CSS, JS, and a bit of love <3"</p>
      `;
    },
  };

  // Render the basic components instantly
  const currentPage = getCurrentPage();
  const headerElement = document.querySelector("header");
  const footerElement = document.querySelector("footer");

  if (headerElement) {
    headerElement.innerHTML = window.BasicComponents.Navbar(currentPage);
  }

  if (footerElement) {
    footerElement.innerHTML = window.BasicComponents.Footer();
  }

  // Helper function for initial page detection
  function getCurrentPage() {
    const pathname = window.location.pathname;
    const filename = pathname.split("/").pop();

    if (
      filename === "index.html" ||
      filename === "" ||
      pathname.endsWith("/Portfolio/")
    ) {
      return "home";
    } else if (filename === "projects.html") {
      return "projects";
    } else if (filename === "blogs.html") {
      return "blogs";
    } else if (filename === "series.html") {
      return "series";
    } else if (filename === "interface.html") {
      return "interface";
    } else if (filename === "contact.html") {
      return "contact";
    } else if (filename === "project.html") {
      return "project";
    } else if (filename === "blog.html") {
      return "blog";
    } else if (filename === "series-detail.html") {
      return "series-detail";
    }
    return "home";
  }
})();

// Initialize main functionality after DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Use console logging instead of visual indicators
  console.log("$ loading components...");

  // Load components script for full functionality
  const componentsScript = document.createElement("script");
  componentsScript.src = "components.js";
  componentsScript.onload = () => {
    console.log("$ components loaded successfully");
    initializePage();
  };
  componentsScript.onerror = handleComponentError;
  document.body.appendChild(componentsScript);
});

// Handle component loading error
function handleComponentError() {
  console.error("$ components.js: No such file or directory");
  document.body.insertAdjacentHTML(
    "afterbegin",
    "<div style=\"background: #222; color: #ddd; padding: 1rem; margin: 1rem; font-family: 'JetBrains Mono', monospace; border: 1px solid #555;\">" +
      "<h3>Error: components.js not found</h3>" +
      "<p>$ cat components.js<br>cat: components.js: No such file or directory</p>" +
      "</div>"
  );
}

// Terminal typing animation
function simulateTyping(element, text, speed = 50) {
  let i = 0;
  element.textContent = "";

  return new Promise((resolve) => {
    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else {
        resolve();
      }
    }
    type();
  });
}

// Page initialization - we don't need to re-render the header/footer
// since they were already rendered by the preload function
async function initializePage() {
  // Check if Components were properly loaded
  if (typeof Components === "undefined") {
    console.error("$ typeof Components");
    console.error("undefined");
    document.body.insertAdjacentHTML(
      "afterbegin",
      "<div style=\"background: #222; color: #ddd; padding: 1rem; margin: 1rem; font-family: 'JetBrains Mono', monospace; border: 1px solid #555;\">" +
        "<h3>Error: Components not defined</h3>" +
        "<p>$ typeof Components<br>undefined</p>" +
        "</div>"
    );
    return;
  }

  // Determine current page
  const currentPage = getCurrentPage();
  console.log("$ echo $CURRENT_PAGE");
  console.log(currentPage);

  // Load page-specific content without re-rendering nav/footer
  // This prevents the flash of unstyled content
  switch (currentPage) {
    case "home":
      loadHomeContent();
      break;
    case "projects":
      loadProjectsContent();
      break;
    case "blogs":
      loadBlogsContent();
      break;
    case "series":
      loadSeriesContent();
      break;
    case "project":
      loadProjectDetail();
      break;
    case "blog":
      loadBlogDetail();
      break;
    case "series-detail":
      loadSeriesDetail();
      break;
    case "interface":
      // Terminal interface page doesn't need data loading
      // Terminal functionality is handled by terminal.js
      break;
    case "contact":
      // Contact page doesn't need data loading
      break;
  }
}

// Get current page
function getCurrentPage() {
  const pathname = window.location.pathname;
  const filename = pathname.split("/").pop();

  console.log("$ pwd");
  console.log(pathname);

  if (
    filename === "index.html" ||
    filename === "" ||
    pathname.endsWith("/Portfolio/")
  ) {
    return "home";
  } else if (filename === "projects.html") {
    return "projects";
  } else if (filename === "blogs.html") {
    return "blogs";
  } else if (filename === "series.html") {
    return "series";
  } else if (filename === "interface.html") {
    return "interface";
  } else if (filename === "contact.html") {
    return "contact";
  } else if (filename === "project.html") {
    return "project";
  } else if (filename === "blog.html") {
    return "blog";
  } else if (filename === "series-detail.html") {
    return "series-detail";
  }

  return "home"; // Default
}

// Get URL parameter
function getUrlParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Cache for storing loaded data
const dataCache = {
  projectsMetadata: null,
  blogMetadata: null,
  projects: {},
  blogs: {},
};

// Enhanced JSON loading with better error handling and console logging
async function loadJsonData(filename) {
  if (filename === "projects" && dataCache.projectsMetadata) {
    return dataCache.projectsMetadata;
  }
  if (filename === "blogs" && dataCache.blogMetadata) {
    return dataCache.blogMetadata;
  }
  if (
    filename.startsWith("projects/") &&
    dataCache.projects[filename.split("/")[1]]
  ) {
    return dataCache.projects[filename.split("/")[1]];
  }
  if (
    filename.startsWith("blogs/") &&
    dataCache.blogs[filename.split("/")[1]]
  ) {
    return dataCache.blogs[filename.split("/")[1]];
  }

  console.log(`$ curl -s https://api.portfolio.local/data/${filename}.json`);

  try {
    // Handle special cases for projects and blogs main data files
    let url;
    if (filename === "blogs") {
      url = "data/blogs/index.json";
    } else if (filename === "projects") {
      url = "data/projects/index.json";
    } else if (filename === "profile") {
      url = "data/home/profile.json";
    } else if (filename === "series") {
      url = "data/series/index.json";
    } else {
      url = `data/${filename}.json`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      console.error(
        `curl: (404) Not Found - ${url} (${response.status})`
      );
      return null;
    }

    const data = await response.json();
    console.log(`$ jq . ${url} | head -3`);
    console.log(`{...}`); // Simulating partial output of jq

    // Cache the data
    if (filename === "projects") {
      dataCache.projectsMetadata = data;
    } else if (filename === "blogs") {
      dataCache.blogMetadata = data;
    } else if (filename.startsWith("projects/")) {
      dataCache.projects[filename.split("/")[1]] = data;
    } else if (filename.startsWith("blogs/")) {
      dataCache.blogs[filename.split("/")[1]] = data;
    }

    return data;
  } catch (error) {
    console.error(
      `curl: Failed to connect to api.portfolio.local - ${error.message}`
    );
    return null;
  }
}

// Home page content
async function loadHomeContent() {
  console.log("$ loading home content...");

  // Load profile data
  const profileData = await loadJsonData("profile");
  if (profileData) {
    const nameEl = document.getElementById("profile-name");
    const titleEl = document.getElementById("profile-title");
    const bioEl = document.getElementById("profile-bio");

    if (nameEl) nameEl.textContent = profileData.name;
    if (titleEl) titleEl.textContent = profileData.title;
    if (bioEl) bioEl.innerHTML = profileData.bio;
  } else {
    document.getElementById("profile-bio").innerHTML =
      "<p>$ cat: bio.txt: No such file or directory</p>";
  }

  console.log("$ home content loaded");
}

// Projects page content
async function loadProjectsContent() {
  console.log("$ loading projects...");
  const projectsContainer = document.querySelector(".terminal-output");
  if (projectsContainer) {
    // Simulate SSH connection time but shorter
    await new Promise((resolve) => setTimeout(resolve, 500));

    const projectsData = await loadJsonData("projects");
    if (projectsData && projectsData.projects) {
      if (projectsData.projects.length > 0) {
        // Sort projects by date, newest first
        const sortedProjects = [...projectsData.projects].sort((a, b) => {
          const dateA = new Date(a.date || 0);
          const dateB = new Date(b.date || 0);
          return dateB - dateA; // Descending order (newest first)
        });

        let output = "";
        // Add ls -la style header
        output += "<p>total " + sortedProjects.length + "</p>";
        output += "<div class='projects-grid'>";
        output += sortedProjects
          .map((project) => Components.ProjectCard(project))
          .join("");
        output += "</div>";
        projectsContainer.innerHTML = output;
      } else {
        projectsContainer.innerHTML = "<p>total 0</p><p>No projects found.</p>";
      }
    } else {
      projectsContainer.innerHTML =
        "<p>ls: cannot access '.': Connection timed out</p>";
    }
  }
  console.log("$ projects loaded");
}

// Blogs page content
async function loadBlogsContent() {
  console.log("$ loading blogs...");
  const blogsContainer = document.querySelector(".terminal-output");
  if (blogsContainer) {
    // Simulate SSH connection time but shorter
    await new Promise((resolve) => setTimeout(resolve, 500));

    const blogsData = await loadJsonData("blogs");
    if (blogsData && blogsData.posts) {
      if (blogsData.posts.length > 0) {
        // Sort blog posts by date, newest first
        const sortedPosts = [...blogsData.posts].sort((a, b) => {
          const dateA = new Date(a.date || 0);
          const dateB = new Date(b.date || 0);
          return dateB - dateA; // Descending order (newest first)
        });

        let output = "";
        // Add find command style output
        output += "<div class='posts-list'>";
        output += sortedPosts
          .map((post) => Components.BlogPostItem(post))
          .join("");
        output += "</div>";
        blogsContainer.innerHTML = output;
      } else {
        blogsContainer.innerHTML = "<p>No blog posts found.</p>";
      }
    } else {
      blogsContainer.innerHTML =
        "<p>find: cannot access './': Connection timed out</p>";
    }
  }
  console.log("$ blogs loaded");
}

// Series page content
async function loadSeriesContent() {
  console.log("$ loading series...");
  const seriesContainer = document.querySelector(".terminal-output");
  if (seriesContainer) {
    // Simulate SSH connection time but shorter
    await new Promise((resolve) => setTimeout(resolve, 500));

    const seriesData = await loadJsonData("series");
    if (seriesData && seriesData.collections) {
      if (seriesData.collections.length > 0) {
        // Sort series by date, newest first
        const sortedSeries = [...seriesData.collections].sort((a, b) => {
          const dateA = new Date(a.date || 0);
          const dateB = new Date(b.date || 0);
          return dateB - dateA; // Descending order (newest first)
        });

        // Create a grid layout but only include the actual series
        let output = "";
        output += "<div class='series-grid'>";
        
        // Only add the actual series we have
        if (sortedSeries.length > 0) {
          const series = sortedSeries[0];
          output += `
            <a href="series-detail.html?id=${series.id}" class="series-terminal">
              <div class="terminal-window">
                <div class="terminal-header">
                  <div class="terminal-buttons">
                    <div class="terminal-button close"></div>
                    <div class="terminal-button minimize"></div>
                    <div class="terminal-button maximize"></div>
                  </div>
                  <div class="terminal-title">${series.title}</div>
                </div>
                <div class="terminal-body">
                  <div class="terminal-line">
                    <div class="terminal-prompt">
                      <span class="terminal-user">user</span>
                      <span>@</span>
                      <span class="terminal-host">portfolio</span>
                      <span>:</span>
                      <span class="terminal-path">~/series</span>
                      <span>$</span>
                    </div>
                    <div class="terminal-command">cat description.txt</div>
                  </div>
                  <div class="terminal-output">
                    <p>${series.description}</p>
                    <div class="series-tags">
                      ${series.tags.map(tag => `<span class="series-tag">${tag}</span>`).join("")}
                    </div>
                    <p class="read-more">$ cd ${series.id} && ls -la</p>
                  </div>
                </div>
              </div>
            </a>
          `;
        }
        
        output += "</div>";
        seriesContainer.innerHTML = output;
        
        // Initialize terminal effects for the newly created terminals
        addBlinkingCursors();
        simulateCommandTyping();
      } else {
        seriesContainer.innerHTML = "<p>No series found.</p>";
      }
    } else {
      seriesContainer.innerHTML =
        "<p>find: cannot access './': Connection timed out</p>";
    }
  }
  console.log("$ series loaded");
}

// Project detail page
async function loadProjectDetail() {
  const projectId = getUrlParam("id");
  if (!projectId) {
    window.location.href = "projects.html";
    return;
  }

  console.log(`$ loading project ${projectId}...`);
  const contentContainer = document.getElementById("project-content");
  const projectDirectory = document.getElementById("project-directory");
  const projectPath = document.getElementById("project-path");
  const projectPathCursor = document.querySelector(".project-path-cursor");
  const titleEl = document.getElementById("project-title");
  const tagsEl = document.getElementById("project-tags");
  const descriptionEl = document.getElementById("project-description");
  const linksEl = document.getElementById("project-links");

  if (contentContainer) {
    // First load projects metadata
    const projectsData = await loadJsonData("projects");
    if (!projectsData || !projectsData.projects) {
      contentContainer.innerHTML =
        "<p>cat: README.md: No such file or directory</p>";
      return;
    }

    const projectMeta = projectsData.projects.find((p) => p.id === projectId);
    if (!projectMeta) {
      contentContainer.innerHTML =
        "<p>cd: no such directory: " + projectId + "</p>";
      return;
    }

    // Update project directory and path
    if (projectDirectory) projectDirectory.textContent = projectMeta.id;
    if (projectPath) projectPath.textContent = projectMeta.id;
    if (projectPathCursor) projectPathCursor.textContent = projectMeta.id;

    // Update page title and project metadata
    if (titleEl) titleEl.textContent = projectMeta.title;
    if (tagsEl) {
      tagsEl.innerHTML = projectMeta.tags
        .map((tag) => `<span class="project-tag">${tag}</span>`)
        .join("");
    }
    if (descriptionEl) descriptionEl.textContent = projectMeta.description;

    // Now load the full project content
    const projectContent = await loadJsonData(`projects/${projectId}`);
    if (projectContent) {
      // Simulate loading time but shorter
      await new Promise((resolve) => setTimeout(resolve, 300));
      contentContainer.innerHTML = projectContent.content;

      // Add links if they exist and are not "N/A"
      if (linksEl) {
        let linksHTML = "";

        // Check if live link exists and is not "N/A" (case-insensitive)
        if (
          projectContent.live &&
          !/^n\/?a$/i.test(projectContent.live.trim())
        ) {
          linksHTML += `<a href="${projectContent.live}" target="_blank" class="demo-link">Live Demo</a>`;
        }

        // Check if github link exists and is not "N/A" (case-insensitive)
        if (
          projectContent.github &&
          !/^n\/?a$/i.test(projectContent.github.trim())
        ) {
          // Only add margin-left if there's also a live demo link
          const marginClass = linksHTML.length > 0 ? " github-with-margin" : "";
          linksHTML += `<a href="${projectContent.github}" target="_blank" class="repo-link${marginClass}">GitHub Repo</a>`;
        }

        linksEl.innerHTML = linksHTML;
      }

      // Update document title
      document.title = `${projectContent.title} | PORTFOLIO_`;
    } else {
      contentContainer.innerHTML =
        "<p>cat: README.md: No such file or directory</p>";
    }
  }
  console.log(`$ project ${projectId} loaded`);
}

// Blog detail page
async function loadBlogDetail() {
  const blogId = getUrlParam("id");
  if (!blogId) {
    window.location.href = "blogs.html";
    return;
  }

  console.log(`$ loading blog ${blogId}...`);
  const contentContainer = document.getElementById("blog-content");
  const titleEl = document.getElementById("blog-title");
  const dateEl = document.getElementById("blog-date");
  const filenameEl = document.getElementById("blog-filename");

  if (contentContainer) {
    // First load blogs metadata
    const blogsData = await loadJsonData("blogs");
    if (!blogsData || !blogsData.posts) {
      contentContainer.innerHTML =
        "<p>less: post.md: No such file or directory</p>";
      return;
    }

    const blogMeta = blogsData.posts.find((p) => p.id === blogId);
    if (!blogMeta) {
      contentContainer.innerHTML =
        "<p>less: post.md: No such file or directory</p>";
      return;
    }

    // Update page title and blog metadata
    if (titleEl) titleEl.textContent = blogMeta.title;
    if (dateEl) dateEl.textContent = "Date: " + blogMeta.date;
    if (filenameEl) filenameEl.textContent = blogId + ".md";

    // Update document title
    document.title = `${blogMeta.title} | PORTFOLIO_`;

    // Now load the full blog content
    const blogContent = await loadJsonData(`blogs/${blogId}`);
    if (blogContent) {
      // Simulate loading time but shorter
      await new Promise((resolve) => setTimeout(resolve, 300));
      contentContainer.innerHTML = blogContent.content;
    } else {
      contentContainer.innerHTML =
        "<p>less: " + blogId + ".md: No such file or directory</p>";
    }
  }
  console.log(`$ blog ${blogId} loaded`);
}

// Series detail page
async function loadSeriesDetail() {
  const seriesId = getUrlParam("id");
  if (!seriesId) {
    window.location.href = "series.html";
    return;
  }

  console.log(`$ loading series ${seriesId}...`);
  const contentContainer = document.getElementById("series-content");
  const titleEl = document.getElementById("series-title");
  const dateEl = document.getElementById("series-date");
  const filenameEl = document.getElementById("series-filename");

  if (contentContainer) {
    // First load series metadata
    const seriesData = await loadJsonData("series");
    if (!seriesData || !seriesData.collections) {
      contentContainer.innerHTML =
        "<p>less: series.txt: No such file or directory</p>";
      return;
    }

    const seriesMeta = seriesData.collections.find((s) => s.id === seriesId);
    if (!seriesMeta) {
      contentContainer.innerHTML =
        "<p>less: series.txt: No such file or directory</p>";
      return;
    }

    // Update page title and series metadata
    if (titleEl) titleEl.textContent = seriesMeta.title;
    if (dateEl) dateEl.textContent = "Date: " + seriesMeta.date;
    if (filenameEl) filenameEl.textContent = seriesId + ".txt";

    // Update document title
    document.title = `${seriesMeta.title} | PORTFOLIO_`;

    // Try to load HTML content first
    try {
      const response = await fetch(`data/series/${seriesId}/index.html`);
      
      if (response.ok) {
        // Simulate loading time but shorter
        await new Promise((resolve) => setTimeout(resolve, 300));
        
        // Get the HTML content
        const htmlContent = await response.text();
        
        // Extract the body content from the HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        const bodyContent = tempDiv.querySelector('body').innerHTML;
        
        // Display the content
        contentContainer.innerHTML = bodyContent;
        return;
      }
    } catch (error) {
      console.warn(`Could not load HTML content for series ${seriesId}:`, error);
    }

    // Fallback to JSON content if HTML content is not available
    const seriesContent = await loadJsonData(`series/${seriesId}`);
    if (seriesContent) {
      // Simulate loading time but shorter
      await new Promise((resolve) => setTimeout(resolve, 300));
      contentContainer.innerHTML = seriesContent.content;
    } else {
      // If no detailed content is available, use the description from metadata
      contentContainer.innerHTML = `
        <div class="series-description">
          <p>${seriesMeta.description}</p>
        </div>
        <div class="series-tags">
          ${seriesMeta.tags.map(tag => `<span class="series-tag">${tag}</span>`).join("")}
        </div>
        <div class="series-installments">
          <h2>Installments</h2>
          <p>No installments available yet. Check back soon!</p>
        </div>
      `;
    }
  }
  console.log(`$ series ${seriesId} loaded`);
}

// Add blinking cursor animation to elements
function addBlinkingCursors() {
  const cursors = document.querySelectorAll(".blink-cursor");
  cursors.forEach((cursor) => {
    if (!cursor.classList.contains("animated")) {
      cursor.classList.add("animated");
    }
  });
}

// Simulate typing for terminal command elements
function simulateCommandTyping() {
  const commands = document.querySelectorAll(
    ".terminal-command:not(.blink-cursor):not(.typed)"
  );
  commands.forEach(async (cmd) => {
    const text = cmd.textContent;
    cmd.classList.add("typed");
    cmd.textContent = "";
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 300));
    simulateTyping(cmd, text, Math.floor(Math.random() * 15) + 15);
  });
}

// GitHub Profile Data Fetcher
async function fetchGitHubProfile() {
  const username = "ioloEJ42";

  try {
    // Fetch basic profile data
    const profileResponse = await fetch(
      `https://api.github.com/users/${username}`
    );
    const profile = await profileResponse.json();

    // Fetch repositories data
    const reposResponse = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=3`
    );
    const repos = await reposResponse.json();

    // Build profile HTML with two-column layout
    let profileHTML = `
      <div class="github-profile-grid">
        <div class="github-profile-info">
          <p><span class="terminal-green">Username:</span> ${profile.login}</p>
          ${
            profile.name
              ? `<p><span class="terminal-green">Name:</span> ${profile.name}</p>`
              : ""
          }
          ${
            profile.bio
              ? `<p><span class="terminal-green">Bio:</span> ${profile.bio}</p>`
              : ""
          }
          <p><span class="terminal-green">Public Repos:</span> ${
            profile.public_repos
          }</p>
          <p><span class="terminal-green">Followers:</span> ${
            profile.followers
          }</p>
          <p><span class="terminal-green">Following:</span> ${
            profile.following
          }</p>
          <p><span class="terminal-green">Profile URL:</span> <a href="${
            profile.html_url
          }" target="_blank">${profile.html_url}</a></p>
        </div>
    `;

    // Add repos section as second column if repositories were found
    if (repos.length > 0) {
      profileHTML += `
        <div class="github-profile-repos">
          <p class="terminal-section-header">Recent Repositories:</p>
          <ul class="github-repos">
      `;

      repos.forEach((repo) => {
        profileHTML += `
          <li>
            <span class="repo-name"><a href="${
              repo.html_url
            }" target="_blank">${repo.name}</a></span>
            ${
              repo.language
                ? `<span class="repo-language">[${repo.language}]</span>`
                : ""
            }
            ${
              repo.description
                ? `<div class="repo-description">${repo.description}</div>`
                : ""
            }
          </li>
        `;
      });

      profileHTML += `</ul></div>`;
    }

    profileHTML += `</div>`;

    // Update the profile element with the fetched data
    document.getElementById("github-profile").innerHTML = profileHTML;
  } catch (error) {
    console.error("Error fetching GitHub data:", error);
    document.getElementById("github-profile").innerHTML =
      "Error fetching GitHub data. Please try again later.";
  }
}

window.addEventListener("load", () => {
  console.log("$ initializing terminal effects...");
  addBlinkingCursors();
  simulateCommandTyping();
  console.log("$ terminal ready");

  // Add this line to call the GitHub API fetch
  fetchGitHubProfile();

  // Hamburger menu functionality
  const hamburger = document.querySelector(".hamburger-menu");
  const navLinks = document.querySelector(".nav-links");

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("change");
      navLinks.classList.toggle("show");
    });
  }
});
