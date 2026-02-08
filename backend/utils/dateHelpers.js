export function isValidDate(dateString) {
  // Vérifie le format YYYY-MM-DD
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  
  if (!regex.test(dateString)) {
    return false;
  }

  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

export function formatDateForDB(dateString) {
  return new Date(dateString).toISOString().split('T')[0];
}