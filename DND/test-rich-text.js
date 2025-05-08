// Rich text testing script
document.addEventListener('DOMContentLoaded', function() {
  console.log('Running rich text verification test...');
  
  // List of all editors that should support rich text formatting
  const requiredRichTextAreas = [
    // Main tab
    'features',
    'inventory',
    
    // Spells tab
    'cantrips',
    'level-1-spells',
    'level-2-spells',
    'level-3-spells',
    'level-4-spells',
    'level-5-spells',
    'level-6-spells',
    'level-7-spells',
    'level-8-spells',
    'level-9-spells',
    
    // Notes tab
    'appearance-notes',
    'background-content',
    'personality-traits',
    'ideals',
    'bonds',
    'flaws'
  ];
  
  // Wait a bit for the app to initialize
  setTimeout(() => {
    let allPassed = true;
    
    // Test 1: Check if all required areas have rich text toolbars
    console.log('Test 1: Checking if all required areas have rich text toolbars');
    requiredRichTextAreas.forEach(id => {
      const element = document.getElementById(id);
      if (!element) {
        console.error(`❌ Element not found: ${id}`);
        allPassed = false;
        return;
      }
      
      const hasToolbar = element.parentNode.classList.contains('rich-text-editor-container');
      if (!hasToolbar) {
        console.error(`❌ Rich text toolbar missing for: ${id}`);
        allPassed = false;
      } else {
        console.log(`✓ Rich text toolbar found for: ${id}`);
      }
    });
    
    // Test 2: Check if keyboard shortcuts work
    console.log('\nTest 2: Testing keyboard shortcuts functionality');
    // This is a manual test, just provide instructions
    console.log('Manual test required: Place cursor in a rich text area and press Ctrl+B, Ctrl+I, or Ctrl+U');
    
    // Test 3: Check if the HTML is preserved when switching tabs
    console.log('\nTest 3: Testing HTML preservation when switching tabs');
    // Test editor with known HTML content
    const testEditor = document.getElementById('features');
    if (testEditor) {
      const originalContent = '<p>This is a <b>test</b> with <i>formatting</i>.</p>';
      testEditor.innerHTML = originalContent;
      
      // Switch tabs
      const spellsTab = document.querySelector('[data-tab="spells"]');
      if (spellsTab) {
        spellsTab.click();
        setTimeout(() => {
          const mainTab = document.querySelector('[data-tab="main"]');
          if (mainTab) {
            mainTab.click();
            setTimeout(() => {
              // Check if content is preserved
              const newContent = testEditor.innerHTML;
              if (newContent === originalContent) {
                console.log('✓ HTML content preserved when switching tabs');
              } else {
                console.error('❌ HTML content changed when switching tabs');
                console.log('Original:', originalContent);
                console.log('Current:', newContent);
                allPassed = false;
              }
              
              // Final result
              if (allPassed) {
                console.log('\n✅ All tests passed! Rich text formatting is working properly.');
              } else {
                console.log('\n❌ Some tests failed. Check the console for details.');
              }
            }, 200);
          }
        }, 200);
      }
    }
  }, 1000);
}); 