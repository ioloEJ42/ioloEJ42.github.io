/**
 * Main script for portfolio site
 * Handles data loading, page routing, and component rendering
 * Enhanced with terminal-style interactions
 */

// Import components
document.addEventListener("DOMContentLoaded", () => {
  // Display loading state
  const loadingIndicator = document.createElement('div');
  loadingIndicator.id = 'loading-indicator';
  loadingIndicator.style.cssText = 'position: fixed; top: 10px; right: 10px; background: #333; color: white; padding: 5px 10px; border-radius: 3px; z-index: 1000; font-family: "JetBrains Mono", monospace;';
  loadingIndicator.textContent = '$ loading components...';
  document.body.appendChild(loadingIndicator);
  
  // Load components script first, then initialize the page
  const componentsScript = document.createElement("script");
  componentsScript.src = "components.js";
  componentsScript.onload = () => {
    loadingIndicator.textContent = '$ components loaded';
    setTimeout(() => {
      loadingIndicator.remove();
      initializePage();
    }, 500);
  };
  componentsScript.onerror = handleComponentError;
  document.body.appendChild(componentsScript);
});

// Handle component loading error
function handleComponentError() {
  console.error("Failed to load components.js!");
  document.body.insertAdjacentHTML('afterbegin', 
    '<div style="background: #ff3333; color: white; padding: 1rem; margin: 1rem; font-family: \'JetBrains Mono\', monospace;">' +
    '<h3>Error: components.js not found</h3>' +
    '<p>$ cat components.js<br>cat: components.js: No such file or directory</p>' +
    '</div>'
  );
}

// Terminal typing animation
function simulateTyping(element, text, speed = 50) {
  let i = 0;
  element.textContent = '';
  
  return new Promise(resolve => {
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

// Page initialization
async function initializePage() {
  // Check if Components were properly loaded
  if (typeof Components === 'undefined') {
    console.error("Components object is not defined!");
    document.body.insertAdjacentHTML('afterbegin', 
      '<div style="background: #ff3333; color: white; padding: 1rem; margin: 1rem; font-family: \'JetBrains Mono\', monospace;">' +
      '<h3>Error: Components not defined</h3>' +
      '<p>$ typeof Components<br>undefined</p>' +
      '</div>'
    );
    return;
  }

  // Determine current page
  const currentPage = getCurrentPage();
  console.log("Current page:", currentPage);

  // Render common components
  renderHeader(currentPage);
  renderFooter();

  // Load page-specific content
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
    case "project":
      loadProjectDetail();
      break;
    case "blog":
      loadBlogDetail();
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
  
  console.log("Pathname:", pathname, "Filename:", filename);

  if (
    filename === "index.html" ||
    filename === "" ||
    pathname.endsWith("/portfolio/")
  ) {
    return "home";
  } else if (filename === "projects.html") {
    return "projects";
  } else if (filename === "blogs.html") {
    return "blogs";
  } else if (filename === "contact.html") {
    return "contact";
  } else if (filename === "project.html") {
    return "project";
  } else if (filename === "blog.html") {
    return "blog";
  }

  return "home"; // Default
}

// Get URL parameter
function getUrlParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Render header with navigation
function renderHeader(currentPage) {
  const headerElement = document.querySelector("header");
  if (headerElement) {
    headerElement.innerHTML = Components.Navbar(currentPage);
  }
}

// Render footer
function renderFooter() {
  const footerElement = document.querySelector("footer");
  if (footerElement) {
    footerElement.innerHTML = Components.Footer();
  }
}

// Enhanced JSON loading with better error handling
async function loadJsonData(filename) {
  console.log(`$ curl -s https://api.portfolio.local/data/${filename}.json`);
  
  try {
    const response = await fetch(`data/${filename}.json`);
    
    if (!response.ok) {
      console.error(`curl: (404) Not Found - ${filename}.json: ${response.status} ${response.statusText}`);
      return null;
    }
    
    const data = await response.json();
    console.log(`Successfully loaded ${filename}.json`);
    return data;
  } catch (error) {
    console.error(`curl: Failed to connect to api.portfolio.local - ${error.message}`);
    return null;
  }
}

// Home page content
async function loadHomeContent() {
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
    document.getElementById("profile-bio").innerHTML = "<p>$ cat: bio.txt: No such file or directory</p>";
  }

  // Load featured projects
  const projectsContainer = document.getElementById("featured-projects");
  if (projectsContainer) {
    const projectsData = await loadJsonData("projects");
    if (projectsData && projectsData.projects) {
      const featuredProjects = projectsData.projects
        .filter((p) => p.featured)
        .slice(0, 3);

      if (featuredProjects.length > 0) {
        // Add a short delay to simulate loading
        await new Promise(resolve => setTimeout(resolve, 1000)); 
        projectsContainer.innerHTML = featuredProjects
          .map((project) => Components.ProjectCard(project))
          .join("");
      } else {
        projectsContainer.innerHTML = "<p>No featured projects found</p>";
      }
    } else {
      projectsContainer.innerHTML = "<p>$ grep: No matches found</p>";
    }
  }

  // Load recent blog posts
  const postsContainer = document.getElementById("recent-posts");
  if (postsContainer) {
    const blogsData = await loadJsonData("blogs");
    if (blogsData && blogsData.posts) {
      const recentPosts = blogsData.posts.slice(0, 3);

      if (recentPosts.length > 0) {
        // Add a short delay to simulate loading
        await new Promise(resolve => setTimeout(resolve, 1500));
        postsContainer.innerHTML = recentPosts
          .map((post) => Components.BlogPostItem(post))
          .join("");
      } else {
        postsContainer.innerHTML = "<p>No blog posts found</p>";
      }
    } else {
      postsContainer.innerHTML = "<p>$ find: No such file or directory</p>";
    }
  }
}

// Projects page content
async function loadProjectsContent() {
  const projectsContainer = document.querySelector(".terminal-output");
  if (projectsContainer) {
    // Simulate SSH connection time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const projectsData = await loadJsonData("projects");
    if (projectsData && projectsData.projects) {
      if (projectsData.projects.length > 0) {
        let output = "";
        // Add ls -la style header
        output += "<p>total " + projectsData.projects.length + "</p>";
        output += "<div class='projects-grid'>";
        output += projectsData.projects
          .map((project) => Components.ProjectCard(project))
          .join("");
        output += "</div>";
        projectsContainer.innerHTML = output;
      } else {
        projectsContainer.innerHTML = "<p>total 0</p><p>No projects found.</p>";
      }
    } else {
      projectsContainer.innerHTML = "<p>ls: cannot access '.': Connection timed out</p>";
    }
  }
}

// Blogs page content
async function loadBlogsContent() {
  const blogsContainer = document.querySelector(".terminal-output");
  if (blogsContainer) {
    // Simulate SSH connection time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const blogsData = await loadJsonData("blogs");
    if (blogsData && blogsData.posts) {
      if (blogsData.posts.length > 0) {
        let output = "";
        // Add find command style output
        output += "<div class='posts-list'>";
        output += blogsData.posts
          .map((post) => Components.BlogPostItem(post))
          .join("");
        output += "</div>";
        blogsContainer.innerHTML = output;
      } else {
        blogsContainer.innerHTML = "<p>No blog posts found.</p>";
      }
    } else {
      blogsContainer.innerHTML = "<p>find: cannot access './': Connection timed out</p>";
    }
  }
}

// Project detail page
async function loadProjectDetail() {
  const projectId = getUrlParam("id");
  if (!projectId) {
    window.location.href = "projects.html";
    return;
  }

  console.log("Loading project detail for ID:", projectId);
  const contentContainer = document.getElementById("project-content");
  const projectDirectory = document.getElementById("project-directory");
  const projectPath = document.getElementById("project-path");
  const projectPathCursor = document.querySelector(".project-path-cursor");
  const titleEl = document.getElementById("project-title");
  const tagsEl = document.getElementById("project-tags");
  const descriptionEl = document.getElementById("project-description");
  
  if (contentContainer) {
    // First load projects metadata
    const projectsData = await loadJsonData("projects");
    if (!projectsData || !projectsData.projects) {
      contentContainer.innerHTML = "<p>cat: README.md: No such file or directory</p>";
      return;
    }

    const projectMeta = projectsData.projects.find((p) => p.id === projectId);
    if (!projectMeta) {
      contentContainer.innerHTML = "<p>cd: no such directory: " + projectId + "</p>";
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
      // Simulate loading time
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      contentContainer.innerHTML = projectContent.content;
      
      // Update document title
      document.title = `${projectContent.title} | PORTFOLIO_`;
    } else {
      contentContainer.innerHTML = "<p>cat: README.md: No such file or directory</p>";
    }
  }
}

// Blog detail page
async function loadBlogDetail() {
  const blogId = getUrlParam("id");
  if (!blogId) {
    window.location.href = "blogs.html";
    return;
  }

  console.log("Loading blog detail for ID:", blogId);
  const contentContainer = document.getElementById("blog-content");
  const titleEl = document.getElementById("blog-title");
  const dateEl = document.getElementById("blog-date");
  const filenameEl = document.getElementById("blog-filename");
  
  if (contentContainer) {
    // First load blogs metadata
    const blogsData = await loadJsonData("blogs");
    if (!blogsData || !blogsData.posts) {
      contentContainer.innerHTML = "<p>less: post.md: No such file or directory</p>";
      return;
    }

    const blogMeta = blogsData.posts.find((p) => p.id === blogId);
    if (!blogMeta) {
      contentContainer.innerHTML = "<p>less: post.md: No such file or directory</p>";
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
      // Simulate loading time
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      contentContainer.innerHTML = blogContent.content;
    } else {
      contentContainer.innerHTML = "<p>less: " + blogId + ".md: No such file or directory</p>";
    }
  }
}

// Add blinking cursor animation to elements
function addBlinkingCursors() {
  const cursors = document.querySelectorAll('.blink-cursor');
  cursors.forEach(cursor => {
    if (!cursor.classList.contains('animated')) {
      cursor.classList.add('animated');
    }
  });
}

// Simulate typing for terminal command elements
function simulateCommandTyping() {
  const commands = document.querySelectorAll('.terminal-command:not(.blink-cursor):not(.typed)');
  commands.forEach(async (cmd) => {
    const text = cmd.textContent;
    cmd.classList.add('typed');
    cmd.textContent = '';
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500));
    simulateTyping(cmd, text, Math.floor(Math.random() * 30) + 30);
  });
}

// Add these effects after page loads
window.addEventListener('load', () => {
  addBlinkingCursors();
  simulateCommandTyping();
});