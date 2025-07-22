export const formatDate = (dateString, locale = 'en-GB') => {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      return 'invalid-date';
    }
    return date.toLocaleDateString(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch (error) {
    return 'invalid-date';
  }
};

export const formatDateForInput = dateString => {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
  } catch (error) {
    return '';
  }
};

export const positions = ['Junior', 'Medior', 'Senior'];

export const getTranslatedDepartment = (department, localizationManager) => {
  if (!department) return '';
  const key = department.toLowerCase();
  const translated = localizationManager.t(key);
  return translated !== key ? translated : department;
};

export const getTranslatedPosition = (position, localizationManager) => {
  if (!position) return '';
  const key = position.toLowerCase();
  const translated = localizationManager.t(key);
  return translated !== key ? translated : position;
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const paginate = (items, page, perPage) => {
  // eslint-disable-next-line no-param-reassign
  if (page < 1) page = 1;

  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;

  return {
    items: items.slice(startIndex, endIndex),
    totalPages: Math.ceil(items.length / perPage),
    currentPage: page,
    hasNext: endIndex < items.length,
    hasPrev: startIndex > 0,
    totalItems: items.length,
  };
};
