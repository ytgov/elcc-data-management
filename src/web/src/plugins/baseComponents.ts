import { App } from "vue";

const components = import.meta.glob("@/components/*.vue", { eager: true });

const register = (app: App<Element>) => {
  Object.entries(components).forEach(([path, definition]) => {
    let p = path || "";
    let def = definition as any;

    // Get name of component, based on filename
    // "./components/Fruits.vue" will become "Fruits"
    if (p && def) {
      const componentName1 = p.split("/").pop();
      const componentName = (componentName1 || "").replace(/\.\w+$/, "");

      app.component(componentName, def.default);
    }
  });
};

export default {
  register,
};
