export function saveToStorage(value) {
  return new Promise(resolve => {
    setTimeout(() => {
      localStorage.setItem('employees', value);
      resolve();
    }, 0);
  });
}

export function loadFromStorage() {
  return new Promise(resolve => {
    setTimeout(() => {
      const stored = localStorage.getItem('employees');
      try {
        resolve(stored ? JSON.parse(stored) : null);
      } catch (error) {
        console.warn('Could not parse employees from storage:', error);
        resolve(null);
      }
    }, 0);
  });
}
