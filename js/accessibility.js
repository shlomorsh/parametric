document.addEventListener('DOMContentLoaded', function() {
    // אלמנטים של תפריט הנגישות
    const accessibilityToggle = document.querySelector('.accessibility-toggle');
    const accessibilityContent = document.querySelector('.accessibility-content');
    const increaseText = document.getElementById('increase-text');
    const decreaseText = document.getElementById('decrease-text');
    const highContrast = document.getElementById('high-contrast');
    const resetAccessibility = document.getElementById('reset-accessibility');
    
    // בדיקה אם קיימות העדפות נגישות בזיכרון המקומי
    checkStoredPreferences();
    
    // הטוגל - פתיחה וסגירה של התפריט
    accessibilityToggle.addEventListener('click', function() {
        if (accessibilityContent.style.display === 'block') {
            accessibilityContent.style.display = 'none';
        } else {
            accessibilityContent.style.display = 'block';
        }
    });
    
    // כפתור הגדלת טקסט
    increaseText.addEventListener('click', function() {
        const currentSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
        const newSize = currentSize * 1.1; // הגדלה ב-10%
        document.documentElement.style.fontSize = `${newSize}px`;
        savePreference('fontSize', newSize);
    });
    
    // כפתור הקטנת טקסט
    decreaseText.addEventListener('click', function() {
        const currentSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
        const newSize = currentSize * 0.9; // הקטנה ב-10%
        document.documentElement.style.fontSize = `${newSize}px`;
        savePreference('fontSize', newSize);
    });
    
    // כפתור ניגודיות גבוהה
    highContrast.addEventListener('click', function() {
        if (document.body.classList.contains('high-contrast')) {
            document.body.classList.remove('high-contrast');
            savePreference('highContrast', false);
        } else {
            document.body.classList.add('high-contrast');
            savePreference('highContrast', true);
        }
    });
    
    // כפתור איפוס הגדרות
    resetAccessibility.addEventListener('click', function() {
        document.documentElement.style.fontSize = '16px'; // חזרה לגודל ברירת המחדל
        document.body.classList.remove('high-contrast');
        
        // ניקוי הגדרות בזיכרון המקומי
        localStorage.removeItem('fontSize');
        localStorage.removeItem('highContrast');
    });
    
    // פונקציה לשמירת העדפות בזיכרון המקומי
    function savePreference(key, value) {
        localStorage.setItem(key, value);
    }
    
    // פונקציה לבדיקת העדפות שמורות ויישומן
    function checkStoredPreferences() {
        // בדיקת גודל טקסט
        const storedFontSize = localStorage.getItem('fontSize');
        if (storedFontSize) {
            document.documentElement.style.fontSize = `${storedFontSize}px`;
        }
        
        // בדיקת מצב ניגודיות
        const storedHighContrast = localStorage.getItem('highContrast');
        if (storedHighContrast === 'true') {
            document.body.classList.add('high-contrast');
        }
    }
    
    // הוספת סגנונות CSS לניגודיות גבוהה
    const highContrastStyles = `
        .high-contrast {
            background-color: #000 !important;
            color: #fff !important;
        }
        .high-contrast header,
        .high-contrast footer,
        .high-contrast section,
        .high-contrast .service-item,
        .high-contrast .blog-card,
        .high-contrast .work-item,
        .high-contrast .testimonial-item,
        .high-contrast .contact-wrapper,
        .high-contrast .form-group input,
        .high-contrast .form-group textarea {
            background-color: #000 !important;
            color: #fff !important;
            border-color: #fff !important;
        }
        .high-contrast a,
        .high-contrast h1, 
        .high-contrast h2, 
        .high-contrast h3, 
        .high-contrast h4, 
        .high-contrast h5, 
        .high-contrast h6 {
            color: #ffff00 !important;
        }
        .high-contrast .btn-primary,
        .high-contrast .btn-outline,
        .high-contrast .btn-text {
            background-color: #000 !important;
            color: #ffff00 !important;
            border-color: #ffff00 !important;
        }
        .high-contrast img,
        .high-contrast svg {
            filter: invert(1);
        }
    `;
    
    // הוספת סגנונות לעמוד
    const styleElement = document.createElement('style');
    styleElement.textContent = highContrastStyles;
    document.head.appendChild(styleElement);
    
    // סגירת התפריט בלחיצה מחוץ אליו
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.accessibility-menu') && accessibilityContent.style.display === 'block') {
            accessibilityContent.style.display = 'none';
        }
    });
}); 