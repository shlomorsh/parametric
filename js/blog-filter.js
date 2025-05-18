document.addEventListener('DOMContentLoaded', function() {
    // אלמנטים לסינון ולחיפוש
    const categoryFilter = document.getElementById('category-filter');
    const searchInput = document.getElementById('blog-search');
    const blogCards = document.querySelectorAll('.blog-card');
    
    // אירוע שינוי בסינון קטגוריה
    categoryFilter.addEventListener('change', filterBlogs);
    
    // אירוע הקלדה בשדה החיפוש
    searchInput.addEventListener('input', filterBlogs);
    
    // פונקציית סינון
    function filterBlogs() {
        const selectedCategory = categoryFilter.value;
        const searchTerm = searchInput.value.trim().toLowerCase();
        
        // עבור על כל כרטיסיות הבלוג
        blogCards.forEach(card => {
            const category = card.getAttribute('data-category');
            const title = card.querySelector('h3').textContent.toLowerCase();
            const content = card.querySelector('p').textContent.toLowerCase();
            
            // בדיקה אם הכרטיסייה עומדת בתנאי הסינון
            const matchesCategory = selectedCategory === 'all' || category === selectedCategory;
            const matchesSearch = searchTerm === '' || 
                                 title.includes(searchTerm) || 
                                 content.includes(searchTerm);
            
            // הצגה או הסתרה בהתאם לתנאים
            if (matchesCategory && matchesSearch) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
        
        // בדיקה אם יש תוצאות
        checkForResults();
    }
    
    // בדיקה אם יש תוצאות
    function checkForResults() {
        const visibleCards = document.querySelectorAll('.blog-card[style="display: block"]');
        const blogGrid = document.querySelector('.blog-grid');
        
        if (visibleCards.length === 0) {
            // אם אין תוצאות, הצג הודעה
            if (!document.querySelector('.no-results-message')) {
                const noResultsMsg = document.createElement('div');
                noResultsMsg.className = 'no-results-message';
                noResultsMsg.textContent = 'לא נמצאו תוצאות המתאימות לחיפוש שלך.';
                blogGrid.appendChild(noResultsMsg);
            }
        } else {
            // הסר הודעת אין תוצאות אם קיימת
            const noResultsMsg = document.querySelector('.no-results-message');
            if (noResultsMsg) {
                noResultsMsg.remove();
            }
        }
    }
}); 