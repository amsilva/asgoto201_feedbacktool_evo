import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const app = firebase.initializeApp({
  apiKey: "AIzaSyDg717DdiOC2WHMS2pYBSjrePqUeIWSu-A",
  authDomain: "persona-f43bf.firebaseapp.com",
  databaseURL: "https://persona-f43bf.firebaseio.com",
  projectId: "persona-f43bf",
  storageBucket: "persona-f43bf.appspot.com",
  messagingSenderId: "826115815226",
  appId: "1:826115815226:web:767eb37182246669ee4203"
});

const firestore = app.firestore();
const auth = app.auth();

const Firestore = {
  methods: {
    fs(col) {
      return firestore.collection(col);
    },
    fsStract(data) {
      if (data.empty)
        return [];
      return data.docs.map(doc => { return { ...doc.data(), id: doc.id } });
    },
    fsGet(col, id) {
      let base = this.fs(col);
      if (id) base = this.fs(col).doc(id);

      return base.get().then(res => {
        if (id) return (res.exists ? res.data() : null);
        return this.fsStract(res);
      });
    },
    fsGetQry(col, field, condition, value) {
      return this.fs(col)
        .where(field, condition, value)
        .get()
        .then(res => this.fsStract(res));
    },
    fsSet(col, data, id) {
      if (id) {
        return this.fs(col)
          .doc(id)
          .set(JSON.parse(JSON.stringify(data)))
          .then(res => !res ? { success: true, id } : { error: true });
      }
      return this.fs(col)
        .add(JSON.parse(JSON.stringify(data)))
        .then(res => res ? { success: true, id: res.id } : { error: true });
    },
    fsDel(col, id) {
      return this.fs(col)
        .doc(id)
        .delete();
    },
  }
};

const Auth = {
  methods: {
    atNewUser(email, password) {
      return auth.createUserWithEmailAndPassword(email, password);
    },
    atGetCur() {
      return auth.currentUser;
    },
    atLogin(email, password) {
      return auth
        .signInWithEmailAndPassword(email, password)
        .catch(error => console.log(error));
    },
    atLogout() {
      return auth.signOut().catch(error => console.log(error));
    },
    atBlockUser(uid) {
      return auth.updateUser(uid, {
        disabled: true
      });
    }
  }
};

export default app;
export { Auth, Firestore };
