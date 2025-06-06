/**
 * Portfolio Content Editor
 * 
 * This script handles the functionality of the portfolio content editor,
 * allowing users to create, edit, and download JSON data for projects and blogs.
 */

// Global state
const state = {
  currentTab: 'projects', // 'projects' or 'blogs'
  currentItemId: null,
  editMode: 'html', // 'html' or 'preview'
  darkMode: true, // Default to dark mode
  items: {
    projects: [],
    blogs: []
  }
};

// DOM element references
const elements = {
  // Tabs
  tabButtons: document.querySelectorAll('.tab-btn'),
  
  // Sidebar
  listTitle: document.getElementById('list-title'),
  itemsContainer: document.getElementById('items-container'),
  newItemBtn: document.getElementById('new-item-btn'),
  
  // Editor
  welcomeScreen: document.getElementById('welcome-screen'),
  editorContainer: document.getElementById('editor-container'),
  editorTitle: document.getElementById('editor-title'),
  
  // Form Fields
  itemId: document.getElementById('item-id'),
  itemTitle: document.getElementById('item-title'),
  itemDescription: document.getElementById('item-description'),
  itemDate: document.getElementById('item-date'),
  itemAuthor: document.getElementById('item-author'),
  authorGroup: document.getElementById('author-group'),
  itemFeatured: document.getElementById('item-featured'),
  featuredGroup: document.getElementById('featured-group'),
  itemGithub: document.getElementById('item-github'),
  githubGroup: document.getElementById('github-group'),
  itemLive: document.getElementById('item-live'),
  liveGroup: document.getElementById('live-group'),
  tagsInput: document.getElementById('item-tags-input'),
  tagsContainer: document.getElementById('tags-container'),
  contentHtml: document.getElementById('content-html'),
  contentPreview: document.getElementById('content-preview'),
  
  // Editor Mode Toggles
  editorModeButtons: document.querySelectorAll('.editor-mode-btn'),
  htmlEditor: document.getElementById('html-editor'),
  previewEditor: document.getElementById('preview-editor'),
  
  // Buttons
  themeToggle: document.getElementById('theme-toggle'),
  addTagBtn: document.getElementById('add-tag-btn'),
  previewBtn: document.getElementById('preview-btn'),
  saveBtn: document.getElementById('save-btn'),
  cancelBtn: document.getElementById('cancel-btn'),
  
  // Modal
  jsonPreviewModal: document.getElementById('json-preview-modal'),
  closePreviewModalBtn: document.getElementById('close-preview-modal'),
  metadataJsonPreview: document.getElementById('metadata-json'),
  contentFileJsonPreview: document.getElementById('content-file-json'),
  downloadJsonBtn: document.getElementById('download-json-btn'),
  modalTabs: document.querySelectorAll('.modal-tab'),
  
  // Notification
  notification: document.getElementById('notification'),
  notificationMessage: document.getElementById('notification-message'),

  // Format Tools
  formatButtons: document.querySelectorAll('.tool-btn')
};

// API functions for data loading and saving
const api = {
  // Load projects list
  async loadProjects() {
    try {
      const response = await fetch('../data/projects/index.json');
      if (!response.ok) {
        throw new Error(`Failed to load projects (${response.status})`);
      }
      const data = await response.json();
      return data.projects || [];
    } catch (error) {
      console.error('Error loading projects:', error);
      showNotification(`Error loading projects: ${error.message}`, 'error');
      return [];
    }
  },
  
  // Load blogs list
  async loadBlogs() {
    try {
      const response = await fetch('../data/blogs/index.json');
      if (!response.ok) {
        throw new Error(`Failed to load blog posts (${response.status})`);
      }
      const data = await response.json();
      return data.posts || [];
    } catch (error) {
      console.error('Error loading blog posts:', error);
      showNotification(`Error loading blog posts: ${error.message}`, 'error');
      return [];
    }
  },
  
  // Load a specific project
  async loadProject(id) {
    try {
      const response = await fetch(`../data/projects/${id}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load project ${id} (${response.status})`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error loading project ${id}:`, error);
      showNotification(`Error loading project ${id}: ${error.message}`, 'error');
      return null;
    }
  },
  
  // Load a specific blog post
  async loadBlog(id) {
    try {
      const response = await fetch(`../data/blogs/${id}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load blog post ${id} (${response.status})`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error loading blog post ${id}:`, error);
      showNotification(`Error loading blog post ${id}: ${error.message}`, 'error');
      return null;
    }
  }
};

// UI functions
function renderItemsList() {
  elements.itemsContainer.innerHTML = '<div class="loading-indicator">Loading...</div>';
  
  const items = state.items[state.currentTab];
  if (!items || items.length === 0) {
    elements.itemsContainer.innerHTML = '<div class="empty-state">No items found</div>';
    return;
  }
  
  let html = '';
  items.forEach(item => {
    const date = item.date || '(No date)';
    const tagsHtml = item.tags.map(tag => `<span class="item-tag">${tag}</span>`).join('');
    
    html += `
      <div class="item-card" data-id="${item.id}">
        <div class="item-title">${item.title}</div>
        <div class="item-date">${date}</div>
        <div class="item-description">${item.description}</div>
        <div class="item-tags">${tagsHtml}</div>
      </div>
    `;
  });
  
  elements.itemsContainer.innerHTML = html;
  
  // Add click event to item cards
  document.querySelectorAll('.item-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.id;
      loadItem(id);
    });
  });
}

// Load item into editor
async function loadItem(id) {
  state.currentItemId = id;
  
  try {
    let item;
    if (state.currentTab === 'projects') {
      item = await api.loadProject(id);
    } else {
      item = await api.loadBlog(id);
    }
    
    if (!item) {
      throw new Error(`Could not load ${state.currentTab === 'projects' ? 'project' : 'blog post'} with ID ${id}`);
    }
    
    // Fill the form
    elements.itemId.value = item.id;
    elements.itemTitle.value = item.title;
    elements.itemDescription.value = item.description;
    
    // Date handling
    if (item.date) {
      // Try to parse date for input[type="date"]
      if (state.currentTab === 'projects') {
        // Projects use ISO format
        elements.itemDate.value = formatDateForInput(item.date);
      } else {
        // Blogs use text format
        elements.itemDate.value = item.date;
      }
    }
    
    // Set item type specific fields
    if (state.currentTab === 'projects') {
      elements.itemFeatured.checked = item.featured || false;
      elements.featuredGroup.style.display = 'block';
      elements.authorGroup.style.display = 'none';
      elements.githubGroup.style.display = 'block';
      elements.liveGroup.style.display = 'block';
      
      if (item.github) elements.itemGithub.value = item.github;
      if (item.live) elements.itemLive.value = item.live;
    } else {
      elements.authorGroup.style.display = 'block';
      elements.featuredGroup.style.display = 'none';
      elements.githubGroup.style.display = 'none';
      elements.liveGroup.style.display = 'none';
      
      if (item.author) elements.itemAuthor.value = item.author;
    }
    
    // Clear and populate tags
    elements.tagsContainer.innerHTML = '';
    if (item.tags && Array.isArray(item.tags)) {
      item.tags.forEach(tag => addTag(tag));
    }
    
    // Set content
    elements.contentHtml.value = item.content || '';
    updatePreview();
    
    // Update UI
    elements.editorTitle.textContent = `Edit ${state.currentTab === 'projects' ? 'Project' : 'Blog Post'}: ${item.title}`;
    showEditor();
    
    showNotification(`Loaded ${state.currentTab === 'projects' ? 'project' : 'blog post'}: ${item.title}`, 'success');
  } catch (error) {
    console.error(`Error loading item ${id}:`, error);
    showNotification(error.message, 'error');
  }
}

// Format date for input[type="date"]
function formatDateForInput(dateString) {
  // If it's already in ISO format (YYYY-MM-DD), return as is
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }
  
  // Try to parse the date
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    // If parsing fails, return the original string
    return dateString;
  }
  
  // Format as YYYY-MM-DD for input[type="date"]
  return date.toISOString().split('T')[0];
}

// Show notification
function showNotification(message, type = 'info') {
  elements.notificationMessage.textContent = message;
  elements.notification.className = 'notification';
  if (type) {
    elements.notification.classList.add(type);
  }
  
  // Set appropriate icon
  const iconElement = elements.notification.querySelector('.notification-icon');
  if (iconElement) {
    iconElement.className = 'notification-icon fas';
    switch (type) {
      case 'success':
        iconElement.classList.add('fa-check-circle');
        break;
      case 'error':
        iconElement.classList.add('fa-exclamation-circle');
        break;
      case 'warning':
        iconElement.classList.add('fa-exclamation-triangle');
        break;
      default:
        iconElement.classList.add('fa-info-circle');
    }
  }
  
  elements.notification.classList.add('show');
  
  // Hide notification after 3 seconds
  setTimeout(() => {
    elements.notification.classList.remove('show');
  }, 3000);
}

// Show editor and hide welcome screen
function showEditor() {
  elements.welcomeScreen.style.display = 'none';
  elements.editorContainer.style.display = 'flex';
}

// Hide editor and show welcome screen
function hideEditor() {
  elements.welcomeScreen.style.display = 'flex';
  elements.editorContainer.style.display = 'none';
}

// Reset form
function resetForm() {
  // Reset form fields
  elements.itemId.value = '';
  elements.itemTitle.value = '';
  elements.itemDescription.value = '';
  elements.itemDate.value = new Date().toISOString().split('T')[0]; // Today
  elements.itemAuthor.value = '';
  elements.itemFeatured.checked = false;
  elements.itemGithub.value = '';
  elements.itemLive.value = '';
  elements.tagsContainer.innerHTML = '';
  elements.contentHtml.value = '';
  elements.contentPreview.innerHTML = '';
  
  // Reset state
  state.currentItemId = null;
}

// Create new item
function createNewItem() {
  resetForm();
  
  // Configure form based on item type
  if (state.currentTab === 'projects') {
    elements.featuredGroup.style.display = 'block';
    elements.authorGroup.style.display = 'none';
    elements.githubGroup.style.display = 'block';
    elements.liveGroup.style.display = 'block';
  } else {
    elements.featuredGroup.style.display = 'none';
    elements.authorGroup.style.display = 'block';
    elements.githubGroup.style.display = 'none';
    elements.liveGroup.style.display = 'none';
    
    // For blogs, use text format date
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    elements.itemDate.value = today.toLocaleDateString('en-US', options);
  }
  
  // Update UI
  elements.editorTitle.textContent = `New ${state.currentTab === 'projects' ? 'Project' : 'Blog Post'}`;
  showEditor();
}

// Add a tag
function addTag(tag) {
  if (!tag) return;
  
  // Check if tag already exists
  const existingTags = Array.from(elements.tagsContainer.querySelectorAll('.tag-text'))
    .map(el => el.textContent);
  
  if (existingTags.includes(tag)) {
    return; // Don't add duplicate tags
  }
  
  const tagElement = document.createElement('div');
  tagElement.className = 'tag';
  
  const tagText = document.createElement('span');
  tagText.className = 'tag-text';
  tagText.textContent = tag;
  
  const removeButton = document.createElement('span');
  removeButton.className = 'tag-remove';
  removeButton.innerHTML = '&times;';
  removeButton.addEventListener('click', () => {
    elements.tagsContainer.removeChild(tagElement);
  });
  
  tagElement.appendChild(tagText);
  tagElement.appendChild(removeButton);
  elements.tagsContainer.appendChild(tagElement);
}

// Get all tags
function getTags() {
  return Array.from(elements.tagsContainer.querySelectorAll('.tag-text'))
    .map(el => el.textContent);
}

// Update preview
function updatePreview() {
  elements.contentPreview.innerHTML = elements.contentHtml.value;
}

// Switch editor mode
function switchEditorMode(mode) {
  state.editMode = mode;
  
  // Update UI
  elements.editorModeButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });
  
  if (mode === 'html') {
    elements.htmlEditor.style.display = 'block';
    elements.previewEditor.style.display = 'none';
  } else {
    elements.htmlEditor.style.display = 'none';
    elements.previewEditor.style.display = 'block';
    updatePreview();
  }
}

// Switch tab
function switchTab(tab) {
  state.currentTab = tab;
  
  // Update UI
  elements.tabButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });
  
  elements.listTitle.textContent = tab === 'projects' ? 'Projects' : 'Blog Posts';
  
  // Load items for tab
  loadItems();
  
  // Reset editor
  hideEditor();
}

// Preview JSON
function previewJson() {
  try {
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Generate JSON objects
    const data = generateJsonData();
    
    // Display in modal
    elements.metadataJsonPreview.textContent = JSON.stringify(data.metadata, null, 2);
    elements.contentFileJsonPreview.textContent = JSON.stringify(data.content, null, 2);
    
    // Show modal
    openJsonPreviewModal();
  } catch (error) {
    console.error('Error generating JSON preview:', error);
    showNotification(error.message, 'error');
  }
}

// Generate JSON data
function generateJsonData() {
  const id = elements.itemId.value.trim();
  const title = elements.itemTitle.value.trim();
  const description = elements.itemDescription.value.trim();
  const date = elements.itemDate.value.trim();
  const tags = getTags();
  const content = elements.contentHtml.value.trim();
  
  // Metadata for list (projects.json or blogs.json)
  const metadata = {
    id,
    title,
    date,
    description,
    tags
  };
  
  // Full content for individual file
  const contentData = {
    id,
    title,
    date,
    tags,
    content
  };
  
  // Add item type specific fields
  if (state.currentTab === 'projects') {
    metadata.featured = elements.itemFeatured.checked;
    
    const github = elements.itemGithub.value.trim();
    const live = elements.itemLive.value.trim();
    
    if (github) contentData.github = github;
    if (live) contentData.live = live;
  } else {
    const author = elements.itemAuthor.value.trim();
    metadata.author = author;
    metadata.excerpt = description; // For blogs, use description as excerpt
    
    contentData.author = author;
  }
  
  return {
    metadata,
    content: contentData
  };
}

// Validate form
function validateForm() {
  const id = elements.itemId.value.trim();
  const title = elements.itemTitle.value.trim();
  const description = elements.itemDescription.value.trim();
  const date = elements.itemDate.value.trim();
  const tags = getTags();
  const content = elements.contentHtml.value.trim();
  
  if (!id) {
    showNotification('ID is required', 'error');
    elements.itemId.focus();
    return false;
  }
  
  if (!/^[a-z0-9-]+$/.test(id)) {
    showNotification('ID must contain only lowercase letters, numbers, and hyphens', 'error');
    elements.itemId.focus();
    return false;
  }
  
  if (!title) {
    showNotification('Title is required', 'error');
    elements.itemTitle.focus();
    return false;
  }
  
  if (!description) {
    showNotification('Description is required', 'error');
    elements.itemDescription.focus();
    return false;
  }
  
  if (!date) {
    showNotification('Date is required', 'error');
    elements.itemDate.focus();
    return false;
  }
  
  if (tags.length === 0) {
    showNotification('At least one tag is required', 'error');
    elements.tagsInput.focus();
    return false;
  }
  
  if (!content) {
    showNotification('Content is required', 'error');
    elements.contentHtml.focus();
    return false;
  }
  
  if (state.currentTab === 'blogs' && !elements.itemAuthor.value.trim()) {
    showNotification('Author is required for blog posts', 'error');
    elements.itemAuthor.focus();
    return false;
  }
  
  return true;
}

// Open JSON preview modal
function openJsonPreviewModal() {
  elements.jsonPreviewModal.classList.add('active');
}

// Close JSON preview modal
function closeJsonPreviewModal() {
  elements.jsonPreviewModal.classList.remove('active');
}

// Download JSON files
function downloadJsonFiles() {
  try {
    const data = generateJsonData();
    const id = data.metadata.id;
    
    // Download individual content file
    downloadFile(`${id}.json`, JSON.stringify(data.content, null, 2));
    
    // Download updated metadata file
    if (state.currentTab === 'projects') {
      downloadProjectsJson(data.metadata);
    } else {
      downloadBlogsJson(data.metadata);
    }
    
    showNotification(`Generated JSON files for ${state.currentTab === 'projects' ? 'project' : 'blog post'}: ${data.metadata.title}`, 'success');
    
    // Close modal
    closeJsonPreviewModal();
  } catch (error) {
    console.error('Error downloading JSON files:', error);
    showNotification(error.message, 'error');
  }
}

// Download file
function downloadFile(filename, content) {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Download updated projects.json
function downloadProjectsJson(newProject) {
  // Create a copy of the projects
  const projects = [...state.items.projects];
  
  // Find if project already exists
  const existingIndex = projects.findIndex(p => p.id === newProject.id);
  
  if (existingIndex !== -1) {
    // Update existing project
    projects[existingIndex] = newProject;
  } else {
    // Add new project
    projects.push(newProject);
  }
  
  // Create the full projects data
  const projectsData = {
    projects
  };
  
  // Download the file
  downloadFile('projects/index.json', JSON.stringify(projectsData, null, 2));
}

// Download updated blogs.json
function downloadBlogsJson(newBlog) {
  // Create a copy of the blog posts
  const posts = [...state.items.blogs];
  
  // Find if blog already exists
  const existingIndex = posts.findIndex(p => p.id === newBlog.id);
  
  if (existingIndex !== -1) {
    // Update existing blog
    posts[existingIndex] = newBlog;
  } else {
    // Add new blog
    posts.push(newBlog);
  }
  
  // Create the full blogs data
  const blogsData = {
    posts
  };
  
  // Download the file
  downloadFile('blogs/index.json', JSON.stringify(blogsData, null, 2));
}

// Toggle dark/light mode
function toggleTheme() {
  state.darkMode = !state.darkMode;
  document.body.classList.toggle('dark-mode', state.darkMode);
  
  // Update theme toggle icon
  const icon = elements.themeToggle.querySelector('i');
  if (icon) {
    icon.className = state.darkMode ? 'fas fa-moon' : 'fas fa-sun';
  }
}

// Format text in editor
function formatText(format) {
  const textarea = elements.contentHtml;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = textarea.value.substring(start, end);
  
  let replacement = '';
  
  switch (format) {
    case 'h2':
      replacement = `<h2>${selectedText || 'Heading 2'}</h2>`;
      break;
    case 'h3':
      replacement = `<h3>${selectedText || 'Heading 3'}</h3>`;
      break;
    case 'p':
      replacement = `<p>${selectedText || 'Paragraph text'}</p>`;
      break;
    case 'strong':
      replacement = `<strong>${selectedText || 'Bold text'}</strong>`;
      break;
    case 'em':
      replacement = `<em>${selectedText || 'Italic text'}</em>`;
      break;
    case 'ul':
      replacement = `<ul>\n  <li>${selectedText || 'List item'}</li>\n</ul>`;
      break;
    case 'ol':
      replacement = `<ol>\n  <li>${selectedText || 'List item'}</li>\n</ol>`;
      break;
    case 'li':
      replacement = `<li>${selectedText || 'List item'}</li>`;
      break;
    case 'code':
      replacement = `<code>${selectedText || 'Inline code'}</code>`;
      break;
    case 'pre':
      replacement = `<pre><code>${selectedText || 'Code block'}</code></pre>`;
      break;
    case 'a':
      const url = prompt('Enter URL:', 'https://');
      if (url) {
        replacement = `<a href="${url}">${selectedText || url}</a>`;
      } else {
        return;
      }
      break;
    case 'img':
      const imgUrl = prompt('Enter image URL:', 'https://');
      const altText = prompt('Enter alt text:', '');
      if (imgUrl) {
        replacement = `<img src="${imgUrl}" alt="${altText || ''}" />`;
      } else {
        return;
      }
      break;
  }
  
  // Insert the formatted text
  insertTextAtCursor(textarea, replacement, start, end);
  
  // Update preview if in preview mode
  if (state.editMode === 'preview') {
    updatePreview();
  }
}

// Insert text at cursor position
function insertTextAtCursor(textarea, text, start, end) {
  // Store the current scroll position
  const scrollPos = textarea.scrollTop;
  
  // Replace the selected text
  textarea.value = textarea.value.substring(0, start) + text + textarea.value.substring(end);
  
  // Put the cursor at the end of the inserted text
  textarea.selectionStart = start + text.length;
  textarea.selectionEnd = start + text.length;
  
  // Restore the scroll position
  textarea.scrollTop = scrollPos;
  
  // Focus the textarea
  textarea.focus();
}

// Load items for current tab
async function loadItems() {
  try {
    if (state.currentTab === 'projects') {
      state.items.projects = await api.loadProjects();
    } else {
      state.items.blogs = await api.loadBlogs();
    }
    
    renderItemsList();
  } catch (error) {
    console.error(`Error loading ${state.currentTab}:`, error);
    showNotification(error.message, 'error');
  }
}

// Initialize app
async function init() {
  try {
    // Load initial data
    state.items.projects = await api.loadProjects();
    state.items.blogs = await api.loadBlogs();
    
    // Render items list for current tab
    renderItemsList();
    
    // Set up event listeners
    setupEventListeners();
    
    // Show notification
    showNotification('Editor loaded successfully', 'success');
  } catch (error) {
    console.error('Error initializing app:', error);
    showNotification('Error initializing app: ' + error.message, 'error');
  }
}

// Setup event listeners
function setupEventListeners() {
  // Tab switching
  elements.tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      switchTab(btn.dataset.tab);
    });
  });
  
  // New item button
  elements.newItemBtn.addEventListener('click', createNewItem);
  
  // Cancel button
  elements.cancelBtn.addEventListener('click', () => {
    hideEditor();
  });
  
  // Preview button
  elements.previewBtn.addEventListener('click', previewJson);
  
  // Save button
  elements.saveBtn.addEventListener('click', downloadJsonFiles);
  
  // Add tag button
  elements.addTagBtn.addEventListener('click', () => {
    const tag = elements.tagsInput.value.trim();
    if (tag) {
      addTag(tag);
      elements.tagsInput.value = '';
    }
  });
  
  // Add tag on Enter key
  elements.tagsInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const tag = elements.tagsInput.value.trim();
      if (tag) {
        addTag(tag);
        elements.tagsInput.value = '';
      }
    }
  });
  
  // Toggle theme
  elements.themeToggle.addEventListener('click', toggleTheme);
  
  // Editor mode toggle
  elements.editorModeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      switchEditorMode(btn.dataset.mode);
    });
  });
  
  // Content input - update preview
  elements.contentHtml.addEventListener('input', () => {
    if (state.editMode === 'preview') {
      updatePreview();
    }
  });
  
  // Format buttons
  elements.formatButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      formatText(btn.dataset.format);
    });
  });
  
  // Modal close button
  elements.closePreviewModalBtn.addEventListener('click', closeJsonPreviewModal);
  
  // Download JSON button
  elements.downloadJsonBtn.addEventListener('click', downloadJsonFiles);
  
  // Modal tabs
  elements.modalTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active tab
      elements.modalTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Show corresponding tab content
      const targetId = tab.dataset.target;
      document.querySelectorAll('.code-preview').forEach(preview => {
        preview.classList.toggle('active', preview.id === targetId);
      });
    });
  });
  
  // Close modal when clicking outside
  elements.jsonPreviewModal.addEventListener('click', (e) => {
    if (e.target === elements.jsonPreviewModal) {
      closeJsonPreviewModal();
    }
  });
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init); 