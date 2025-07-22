import Store from './Store.js';
import { loadData } from './Employee.js';

window.app = {};

app.store = Store;

window.addEventListener('DOMContentLoaded', async () => {
  await loadData();
});
