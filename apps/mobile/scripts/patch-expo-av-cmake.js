const fs = require('fs');
const path = require('path');

const cmakeFilePath = path.join(__dirname, '..', 'node_modules', 'expo-av', 'android', 'CMakeLists.txt');

if (!fs.existsSync(cmakeFilePath)) {
  process.exit(0);
}

const currentContents = fs.readFileSync(cmakeFilePath, 'utf8');
const updatedContents = currentContents.replace(
  /ReactAndroid::reactnativejni/g,
  'ReactAndroid::reactnative'
);

if (updatedContents !== currentContents) {
  fs.writeFileSync(cmakeFilePath, updatedContents);
  console.log('Patched expo-av Android CMake target.');
}