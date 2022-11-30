const config = {
    apiKey: "AIzaSyDzOah7lLUm5zz30b2DQz7YVvJAVtsChlg",
    authDomain: "odin-wheres-waldo-53cc2.firebaseapp.com",
    projectId: "odin-wheres-waldo-53cc2",
    storageBucket: "odin-wheres-waldo-53cc2.appspot.com",
    messagingSenderId: "912755544851",
    appId: "1:912755544851:web:6b64c2592a99fdbb5980e6"
}

export function getFirebaseConfig() {
    if (!config || !config.apiKey) {
        throw new Error('No Firebase Config object provided.' + '\n' +
        'Add your web app\'s configuration object to firebaseConfig.js');
    } else {
        return config;
    }
}