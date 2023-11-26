const RootComponent = {
    data() {
        return {
            message: "Hello World!",
        };
    },

    template:`
    
    <h1>{{ message }}</h1>
    `
};



const app = Vue.createApp(RootComponent);

const vm = app.mount("#app");