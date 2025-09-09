// store.js

export const initialStore = () => ({
  message: null,
  todos: [
    { id: 1, title: "Make the bed", background: null },
    { id: 2, title: "Do my homework", background: null }
  ],

  auth: {
    token: sessionStorage.getItem("token") || null,
    user: JSON.parse(sessionStorage.getItem("user") || "null"),
  },
});

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_hello":
      return { ...store, message: action.payload };

    case "add_task": {
      const { id, color } = action.payload;
      return {
        ...store,
        todos: store.todos.map((todo) =>
          todo.id === id ? { ...todo, background: color } : todo
        ),
      };
    }


    case "auth_login": {
      const { token, user } = action.payload || {};
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(user));
      return { ...store, auth: { token, user } };
    }

    case "auth_logout": {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      return { ...store, auth: { token: null, user: null } };
    }


    case "auth_update_user": {
      const user = action.payload;
      sessionStorage.setItem("user", JSON.stringify(user));
      return { ...store, auth: { ...store.auth, user } };
    }

    default:
      throw Error("Unknown action.");
  }
}