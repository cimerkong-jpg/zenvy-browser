const e = require('electron');
console.log('type:', typeof e);
console.log('has app:', typeof e.app);
e.app.whenReady().then(() => {
  console.log('ready!');
  e.app.quit();
});
