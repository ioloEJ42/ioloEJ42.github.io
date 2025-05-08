// Rich text editing functionality
document.addEventListener('DOMContentLoaded', function() {
  // Create the toolbar template if it doesn't exist
  if (!document.getElementById('rich-text-toolbar-template')) {
    const template = document.createElement('div');
    template.id = 'rich-text-toolbar-template';
    template.style.display = 'none';
    template.innerHTML = `
      <div class="rich-text-toolbar">
        <button type="button" data-command="bold" title="Bold (Ctrl+B)"><strong>B</strong></button>
        <button type="button" data-command="italic" title="Italic (Ctrl+I)"><em>I</em></button>
        <button type="button" data-command="underline" title="Underline (Ctrl+U)"><u>U</u></button>
        <button type="button" data-command="insertUnorderedList" title="Bullet List"><span>•</span></button>
        <button type="button" data-command="insertOrderedList" title="Numbered List"><span>#</span></button>
      </div>
    `;
    document.body.appendChild(template);
  }
  
  // Configure JSZip for folder downloads
  if (typeof JSZip === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
    document.head.appendChild(script);
  }

  // Make sure rich text formatting is applied to all contenteditable elements
  // This is a safeguard in case the main script fails to call setupRichTextFormatting
  setTimeout(function() {
    const richTextEditors = document.querySelectorAll('[contenteditable="true"]');
    if (richTextEditors.length > 0) {
      // Check if each editor has a toolbar
      richTextEditors.forEach(editor => {
        if (!editor.parentNode.classList.contains('rich-text-editor-container')) {
          console.log('Applying rich text formatting to:', editor.id);
          applyRichTextFormatting(editor);
        }
      });
    }
  }, 500); // Short delay to ensure DOM is fully loaded

  // Function to apply rich text formatting to a specific editor
  function applyRichTextFormatting(editor) {
    const toolbarTemplate = document.getElementById('rich-text-toolbar-template');
    if (!toolbarTemplate) return;
    
    // Create toolbar container
    const container = document.createElement('div');
    container.className = 'rich-text-editor-container';
    
    // Clone toolbar template
    const toolbar = toolbarTemplate.querySelector('.rich-text-toolbar').cloneNode(true);
    
    // Hide toolbar by default (only show when editor is focused)
    toolbar.classList.add('toolbar-hidden');
    
    // Insert toolbar before editor
    editor.parentNode.insertBefore(container, editor);
    container.appendChild(toolbar);
    container.appendChild(editor);
    
    // Add toolbar button functionality
    const buttons = toolbar.querySelectorAll('button');
    
    // Accessibility improvements for toolbar buttons
    buttons.forEach(button => {
      const command = button.getAttribute('data-command');
      button.setAttribute('aria-label', button.getAttribute('title') || command);
      button.setAttribute('role', 'button');
      
      button.addEventListener('click', () => {
        if (command) {
          document.execCommand(command, false, null);
          editor.focus();
          
          // Toggle active state for buttons
          if (['bold', 'italic', 'underline'].includes(command)) {
            if (document.queryCommandState(command)) {
              button.classList.add('active');
              button.setAttribute('aria-pressed', 'true');
            } else {
              button.classList.remove('active');
              button.setAttribute('aria-pressed', 'false');
            }
          }
        }
      });
    });
    
    // Update button states when editor is focused
    editor.addEventListener('keyup', updateToolbar);
    editor.addEventListener('mouseup', updateToolbar);
    
    // Show toolbar on focus
    editor.addEventListener('focus', () => {
      // Show toolbar
      toolbar.classList.remove('toolbar-hidden');
      // Update button states
      updateToolbar();
    });
    
    // Hide toolbar on blur
    editor.addEventListener('blur', (e) => {
      // Only hide if not clicking on the toolbar itself
      // This prevents the toolbar from disappearing when clicking its buttons
      if (!toolbar.contains(e.relatedTarget)) {
        // Small delay to ensure button click is processed
        setTimeout(() => {
          // Double check we're not interacting with the toolbar
          if (!toolbar.contains(document.activeElement)) {
            toolbar.classList.add('toolbar-hidden');
          }
        }, 100);
      }
    });
    
    function updateToolbar() {
      buttons.forEach(button => {
        const command = button.getAttribute('data-command');
        if (['bold', 'italic', 'underline'].includes(command)) {
          if (document.queryCommandState(command)) {
            button.classList.add('active');
            button.setAttribute('aria-pressed', 'true');
          } else {
            button.classList.remove('active');
            button.setAttribute('aria-pressed', 'false');
          }
        }
      });
    }
    
    // Keyboard shortcuts
    editor.addEventListener('keydown', (e) => {
      // Bold: Ctrl+B
      if (e.ctrlKey && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        document.execCommand('bold', false, null);
        updateToolbar();
      }
      // Italic: Ctrl+I
      else if (e.ctrlKey && e.key.toLowerCase() === 'i') {
        e.preventDefault();
        document.execCommand('italic', false, null);
        updateToolbar();
      }
      // Underline: Ctrl+U
      else if (e.ctrlKey && e.key.toLowerCase() === 'u') {
        e.preventDefault();
        document.execCommand('underline', false, null);
        updateToolbar();
      }
    });
    
    // Handle paste to preserve formatting if it's HTML
    editor.addEventListener('paste', (e) => {
      // Cancel the default paste action
      e.preventDefault();
      
      // Get clipboard data
      let text;
      let isHTML = false;
      
      if (e.clipboardData || e.originalEvent.clipboardData) {
        // Check for HTML content first
        if (e.clipboardData.types.indexOf('text/html') !== -1) {
          text = e.clipboardData.getData('text/html');
          isHTML = true;
        } else {
          text = e.clipboardData.getData('text/plain');
        }
      } else if (window.clipboardData) {
        text = window.clipboardData.getData('Text');
      }
      
      // Insert the content
      if (isHTML) {
        // Clean up HTML to remove unwanted tags and styles
        const cleanHTML = sanitizeHTML(text);
        document.execCommand('insertHTML', false, cleanHTML);
      } else {
        document.execCommand('insertText', false, text);
      }
    });
    
    // Accessibility improvements for rich text editors
    editor.setAttribute('role', 'textbox');
    editor.setAttribute('aria-multiline', 'true');
    editor.setAttribute('aria-label', editor.dataset.label || 'Rich text editor');
  }

  // Function to sanitize HTML for paste operations
  function sanitizeHTML(html) {
    // Create a temporary element
    const temp = document.createElement('div');
    temp.innerHTML = html;
    
    // Remove unwanted elements
    const unwantedElements = temp.querySelectorAll('script, style, link, meta');
    unwantedElements.forEach(el => el.remove());
    
    // Remove all attributes except some allowed ones
    const allElements = temp.querySelectorAll('*');
    const allowedAttributes = ['href', 'src', 'alt', 'title'];
    
    allElements.forEach(el => {
      Array.from(el.attributes).forEach(attr => {
        if (!allowedAttributes.includes(attr.name)) {
          el.removeAttribute(attr.name);
        }
      });
    });
    
    // Return the cleaned HTML
    return temp.innerHTML;
  }

  // Expose functions for external use
  window.richTextFormatting = {
    apply: applyRichTextFormatting,
    sanitize: sanitizeHTML
  };
});

// Function to ensure proper rich text content is saved with HTML formatting
function ensureRichTextPreservation() {
  // Apply to all tabs to ensure all contenteditable elements are processed
  const tabs = ['main', 'spells', 'personal'];
  tabs.forEach(tabId => {
    const tab = document.getElementById(tabId);
    if (tab) {
      const editors = tab.querySelectorAll('[contenteditable="true"]');
      editors.forEach(editor => {
        // Make sure HTML content is preserved in the editor
        if (editor.innerHTML.trim() === '') {
          editor.innerHTML = ''; // Clean empty but not completely empty editors
        }
      });
    }
  });
}

// Add a hook to the save process
document.addEventListener('DOMContentLoaded', function() {
  // Find the save button and add ensureRichTextPreservation before saving
  const saveBtn = document.getElementById('save-character-btn');
  if (saveBtn) {
    const originalOnClick = saveBtn.onclick;
    saveBtn.onclick = function(e) {
      ensureRichTextPreservation();
      if (originalOnClick) {
        return originalOnClick.call(this, e);
      }
    };
  }
}); 